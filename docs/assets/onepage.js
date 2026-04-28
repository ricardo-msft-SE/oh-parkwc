async function renderOnePageExecutiveSummary(config) {
  const summaryEl = document.getElementById("summary");
  const useCasesEl = document.getElementById("useCases");
  const deliveryEl = document.getElementById("delivery");
  const costLineEl = document.getElementById("costLine");
  const costDetailEl = document.getElementById("costDetail");

  try {
    const response = await fetch(config.markdownPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${config.markdownPath}: ${response.status}`);
    }

    const markdown = await response.text();
    const sections = splitByH2(markdown);

    const execSummary = firstParagraph(sections.get("Executive Summary") || "")
      || firstParagraph(markdown)
      || "Summary unavailable in source README.";
    summaryEl.textContent = execSummary;

    const useCaseCards = extractUseCases(sections);
    useCasesEl.innerHTML = useCaseCards.length
      ? useCaseCards.map((card) => `
        <article class="card">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.description)}</p>
        </article>
      `).join("")
      : `<article class="card"><h3>Use Cases</h3><p>Use case details are available in the full brief.</p></article>`;

    const roadmapSection = sections.get("Implementation Roadmap") || "";
    const timelineItems = extractTimelineItems(roadmapSection);
    deliveryEl.innerHTML = timelineItems.length
      ? timelineItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "<li>Delivery phases and milestones are documented in the full brief.</li>";

    const costSection = sections.get("Cost Estimates") || "";
    const costLine = extractBottomLineCost(costSection) || "Bottom-line estimate is included in the Cost Estimates section.";
    costLineEl.textContent = costLine;

    const costBullets = extractCostBullets(costSection);
    costDetailEl.innerHTML = costBullets.length
      ? costBullets.map((line) => `<li>${escapeHtml(line)}</li>`).join("")
      : "<li>Open the full brief for complete component-level cost details.</li>";
  } catch (error) {
    summaryEl.textContent = "Unable to load source markdown.";
    useCasesEl.innerHTML = `<article class="card"><h3>Error</h3><p>${escapeHtml(error.message)}</p></article>`;
    deliveryEl.innerHTML = "<li>Unable to extract roadmap details.</li>";
    costLineEl.textContent = "Unable to extract cost summary.";
    costDetailEl.innerHTML = "<li>Unable to extract cost details.</li>";
  }
}

function splitByH2(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = new Map();
  let currentTitle = "";
  let currentBuffer = [];

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      if (currentTitle) {
        sections.set(currentTitle, currentBuffer.join("\n").trim());
      }
      currentTitle = h2[1].trim();
      currentBuffer = [];
      continue;
    }

    if (currentTitle) {
      currentBuffer.push(line);
    }
  }

  if (currentTitle) {
    sections.set(currentTitle, currentBuffer.join("\n").trim());
  }

  return sections;
}

function firstParagraph(text) {
  return text
    .split(/\r?\n\r?\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .find((p) => p && !p.startsWith("|") && !p.startsWith("-") && !p.startsWith("*") && !/^\d+\./.test(p));
}

function extractUseCases(sections) {
  const cards = [];
  for (const [title, body] of sections.entries()) {
    if (!/^Use Case/i.test(title)) {
      continue;
    }

    cards.push({
      title,
      description: firstParagraph(body) || "Details are provided in the full initiative brief."
    });
  }

  return cards;
}

function extractTimelineItems(roadmapSection) {
  const candidates = roadmapSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || line.startsWith("•"))
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  if (candidates.length > 0) {
    return candidates.slice(0, 6);
  }

  const phaseLines = roadmapSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /month|week|phase/i.test(line) && line.length < 140);

  return phaseLines.slice(0, 6);
}

function extractBottomLineCost(costSection) {
  const combinedHeaderMatch = costSection.match(/###\s+Shared Costs/i);
  if (combinedHeaderMatch) {
    const fromCombined = costSection.slice(combinedHeaderMatch.index);
    const nextHeader = fromCombined.search(/^###\s+/m);
    const combinedBlock = nextHeader > 0 ? fromCombined.slice(0, nextHeader) : fromCombined;
    const rows = combinedBlock
      .split(/\r?\n/)
      .filter((line) => line.includes("|") && /\$/.test(line));

    if (rows.length > 0) {
      return rows
        .slice(0, 3)
        .map((line) => line.replace(/\|/g, " ").replace(/\s+/g, " ").trim())
        .join(" | ");
    }
  }

  const money = [...new Set(costSection.match(/\$[0-9,]+(?:\s*[–-]\s*\$[0-9,]+)?(?:\/[a-zA-Z]+)?/g) || [])];
  if (money.length > 0) {
    return `Estimated range: ${money.slice(0, 4).join(" | ")}`;
  }

  return "";
}

function extractCostBullets(costSection) {
  const rows = costSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.includes("|") && /\$/.test(line) && !/^\|\s*[-:]/.test(line));

  const cleaned = rows.map((line) => line.replace(/\|/g, " ").replace(/\s+/g, " ").trim());
  return cleaned.slice(0, 6);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}