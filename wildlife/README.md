# Ohio Department of Natural Resources — Division of Wildlife
## AI Initiative: Implementation Plan & Architectural Design

> **Agency:** Ohio Department of Natural Resources (ODNR) — Division of Wildlife
> **Platform:** Microsoft Azure AI Foundry + Microsoft 365 Copilot + Power Platform
> **Date:** March 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Solution Overview](#solution-overview)
3. [Use Case 1 — Automate Internal Task-Based Processes](#use-case-1--automate-internal-task-based-processes)
   - [Problem Statement](#problem-statement)
   - [Architecture (UC1)](#architecture-uc1)
   - [Implementation Plan (UC1)](#implementation-plan-uc1)
   - [Microsoft & Azure Services (UC1)](#microsoft--azure-services-uc1)
4. [Use Case 2 — PDF Form to Web Application Translation](#use-case-2--pdf-form-to-web-application-translation)
   - [Problem Statement (UC2)](#problem-statement-uc2)
   - [Architecture (UC2)](#architecture-uc2)
   - [Implementation Plan (UC2)](#implementation-plan-uc2)
   - [Microsoft & Azure Services (UC2)](#microsoft--azure-services-uc2)
5. [Shared Platform Architecture](#shared-platform-architecture)
6. [Security & Compliance](#security--compliance)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Success Metrics & KPIs](#success-metrics--kpis)
9. [Cost Estimates](#cost-estimates)
10. [Team & Roles](#team--roles)

---

## Executive Summary

The Ohio Department of Natural Resources (ODNR), Division of Wildlife, is pursuing two AI-enabled initiatives to reduce manual staff burden, improve data accuracy, and accelerate mission-critical workflows. Both use cases are grounded in the Microsoft platform ecosystem — combining **Azure AI Services**, **Microsoft Power Platform**, **Microsoft 365 Copilot**, and **Copilot Studio** — to deliver intelligent automation that keeps Division staff in a supervisory role while eliminating repetitive manual work.

| Initiative | Problem | AI Solution | Outcome |
|---|---|---|---|
| UC1 — Automate Internal Processes | Staff spend hours on repetitive permitting data entry and manual fish survey reporting | Power Automate + Azure AI + M365 Copilot workflow automation with human-in-the-loop review | Faster permit processing, auto-generated survey summaries, more field time for staff |
| UC2 — PDF to Web Application Translation | PDF form submissions are manually re-keyed into web systems, causing errors and delays | Azure AI Document Intelligence extracts fields; Power Automate routes to target systems; staff review before submission | Elimination of redundant data entry, lower error rates, faster form processing |

---

## Solution Overview

Both use cases share a common **Microsoft Power Platform + Azure AI** foundation deployed within Ohio's existing Microsoft 365 tenant. The platform approach enables reuse of Dataverse data models, Power Automate flows, and Copilot Studio agents across both initiatives.

```
┌──────────────────────────────────────────────────────────────────┐
│               ODNR Microsoft 365 Tenant                          │
│                                                                  │
│  ┌───────────────────────┐   ┌──────────────────────────────┐   │
│  │  UC1 — Process        │   │  UC2 — PDF Translation       │   │
│  │  Automation           │   │  Pipeline                    │   │
│  │  (Permits + Surveys)  │   │  (Doc Intel + Power Automate)│   │
│  └───────────────────────┘   └──────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Shared: Dataverse | Power Automate | Copilot Studio     │   │
│  │           M365 Copilot | Azure AI Services               │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Use Case 1 — Automate Internal Task-Based Processes

### Problem Statement

Division of Wildlife staff perform numerous high-frequency, rules-based tasks that consume disproportionate amounts of working time:

**Permitting Workflows:** Class A fish propagation permits, collector permits, and similar annual submissions follow predictable patterns and standardized approval criteria. Each renewal cycle requires manual data entry, document review, and multi-step approval routing — work that is largely repetitive for the same applicants year over year.

**Fish Survey Data Summarization:** The Inland Fisheries Program processes hundreds of fish surveys annually. Staff manually extract raw data files, execute standardized R/Python scripts, and author narrative summary reports. Angler creel surveys undergo similar manual analysis. This process is time-intensive, accessible only to staff with scripting skills, and prone to inconsistency in report language.

**Impact:** These manual workflows divert professional staff from fieldwork, wildlife management, and public engagement — the work that most directly supports ODNR's conservation mission.

---

### Architecture (UC1)

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Permit Submission Channel                         │
│         Ohio ePermitting Portal / Email / SharePoint Upload          │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ Trigger: new submission event
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│               Power Automate — Permit Routing Flow                   │
│                                                                      │
│  1. Extract applicant info from submission                           │
│  2. Query Dataverse: prior year permit history                       │
│  3. Apply rules engine: eligibility check (compliance, fees, type)   │
│  4. Route to AI Language for field validation & anomaly detection    │
│  5. Generate draft approval/denial memo (M365 Copilot)               │
│  6. Queue for human review in Model-Driven Power App                 │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ Human reviewer: approve / modify / reject
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│              Microsoft Dataverse — Permit Master                     │
│         (Applicant history, decisions, audit trail)                  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                   Fish Survey Data Pipeline                          │
│         Raw Data Files (CSV/Excel) → SharePoint / ADLS               │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ Power Automate: on file upload trigger
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│               Azure AI Foundry — Survey Analysis Flow                │
│                                                                      │
│  1. Data validation: schema checks, outlier detection (AI Language)  │
│  2. Statistical computation: abundance indices, CPUE, size-frequency │
│     (Azure Functions executing standardized R/Python scripts)        │
│  3. GPT-4o (Azure OpenAI): generate plain-language narrative summary │
│     e.g. "Bass population abundances were generally high this season"│
│  4. Output: structured report + narrative → SharePoint document      │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Staff Review via Copilot Studio Agent                               │
│  (Review summary, request edits, approve for publication)            │
└──────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Plan (UC1)

#### Phase 1 — Scope Definition & Process Mapping (Weeks 1–3)
- [ ] Select one permit type (e.g., Class A Fish Propagation) and one survey process (e.g., inland bass survey) for initial pilot
- [ ] Document all current manual steps, decision points, and data fields for each process
- [ ] Establish baseline measurements: average processing time per permit, surveys processed per month, error rates
- [ ] Define success metrics and acceptance criteria
- [ ] Map Dataverse data model for permit records and survey outputs
- [ ] Inventory existing applicant/survey data for training and testing

#### Phase 2 — Data Preparation & Environment Setup (Weeks 4–6)
- [ ] Provision Power Platform environment (Dev / UAT / Prod)
- [ ] Configure Dataverse schema: Permit entity, Applicant entity, Survey entity
- [ ] Collect sample permit submissions and raw survey data files for PoC dataset
- [ ] Deploy Azure AI Language resource for field validation and anomaly detection
- [ ] Deploy Azure OpenAI (GPT-4o) endpoint for narrative summary generation
- [ ] Configure Azure Functions for standardized statistical computation scripts (R/Python)

#### Phase 3 — Workflow Automation Build (Weeks 7–12)
- [ ] Build Power Automate permit routing flow:
  - Trigger on SharePoint/ePermitting portal submission
  - Dataverse lookup for prior-year permit history
  - Rules engine for eligibility assessment
  - Azure AI Language for field validation
  - M365 Copilot API for draft memo generation
  - Human review queue in model-driven Power App
- [ ] Build Power Automate survey data pipeline:
  - File upload trigger (SharePoint/ADLS)
  - Schema validation and error flagging
  - Azure Functions execution of statistical scripts
  - GPT-4o narrative summary generation
  - SharePoint output document creation
- [ ] Build Copilot Studio agent for staff review interface:
  - Review survey summaries and request edits
  - Approve reports for publication
  - Query permit status

#### Phase 4 — Validation & User Acceptance Testing (Weeks 13–16)
- [ ] Compare automated permit outputs against manually processed results (precision/recall)
- [ ] Validate survey narrative summaries against subject matter expert review
- [ ] UAT with pilot group of Division staff (biologists + permit technicians)
- [ ] Collect and action feedback on flows, UI, and AI output quality
- [ ] Tune GPT-4o prompts and rules engine thresholds

#### Phase 5 — Training, Rollout & Expansion (Weeks 17–20)
- [ ] Staff training sessions for Power App review queue and Copilot Studio agent
- [ ] Soft launch: permit pilot type + one survey program
- [ ] Monitor outcomes vs. baseline metrics for 4 weeks
- [ ] Document findings, expand to additional permit types and survey programs
- [ ] Establish governance for Dataverse and Power Automate environment

---

### Microsoft & Azure Services (UC1)

| Service | Role |
|---|---|
| **Microsoft Power Automate** | Orchestration of permit routing and survey data workflows |
| **Microsoft Dataverse** | Centralized data storage for permits, applicants, and survey records |
| **Microsoft 365 Copilot** | Draft memo and narrative content generation; document summarization |
| **Copilot Studio** | Conversational review agent for staff interaction with outputs |
| **Azure OpenAI Service (GPT-4o)** | Plain-language narrative summary generation for survey reports |
| **Azure AI Language** | Field validation, anomaly detection, and NER on submitted data |
| **Azure Functions** | Execution of standardized R/Python statistical scripts in the cloud |
| **Azure Data Lake Storage Gen2** | Raw survey data file landing zone |
| **SharePoint Online** | Output document library and file trigger source |
| **Power Apps (Model-Driven)** | Human review queue for permit approval workflow |
| **Azure Monitor + App Insights** | Flow health monitoring and alerting |

---

## Use Case 2 — PDF Form to Web Application Translation

### Problem Statement (UC2)

Division of Wildlife processes depend on numerous PDF forms submitted by the public, licensees, and partner agencies. Staff currently re-enter data from these forms manually into web-based systems and databases — a process that:

- **Duplicates effort** already performed by the submitter
- **Introduces transcription errors** from handwritten or printed forms
- **Delays processing** due to manual queue management
- **Occupies skilled staff** with low-value data entry rather than review and decision-making

The scale of this problem is significant: multiple high-volume form types are processed annually, and transcription errors require additional correction cycles that further compound staff time loss.

---

### Architecture (UC2)

![UC2 Architecture](uc2.png)

---

### Implementation Plan (UC2)

#### Phase 1 — Scope & Baseline (Weeks 1–3)
- [ ] Identify 2–3 highest-volume PDF form types for pilot (e.g., wildlife damage complaint, scientific collection permit application)
- [ ] Document all fields in each form and their corresponding destination fields in target web systems
- [ ] Establish baseline: average processing time per form, transcription error rate, queue backlog volume
- [ ] Collect representative sample documents: varying handwriting styles, print quality, completeness levels
- [ ] Define confidence thresholds for auto-population vs. flagging for manual review

#### Phase 2 — Document Intelligence Configuration (Weeks 4–7)
- [ ] Provision Azure AI Document Intelligence resource
- [ ] Label training datasets for each selected form type using Document Intelligence Studio
- [ ] Train custom extraction models per form type
- [ ] Validate extraction accuracy against held-out sample set (target: ≥ 95% field-level accuracy)
- [ ] Implement confidence scoring: fields below threshold flagged for staff review
- [ ] Configure output schema mapping: extracted fields → target web application fields

#### Phase 3 — Integration & Routing Pipeline (Weeks 8–12)
- [ ] Build Power Automate flow:
  - Trigger: PDF uploaded to SharePoint intake folder or emailed to shared mailbox
  - Call Document Intelligence API; receive structured JSON extraction result
  - Apply field mapping to target system schema
  - Flag low-confidence fields for staff review
  - Route to Copilot Studio review agent or web application pre-fill
- [ ] Build Copilot Studio agent for guided staff review:
  - Display extracted fields side-by-side with original PDF
  - Highlight low-confidence fields for correction
  - Staff confirms or edits; submits to target system
- [ ] Integrate with target web application via REST API or Dataverse connector
- [ ] Store processed forms and extraction results in SharePoint/Dataverse audit trail

#### Phase 4 — Testing & Validation (Weeks 13–16)
- [ ] Conduct end-to-end testing with full sample document set
- [ ] Compare extraction accuracy and processing time against baseline
- [ ] Perform UAT with permit technicians and program staff
- [ ] Refine Document Intelligence models with additional labeled examples if needed
- [ ] WCAG 2.1 accessibility review of Copilot Studio review interface

#### Phase 5 — Rollout & Expansion (Weeks 17–20)
- [ ] Go-live with 2–3 pilot form types
- [ ] Monitor extraction accuracy, processing time, and staff correction rates for 4 weeks
- [ ] Document lessons learned and model performance data
- [ ] Expand to additional high-volume form types based on results
- [ ] Establish ongoing model retraining cadence as form templates change

---

### Microsoft & Azure Services (UC2)

| Service | Role |
|---|---|
| **Azure AI Document Intelligence** | Custom model training and field extraction from PDF forms |
| **Microsoft Power Automate** | Trigger on PDF upload, call Document Intelligence, route extracted data |
| **Copilot Studio** | Guided staff review interface: display extracted data vs. original PDF, flag low-confidence fields |
| **Microsoft 365 Copilot** | Reviewing and validating extracted information; summarizing form content |
| **SharePoint Online** | PDF intake folder (trigger source) and processed form archive |
| **Microsoft Dataverse** | Structured storage of extracted form data and audit trail |
| **Azure AI Language** | Secondary validation of extracted free-text fields |
| **Power Apps (Canvas)** | Custom review UI for field-by-field staff verification if Copilot Studio is insufficient |
| **Azure Monitor + App Insights** | Extraction pipeline monitoring, accuracy dashboards, error alerting |

---

## Shared Platform Architecture

Both use cases are delivered within a single **ODNR Power Platform environment** connected to the existing Microsoft 365 tenant, with Azure AI Services accessible via managed connectors. All data remains within Ohio's Microsoft 365 sovereign boundary.

```
┌──────────────────────────────────────────────────────────────────────┐
│               ODNR Microsoft 365 Tenant (Shared)                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Microsoft Entra ID — Identity, RBAC, Conditional Access     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Power Platform Environment (Wildlife)                       │   │
│  │  Dataverse | Power Automate | Power Apps | Copilot Studio    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  SharePoint Online — Document Libraries & Intake Queues      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Azure AI Services (connected via managed connectors)        │   │
│  │  Azure OpenAI | AI Language | Document Intelligence         │   │
│  │  Azure Functions | Azure Monitor                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Resource Group Structure

```
rg-odnr-wildlife-shared        # Azure AI Services, Key Vault, Monitor
rg-odnr-wildlife-automation    # UC1: Azure Functions, ADLS, AI Language, OpenAI
rg-odnr-wildlife-docprocess    # UC2: Document Intelligence, Power Automate connections
```

---

## Security & Compliance

| Control | Implementation |
|---|---|
| **Identity** | Microsoft Entra ID with MFA; Conditional Access policies; Managed Identities for Azure service auth |
| **Data Residency** | All Microsoft 365 and Power Platform data stored within Ohio's M365 tenant boundary |
| **Network** | Azure AI Service endpoints on private networks where applicable; no public data exposure |
| **PII Protection** | Wildlife permit and form data classified; access restricted to authorized Division staff via Entra ID groups |
| **Audit Logging** | Power Automate run history; Dataverse audit log; Azure Monitor for AI service calls; 7-year retention |
| **Human-in-the-Loop** | All AI outputs (permit decisions, survey summaries, form extractions) require staff review before final action |
| **Responsible AI** | Azure AI Content Safety; GPT-4o output reviewed by staff; Document Intelligence confidence thresholds enforce human review |
| **Compliance** | Ohio Data Protection Law; NIST 800-53 control mapping; FedRAMP-aligned Azure regions |

---

## Implementation Roadmap

```
Month     1     2     3     4     5
          ├─────┼─────┼─────┼─────┤

UC1 — Process Automation
          ████  ████  ████████████  ████
          Scope Data  Build         UAT  Rollout

UC2 — PDF Translation
          ████  ████████  ████████  ████
          Scope Doc Intel Pipeline  UAT  Rollout
```

| Milestone | Target Month | Owner |
|---|---|---|
| Power Platform environment provisioned | Month 1 | ODNR IT |
| UC1 process maps and baseline metrics complete | Month 1 | Division Staff + BA |
| UC2 form types selected, samples collected | Month 1 | Division Staff |
| UC1 Power Automate permit flow live (pilot) | Month 3 | Power Platform Dev |
| UC2 Document Intelligence models trained | Month 2 | AI Engineer |
| UC2 Power Automate routing flow live (pilot) | Month 3 | Power Platform Dev |
| UC1 + UC2 UAT complete | Month 4 | Division Staff |
| Full rollout (pilot scope) | Month 5 | All teams |
| Expansion planning for additional form/permit types | Month 5 | Program Leads |

---

## Success Metrics & KPIs

### UC1 — Process Automation

| Metric | Baseline | Target |
|---|---|---|
| Average permit processing time | Current (TBD in Phase 1) | ≥ 50% reduction |
| % permits requiring manual rework | Current (TBD) | < 5% |
| Survey reports generated per month | Current (TBD) | 2× throughput |
| Staff hours saved per month | 0 (baseline) | ≥ 40 hrs/month |
| Narrative summary accuracy (SME rating) | N/A | ≥ 4.0 / 5.0 |
| Percent of staff able to run survey analysis | Low (scripting required) | All biologists |

### UC2 — PDF Form Translation

| Metric | Baseline | Target |
|---|---|---|
| Average time to process one form | Current (TBD in Phase 1) | ≥ 70% reduction |
| Field-level transcription error rate | Current (TBD) | < 2% post-AI extraction |
| Document Intelligence field extraction accuracy | N/A | ≥ 95% |
| % fields requiring staff correction | N/A | < 10% |
| Staff hours saved per month | 0 (baseline) | ≥ 30 hrs/month |

---

## Cost Estimates

> Estimates are indicative. Refine using the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) and Power Platform licensing review.

### UC1 — Process Automation

| Component | Monthly Estimate |
|---|---|
| Azure OpenAI (GPT-4o) — survey summaries + permit memos | $300–$700 |
| Azure AI Language — field validation | $100–$200 |
| Azure Functions — statistical script execution | $50–$150 |
| Azure Data Lake Storage Gen2 | $30–$80 |
| Power Platform Premium per-user licenses (10 users) | $500–$600 |
| M365 Copilot licenses (existing or incremental) | $0 (if already licensed) |
| Azure Monitor + App Insights | $50–$100 |
| **Total** | **~$1,030–$1,830/month** |

### UC2 — PDF Form Translation

| Component | Monthly Estimate |
|---|---|
| Azure AI Document Intelligence (custom model, ~5K pages/month) | $100–$300 |
| Power Automate Premium flows | $150–$300 |
| Power Platform Premium per-user licenses (5 users) | $250–$300 |
| Copilot Studio (per session or per user) | $200–$400 |
| SharePoint / Dataverse storage (incremental) | $50–$100 |
| Azure Monitor + App Insights | $30–$60 |
| **Total** | **~$780–$1,460/month** |

### Combined Estimate

| Scenario | Monthly Cost |
|---|---|
| **Build period (Months 1–5, dev/test environments)** | ~$1,200–$2,500/month |
| **Post-launch steady state** | **~$1,800–$3,300/month** |
| **Annual operational estimate** | **~$22,000–$40,000/year** |

> Power Platform and M365 Copilot licensing may be partially covered by existing Ohio enterprise agreements — validate with ODNR IT and Microsoft licensing team before finalizing.

---

## Team & Roles

| Role | Count | Primary Responsibility | Required Skills |
|---|---|---|---|
| **Power Platform Developer** | 2 | Power Automate flows, Dataverse schema, Power Apps, Copilot Studio | Power Automate, Dataverse, Power Apps, Copilot Studio, REST APIs |
| **AI Engineer** | 1 | Azure OpenAI, AI Language, Document Intelligence configuration, Prompt engineering | Azure AI Services, Python, Prompt engineering, Document Intelligence Studio |
| **Azure Functions Developer** | 1 | Cloud execution of R/Python statistical scripts | Azure Functions, R, Python, ADLS Gen2 |
| **Business Analyst** | 1 | Process mapping, requirements, UAT coordination, baseline measurement | Business process analysis, workflow documentation |
| **ODNR Wildlife SME (Fisheries Biologist)** | 1 | Survey data validation, narrative summary review, domain accuracy | Fisheries science, survey methodology |
| **ODNR Permit Technician** | 1 | Permit workflow validation, UAT, ongoing human-in-the-loop review | Permitting processes, Division workflows |
| **ODNR IT Lead** | 1 | Power Platform environment provisioning, Azure subscription, Entra ID | Azure administration, Power Platform administration, M365 |
| **UX Designer** | 0.5 | Copilot Studio review interface, accessibility | UX design, WCAG 2.1 |

---

## Getting Started

### Prerequisites

- Microsoft 365 tenant with Power Platform enabled
- Power Platform environment (Production + Sandbox)
- Azure subscription with Contributor role
- Azure AI Services access (OpenAI, Language, Document Intelligence)
- M365 Copilot licenses for target staff (UC1)
- Copilot Studio capacity (UC2)

### Repository Structure

```
oh-parkwc/wildlife/
├── README.md                          # This document
├── EXECUTIVE-SUMMARY.md               # Executive summary
├── infra/                             # Azure resource provisioning
│   ├── wildlife-shared.bicep
│   ├── uc1-automation/
│   └── uc2-docprocess/
├── src/
│   ├── uc1-automation/                # Permit flows, survey pipeline
│   │   ├── power-automate/
│   │   ├── azure-functions/
│   │   └── prompts/
│   └── uc2-pdf-translation/           # Document Intelligence, routing flows
│       ├── document-intelligence/
│       ├── power-automate/
│       └── copilot-studio/
├── docs/
│   ├── process-maps/
│   ├── data-models/
│   └── runbooks/
└── tests/
    ├── uc1-automation/
    └── uc2-pdf-translation/
```

---

## References

- [Azure AI Document Intelligence Documentation](https://learn.microsoft.com/azure/ai-services/document-intelligence/)
- [Microsoft Power Automate Documentation](https://learn.microsoft.com/power-automate/)
- [Copilot Studio Documentation](https://learn.microsoft.com/microsoft-copilot-studio/)
- [Microsoft Dataverse Documentation](https://learn.microsoft.com/power-apps/maker/data-platform/)
- [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
- [Responsible AI at Microsoft](https://www.microsoft.com/ai/responsible-ai)
- [Ohio Cybersecurity & Data Privacy Standards](https://ohio.gov/wps/portal/gov/site/government/resources/ohio-cybersecurity/)

---

*Document maintained by ODNR Division of Wildlife AI Initiative team. For questions, contact the ODNR IT Office.*
