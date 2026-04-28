# ODNR Division of Wildlife — AI Initiative
## Executive Summary

> **Agency:** Ohio Department of Natural Resources (ODNR) — Division of Wildlife
> **Platform:** Microsoft Azure AI Foundry + Microsoft 365 Copilot + Power Platform
> **Date:** March 2026
> **Full Technical Plan:** [README.md](README.md)

---

## Initiative Overview

The Division of Wildlife is implementing two AI-enabled initiatives focused on reducing repetitive manual work, improving data accuracy, and freeing professional staff to focus on wildlife management and public engagement. Both use cases employ a **human-in-the-loop** design principle — AI accelerates and assists, while Division staff retain supervisory control over all outputs and decisions.

| # | Initiative | Primary Benefit |
|---|---|---|
| 1 | **Automate Internal Task-Based Processes** | Automate permitting workflows and fish survey data summarization to reduce staff hours spent on repetitive data entry and manual reporting |
| 2 | **PDF Form to Web Application Translation** | Use AI to extract fields from submitted PDF forms and pre-populate web systems, eliminating redundant manual transcription |

---

## Level of Effort

### Summary

| | UC1 — Process Automation | UC2 — PDF Translation |
|---|---|---|
| **Total Duration** | 5 months | 5 months |
| **Parallel execution** | Months 1–5 | Months 1–5 |
| **Initial build effort** | ~1,480 hours | ~1,200 hours |
| **Ongoing support (monthly)** | ~20 hrs/month | ~15 hrs/month |

### UC1 — Process Automation (Permitting + Fish Surveys)

| Phase | Duration | Key Activities | Est. Hours |
|---|---|---|---|
| Scope Definition & Process Mapping | Weeks 1–3 | Select pilot permit type and survey, document workflows, establish baselines, design Dataverse schema | 160 hrs |
| Data Preparation & Environment Setup | Weeks 4–6 | Power Platform provisioning, Dataverse schema, sample data collection, Azure AI resource deployment | 200 hrs |
| Workflow Automation Build | Weeks 7–12 | Power Automate permit flow, survey pipeline, Azure Functions for statistical scripts, Copilot Studio agent | 560 hrs |
| Validation & UAT | Weeks 13–16 | Accuracy testing, SME review of narratives, pilot group UAT, prompt tuning | 320 hrs |
| Training, Rollout & Expansion Planning | Weeks 17–20 | Staff training, soft launch, performance monitoring, expansion roadmap | 240 hrs |
| **Total** | **20 weeks** | | **~1,480 hrs** |

### UC2 — PDF Form to Web Application Translation

| Phase | Duration | Key Activities | Est. Hours |
|---|---|---|---|
| Scope & Baseline | Weeks 1–3 | Form type selection, field mapping, baseline measurement, sample document collection | 120 hrs |
| Document Intelligence Configuration | Weeks 4–7 | Model labeling, training, extraction validation, confidence threshold design | 320 hrs |
| Integration & Routing Pipeline | Weeks 8–12 | Power Automate flow, Copilot Studio review agent, target system integration, audit trail | 400 hrs |
| Testing & Validation | Weeks 13–16 | End-to-end testing, UAT, model refinement, accessibility review | 240 hrs |
| Rollout & Expansion | Weeks 17–20 | Go-live, monitoring, lessons learned, next form types | 120 hrs |
| **Total** | **20 weeks** | | **~1,200 hrs** |

> **Note:** Both use cases run concurrently. Shared infrastructure setup (Power Platform environment, Azure AI Services) occurs in Month 1 and benefits both.

---

## Development Teams & Skills Required

### Team Composition

