# Office of Coastal Management — AI Initiative: Implementation Plan & Architectural Design

**Agency:** Office of Coastal Management — Coastal Management / Real Estate / Water Divisions  
**Platform:** Microsoft Azure AI Foundry + Azure AI Services + Microsoft Power Platform  
**Date:** April 2026  

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Solution Overview](#solution-overview)
- [Use Case 1 — QA/QC of Coastal Management Instrumentation](#use-case-1--qaqc-of-coastal-management-instrumentation)
  - [Problem Statement](#problem-statement)
  - [Architecture (UC1)](#architecture-uc1)
  - [Implementation Plan (UC1)](#implementation-plan-uc1)
  - [Microsoft & Azure Services (UC1)](#microsoft--azure-services-uc1)
- [Use Case 2 — Shoreline Project Permit Review](#use-case-2--shoreline-project-permit-review)
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

The Office of Coastal Management — spanning the Coastal Management, Real Estate, and Water Divisions — is pursuing two AI-enabled initiatives to modernize legacy processes, improve environmental stewardship, and enhance public engagement. Both use cases are built on the Microsoft Azure AI platform, combining natural language processing, document intelligence, workflow automation, and conversational AI to deliver scalable, auditable solutions aligned with public-sector cloud standards.

| Initiative | Problem | AI Solution | Outcome |
|---|---|---|---|
| UC1 — QA/QC of Coastal Management Instrumentation | Manual QA/QC of sensor and instrument data is time-consuming, error-prone, and difficult to scale across distributed coastal monitoring networks | Azure AI Services detect anomalies in sensor logs; Power Automate routes exceptions; M365 Copilot summarizes QA findings for staff review | Increased automation of QA checks, improved data accuracy, reduced manual effort, and faster identification of instrument failures |
| UC2 — Shoreline Project Permit Review | Permit review is a document-heavy, manual process prone to inconsistency and delays; historical permit data is difficult to access and analyze | Azure AI Services analyze permit documents and flag key issues; Copilot Studio agent assists reviewers; M365 Copilot summarizes documents and generates review summaries | Faster permit review cycles, improved consistency, better resource allocation, and enhanced public service delivery |

---

## Solution Overview

Both use cases leverage a shared Azure AI Foundry platform deployed within the agency's Azure subscription. A common data and observability layer reduces duplication and supports cross-initiative governance across the Coastal Management, Real Estate, and Water Divisions.

```
┌──────────────────────────────────────────────────────────────────────┐
│         Office of Coastal Management — Azure AI Foundry Hub (Shared) │
│                                                                      │
│  ┌────────────────────────────┐  ┌──────────────────────────────┐   │
│  │  UC1 — QA/QC of Coastal   │  │  UC2 — Shoreline Project     │   │
│  │  Management Instrumentation│  │  Permit Review               │   │
│  └────────────────────────────┘  └──────────────────────────────┘   │
│                                                                      │
│  Shared: ADLS Gen2 | Key Vault | Monitor | Entra ID | Purview       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Use Case 1 — QA/QC of Coastal Management Instrumentation

### Problem Statement

The Coastal Management, Real Estate, and Water Divisions operate distributed networks of environmental instruments — including water level sensors, weather stations, and coastal monitoring equipment. Ensuring the quality and accuracy of data from these instruments is critical for environmental decision-making, regulatory reporting, and public safety.

Current QA/QC processes are largely manual: staff must review sensor logs, maintenance records, and data outputs individually to detect anomalies, calibration drift, or equipment failures. This approach is time-intensive, difficult to scale as instrument networks grow, and introduces risk of delayed detection of data quality issues that could compromise downstream environmental analysis.

AI-powered anomaly detection and workflow automation can continuously monitor instrument data streams, flag outliers and failure patterns, and route exceptions to the appropriate staff — dramatically reducing manual review burden and improving data reliability across the Divisions.

### Architecture (UC1)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UC1 — QA/QC Pipeline                        │
│                                                                     │
│  Sensor / Instrument Logs                                           │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────┐     ┌──────────────────────────────────┐    │
│  │  ADLS Gen2        │────▶│  Azure AI Services               │    │
│  │  (Raw Sensor Data)│     │  (Anomaly Detection / NLP)       │    │
│  └───────────────────┘     └──────────────┬───────────────────┘    │
│                                           │                         │
│                          ┌────────────────▼──────────────────┐     │
│                          │  Power Automate                   │     │
│                          │  (Exception Routing Workflow)     │     │
│                          └────────────────┬──────────────────┘     │
│                                           │                         │
│               ┌───────────────────────────▼──────────────────────┐ │
│               │  M365 Copilot / Copilot Studio Agent             │ │
│               │  (QA Summary Generation / Staff Conversational   │ │
│               │   Interface)                                      │ │
│               └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Plan (UC1)

**Phase 1 — Define Scope & Success Metrics (Weeks 1–3)**
- Identify key instrument types and monitoring locations for the pilot (select 2–3 high-priority sensor categories)
- Define QA/QC goals and anomaly detection criteria for each instrument type
- Establish success metrics: anomaly detection accuracy rate, reduction in manual review time, staff satisfaction
- Inventory available sensor logs and maintenance records; assess data format and quality
- Provision Azure landing zone: ADLS Gen2, AI Foundry project, Key Vault, Azure Monitor

**Phase 2 — Collect & Prepare Data (Weeks 4–7)**
- Gather historical sensor logs and maintenance records for pilot instrument types
- Cleanse and normalize data; establish baseline "healthy" data profiles per instrument type
- Label historical anomaly events (known calibration failures, outages, drift) as training data
- Design Azure AI Services anomaly detection configuration and thresholds
- Define Power Automate routing logic: auto-resolve threshold vs. staff review queue

**Phase 3 — Build AI Validation Tools (Weeks 8–13)**
- Deploy Azure AI Services anomaly detection models against pilot sensor data streams
- Build Power Automate workflow: automated ingestion of flagged anomalies → staff notification → resolution tracking
- Build Copilot Studio QA agent: staff can query instrument status, review open anomalies, and retrieve maintenance history via conversational interface
- Integrate M365 Copilot for automated QA summary generation per flagged instrument event
- Build Power BI QA dashboard: anomaly trends by instrument type, location, and resolution status

**Phase 4 — Evaluate & Refine (Weeks 14–16)**
- Review anomaly detection accuracy against known historical events; measure true positive and false positive rates
- Gather feedback from Division staff on workflow usability and summary quality
- Refine detection thresholds and routing logic based on pilot results
- Document model performance and QA methodology for regulatory reporting
- Plan for broader rollout across full instrument network

### Microsoft & Azure Services (UC1)

| Service | Role |
|---|---|
| Azure AI Services (Anomaly Detector) | Automated detection of anomalies, calibration drift, and failure patterns in sensor data streams |
| Azure AI Foundry | Model management, pipeline orchestration, monitoring |
| Azure Data Lake Storage Gen2 | Raw sensor log and maintenance record storage organized by instrument type and location |
| Microsoft Power Automate | Exception routing workflow; staff notification and resolution tracking |
| Microsoft 365 Copilot | Automated QA finding summary generation per flagged instrument event |
| Microsoft Copilot Chat | Conversational interface for staff to query instrument status and QA findings |
| Copilot Studio + Copilot Agents | Intelligent QA assistant for Division staff; supports natural language queries on instrument health |
| Power BI | QA dashboard with anomaly trend visualization, instrument health status, and resolution tracking |
| Azure Monitor + App Insights | Pipeline health monitoring, model inference latency, alerting |
| Azure Key Vault | Secure storage of API keys, connection strings, and credentials |

---

## Use Case 2 — Shoreline Project Permit Review

### Problem Statement (UC2)

The Office of Coastal Management processes a significant volume of shoreline project permit applications annually. Each application requires review of submitted documents — site plans, environmental assessments, engineering reports, and compliance forms — against applicable regulations and coastal management standards.

Current permit review is a document-heavy, manual process. Staff must read and cross-reference large volumes of submitted materials, check for regulatory completeness, and draft review findings individually. This creates bottlenecks that extend review timelines, introduces inconsistency across reviewers, and limits the Division's capacity to scale review throughput as permit volumes grow.

Historical permit data — decisions, conditions, precedents — exists in formats that are difficult to search and leverage for consistency in new reviews. AI-powered document analysis can automate initial document review, flag key issues and missing information, surface relevant historical precedents, and generate draft review summaries — allowing staff to focus their expertise on higher-order regulatory judgment.

### Architecture (UC2)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    UC2 — Permit Review Pipeline                     │
│                                                                     │
│  Permit Application Documents (PDFs, Forms, Site Plans)            │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────┐     ┌──────────────────────────────────┐    │
│  │  ADLS Gen2        │────▶│  Azure AI Services               │    │
│  │  (Permit Archive) │     │  (Document Analysis / NLP)       │    │
│  └───────────────────┘     └──────────────┬───────────────────┘    │
│                                           │                         │
│                          ┌────────────────▼──────────────────┐     │
│                          │  Power Automate                   │     │
│                          │  (Review Routing Workflow)        │     │
│                          └────────────────┬──────────────────┘     │
│                                           │                         │
│               ┌───────────────────────────▼──────────────────────┐ │
│               │  M365 Copilot / Copilot Studio Agent             │ │
│               │  (Review Summary Generation / Reviewer           │ │
│               │   Conversational Assistant)                       │ │
│               └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Plan (UC2)

**Phase 1 — Define Scope & Success Metrics (Weeks 1–3)**
- Select 2–3 high-priority permit types for the pilot (e.g., dock construction, shoreline stabilization, dredging)
- Define review efficiency goals: target reduction in average review time, consistency improvement metrics
- Map current review workflow: intake steps, document checklist, reviewer assignment, decision issuance
- Inventory historical permit records available for training and precedent retrieval
- Provision Azure resources: ADLS Gen2, Azure AI Services, Azure SQL, AI Search, AI Foundry project

**Phase 2 — Prepare Data & Workflows (Weeks 4–8)**
- Gather and organize historical permit applications and decisions for pilot permit types
- Label sample documents: identify key fields, regulatory flags, completeness criteria per permit type
- Train or configure Azure AI Services document analysis models for each selected permit type
- Validate extraction accuracy on held-out sample (target: ≥ 90% field-level accuracy for pilot types)
- Design Azure SQL schema and Azure AI Search index for extracted permit metadata and full-text content
- Map Power Automate routing logic: auto-complete checklist → flag exceptions → assign to reviewer queue

**Phase 3 — Build AI Review Assistant (Weeks 9–14)**
- Deploy Azure AI Services document analysis pipeline: intake of permit submissions from ADLS Gen2 → extraction of key fields and regulatory flags → structured output to Azure SQL
- Build Power Automate workflow: permit intake notification → automated checklist generation → reviewer assignment with AI-generated summary
- Build Copilot Studio permit review agent: reviewers can query permit history, surface similar past decisions, and retrieve regulatory guidance via conversational interface
- Integrate M365 Copilot for automated permit review summary drafts per submitted application
- Build Power BI permit dashboard: review pipeline status, average processing time, flagged issue trends

**Phase 4 — Evaluate & Refine (Weeks 15–18)**
- Conduct UAT with Division permit reviewers on pilot permit types
- Measure review time reduction and consistency improvement against baseline
- Gather reviewer feedback on AI summary quality, flag accuracy, and agent usability
- Refine document analysis models and routing logic based on UAT findings
- Document methodology and accuracy metrics; plan for expansion to additional permit types

### Microsoft & Azure Services (UC2)

| Service | Role |
|---|---|
| Azure AI Services (Document Intelligence) | Automated extraction of key fields, regulatory flags, and completeness checks from permit application documents |
| Azure AI Search | Full-text and semantic search index over permit archive; surfaces relevant historical precedents for reviewers |
| Azure AI Foundry | Model management, pipeline orchestration, monitoring |
| Azure Data Lake Storage Gen2 | Raw permit document storage organized by permit type and submission date |
| Azure SQL Database | Structured permit metadata store (extracted fields, flags, review status, decisions) |
| Microsoft Power Automate | Permit intake and review routing workflow; reviewer assignment and checklist automation |
| Microsoft 365 Copilot | Automated permit review summary and draft finding generation per application |
| Microsoft Copilot Chat | Conversational interface for reviewers to query permit history and regulatory guidance |
| Copilot Studio + Copilot Agents | Intelligent permit review assistant; supports natural language queries on permit status and precedent |
| Power BI | Permit review pipeline dashboard with processing time trends, flag analysis, and status tracking |
| Azure Monitor + App Insights | Pipeline health monitoring, model inference latency, alerting |
| Azure Key Vault | Secure storage of API keys, connection strings, and credentials |

---

## Shared Platform Architecture

Both use cases are deployed under a common Azure AI Foundry Hub within the agency's Azure subscription. Shared infrastructure reduces cost, simplifies governance, and provides a consistent security and observability posture across both initiatives.

- Azure AI Foundry Hub with UC1 QA/QC and UC2 Permit Review project isolation.
- ADLS Gen2 data lake, Azure SQL, and Azure AI Search for centralized storage and retrieval.
- Azure Key Vault for secrets management; Microsoft Purview for data governance and lineage.
- Azure Monitor, App Insights, and Microsoft Entra ID RBAC across all shared services.

```
┌──────────────────────────────────────────────────────────────────────────┐
│              Office of Coastal Management — Shared Azure Platform        │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Azure AI Foundry Hub                          │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────┐  ┌──────────────────────────────┐  │   │
│  │  │  UC1 — QA/QC Project    │  │  UC2 — Permit Review Project │  │   │
│  │  └─────────────────────────┘  └──────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ADLS Gen2 (Data Lake)  |  Azure SQL  |  Azure AI Search               │
│  Azure Key Vault        |  Azure Monitor + App Insights                 │
│  Microsoft Entra ID     |  Microsoft Purview (Governance)               │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Security & Compliance

- **Identity & Access:** Microsoft Entra ID enforces role-based access control (RBAC) across all Azure resources; least-privilege principles applied to all service identities
- **Data Protection:** All data at rest encrypted via Azure Storage Service Encryption; all data in transit encrypted via TLS 1.2+
- **Secret Management:** API keys, connection strings, and credentials stored exclusively in Azure Key Vault; no secrets in code or configuration files
- **Governance:** Microsoft Purview applied for data classification, lineage tracking, and compliance reporting across both use case data assets
- **Audit Logging:** Azure Monitor and App Insights capture all pipeline activity, model inference events, and workflow actions for audit trail
- **Network Security:** Azure Virtual Network (VNet) integration and Private Endpoints used to restrict public exposure of data and AI services
- **Regulatory Alignment:** Solution design aligned with public-sector cloud standards and applicable coastal management regulatory requirements

---

## Implementation Roadmap

| Phase | Weeks | Milestone |
|---|---|---|
| Phase 1 (UC1) — Scope & Data Inventory | 1–3 | Pilot instrument types selected; success metrics defined; Azure landing zone provisioned |
| Phase 1 (UC2) — Scope & Workflow Mapping | 1–3 | Pilot permit types selected; current review workflow documented; Azure resources provisioned |
| Phase 2 (UC1) — Data Preparation | 4–7 | Sensor logs cleansed and labeled; anomaly detection baselines established |
| Phase 2 (UC2) — Data & Workflow Preparation | 4–8 | Historical permits organized; document analysis models trained; routing logic designed |
| Phase 3 (UC1) — AI Validation Tools Build | 8–13 | Anomaly detection deployed; Power Automate workflow live; Copilot Studio agent deployed |
| Phase 3 (UC2) — AI Review Assistant Build | 9–14 | Document analysis pipeline live; permit review agent deployed; Power BI dashboard live |
| Phase 4 (UC1) — Evaluate & Refine | 14–16 | Pilot accuracy reviewed; thresholds refined; rollout plan finalized |
| Phase 4 (UC2) — Evaluate & Refine | 15–18 | UAT complete; review time reduction measured; expansion plan finalized |

---

## Success Metrics & KPIs — [Learn More](../metrics-methodology.html#success-metrics-and-kpis)

| Metric | Baseline | Target |
|---|---|---|
| UC1 — Manual QA/QC review time per instrument event | To be measured in Phase 1 | ≥ 50% reduction |
| UC1 — Anomaly detection accuracy (F1 score) | N/A (new capability) | ≥ 0.85 |
| UC1 — Mean time to detect instrument anomaly | To be measured in Phase 1 | ≥ 60% reduction |
| UC2 — Average permit review cycle time | To be measured in Phase 1 | ≥ 30% reduction |
| UC2 — Document extraction field accuracy | N/A (new capability) | ≥ 90% |
| UC2 — Reviewer-rated summary usefulness | N/A (new capability) | ≥ 4 / 5 avg. rating |
| Both — Staff adoption rate of Copilot tools | 0% | ≥ 75% of target users active within 60 days of launch |

---

## Cost Estimates

> Estimates are indicative. Validate with the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) based on finalized sensor volumes, permit document backlog size, and licensed user counts. Azure AI Foundry Hub overhead is consumption-based (no flat platform fee); underlying service costs are reflected in component line items below.

### UC1 — QA/QC of Coastal Management Instrumentation

| Component | Build Period (Months 1–4) | Monthly Steady State |
|---|---|---|
| Azure AI Services — Anomaly Detector (~50K–200K sensor transactions/month) | $15–$65 | $30–$100 |
| Azure Data Lake Storage Gen2 (sensor logs + QA results archive) | $1–$5 | $5–$20 |
| Power Automate Premium (exception routing flows, ~5–10 users) | $75–$150 | $75–$150 |
| Microsoft 365 Copilot (QA summary generation, ~5–10 staff) | $150–$300 | $150–$300 |
| Copilot Studio (QA agent, per-session consumption) | $100–$200 | $100–$200 |
| Azure Monitor + App Insights | $25–$50 | $25–$50 |
| Azure Key Vault (shared) | ~$5 | ~$5 |
| **UC1 Total** | **~$371–$775/month** | **~$390–$825/month** |

### UC2 — Shoreline Project Permit Review

| Component | Build Period (Months 1–5) | Monthly Steady State |
|---|---|---|
| Azure AI Services — Document Intelligence (~2K–5K pages/month build; ~5K–10K pages/month steady state) | $3–$50 | $50–$150 |
| Azure AI Search (S1 tier, ~$245/SU, permit archive index) | ~$245 | ~$245 |
| Azure Data Lake Storage Gen2 (permit document archive) | $1–$5 | $5–$20 |
| Azure SQL Database (Standard S2, permit metadata store) | $30–$150 | $30–$150 |
| Power Automate Premium (permit routing flows, ~5–10 users) | $75–$150 | $75–$150 |
| Microsoft 365 Copilot (permit review summaries, ~5–10 reviewers) | $150–$300 | $150–$300 |
| Copilot Studio (permit review agent, per-session consumption) | $100–$200 | $100–$200 |
| Azure Monitor + App Insights | $25–$50 | $25–$50 |
| Azure Key Vault (shared) | ~$5 | ~$5 |
| **UC2 Total** | **~$634–$1,155/month** | **~$685–$1,270/month** |

### Shared Costs Estimate

| Scenario | Monthly Cost |
|---|---|
| Build period (Months 1–5, both UCs running in parallel) | ~$1,005–$1,930/month |
| Post-launch steady state (both UCs) | ~$1,075–$2,095/month |
| Annual operational estimate (steady state × 12) | ~$12,900–$25,140/year |


---

## Team & Roles

| Role | Responsibility |
|---|---|
| Microsoft Solution Engineer | Overall solution architecture; Azure AI Foundry configuration; technical guidance and PoC delivery |
| Azure AI Engineer | Azure AI Services model configuration, training, and validation; pipeline build |
| Power Platform Developer | Power Automate workflow build; Copilot Studio agent development; Power BI dashboard |
| Agency IT Lead | Azure subscription administration; Entra ID and RBAC configuration; network security |
| Division Subject Matter Expert (UC1) | Instrument QA/QC domain expertise; anomaly labeling; pilot validation |
| Division Subject Matter Expert (UC2) | Permit review domain expertise; document labeling; UAT participation |
| Program Manager | Initiative coordination; milestone tracking; stakeholder communication |

---

*Generated April 2026 — Office of Coastal Management AI Initiative*  
*Built on Microsoft Azure AI Foundry + Azure AI Services + Microsoft Power Platform*
