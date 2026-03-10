# ODNR Division of Oil & Gas Resources Management — AI Initiative
## Executive Summary

> **Agency:** Ohio Department of Natural Resources (ODNR) — Division of Oil & Gas Resources Management
> **Platform:** Microsoft Azure AI Foundry + Azure AI Services + Microsoft Power Platform
> **Date:** March 2026
> **Full Technical Plan:** [README.md](README.md)

---

## Initiative Overview

The Division of Oil & Gas Resources Management is pursuing two AI-enabled initiatives that address pressing environmental monitoring and legacy data accessibility challenges. Both use cases leverage Microsoft Azure AI capabilities and are designed to augment — not replace — Division staff expertise, with human review built into every workflow.

| # | Initiative | Primary Benefit |
|---|---|---|
| 1 | **Orphaned Well Detection via Aerial Imagery** | Use AI image recognition to automatically scan aerial imagery for orphaned well indicators across Ohio, dramatically increasing detection rates while reducing manual field survey time |
| 2 | **Historic Files Processing** | Use AI document intelligence and OCR to digitize, extract metadata from, and make searchable decades of legacy oil & gas records currently locked in scanned documents and microfiche |

---

## Level of Effort

### Summary

| | UC1 — Orphaned Well Detection | UC2 — Historic Files Processing |
|---|---|---|
| **Total Duration** | 6 months | 6 months |
| **Parallel execution** | Months 1–6 | Months 1–6 |
| **Initial build effort** | ~1,760 hours | ~1,640 hours |
| **Ongoing support (monthly)** | ~25 hrs/month | ~30 hrs/month |

### UC1 — Orphaned Well Detection via Aerial Imagery

| Phase | Duration | Key Activities | Est. Hours |
|---|---|---|---|
| Scope Definition & Data Collection | Weeks 1–4 | Pilot county selection, imagery source identification, training data collection and labeling strategy, infrastructure provisioning | 320 hrs |
| Model Training & Validation | Weeks 5–10 | Image annotation in AI Vision Studio, custom model training, precision/recall evaluation, confidence threshold design | 480 hrs |
| Detection Pipeline & Workflow Build | Weeks 11–16 | ADF batch inference pipeline, Power Automate field routing, Copilot Studio agent, Power BI dashboard | 560 hrs |
| Field Validation & Model Refinement | Weeks 17–20 | Top-detection field verification, true positive analysis, model retraining with field feedback, UAT | 240 hrs |
| Scale Planning & Statewide Rollout | Weeks 21–24 | Statewide imagery processing, database integration, staff training, documentation | 160 hrs |
| **Total** | **24 weeks** | | **~1,760 hrs** |

### UC2 — Historic Files Processing

| Phase | Duration | Key Activities | Est. Hours |
|---|---|---|---|
| Scope & Document Inventory | Weeks 1–3 | Record type inventory, pilot document selection, metadata target definition, baseline measurement | 160 hrs |
| Document Intelligence Model Training | Weeks 4–8 | Document labeling, custom model training per record type, extraction validation, confidence design | 400 hrs |
| Pipeline & Integration Build | Weeks 9–14 | Power Automate pipeline, Azure SQL/AI Search integration, Copilot Studio research agent, staff review Power App | 560 hrs |
| Testing & UAT | Weeks 15–18 | End-to-end pipeline testing, ground truth comparison, Division staff UAT, model refinement | 320 hrs |
| Scale Rollout & Backlog Processing | Weeks 19–24 | Expanded document types, systematic backlog batching, staff training, ongoing ingestion process | 200 hrs |
| **Total** | **24 weeks** | | **~1,640 hrs** |

> Both use cases run concurrently. Shared infrastructure provisioning (AI Foundry Hub, ADLS Gen2, Key Vault) occurs in Month 1 and benefits both initiatives.

---

## Development Teams & Skills Required

### Team Composition

| Role | Count | UC | Primary Responsibility | Required Skills |
|---|---|---|---|---|
| **AI / Computer Vision Engineer** | 1 FTE | UC1 | Azure AI Vision custom model training, image annotation, batch inference pipeline design | Azure AI Vision, Python, object detection, image labeling tools, Azure AI Foundry |
| **AI / Document Intelligence Engineer** | 1 FTE | UC2 | Document Intelligence custom model training, extraction pipeline, Azure AI Search indexing | Azure AI Document Intelligence, OCR, Python, Azure AI Search, field labeling |
| **Data / Platform Engineer** | 1 FTE | UC1 + UC2 | ADLS Gen2 architecture, ADF pipelines, Azure SQL schema, Azure Purview catalog | Azure Data Factory, ADLS Gen2, Azure SQL, Purview, Bicep/ARM |
| **Power Platform Developer** | 1 FTE | UC1 + UC2 | Power Automate flows, Power Apps review queues, Copilot Studio agents | Power Automate, Power Apps, Copilot Studio, REST API connectors, Dataverse |
| **GIS Specialist** | 1 FTE | UC1 | Aerial imagery source coordination, spatial data handling, detection coordinate validation and mapping | GIS (ArcGIS/QGIS), spatial SQL, USGS/Ohio imagery programs, KML/GeoJSON |
| **Division Geologist / Records SME** | 1 FTE | UC1 + UC2 | Well feature validation, historic record metadata review, domain accuracy assessment | Oil & gas geology, well log interpretation, Division record systems, regulatory compliance |
| **Business Analyst** | 0.5 FTE | UC1 + UC2 | Requirements, process mapping, UAT coordination, baseline metric tracking | Business process analysis, UAT facilitation, workflow documentation |
| **ODNR IT Lead** | 0.5 FTE | UC1 + UC2 | Azure environment, Entra ID, VNet, governance, licensing | Azure administration, network security, M365 tenant |

