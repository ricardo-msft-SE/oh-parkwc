async function renderExecutiveReview(config) {
  const summary = document.getElementById("summaryText");
  const title = document.getElementById("initiativeTitle");
  const programCount = document.getElementById("programCount");
  const timelineLength = document.getElementById("timelineLength");
  const impactLine = document.getElementById("impactLine");
  const costHeadline = document.getElementById("costHeadline");
  const costGrid = document.getElementById("costGrid");
  const costTableBody = document.getElementById("costTableBody");
  const useCases = document.getElementById("useCases");
  const roadmap = document.getElementById("roadmap");
  const sharedStack = document.getElementById("sharedStack");
  const securityControls = document.getElementById("securityControls");

  try {
    const response = await fetch(config.markdownPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${config.markdownPath}: ${response.status}`);
    }

    const markdown = await response.text();
    const h1 = markdown.match(/^#\s+(.+)$/m);
    title.textContent = config.title || (h1 ? h1[1].trim() : "Executive Review");

    const sections = splitByH2(markdown);
    const useCaseData = extractUseCases(sections);
    const phaseData = extractPhases(useCaseData, sections.get("Implementation Roadmap") || "");
    const costData = extractCostData(sections.get("Cost Estimates") || "");

    summary.textContent = firstParagraph(sections.get("Executive Summary") || markdown)
      || "Summary content is available in the full technical brief.";

    programCount.textContent = `${useCaseData.length || 2} Parallel Use Cases`;
    timelineLength.textContent = phaseData.length ? `${phaseData.length} Delivery Phases` : "Phased Delivery Roadmap";
    impactLine.textContent = extractImpactLine(sections.get("Success Metrics & KPIs") || "") || "Major reduction in manual effort through AI-assisted workflows.";

    costHeadline.textContent = costData.headline;
    costGrid.innerHTML = costData.boxes.map((box) => `
      <div class="cost-box">
        <div class="key">${escapeHtml(box.key)}</div>
        <div class="amt">${escapeHtml(box.amount)}</div>
      </div>
    `).join("");

    costTableBody.innerHTML = costData.rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.scenario)}</td>
        <td>${escapeHtml(row.cost)}</td>
        <td>${escapeHtml(row.notes)}</td>
      </tr>
    `).join("");

    useCases.innerHTML = useCaseData.map((uc) => {
      const imageHtml = uc.image ? `<img class="arch-img" src="${escapeHtml(uc.image)}" alt="${escapeHtml(uc.title)} architecture">` : "";
      return `
        <article class="card">
          <h3>${escapeHtml(uc.title)}</h3>
          <span class="pill">${escapeHtml(uc.pill)}</span>
          <ul class="list">
            <li><strong>Current pain:</strong> ${escapeHtml(uc.pain)}</li>
            <li><strong>AI pattern:</strong> ${escapeHtml(uc.pattern)}</li>
            <li><strong>Expected outcome:</strong> ${escapeHtml(uc.outcome)}</li>
            <li><strong>Primary KPI targets:</strong> ${escapeHtml(uc.kpi)}</li>
          </ul>
          ${imageHtml}
        </article>
      `;
    }).join("");

    roadmap.innerHTML = phaseData.map((phase) => `
      <article class="phase">
        <span class="wk">${escapeHtml(phase.window)}</span>
        <h4>${escapeHtml(phase.name)}</h4>
        <p>${escapeHtml(phase.detail)}</p>
      </article>
    `).join("");

    sharedStack.innerHTML = extractSharedStack(sections.get("Shared Platform Architecture") || "")
      .map((line) => `<li>${escapeHtml(line)}</li>`).join("");

    securityControls.innerHTML = extractSecurityControls(sections.get("Security & Compliance") || "")
      .map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  } catch (error) {
    summary.textContent = `Unable to render executive review: ${error.message}`;
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

function splitByH3(section) {
  const lines = section.split(/\r?\n/);
  const parts = new Map();
  let title = "";
  let buffer = [];

  for (const line of lines) {
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      if (title) {
        parts.set(title, buffer.join("\n").trim());
      }
      title = h3[1].trim();
      buffer = [];
      continue;
    }
    if (title) {
      buffer.push(line);
    }
  }

  if (title) {
    parts.set(title, buffer.join("\n").trim());
  }

  return parts;
}

function firstParagraph(text) {
  return text
    .split(/\r?\n\r?\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .find((p) => p && !p.startsWith("|") && !p.startsWith("-") && !p.startsWith("*") && !/^\d+\./.test(p));
}

function extractUseCases(sections) {
  const success = sections.get("Success Metrics & KPIs") || "";
  const kpiByUseCase = new Map();
  for (const [key, value] of splitByH3(success).entries()) {
    const targets = value
      .split(/\r?\n/)
      .filter((line) => line.includes("|") && !/^\|\s*[-:]/.test(line))
      .slice(0, 3)
      .map((line) => line.replace(/\|/g, " ").replace(/\s+/g, " ").trim());
    if (targets.length) {
      kpiByUseCase.set(key, targets.join("; "));
    }
  }

  const useCases = [];
  for (const [title, body] of sections.entries()) {
    if (!/^Use Case/i.test(title)) {
      continue;
    }

    const h3 = splitByH3(body);
    const problem = findSection(h3, "Problem Statement") || body;
    const services = findSection(h3, "Azure Services") || "";

    const serviceNames = services
      .split(/\r?\n/)
      .filter((line) => line.includes("|") && !/^\|\s*[-:]/.test(line))
      .slice(0, 4)
      .map((line) => line.split("|")[1] || "")
      .map((s) => s.trim())
      .filter(Boolean);

    const image = (body.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1] || "";
    const ucName = title.replace(/^Use Case\s*\d*\s*[—-]\s*/i, "");
    const kpi = pickKpiForUseCase(title, kpiByUseCase) || "KPI thresholds defined in the Success Metrics section.";

    useCases.push({
      title: ucName,
      pill: serviceNames.slice(0, 3).join(" + ") || "AI-Enabled Workflow",
      pain: firstParagraph(problem) || "Manual processing and fragmented workflows reduce speed and quality.",
      pattern: serviceNames.length ? serviceNames.join(", ") : "Azure AI Foundry, automation, and domain models.",
      outcome: extractOutcomeText(problem) || "Faster cycle times, better consistency, and scalable operations.",
      kpi,
      image
    });
  }

  return useCases.slice(0, 2);
}

function extractOutcomeText(problemSection) {
  const goalIndex = problemSection.search(/Goals?:/i);
  if (goalIndex >= 0) {
    const goals = problemSection.slice(goalIndex)
      .split(/\r?\n/)
      .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
      .map((line) => line.replace(/^\s*[-•]\s*/, "").trim())
      .filter(Boolean);
    if (goals.length) {
      return goals[0];
    }
  }

  return "Improved decision speed, reduced manual effort, and more reliable service outcomes.";
}

function extractPhases(useCases, roadmapSection) {
  const phaseLines = [];
  const source = roadmapSection || useCases.map((u) => u.pain).join("\n");

  for (const line of source.split(/\r?\n/)) {
    const m = line.match(/(Phase\s*\d+[^|]*)\|?\s*(.*)/i);
    if (m) {
      phaseLines.push({ raw: m[1].trim(), detail: m[2].trim() });
    }
  }

  const weekMatches = [...source.matchAll(/(Weeks?\s*\d+\s*[–-]\s*\d+|Month\s*\d+)/gi)].map((m) => m[0]);

  if (phaseLines.length) {
    return phaseLines.slice(0, 4).map((p, idx) => ({
      window: weekMatches[idx] || `Phase ${idx + 1}`,
      name: p.raw,
      detail: p.detail || "Execution detail defined in implementation plan."
    }));
  }

  return [
    { window: "Weeks 1-4", name: "Phase 1 - Scope and Baselines", detail: "Define scope, establish baseline metrics, and provision foundational resources." },
    { window: "Weeks 5-9", name: "Phase 2 - Data and Model Preparation", detail: "Prepare data pipelines, quality controls, and model-ready inputs." },
    { window: "Weeks 10-15", name: "Phase 3 - Build and Integrate", detail: "Deploy AI workflows, integrate with business systems, and harden operations." },
    { window: "Weeks 16-24", name: "Phase 4 - Validate and Scale", detail: "Run pilots, validate KPIs, train users, and scale to full production." }
  ];
}

function extractCostData(costSection) {
  const money = [...new Set(costSection.match(/\$[0-9,]+(?:\s*[–-]\s*\$[0-9,]+)?(?:\/[a-zA-Z]+)?/g) || [])];
  const headline = money.length
    ? `Recommended planning range: ${money.slice(0, 4).join(" | ")}`
    : "Recommended planning range is documented in the Cost Estimates section.";

  const boxes = [
    { key: "Build Period", amount: findRowCost(costSection, "Build") || "See full brief" },
    { key: "UC1 Steady State", amount: findRowCost(costSection, "UC1") || "See full brief" },
    { key: "UC2 Steady State", amount: findRowCost(costSection, "UC2") || "See full brief" },
    { key: "Combined", amount: findRowCost(costSection, "Combined") || (money[0] || "See full brief") }
  ];

  const rows = costSection
    .split(/\r?\n/)
    .filter((line) => line.includes("|") && /\$/.test(line) && !/^\|\s*[-:]/.test(line))
    .slice(0, 3)
    .map((line) => {
      const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
      return {
        scenario: cols[0] || "Scenario",
        cost: cols.find((c) => /\$/.test(c)) || "See full brief",
        notes: cols.slice(2).join(" ") || "Cost detail from source estimate table."
      };
    });

  if (!rows.length) {
    rows.push(
      { scenario: "Build period", cost: "See full brief", notes: "Implementation and setup period." },
      { scenario: "Steady state", cost: "See full brief", notes: "Ongoing monthly operations." },
      { scenario: "Annualized", cost: "See full brief", notes: "Annual view based on monthly run rate." }
    );
  }

  return { headline, boxes, rows };
}

function findRowCost(costSection, keyword) {
  const line = costSection
    .split(/\r?\n/)
    .find((l) => l.includes("|") && new RegExp(keyword, "i").test(l) && /\$/.test(l));
  if (!line) {
    return "";
  }
  const match = line.match(/\$[0-9,]+(?:\s*[–-]\s*\$[0-9,]+)?(?:\/[a-zA-Z]+)?/g);
  return match ? match.join(" | ") : "";
}

function extractSharedStack(section) {
  const bullets = section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || line.startsWith("•"))
    .map((line) => line.replace(/^[-•]\s*/, "").trim());

  if (bullets.length) {
    return bullets.slice(0, 4);
  }

  const rows = section
    .split(/\r?\n/)
    .filter((line) => line.includes("|") && !/^\|\s*[-:]/.test(line))
    .map((line) => line.replace(/\|/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return rows.slice(0, 4).length ? rows.slice(0, 4) : [
    "Azure AI Foundry hub with initiative-level project separation.",
    "Centralized data storage and workflow orchestration.",
    "Unified monitoring and operational dashboards.",
    "Shared identity and secrets management controls."
  ];
}

function extractSecurityControls(section) {
  const rows = section
    .split(/\r?\n/)
    .filter((line) => line.includes("|") && !/^\|\s*[-:]/.test(line))
    .map((line) => line.split("|").map((c) => c.trim()).filter(Boolean))
    .filter((cols) => cols.length >= 2)
    .map((cols) => `${cols[0]}: ${cols[1]}`);

  return rows.slice(0, 4).length ? rows.slice(0, 4) : [
    "Microsoft Entra ID access controls with role-based permissions.",
    "Encryption at rest and in transit with managed secrets.",
    "Audit logging and data governance workflows.",
    "Responsible AI and compliance guardrails across both use cases."
  ];
}

function extractImpactLine(successSection) {
  const lines = successSection
    .split(/\r?\n/)
    .filter((line) => line.includes("|") && !/^\|\s*[-:]/.test(line))
    .slice(0, 2)
    .map((line) => line.replace(/\|/g, " ").replace(/\s+/g, " ").trim());

  return lines.length ? lines.join("; ") : "";
}

function findSection(parts, startsWith) {
  for (const [key, value] of parts.entries()) {
    if (key.toLowerCase().startsWith(startsWith.toLowerCase())) {
      return value;
    }
  }
  return "";
}

function pickKpiForUseCase(title, kpiByUseCase) {
  for (const [key, value] of kpiByUseCase.entries()) {
    const normalizedKey = key.toLowerCase();
    if (title.toLowerCase().includes("1") && normalizedKey.includes("1")) {
      return value;
    }
    if (title.toLowerCase().includes("2") && normalizedKey.includes("2")) {
      return value;
    }
  }
  return "";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
