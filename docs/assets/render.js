async function renderExecutivePage(config) {
  const markdownTarget = document.getElementById("content");
  const quickTakeEl = document.getElementById("quickTake");
  const costEl = document.getElementById("costLine");

  try {
    const response = await fetch(config.markdownPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${config.markdownPath}: ${response.status}`);
    }

    const markdown = await response.text();
    
    // Custom slugger that generates consistent IDs matching TOC links
    const customSlugger = {
      seen: {},
      slug(text) {
        const slug = text
          .toLowerCase()
          .trim()
          .replace(/[—–]/g, '--')           // em/en dashes to double hyphen
          .replace(/&/g, 'and')              // ampersands to 'and'
          .replace(/[()]/g, ' ')             // remove parentheses (replace with space)
          .replace(/\//g, '-')               // forward slashes to hyphen
          .replace(/\s+/g, ' ')              // normalize whitespace
          .replace(/\s/g, '-')               // spaces to hyphens
          .replace(/[^\w-]/g, '')            // remove special chars except hyphens
          .replace(/-+/g, '-')               // collapse multiple hyphens
          .replace(/^-+|-+$/g, '');          // trim hyphens
        
        // Handle duplicates
        let uniqueSlug = slug;
        let count = 0;
        while (this.seen[uniqueSlug]) {
          count++;
          uniqueSlug = `${slug}-${count}`;
        }
        this.seen[uniqueSlug] = true;
        return uniqueSlug;
      }
    };

    const parser = new marked.Marked({
      gfm: true,
      breaks: false,
      headerIds: true,
      mangle: false
    });

    // Inject custom slugger into the renderer
    const originalHeadingRenderer = parser.renderer.heading;
    parser.renderer.heading = function(token) {
      const id = customSlugger.slug(token.text);
      return `<h${token.depth} id="${id}">${token.text}</h${token.depth}>\n`;
    };

    const html = parser.parse(markdown);
    markdownTarget.innerHTML = DOMPurify.sanitize(html);

    const quickTake = extractExecutiveSummary(markdown);
    quickTakeEl.textContent = quickTake || "Executive summary is available in the full brief below.";

    const costLine = extractCostSummary(markdown);
    costEl.textContent = costLine || "Cost details are included in the Cost Estimates section of the brief.";
  } catch (error) {
    markdownTarget.innerHTML = `<p>Unable to render this brief. ${error.message}</p>`;
    quickTakeEl.textContent = "Unable to load source markdown.";
    costEl.textContent = "Unable to extract cost summary.";
  }
}

function extractExecutiveSummary(markdown) {
  const summaryHeader = markdown.match(/^##\s+Executive Summary\s*$/im);
  if (!summaryHeader) {
    return "";
  }

  const fromHeader = markdown.slice(summaryHeader.index + summaryHeader[0].length);
  const nextSection = fromHeader.search(/^##\s+/m);
  const summaryBody = nextSection >= 0 ? fromHeader.slice(0, nextSection) : fromHeader;

  const paragraph = summaryBody
    .split(/\r?\n\r?\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .find((p) => p && !p.startsWith("|") && !p.startsWith("- ") && !p.startsWith("1."));

  return paragraph || "";
}

function extractCostSummary(markdown) {
  const lines = markdown.split(/\r?\n/);
  const combinedRow = lines.find((line) => /Combined Estimate/i.test(line));
  if (!combinedRow) {
    return "";
  }

  const moneyRanges = combinedRow.match(/\$[0-9,]+(?:\s*[–-]\s*\$[0-9,]+)?(?:\/[a-zA-Z]+)?/g);
  if (!moneyRanges || moneyRanges.length === 0) {
    return "";
  }

  return `Bottom-line combined estimate: ${moneyRanges.join(" | ")}`;
}