| Role | FTE / Allocation | UC | Primary Responsibility | Required Skills |
|---|---|---|---|---|
| **Power Platform Developer** | 2 FTE | UC1 + UC2 | Power Automate flows, Dataverse schema, Power Apps, Copilot Studio agents | Power Automate, Dataverse, Power Apps, Copilot Studio, REST API connectors |
| **AI Engineer** | 1 FTE | UC1 + UC2 | Azure OpenAI (GPT-4o) integration, AI Language, Document Intelligence model training and tuning | Azure AI Services, Python, Prompt engineering, Document Intelligence Studio |
| **Azure Functions Developer** | 1 FTE | UC1 | Cloud execution of R/Python statistical analysis scripts for fish surveys | Azure Functions, R, Python, ADLS Gen2 |
| **Business Analyst** | 1 FTE | UC1 + UC2 | Process mapping, requirements gathering, UAT coordination, baseline metric tracking | Business process analysis, workflow documentation, UAT facilitation |
| **Wildlife SME — Fisheries Biologist** | 0.5 FTE | UC1 | Survey narrative validation, domain accuracy review, pilot feedback | Fisheries science, survey methodology, report authoring |
| **Division Permit Technician** | 0.5 FTE | UC1 + UC2 | Permit workflow validation, form field verification, UAT, ongoing human review | Permitting processes, Division workflows |
| **ODNR IT Lead** | 0.5 FTE | UC1 + UC2 | Power Platform environment, Azure subscription, Entra ID, licensing coordination | Azure administration, Power Platform admin, M365 tenant management |
| **UX Designer** | 0.25 FTE | UC2 | Copilot Studio review interface design, accessibility compliance | UX design, WCAG 2.1 AA |

### Critical Skill Areas

- **Power Platform (Advanced)** — Power Automate cloud flows with custom connectors, Dataverse data modeling, Copilot Studio agent design with adaptive cards and guided review flows
- **Azure AI Document Intelligence** — Custom model training via Document Intelligence Studio, confidence scoring design, field mapping to target schemas
- **LLM Prompt Engineering** — GPT-4o system prompt authoring for domain-specific (fisheries/wildlife) narrative generation with factual grounding
- **Statistical Script Operationalization** — Migrating existing R/Python analysis scripts to Azure Functions for cloud-based, staff-accessible execution
- **Human-in-the-Loop Design** — UX and workflow patterns that make AI outputs reviewable, correctable, and auditable by non-technical staff
- **Public Sector Security & Compliance** — Entra ID, Conditional Access, Dataverse audit logging, PII handling, NIST 800-53 alignment

---

## Key Microsoft & Azure Services to Deploy

### Shared Platform (Both Use Cases)

| Service | Purpose |
|---|---|
| **Microsoft Entra ID** | Identity, RBAC, Conditional Access, Managed Identities |
| **Power Platform Environment** | Unified environment for Dataverse, Power Automate, Power Apps, Copilot Studio |
| **Microsoft Dataverse** | Centralized structured data store for permits, survey records, and extracted form data |
| **SharePoint Online** | Document intake queues, output libraries, file-based triggers |
| **Azure Monitor + App Insights** | Pipeline health monitoring, extraction accuracy dashboards, alerting |
| **Azure Key Vault** | Secrets and API key management for Azure AI service connections |

### UC1 — Process Automation Specific

| Service | Purpose |
|---|---|
| **Microsoft Power Automate** | End-to-end permit routing and survey data pipeline orchestration |
| **Microsoft 365 Copilot** | Draft permit approval memos and document summarization |
| **Copilot Studio** | Conversational interface for staff to review, edit, and approve AI outputs |
| **Azure OpenAI Service (GPT-4o)** | Plain-language narrative summary generation for fish survey reports |
| **Azure AI Language** | Field validation, anomaly detection, and NER on permit submissions |
| **Azure Functions** | Serverless execution of R/Python statistical scripts (CPUE, size-frequency, abundance indices) |
| **Azure Data Lake Storage Gen2** | Raw survey data file landing zone |
| **Power Apps (Model-Driven)** | Human review queue for permit decisions |

### UC2 — PDF Translation Specific

| Service | Purpose |
|---|---|
| **Azure AI Document Intelligence** | Custom model training and field extraction from submitted PDF forms |
| **Microsoft Power Automate** | PDF intake trigger, Document Intelligence API call, field routing to target system |
| **Copilot Studio** | Guided staff review: side-by-side extracted fields vs. original PDF, low-confidence flagging |
| **Microsoft 365 Copilot** | Review and validation of extracted content prior to submission |
| **Azure AI Language** | Secondary validation of free-text extracted fields |
| **Power Apps (Canvas)** | Optional custom review UI for field-by-field staff verification |

---

## Estimated Run Costs

> All figures are indicative estimates. Validate with [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) and the ODNR Microsoft enterprise licensing agreement.

### UC1 — Process Automation

