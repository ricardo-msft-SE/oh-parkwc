# Division of Wildlife — AI Initiative: Implementation Plan & Architectural Design

**Agency:** Division of Wildlife — Ohio Department of Natural Resources (ODNR)
**Platform:** Microsoft Azure AI Foundry + Azure AI Vision + Azure AI Document Intelligence + Microsoft Power Platform
**Date:** April 2026

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Solution Overview](#solution-overview)
- [Use Case 1 — Contract Processing: PDF → Excel → Memo Automation](#use-case-1--contract-processing-pdf--excel--memo-automation)
  - [Problem Statement](#problem-statement)
  - [Architecture (UC1)](#architecture-uc1)
  - [Implementation Plan (UC1)](#implementation-plan-uc1)
  - [Microsoft & Azure Services (UC1)](#microsoft--azure-services-uc1)
- [Use Case 2 — Wildlife Image & Video Recognition](#use-case-2--wildlife-image--video-recognition)
  - [Problem Statement (UC2)](#problem-statement-uc2)
  - [Architecture (UC2)](#architecture-uc2)
  - [Implementation Plan (UC2)](#implementation-plan-uc2)
  - [Microsoft & Azure Services (UC2)](#microsoft--azure-services-uc2)
- [Shared Platform Architecture](#shared-platform-architecture)
- [Security & Compliance](#security--compliance)
- [Implementation Roadmap](#implementation-roadmap)
- [Success Metrics & KPIs](#success-metrics--kpis)
- [Cost Estimates](#cost-estimates)
- [Team & Roles](#team--roles)

---

## Executive Summary

The Division of Wildlife within the Ohio Department of Natural Resources is pursuing two AI-enabled initiatives to eliminate high-friction manual workflows and scale wildlife research and operations. Both use cases are built on the Microsoft Azure AI platform, combining document intelligence, large language model reasoning, custom computer vision, and workflow automation to deliver scalable, auditable solutions aligned with Ohio public-sector cloud standards.

| Initiative | Problem | AI Solution | Outcome |
|---|---|---|---|
| UC1 — Contract Processing: PDF → Excel → Memo Automation | Staff (Christina Kuchle) manually reads contract PDFs with Copilot one at a time, reformats data into Excel, then copy/pastes into Memos and other documents — a time-consuming, error-prone process with manual handoffs at every step | Azure AI Document Intelligence extracts PDF fields into structured output; Power Automate auto-populates Excel templates; Azure OpenAI GPT-4o drafts memos from extracted data; end-to-end pipeline eliminates manual handoffs | Elimination of manual PDF-to-Excel translation, automated memo generation, dramatic reduction in staff processing time, and improved document consistency across the Division |
| UC2 — Wildlife Image & Video Recognition | The Division receives massive volumes of photos and videos from research trail cams, public submissions, law enforcement cameras, side-scan sonar, aerial video, and fish otolith scans — reviewing these, especially filtering false triggers such as wind, is extremely time-consuming and delays research and enforcement | Azure AI Custom Vision classifies trail cam images as wildlife events vs. false triggers; Azure AI Vision tags species and scene content; Azure AI Video Indexer processes aerial and trail cam video; automated routing surfaces only flagged images for human review | Dramatic reduction in manual image review time, automated false-trigger filtering, faster identification of wildlife events and enforcement evidence, and improved research throughput |

---

## Solution Overview

Both use cases leverage a shared Azure AI Foundry platform deployed within ODNR's Azure subscription. A common data lake, ingestion pipeline, and observability layer reduces duplication and supports cross-initiative governance across the Division of Wildlife.

```
┌──────────────────────────────────────────────────────────────────────┐
│        ODNR Division of Wildlife — Azure AI Foundry Hub (Shared)    │
│                                                                      │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐  │
│  │  UC1 — Contract Processing  │  │  UC2 — Image & Video         │  │
│  │  PDF → Excel → Memo         │  │  Recognition Pipeline        │  │
│  │  Automation Project         │  │  Project                     │  │
│  └─────────────────────────────┘  └──────────────────────────────┘  │
│                                                                      │
│  Shared: ADLS Gen2 | Azure Data Factory | Key Vault                 │
│          Monitor | Entra ID | Purview                               │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Use Case 1 — Contract Processing: PDF → Excel → Memo Automation

### Problem Statement

Christina Kuchle in the Division of Wildlife currently uses Microsoft Copilot to manually read contract PDFs and translate their content into Excel — a one-at-a-time process that requires significant hands-on effort to reformat, validate, and organize the extracted data. Once the Excel file is prepared, she must then manually copy and paste that data into Memos and other official documents. This workflow, while partially assisted by Copilot, remains largely manual at each handoff point: PDF reading, Excel formatting, and document population all require active staff intervention.

As contract volumes grow and staff bandwidth remains constrained, this approach creates processing bottlenecks, introduces risk of data entry errors at each manual handoff, and consumes significant staff time on mechanical formatting tasks that could be fully automated. A fully automated pipeline — from PDF ingestion through structured data extraction, Excel population, and memo drafting — would eliminate manual handoffs and allow Christina and her colleagues to focus on higher-value review and decision-making tasks.

### Architecture (UC1)

![Architecture (UC1) - Contract Processing Automation Pipeline](wild.png)

### Implementation Plan (UC1)

**Phase 1 — Define Scope & Success Metrics (Weeks 1–3)**
- Select 2–3 contract types for the pilot (e.g., wildlife permits, vendor service agreements, interagency contracts)
- Map Christina's current step-by-step workflow: PDF ingestion → Copilot-assisted reading → manual Excel formatting → copy/paste to Memo template
- Define extraction fields per contract type (party names, dates, dollar amounts, terms, key clauses, effective dates)
- Identify and collect existing Excel templates and Memo templates used by Division staff
- Establish success metrics: processing time per contract, extraction accuracy, memo quality rating, staff satisfaction
- Provision Azure landing zone: ADLS Gen2, Azure AI Document Intelligence project, Azure OpenAI deployment (GPT-4o), AI Foundry project, Key Vault, Azure Monitor

**Phase 2 — Collect & Prepare Data (Weeks 4–7)**
- Gather 100–300 historical contracts for pilot contract types
- Label sample documents in Document Intelligence Studio: annotate extraction fields per contract type (party names, contract dates, amounts, key terms, required clauses)
- Validate Document Intelligence extraction accuracy on held-out sample (target: ≥ 90% field-level accuracy)
- Map Excel template field population: which extracted fields populate which Excel columns for each contract type
- Design Power Automate pipeline flow: PDF uploaded → Document Intelligence extraction triggered → structured data output → Excel template auto-populated → GPT-4o memo draft generated → staff notification with review package

**Phase 3 — Build Automation Pipeline (Weeks 8–13)**
- Deploy Document Intelligence extraction pipeline: contract PDF ingestion from ADLS Gen2 → structured field extraction → auto-populated Excel output file generation per contract type
- Deploy Azure OpenAI GPT-4o memo drafting: extracted contract fields passed as structured input → GPT-4o populates Division Memo template → draft memo output routed to staff review
- Build Power Automate end-to-end workflow: PDF uploaded → extraction triggered → Excel file generated → memo drafted → staff notification with complete review package (PDF + Excel + draft Memo) in one step
- Build Copilot Studio contract processing agent: staff query contract processing status, retrieve extraction results, request memo revisions via conversational interface within Teams
- Integrate M365 Copilot for final memo editing and document refinement assistance within Word
- Build Power BI dashboard: pipeline throughput, extraction accuracy trends, processing time per contract type, volume by month

**Phase 4 — Evaluate & Refine (Weeks 14–16)**
- Measure contract processing time reduction per document vs. Christina's current baseline
- Review extraction accuracy and memo draft quality with Division staff
- Gather feedback on workflow usability and end-to-end pipeline experience
- Refine Document Intelligence custom models and GPT-4o memo prompts based on staff feedback
- Document automation methodology and data lineage for compliance and audit purposes
- Plan for broader rollout to additional contract types and Division staff members

### Microsoft & Azure Services (UC1)

| Service | Role |
|---|---|
| Azure AI Document Intelligence (Custom/Layout) | Automated extraction of contract fields (party names, dates, amounts, terms, clauses) from uploaded PDFs into structured output for Excel population |
| Azure OpenAI — GPT-4o | Auto-generation of draft memos and other Division documents using extracted contract fields as structured template input |
| Azure AI Foundry | Model deployment management, pipeline orchestration, prompt engineering workspace, monitoring |
| Azure Data Lake Storage Gen2 | Contract PDF archive and extracted output storage organized by contract type and submission date |
| Microsoft Power Automate | End-to-end pipeline orchestration: PDF ingestion → field extraction → Excel auto-population → memo drafting → staff review routing |
| Microsoft 365 Copilot | Final memo editing and document refinement assistance within Word; drafting guidance for staff review and approval |
| Microsoft Copilot Chat | Conversational interface for staff to query contract processing status and request document revisions |
| Copilot Studio + Copilot Agents | Contract processing agent: staff query extraction results, memo status, and revision requests via conversational interface in Teams |
| Power BI | Pipeline throughput dashboard with extraction accuracy trends, processing time per contract type, and volume metrics |
| Azure Monitor + App Insights | Pipeline health monitoring, model inference latency, alerting |
| Azure Key Vault | Secure storage of API keys, connection strings, and credentials |

---

## Use Case 2 — Wildlife Image & Video Recognition

### Problem Statement (UC2)

The Division of Wildlife receives and must review massive volumes of imagery and video from multiple sources: research trail cameras deployed across Ohio wildlife management areas, public photo and video submissions via online portals, law enforcement trail cameras used for wildlife crime investigation, side-scan sonar imagery from aquatic habitat surveys, aerial video from drone and fixed-wing aircraft surveys, and fish otolith scans used in age and growth research.

Reviewing this volume of visual content is extremely time-consuming and creates significant bottlenecks for wildlife biologists, researchers, and law enforcement staff. Trail cameras in particular generate high rates of false trigger events — images captured by wind moving vegetation, lighting changes, insects crossing the sensor, or other non-wildlife stimuli — that must be manually sorted before biologists can identify and analyze images containing actual wildlife events. At scale, this manual triage process consumes hours of skilled staff time that could be directed toward research analysis and resource management decisions.

AI-powered image and video analysis can dramatically reduce this manual review burden: automatically classifying trail cam images as wildlife events vs. false triggers, tagging species in photos and video frames, processing aerial and trail cam video for event detection, and routing only flagged images and relevant clips to biologists for human review. This allows Division staff to focus their expertise on scientific interpretation and enforcement action rather than mechanical image triage.

### Architecture (UC2)

![Architecture (UC2) - Wildlife Image & Video Recognition Pipeline](wild2.png)

### Implementation Plan (UC2)

**Phase 1 — Define Scope & Success Metrics (Weeks 1–4)**
- Select 2–3 image source types for the pilot (recommended priority: research trail cams + public photo submissions as Phase 1; aerial video as Phase 2 expansion)
- Define classification labels for the Custom Vision pilot model: True Wildlife Event / False Trigger — Wind/Vegetation / False Trigger — Lighting / False Trigger — Other
- Inventory available labeled trail cam images for model training (target: 500–2,000 labeled images per class from ODNR's existing archive)
- Establish success metrics: false trigger filtering F1 score (target ≥ 0.88), manual review time reduction (target ≥ 60%), biologist workflow satisfaction
- Provision Azure resources: ADLS Gen2, Azure AI Custom Vision project, Azure AI Vision, Azure AI Video Indexer, Azure Data Factory, AI Foundry project, Key Vault, Monitor

**Phase 2 — Collect & Prepare Data (Weeks 5–9)**
- Gather and label 500–2,000 trail cam images per classification class from ODNR's existing trail cam archive; export to Azure AI Custom Vision training project
- Train initial Custom Vision classification model using labeled dataset
- Evaluate initial model accuracy on held-out validation set (target: ≥ 85% precision and recall for the False Trigger class; iterate until threshold met)
- Configure Azure AI Vision Image Analysis for species tagging on images classified as Wildlife Events
- Design Azure Data Factory batch ingestion pipeline: image/video upload from field cameras → ADLS Gen2 organized by source type, date, and location
- Design Power Automate routing logic: Wildlife Event images (with species tags) → biologist review queue; False Trigger images → auto-archive with confidence score logged

**Phase 3 — Build AI Image Triage Pipeline (Weeks 10–16)**
- Deploy Azure AI Custom Vision inference endpoint: batch processing of trail cam images → False Trigger vs. Wildlife Event classification → confidence scores → routing decision per image
- Deploy Azure AI Vision Image Analysis on all images classified as Wildlife Events: species tagging, scene classification, and object detection output appended to image metadata
- Deploy Azure AI Video Indexer: batch processing of aerial video and trail cam video → scene change detection → wildlife event clip extraction → false trigger video segment filtering → indexed output
- Build Azure Data Factory batch ingestion pipeline: automated ingestion of images/videos from field upload locations → ADLS Gen2 archive by source type, date, and location → AI analysis pipeline trigger
- Build Power Automate review routing workflow: Wildlife Event images and video clips with species tags → biologist review dashboard notification → review assignment and annotation queue
- Build Power BI image review dashboard: triage results by source type and location, false trigger rates by camera and season, species identification trends, review queue status, and processing volume
- Integrate M365 Copilot for automated wildlife event summary report generation from Power BI data and triage results

**Phase 4 — Evaluate & Refine (Weeks 17–20)**
- Conduct UAT with Division wildlife biologists and law enforcement staff on pilot image source types
- Measure false trigger filtering accuracy (F1 score) against labeled validation set; measure manual review time reduction vs. pre-pilot baseline
- Gather biologist feedback on species tagging accuracy, video indexer clip quality, and review workflow usability
- Retrain Custom Vision model with additional labeled data from pilot review sessions to improve accuracy iteratively
- Document model performance metrics and classification methodology for research and enforcement defensibility
- Plan Phase 2 expansion: side-scan sonar imagery interpretation, fish otolith scan analysis, and law enforcement trail cam integration

### Microsoft & Azure Services (UC2)

| Service | Role |
|---|---|
| Azure AI Custom Vision (Standard, 10 TPS) | Custom wildlife image classifier trained on ODNR-labeled trail cam images; classifies images as Wildlife Event vs. False Trigger categories at batch scale ($2/1K prediction transactions) |
| Azure AI Vision — Image Analysis | Species tagging, scene classification, and object detection on images classified as Wildlife Events by the Custom Vision model |
| Azure AI Video Indexer | Batch processing of aerial video and trail cam video; scene change detection, wildlife event clip extraction, and false trigger video segment filtering (~$0.035/min Basic Video Analysis) |
| Azure AI Foundry | Model deployment management, Custom Vision project hosting, pipeline orchestration, monitoring |
| Azure Data Factory | Automated batch ingestion pipeline: field image/video uploads → ADLS Gen2 archive organized by source type, date, and location |
| Azure Data Lake Storage Gen2 | Centralized image and video archive organized by source type (trail cam, public submission, aerial, sonar, otolith), date, and location |
| Microsoft Power Automate | Review routing workflow: Wildlife Event images/clips → biologist review queue; False Trigger images → auto-archive |
| Power BI | Image review dashboard with triage results, false trigger rates, species identification trends, review queue status, and processing volume |
| Microsoft 365 Copilot | Automated wildlife event summary report generation; research report drafting from Power BI triage data |
| Microsoft Copilot Chat | Conversational interface for biologists to query image triage results and review queue status |
| Azure Monitor + App Insights | Pipeline health monitoring, batch job status, model inference latency, alerting |
| Azure Key Vault | Secure storage of API keys, connection strings, and credentials |

---

## Shared Platform Architecture

Both use cases are deployed under a common Azure AI Foundry Hub within ODNR's Azure subscription. Shared infrastructure — including the data lake, ingestion pipeline, Key Vault, and observability stack — reduces cost, simplifies governance, and provides a consistent security posture across both Division of Wildlife AI initiatives.

```
┌──────────────────────────────────────────────────────────────────────────┐
│              ODNR Division of Wildlife — Shared Azure Platform           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Azure AI Foundry Hub                          │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────┐  ┌──────────────────────────────┐ │   │
│  │  │  UC1 — Contract          │  │  UC2 — Image & Video         │ │   │
│  │  │  Processing Project      │  │  Recognition Project         │ │   │
│  │  └──────────────────────────┘  └──────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ADLS Gen2 (Data Lake)      |  Azure Data Factory (Ingestion)           │
│  Azure Key Vault             |  Azure Monitor + App Insights             │
│  Microsoft Entra ID          |  Microsoft Purview (Governance)           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Security & Compliance

- **Identity & Access:** Microsoft Entra ID enforces role-based access control (RBAC) across all Azure resources; law enforcement trail camera imagery and case evidence access restricted to authorized law enforcement personnel only; biologist access scoped to research image repositories
- **Data Protection:** All data at rest encrypted via Azure Storage Service Encryption; all data in transit encrypted via TLS 1.2+; wildlife imagery classified by sensitivity (research vs. law enforcement evidence) with separate access tiers in ADLS Gen2
- **Secret Management:** API keys, connection strings, and credentials stored exclusively in Azure Key Vault; no secrets in code or configuration files
- **Wildlife Data & Image Governance:** Microsoft Purview applied for data classification, lineage tracking, and retention policy enforcement; law enforcement trail cam imagery subject to chain-of-custody data handling requirements for use in enforcement proceedings
- **Audit Logging:** Azure Monitor and App Insights capture all pipeline activity, model inference events, image classification decisions, and review actions for full audit trail; AI classifications on law enforcement imagery flagged for human review before use in enforcement actions
- **Network Security:** Azure Virtual Network (VNet) integration and Private Endpoints restrict public exposure of image data and AI services; field camera upload endpoints secured via authenticated upload workflows
- **Regulatory Alignment:** Solution design aligned with Ohio public-sector cloud standards; CJIS-aligned data handling practices for law enforcement trail cam imagery and wildlife crime evidence; wildlife data residency enforced within ODNR's Azure tenant boundary

---

## Implementation Roadmap

| Phase | Weeks | Milestone |
|---|---|---|
| Phase 1 (UC1) — Scope & Workflow Mapping | 1–3 | Pilot contract types selected; Christina's workflow mapped step-by-step; Azure landing zone provisioned |
| Phase 1 (UC2) — Scope & Image Inventory | 1–4 | Pilot image source types selected; labeled training images inventoried; Azure resources provisioned |
| Phase 2 (UC1) — Data Preparation | 4–7 | Contracts labeled; Document Intelligence extraction validated; Excel + Memo template mappings designed |
| Phase 2 (UC2) — Model Training & Pipeline Design | 5–9 | Trail cam images labeled; Custom Vision model trained to ≥ 85% accuracy; batch ingestion pipeline designed |
| Phase 3 (UC1) — Automation Pipeline Build | 8–13 | End-to-end PDF → Excel → Memo pipeline live; Copilot Studio agent deployed; Power BI dashboard live |
| Phase 3 (UC2) — AI Image Triage Pipeline Build | 10–16 | Custom Vision inference deployed; Video Indexer pipeline live; Power BI image review dashboard live |
| Phase 4 (UC1) — Evaluate & Refine | 14–16 | Pilot accuracy reviewed; prompts refined; rollout plan finalized for additional contract types |
| Phase 4 (UC2) — Evaluate & Refine | 17–20 | UAT complete; Custom Vision model retrained; Phase 2 expansion plan finalized (sonar, otolith, LE cams) |

---

## Success Metrics & KPIs

| Metric | Baseline | Target |
|---|---|---|
| UC1 — Contract processing time per document | Current Christina manual baseline (to be measured in Phase 1) | ≥ 70% reduction |
| UC1 — PDF field extraction accuracy | N/A (new capability) | ≥ 90% field-level accuracy |
| UC1 — Memo draft quality (staff-rated) | N/A (new capability) | ≥ 4 / 5 avg. rating |
| UC1 — Staff adoption rate | 0% | ≥ 80% of target users active within 60 days of launch |
| UC2 — False trigger filtering accuracy (F1 score) | N/A (new capability) | ≥ 0.88 F1 score |
| UC2 — Manual image review time reduction | To be measured in Phase 1 | ≥ 60% reduction |
| UC2 — Species tagging precision | N/A (new capability) | ≥ 85% precision |
| UC2 — Biologist-rated review workflow usefulness | N/A (new capability) | ≥ 4 / 5 avg. rating |

---

## Cost Estimates

> Estimates are indicative. Validate with the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) based on finalized contract document volumes, image/video ingestion rates, and licensed user counts. Azure AI Foundry Hub overhead is consumption-based (no flat platform fee); underlying service costs are reflected in component line items below. UC2 steady-state range is wide due to image volume variability — validate against actual ODNR trail cam trigger rates and archive volumes.

### UC1 — Contract Processing: PDF → Excel → Memo Automation

| Component | Build Period (Months 1–4) | Monthly Steady State |
|---|---|---|
| Azure AI Document Intelligence — Custom/Layout (~1K–5K pages/month @ $30/1K pages Custom) | $30–$150 | $30–$150 |
| Azure OpenAI — GPT-4o (memo drafting, ~500K–2M tokens/month @ $2.50/1M input + $10/1M output) | $1–$5 | $2–$10 |
| Azure Data Lake Storage Gen2 (contract PDF archive + extracted outputs) | $1–$5 | $5–$20 |
| Power Automate Premium (pipeline orchestration, ~3–5 users @ $15/user/mo) | $45–$75 | $45–$75 |
| Microsoft 365 Copilot (memo editing + drafting, ~3–5 staff @ $30/user/mo) | $90–$150 | $90–$150 |
| Copilot Studio (contract processing agent, 25K credits/mo prepaid pack) | $100–$200 | $100–$200 |
| Azure Monitor + App Insights | $25–$50 | $25–$50 |
| Azure Key Vault (shared) | ~$5 | ~$5 |
| **UC1 Total** | **~$297–$640/month** | **~$297–$660/month** |

### UC2 — Wildlife Image & Video Recognition

| Component | Build Period (Months 1–5) | Monthly Steady State |
|---|---|---|
| Azure AI Custom Vision — Prediction (~10K–500K images/month @ $2/1K transactions) | $20–$100 | $100–$1,000 |
| Azure AI Custom Vision — Model Training ($10/compute hour; ~5–10 hrs/month build retraining) | $50–$100 | $10–$30 (periodic retraining) |
| Azure AI Vision — Image Analysis (species tagging on wildlife events, ~5K–100K images/month @ $1/1K) | $5–$100 | $50–$100 |
| Azure AI Video Indexer — Basic Video Analysis (~500–5,000 min/month @ ~$0.035/min) | $18–$175 | $18–$175 |
| Azure Data Factory (batch ingestion pipelines, ~$1/1K activity runs + DIU hours) | $50–$200 | $50–$200 |
| Azure Data Lake Storage Gen2 (image/video archive, ~500 GB–2 TB accumulation) | $10–$50 | $50–$200 |
| Power Automate Premium (review routing, ~3–5 users @ $15/user/mo) | $45–$75 | $45–$75 |
| Power BI Pro (image review dashboard, ~3–5 biologists @ $10/user/mo) | $30–$50 | $30–$50 |
| Azure Monitor + App Insights | $25–$50 | $25–$50 |
| Azure Key Vault (shared) | ~$5 | ~$5 |
| **UC2 Total** | **~$258–$905/month** | **~$383–$1,885/month** |

### Combined Estimate

| Scenario | Monthly Cost |
|---|---|
| Build period (Months 1–5, both UCs running in parallel) | ~$555–$1,545/month |
| Post-launch steady state (both UCs) | ~$680–$2,545/month |
| Annual operational estimate (steady state × 12) | ~$8,160–$30,540/year |

---

## Team & Roles

| Role | Responsibility |
|---|---|
| Microsoft Solution Engineer | Overall solution architecture; Azure AI Foundry, Custom Vision, and Document Intelligence configuration; technical guidance and PoC delivery |
| Azure AI Engineer | Custom Vision model training and validation; Document Intelligence field extraction model configuration; Video Indexer pipeline build; Azure OpenAI prompt engineering |
| Power Platform Developer | Power Automate workflow build (UC1 end-to-end pipeline + UC2 review routing); Copilot Studio agent development; Power BI dashboard |
| Agency IT Lead | Azure subscription administration; Entra ID and RBAC configuration; network security; law enforcement data access tier controls |
| Division of Wildlife Staff SME (UC1) | Contract processing workflow domain expertise; Excel and Memo template definitions; extraction field labeling; UAT — Christina Kuchle and Division staff |
| Division of Wildlife Biologist SME (UC2) | Wildlife image classification expertise; trail cam false trigger labeling; species identification validation; review workflow UAT |
| Program Manager | Initiative coordination; milestone tracking; stakeholder communication across Division of Wildlife, IT, and Microsoft teams |

---

*Generated April 2026 — Division of Wildlife AI Initiative*
*Built on Microsoft Azure AI Foundry + Azure AI Vision + Azure AI Document Intelligence + Microsoft Power Platform*