### Critical Skill Areas

- **Computer Vision / Object Detection** — Custom model training specifically for aerial/satellite imagery with small, varied well surface features; understanding of false-positive management strategies in environmental detection contexts
- **Document OCR & Extraction at Scale** — Experience with degraded-quality scanned documents, microfiche digitization artifacts, handwritten well log interpretation, and multi-layout form types
- **Geospatial Data Handling** — Coordinate system management, GeoJSON detection output, spatial database indexing, integration with Ohio's existing GIS infrastructure
- **Power Platform & Copilot Studio** — Advanced flow design with custom connectors, Copilot Studio agent creation with data source connections, model-driven app development for staff review queues
- **Human-in-the-Loop Workflow Design** — Ensuring every AI output has a clear staff review path; auditable decision trails for environmental regulatory purposes
- **Public Sector Security & Compliance** — Entra ID, private networking, NIST 800-53, EPA orphaned well program regulatory requirements, data retention policies

---

## Key Microsoft & Azure Services to Deploy

### Shared Platform (Both Use Cases)

| Service | Purpose |
|---|---|
| **Azure AI Foundry Hub** | Unified AI workspace, model management, monitoring, and governance |
| **Microsoft Entra ID** | Identity, RBAC, Conditional Access, Managed Identities |
| **Azure Data Lake Storage Gen2** | Raw imagery and document archive storage |
| **Azure Key Vault** | Secrets and API key management |
| **Azure Monitor + Log Analytics** | Pipeline health, model inference metrics, and alerting |
| **Azure Purview** | Data catalog, lineage, and sensitive data classification |
| **Azure Virtual Network + Private Endpoints** | Private network isolation for all PaaS services |

### UC1 — Orphaned Well Detection Specific

| Service | Purpose |
|---|---|
| **Azure AI Vision (Custom Model)** | Object detection model for well surface features in aerial imagery |
| **Azure Data Factory** | Batch imagery tile ingestion and inference pipeline orchestration |
| **Azure SQL Database** | Spatial detection results store (coordinates, confidence scores, field verification status) |
| **Azure Maps** | Spatial visualization of detection coordinates on Ohio county maps |
| **Microsoft Power Automate** | Field verification routing; inspection assignment queuing |
| **Microsoft 365 Copilot** | Field briefing summary generation per detected site |
| **Copilot Studio** | Field team agent for querying detections, managing site assignments |
| **Power BI** | Detection dashboard: county heat maps, confidence filters, status tracking |
| **Power Apps (Model-Driven)** | Staff review queue for detection disposition and verification |

### UC2 — Historic Files Processing Specific

| Service | Purpose |
|---|---|
| **Azure AI Document Intelligence** | Custom OCR and metadata extraction models for legacy oil & gas records |
| **Azure AI Search** | Full-text and semantic search over extracted document content |
| **Azure SQL Database** | Structured metadata store (well ID, operator, county, dates, formations, permit numbers) |
| **Microsoft Power Automate** | File arrival trigger, Document Intelligence API call, routing to database or review queue |
| **Microsoft 365 Copilot** | Plain-language document summary generation |
| **Copilot Studio** | Natural language records research agent |
| **Power Apps (Canvas)** | Staff interface for low-confidence field correction |
| **Azure AI Language** | Entity recognition and validation on extracted free-text fields |

---

## Estimated Run Costs

> All figures are indicative estimates. Validate with the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) based on finalized imagery volumes and document backlog sizing.

### UC1 — Orphaned Well Detection

| Component | Monthly Steady State |
|---|---|
| Azure AI Vision (custom model inference, ~50K tiles/month) | $300–$700 |
| Azure Data Factory (imagery ingestion) | $100–$250 |
| Azure Data Lake Storage Gen2 | $200–$500 |
| Azure SQL Database (detections + spatial index) | $150–$300 |
| Azure Maps | $50–$100 |
| Power BI Premium (if not already licensed) | $0–$200 |
| Azure Monitor + App Insights | $50–$100 |
| **UC1 Total** | **~$850–$2,150/month** |