| Component | Monthly Estimate |
|---|---|
| Azure OpenAI GPT-4o (survey summaries + permit memos) | $300–$700 |
| Azure AI Language (field validation) | $100–$200 |
| Azure Functions (statistical script execution) | $50–$150 |
| Azure Data Lake Storage Gen2 | $30–$80 |
| Power Platform Premium per-user (10 users) | $500–$600 |
| M365 Copilot licenses (if not already licensed) | $300–$500 |
| Azure Monitor + App Insights | $50–$100 |
| **UC1 Total** | **~$1,330–$2,330/month** |

### UC2 — PDF Form Translation

| Component | Monthly Estimate |
|---|---|
| Azure AI Document Intelligence (~5,000 pages/month) | $100–$300 |
| Power Automate Premium flows | $150–$300 |
| Power Platform Premium per-user (5 users) | $250–$300 |
| Copilot Studio (per session or per user licensing) | $200–$400 |
| SharePoint / Dataverse storage (incremental) | $50–$100 |
| Azure Monitor + App Insights | $30–$60 |
| **UC2 Total** | **~$780–$1,460/month** |

### Shared Costs Estimate

| Scenario | Monthly Cost |
|---|---|
| **Build period (Months 1–5, dev + test environments)** | ~$1,200–$2,500/month |
| **Post-launch steady state** | **~$2,110–$3,790/month** |
| **Annual operational estimate** | **~$25,000–$45,000/year** |

> **Licensing note:** If ODNR already holds Ohio enterprise M365 E3/E5 agreements, Power Platform and Copilot Studio capacity may be partially covered. Confirm current entitlements with ODNR IT and Microsoft Account team before finalizing cost projections.

---

## Timeline at a Glance

```
Month     1     2     3     4     5
          ├─────┼─────┼─────┼─────┤

Shared    ████ (Power Platform env + Azure AI provisioning)

UC1       ████  ████  ████████████  ████  ████
          Scope Setup   Build       UAT   Rollout

UC2       ████  ████████  ████████  ████  ████
          Scope Doc Intel  Pipeline  UAT   Rollout
```

| Key Milestone | Target |
|---|---|
| Power Platform environment + Azure AI resources provisioned | End of Month 1 |
| UC1 process maps and baseline metrics complete | End of Month 1 |
| UC2 Document Intelligence models trained and validated | End of Month 2 |
| UC1 Power Automate permit flow live (pilot permit type) | End of Month 3 |
| UC2 Power Automate PDF routing flow live (pilot forms) | End of Month 3 |
| UC1 + UC2 UAT complete | End of Month 4 |
| Full rollout (pilot scope) for both use cases | End of Month 5 |
| Expansion planning to additional permit/form types | End of Month 5 |

---

## Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Legacy data variability impacting Document Intelligence accuracy | Medium | High | Collect diverse training samples; set conservative confidence thresholds; expand training set iteratively |
| Statistical script dependencies (R/Python packages) blocking Azure Functions deployment | Medium | Medium | Containerize scripts in Azure Functions with explicit dependency management; validate in Month 1 |
| Staff resistance to AI-assisted review workflows | Low | Medium | Early stakeholder engagement; emphasize human oversight; demonstrate time savings in pilot |
| M365 Copilot or Power Platform licensing gaps | Medium | Medium | Validate current entitlements in Month 1; budget for incremental licenses if needed |
| Survey narrative accuracy rejected by subject matter experts | Low | High | Build iterative prompt tuning loop; SME reviews all output during UAT before production |

---

## Recommendation

Both use cases are **high-impact, lower-complexity** AI implementations well-suited to the Power Platform + Azure AI stack. They share infrastructure and can be delivered concurrently by a lean team within **5 months**.

**Immediate next steps:**

1. **Convene a Month 1 scoping session** with Division staff to select the pilot permit type and 2–3 PDF form types, and document current process steps and baseline metrics.
2. **Validate Power Platform and M365 licensing** with ODNR IT and the Microsoft Account Team to confirm entitlements and identify any licensing gaps.
3. **Provision the Power Platform environment and Azure resource groups** (can be completed in Week 1 with ODNR IT involvement).
4. **Engage a fisheries biologist SME** for the survey narrative evaluation process — this is the highest-risk accuracy judgment in UC1.

These initiatives represent practical, near-term wins that will directly free Division staff for the conservation and public engagement work that defines ODNR's mission.

---

*For full technical architecture, implementation phases, and security design, see [README.md](README.md).*
*Prepared by ODNR Division of Wildlife AI Initiative team — March 2026.*