### UC2 — Historic Files Processing

| Component | Monthly Steady State |
|---|---|
| Azure AI Document Intelligence (~10K pages/month) | $100–$300 |
| Azure AI Search (S1 tier) | ~$250 |
| Azure SQL Database (metadata store) | $150–$300 |
| Azure Data Lake Storage Gen2 (document archive) | $50–$150 |
| Power Automate Premium flows | $150–$300 |
| Copilot Studio (per session) | $100–$300 |
| Azure Monitor + App Insights | $50–$100 |
| **UC2 Total** | **~$850–$1,700/month** |

### Combined Estimate

| Scenario | Monthly Cost |
|---|---|
| **Build period (Months 1–6, dev + test environments active)** | ~$2,000–$4,500/month |
| **Post-launch steady state** | **~$1,700–$3,850/month** |
| **Annual operational estimate** | **~$20,000–$46,000/year** |

> **Note on imagery storage costs:** If processing statewide Ohio aerial imagery archives (potentially terabytes of data), Azure Data Lake Storage costs may be higher. Confirm estimated image volume with the Ohio Statewide Imagery Program before finalizing storage budget.

---

## Timeline at a Glance

```
Month     1     2     3     4     5     6
          ├─────┼─────┼─────┼─────┼─────┤

Shared    ████ (Foundry Hub, ADLS, shared infra)

UC1       ████  ████████  ████████████  ████  ████████
          Scope Training   Pipeline    Field  Statewide

UC2       ████  ████████  ████████████████  ████  ████
          Scope DocIntel   Pipeline+Search   UAT  Backlog
```

| Key Milestone | Target |
|---|---|
| Azure AI Foundry Hub + shared infrastructure provisioned | End of Month 1 |
| UC1 training imagery labeled, model training started | End of Month 2 |
| UC2 Document Intelligence models trained (pilot types) | End of Month 2 |
| UC1 AI Vision model validated, detection pipeline live | End of Month 3 |
| UC2 Power Automate pipeline + AI Search index live | End of Month 4 |
| UC1 Field validation complete (pilot counties) | End of Month 4 |
| UC2 UAT + Copilot Studio research agent validated | End of Month 4 |
| UC1 Statewide imagery detection run | End of Month 5 |
| UC2 Full backlog processing begins | End of Month 5 |
| Both use cases in steady-state operation | End of Month 6 |

---

## Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low aerial imagery resolution insufficient for well feature detection | Medium | High | Validate minimum resolution requirements in Month 1 before model training; procure higher-resolution imagery if needed |
| High false-positive rate reducing field team confidence | Medium | High | Set conservative confidence thresholds; build iterative field feedback loop for model retraining; track and report false-positive rate transparently |
| Historic document quality (faded microfiche, handwriting) limiting OCR accuracy | High | Medium | Collect maximally diverse training samples; set lower confidence thresholds for degraded document types; ensure staff review path for all uncertain extractions |
| Historic document backlog volume larger than estimated | Medium | Medium | Scope backlog volume in Month 1 before committing to processing timeline; design pipeline for scalable batch throughput |
| Imagery data access restrictions (licensing, data sharing agreements) | Low | High | Confirm data use agreements with Ohio Statewide Imagery Program and USGS in Month 1 |
| Field staff skepticism of AI detection accuracy | Medium | Medium | Transparent precision/recall reporting; emphasize human verification step; demonstrate early wins in pilot counties |

---

## Recommendation

Both use cases are **high-impact, technically feasible** AI applications for the Division. UC2 (Historic Files) carries lower technical risk and can demonstrate value quickly, making it an ideal **early win** to build organizational confidence in AI-assisted workflows before the more technically complex UC1 image detection model reaches production.

**Immediate next steps:**

1. **Month 1 scoping sessions** — UC1: confirm pilot county selection and aerial imagery source access. UC2: inventory document types and estimate backlog volume.
2. **Imagery data use agreement** — Confirm ODNR access to Ohio Statewide Imagery Program and USGS National Map imagery for model training and production inference.
3. **Engage Division Geologist SME** — This person is the critical accuracy gatekeeper for both use cases; include them in Month 1 planning sessions.
4. **Provision Azure infrastructure** — AI Foundry Hub, ADLS Gen2, and resource groups can be stood up in Week 1 to unblock both teams.
5. **Assess existing Power Platform licensing** — Confirm whether Premium Power Automate and Copilot Studio capacity is available under Ohio's enterprise agreement.

These two initiatives directly support ODNR's environmental stewardship mission by finding more orphaned wells faster and unlocking decades of regulatory data that until now has been inaccessible to modern analysis.

---

*For full technical architecture, implementation phases, and security design, see [README.md](README.md).*
*Prepared by ODNR Division of Oil & Gas Resources Management AI Initiative team — March 2026.*
