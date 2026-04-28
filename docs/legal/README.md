# Office of Legal and Legislative Services — AI Initiative: Implementation Plan & Architectural Design

**Agency:** Office of Legal and Legislative Services — Ohio Department of Natural Resources (ODNR)
**Platform:** Microsoft Azure AI Foundry + Azure OpenAI + Azure AI Services + Microsoft Power Platform
**Date:** April 2026

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Solution Overview](#solution-overview)
- [Use Case 1 — Contracting Terms Summarization and Conflict Detection](#use-case-1--contracting-terms-summarization-and-conflict-detection)
  - [Problem Statement](#problem-statement)
  - [Architecture (UC1)](#architecture-uc1)
  - [Implementation Plan (UC1)](#implementation-plan-uc1)
  - [Microsoft & Azure Services (UC1)](#microsoft--azure-services-uc1)
- [Use Case 2 — AI-Assisted Attorney General Referral Packages – Well Violations](#use-case-2--ai-assisted-attorney-general-referral-packages--well-violations)
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

The Office of Legal and Legislative Services within the Ohio Department of Natural Resources is pursuing two AI-enabled initiatives to modernize high-volume legal workflows, reduce manual document processing burden, and improve the consistency and quality of legal output. Both use cases are built on the Microsoft Azure AI platform, combining large language model reasoning, document intelligence, workflow automation, and conversational AI to deliver scalable, auditable solutions aligned with Ohio public-sector cloud and legal compliance standards.

| Initiative | Problem | AI Solution | Outcome |
|---|---|---|---|
| UC1 — Contracting Terms Summarization and Conflict Detection | Reviewing and comparing contract language across vendor agreements, grant documents, and regulatory compliance contracts is time-intensive and prone to missed conflicts and inconsistencies | Azure OpenAI GPT-4o analyzes and summarizes contract clauses; conflict flags are automatically surfaced; M365 Copilot assists attorneys with drafting and redlining; Copilot Studio agent provides conversational contract query interface | Reduced contract review cycle time, improved conflict detection consistency, faster drafting with AI-assisted language generation, and better risk identification across the contract portfolio |
| UC2 — AI-Assisted Attorney General Referral Packages – Well Violations | Assembling AG referral packages for well violations requires manual aggregation of case files, inspection records, and legal documentation — a time-consuming process with high documentation burden and risk of incomplete submissions | Azure AI Document Intelligence extracts structured data from case files; Azure OpenAI GPT-4o drafts referral package narratives and case summaries; Power Automate validates documentation checklists and routes packages for attorney review | Faster referral package preparation, improved checklist completeness, reduced attorney documentation burden, and more consistent referral submissions to the AG office |

---

## Solution Overview

Both use cases leverage a shared Azure AI Foundry platform deployed within ODNR's Azure subscription. A common data and observability layer reduces duplication and supports cross-initiative governance across the Office of Legal and Legislative Services.

```
┌──────────────────────────────────────────────────────────────────────┐
│    ODNR Office of Legal & Legislative Services — Azure AI Foundry    │
│                             Hub (Shared)                             │
│                                                                      │
│  ┌────────────────────────────┐  ┌──────────────────────────────┐   │
│  │  UC1 — Contracting Terms  │  │  UC2 — AG Referral Packages  │   │
│  │  Summarization & Conflict │  │  Well Violations             │   │
│  │  Detection                │  │                              │   │
│  └────────────────────────────┘  └──────────────────────────────┘   │
│                                                                      │
│  Shared: ADLS Gen2 | Key Vault | Monitor | Entra ID | Purview       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Use Case 1 — Contracting Terms Summarization and Conflict Detection

### Problem Statement

The Office of Legal and Legislative Services processes a significant volume of contracts annually — including vendor agreements, grant documents, interagency agreements, and regulatory compliance contracts. Each contract requires careful review of clause language for legal risk, internal policy conflicts, ADA compliance requirements, indemnification exposure, and alignment with ODNR standard terms.

Current contract review is a manual, document-intensive process. Attorneys must read and cross-reference lengthy documents for conflicting provisions, non-standard clauses, and missing required terms. This approach is time-consuming, difficult to scale as contract volume grows, and introduces risk of inconsistency across reviewers and missed conflicts buried in complex legal language.

AI-powered document analysis and large language model summarization can automatically extract key clauses, compare against standard terms, flag conflicts and anomalies, and provide attorneys with AI-generated summaries — allowing legal staff to focus their expertise on high-stakes judgment calls rather than manual document review.

### Architecture (UC1)

```
┌─────────────────────────────────────────────────────────────────────┐
│              UC1 — Contract Summarization & Conflict Detection      │
│                                                                     │
│  Contract Documents (PDFs, Word files, Scanned Agreements)         │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────┐     ┌──────────────────────────────────┐    │
│  │  ADLS Gen2        │────▶│  Azure AI Document Intelligence  │    │
│  │  (Contract        │     │  (Layout + Clause Extraction)    │    │
│  │   Archive)        │     └──────────────┬───────────────────┘    │
│  └───────────────────┘                    │                         │
│                                           ▼                         │
│                          ┌────────────────────────────────────┐    │
│                          │  Azure OpenAI — GPT-4o             │    │
│                          │  (Clause Summarization + Conflict  │    │
│                          │   Detection)                        │    │
│                          └────────────────┬───────────────────┘    │
│                                           │                         │
│                          ┌────────────────▼──────────────────┐     │
│                          │  Power Automate                   │     │
│                          │  (Review Routing Workflow)        │     │
│                          └────────────────┬──────────────────┘     │
│                                           │                         │
│               ┌───────────────────────────▼──────────────────────┐ │
│               │  M365 Copilot / Copilot Studio Agent             │ │
│               │  (Contract Drafting + Attorney Interface)        │ │
│               └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Plan (UC1)

**Phase 1 — Define Scope & Success Metrics (Weeks 1–3)**
- Select 2–3 high-priority contract types for the pilot (e.g., vendor contracts, grant agreements, regulatory compliance agreements)
- Define conflict detection criteria: non-standard indemnification clauses, ADA compliance gaps, termination discrepancies, missing required provisions
- Establish success metrics: contract review cycle time reduction, conflict detection precision, attorney-rated summary quality
- Inventory available contract repository; assess document formats and digitization needs
- Provision Azure landing zone: ADLS Gen2, Azure OpenAI deployment (GPT-4o), AI Foundry project, Key Vault, Azure Monitor

**Phase 2 — Collect & Prepare Data (Weeks 4–7)**
- Gather 200–500 historical contracts for pilot contract types
- Label sample clause types per contract type: indemnification, ADA compliance, termination, force majeure, conflict flags
- Validate Azure OpenAI GPT-4o summarization output quality against attorney-reviewed ground truth
- Configure Azure AI Document Intelligence for contract layout and clause boundary extraction
- Design Power Automate routing logic: AI summary generated → conflict flags surfaced → attorney review assignment → approval tracking

**Phase 3 — Build AI Analysis Tools (Weeks 8–13)**
- Deploy Azure OpenAI pipeline: contract ingestion from ADLS Gen2 → Document Intelligence layout extraction → GPT-4o clause summarization and conflict detection → structured output to review dashboard
- Build Power Automate workflow: contract intake notification → AI summary generation → attorney assignment with conflict flag report → approval and sign-off tracking
- Build Copilot Studio contract agent: attorneys query contract status, retrieve clause comparisons, flag conflicts, and get clause drafting suggestions via conversational interface
- Integrate M365 Copilot for contract language drafting assistance and redline suggestion generation
- Build Power BI contract dashboard: review pipeline status, conflict flag trends, clause type distribution, approval cycle time

**Phase 4 — Evaluate & Refine (Weeks 14–16)**
- Review summarization accuracy and conflict detection precision with pilot attorneys
- Measure contract review cycle time reduction against pre-pilot baseline
- Gather attorney feedback on Copilot drafting quality and conflict flag usefulness
- Refine GPT-4o prompt engineering and conflict detection logic based on feedback
- Document AI methodology for legal compliance and audit trail requirements
- Plan for broader rollout across all contract types and additional legal staff

### Microsoft & Azure Services (UC1)

| Service | Role |
|---|---|
| Azure OpenAI — GPT-4o | Clause summarization, conflict detection, and contract language drafting assistance via large language model reasoning |
| Azure AI Document Intelligence (Read/Layout) | Automated extraction of contract text, clause boundaries, and document structure from PDFs and scanned agreements |
| Azure AI Foundry | Model deployment management, pipeline orchestration, prompt engineering workspace, monitoring |
| Azure Data Lake Storage Gen2 | Contract document archive organized by contract type, status, and submission date |
| Microsoft Power Automate | Contract intake and review routing workflow; attorney assignment and approval tracking automation |
| Microsoft 365 Copilot | Contract language drafting assistance, redline suggestion generation, and clause summarization within Word and Outlook |
| Microsoft Copilot Chat | Conversational interface for attorneys to query contract status and retrieve AI summaries |
| Copilot Studio + Copilot Agents | Intelligent contract review agent; supports natural language queries on contract status, clause comparisons, and conflict flags |
| Power BI | Contract review pipeline dashboard with conflict flag trends, approval cycle time metrics, and clause type analysis |
| Azure Monitor + App Insights | Pipeline health monitoring, model inference latency tracking, alerting |
| Azure Key Vault | Secure storage of API keys, connection strings, and credentials |

---

## Use Case 2 — AI-Assisted Attorney General Referral Packages – Well Violations

### Problem Statement (UC2)

The Office of Legal and Legislative Services, in coordination with the Division of Oil and Gas Resources Management, is responsible for preparing and submitting referral packages to the Ohio Attorney General's office for well violations — including unplugged orphaned wells, operator non-compliance, and permit violations. These referral packages require the assembly and review of case files, inspection records, violation histories, photographic evidence, and legal documentation.

Current referral package preparation is a document-heavy, manual process. Legal staff must aggregate materials from multiple sources, verify documentation completeness against a multi-item checklist, draft case narratives, and coordinate with field inspectors and division attorneys before submission. This process is time-intensive, prone to documentation gaps that delay AG referral, and difficult to scale as violation caseloads grow.

AI-powered document intelligence and large language model drafting can automate case file data extraction, validate documentation checklists for completeness, generate draft case narratives, and provide an intelligent workflow interface for legal staff — significantly reducing preparation time and improving submission quality.

### Architecture (UC2)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  UC2 — AG Referral Package Pipeline                 │
│                                                                     │
│  Case Files (Inspection Records, Violation Histories, Photos)      │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────┐     ┌──────────────────────────────────┐    │
│  │  ADLS Gen2        │────▶│  Azure AI Document Intelligence  │    │
│  │  (Case File       │     │  (Field Extraction + OCR)        │    │
│  │   Archive)        │     └──────────────┬───────────────────┘    │
│  └───────────────────┘                    │                         │
│                                           ▼                         │
│                          ┌────────────────────────────────────┐    │
│                          │  Azure OpenAI — GPT-4o             │    │
│                          │  (Case Summary + Referral          │    │
│                          │   Narrative Drafting)              │    │
│                          └────────────────┬───────────────────┘    │
│                                           │                         │
│                          ┌────────────────▼──────────────────┐     │
│                          │  Power Automate                   │     │
│                          │  (Checklist Validation + Routing) │     │
│                          └────────────────┬──────────────────┘     │
│                                           │                         │
│               ┌───────────────────────────▼──────────────────────┐ │
│               │  M365 Copilot / Copilot Studio Agent             │ │
│               │  (Referral Drafting + Attorney Interface)        │ │
│               └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Plan (UC2)

**Phase 1 — Define Scope & Success Metrics (Weeks 1–3)**
- Identify well violation case types for the pilot (e.g., unplugged wells, operator non-compliance, permit violations)
- Map current AG referral package workflow: case file assembly → documentation checklist → legal review and sign-off → submission to AG office
- Inventory available case files and completed historical referral packages for pilot violation types
- Define documentation completeness criteria and required checklist items per violation type
- Establish success metrics: referral package preparation time reduction, checklist completeness rate, narrative quality rating
- Provision Azure resources: ADLS Gen2, Azure AI Document Intelligence, Azure SQL, AI Foundry project, Key Vault

**Phase 2 — Prepare Data & Workflows (Weeks 4–8)**
- Gather and organize historical case files and completed referral packages for pilot violation types
- Label sample case documents: identify required fields, checklist validation items, and common documentation gaps per violation type
- Configure Azure AI Document Intelligence custom/prebuilt models for case file field extraction (operator name, well ID, violation type, inspection dates, enforcement history)
- Design Azure SQL schema for referral package metadata and checklist status tracking
- Map Power Automate routing logic: case file intake → automated checklist generation and gap detection → attorney notification with AI-drafted referral summary

**Phase 3 — Build AI Referral Assistant (Weeks 9–14)**
- Deploy Azure AI Document Intelligence pipeline: case file ingestion from ADLS Gen2 → structured field extraction → output to Azure SQL referral metadata store
- Deploy Azure OpenAI GPT-4o: case history and inspection record summarization → referral package narrative drafting → checklist gap explanation generation
- Build Power Automate workflow: case intake notification → automated checklist validation → gap flagging → attorney assignment with AI-generated referral package draft
- Build Copilot Studio referral agent: attorneys query case status, retrieve violation history summaries, validate checklist completeness, and generate narrative sections via conversational interface
- Integrate M365 Copilot for referral package narrative drafting, editing, and final legal language refinement within Word and Outlook
- Build Power BI dashboard: referral pipeline status, average preparation time, checklist completion rates, violation type trends, and AG submission status tracking

**Phase 4 — Evaluate & Refine (Weeks 15–18)**
- Conduct UAT with ODNR legal staff and AG office liaisons on pilot violation types
- Measure referral package preparation time reduction against pre-pilot baseline
- Gather attorney and field inspector feedback on narrative quality, extraction accuracy, and checklist validation utility
- Refine Document Intelligence extraction models and GPT-4o prompts based on UAT findings
- Document AI methodology and accuracy metrics for legal compliance and audit trail requirements
- Plan for expansion to additional violation types and broader AG collaboration workflow

### Microsoft & Azure Services (UC2)

| Service | Role |
|---|---|
| Azure AI Document Intelligence (Prebuilt/Custom) | Automated extraction of key fields from case files: operator name, well ID, violation type, inspection dates, enforcement history, and supporting documentation |
| Azure OpenAI — GPT-4o | Case history summarization and referral package narrative drafting via large language model reasoning |
| Azure AI Foundry | Model deployment management, pipeline orchestration, prompt workspace, monitoring |
| Azure Data Lake Storage Gen2 | Case file document archive organized by violation type, operator, and case status |
| Azure SQL Database | Referral package metadata store: extracted fields, checklist status, review assignments, submission tracking |
| Microsoft Power Automate | Case intake routing and checklist validation workflow; attorney assignment and submission tracking automation |
| Microsoft 365 Copilot | Referral package narrative drafting and editing assistance within Word and Outlook; document summarization for legal review |
| Microsoft Copilot Chat | Conversational interface for attorneys to query case status, retrieve violation history, and validate checklist completeness |
| Copilot Studio + Copilot Agents | Intelligent referral assistant for legal staff; supports natural language queries on case status, checklist gaps, and narrative generation |
| Power BI | Referral pipeline dashboard with preparation time trends, checklist completion rates, violation type analysis, and AG submission status |
| Azure Monitor + App Insights | Pipeline health monitoring, model inference latency, alerting |
| Azure Key Vault | Secure storage of API keys, connection strings, and credentials |

---

## Shared Platform Architecture

Both use cases are deployed under a common Azure AI Foundry Hub within ODNR's Azure subscription. Shared infrastructure reduces cost, simplifies governance, and provides a consistent security and observability posture across both legal AI initiatives.

- Azure AI Foundry Hub with UC1 Contracting and UC2 AG Referral project isolation.
- ADLS Gen2 data lake, Azure SQL, and Azure OpenAI for document processing and analysis.
- Azure Key Vault for secrets management; Microsoft Purview for legal document governance and lineage.
- Azure Monitor, App Insights, and Microsoft Entra ID RBAC across all shared services.

```
┌──────────────────────────────────────────────────────────────────────────┐
│         ODNR Office of Legal & Legislative Services — Shared Platform    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Azure AI Foundry Hub                          │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────┐  ┌──────────────────────────────┐  │   │
│  │  │  UC1 — Contracting      │  │  UC2 — AG Referral Packages  │  │   │
│  │  │  Terms Analysis Project │  │  Project                     │  │   │
│  │  └─────────────────────────┘  └──────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ADLS Gen2 (Data Lake)   |  Azure SQL  |  Azure OpenAI Deployment      │
│  Azure Key Vault         |  Azure Monitor + App Insights                │
│  Microsoft Entra ID      |  Microsoft Purview (Legal Doc Governance)    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Security & Compliance

- **Identity & Access:** Microsoft Entra ID enforces role-based access control (RBAC) across all Azure resources; least-privilege principles applied to all service identities; attorney access scoped to authorized case files and contract repositories
- **Data Protection:** All data at rest encrypted via Azure Storage Service Encryption; all data in transit encrypted via TLS 1.2+; attorney-client privilege data handling governed by strict access controls and data classification policies
- **Secret Management:** API keys, connection strings, and credentials stored exclusively in Azure Key Vault; no secrets in code or configuration files
- **Legal Document Governance:** Microsoft Purview applied for legal document classification, lineage tracking, retention policy enforcement, and compliance reporting across both use case data assets
- **Audit Logging:** Azure Monitor and App Insights capture all pipeline activity, model inference events, and workflow actions for full legal audit trail; all AI-generated content flagged for attorney review before use in official submissions
- **Network Security:** Azure Virtual Network (VNet) integration and Private Endpoints used to restrict public exposure of legal data and AI services; data residency enforced within ODNR's Azure tenant boundary
- **Regulatory Alignment:** Solution design aligned with Ohio public-sector cloud standards, applicable legal and regulatory requirements, and CJIS-aligned data handling practices for law enforcement and legal referral workflows

---

## Implementation Roadmap

| Phase | Weeks | Milestone |
|---|---|---|
| Phase 1 (UC1) — Scope & Contract Inventory | 1–3 | Pilot contract types selected; conflict detection criteria defined; Azure landing zone provisioned |
| Phase 1 (UC2) — Scope & Workflow Mapping | 1–3 | Pilot violation types selected; AG referral workflow documented; Azure resources provisioned |
| Phase 2 (UC1) — Data Preparation | 4–7 | Historical contracts gathered and labeled; GPT-4o summarization quality validated |
| Phase 2 (UC2) — Data & Workflow Preparation | 4–8 | Case files organized; Document Intelligence models configured; checklist routing logic designed |
| Phase 3 (UC1) — AI Analysis Tools Build | 8–13 | Contract analysis pipeline live; Copilot Studio agent deployed; Power BI dashboard live |
| Phase 3 (UC2) — AI Referral Assistant Build | 9–14 | Document extraction pipeline live; GPT-4o referral drafting deployed; Power BI dashboard live |
| Phase 4 (UC1) — Evaluate & Refine | 14–16 | Pilot accuracy reviewed; GPT-4o prompts refined; rollout plan finalized |
| Phase 4 (UC2) — Evaluate & Refine | 15–18 | UAT complete; preparation time reduction measured; expansion plan finalized |

---

## Success Metrics & KPIs

| Metric | Baseline | Target |
|---|---|---|
| UC1 — Contract review cycle time per agreement | To be measured in Phase 1 | ≥ 40% reduction |
| UC1 — Clause extraction and summarization accuracy | N/A (new capability) | ≥ 90% attorney-validated accuracy |
| UC1 — Conflict detection precision | N/A (new capability) | ≥ 85% precision (low false positive rate) |
| UC1 — Attorney-rated summary and draft quality | N/A (new capability) | ≥ 4 / 5 avg. rating |
| UC2 — Referral package preparation time per case | To be measured in Phase 1 | ≥ 50% reduction |
| UC2 — Document field extraction accuracy | N/A (new capability) | ≥ 90% field-level accuracy |
| UC2 — Checklist completeness rate at submission | To be measured in Phase 1 | ≥ 95% complete submissions |
| Both — Staff adoption rate of Copilot tools | 0% | ≥ 75% of target users active within 60 days of launch |

---

## Cost Estimates

> Estimates are indicative. Validate with the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) based on finalized contract document volumes, case file backlog size, and licensed user counts. Azure AI Foundry Hub overhead is consumption-based (no flat platform fee); underlying service costs are reflected in component line items below.

### UC1 — Contracting Terms Summarization and Conflict Detection

| Component | Build Period (Months 1–4) | Monthly Steady State |
|---|---|---|
| Azure OpenAI — GPT-4o (contract summarization + conflict detection, ~2M–8M tokens/month) | $5–$20 | $20–$80 |
| Azure AI Document Intelligence — Read/Layout (~5K–20K pages/month) | $8–$30 | $30–$200 |
| Azure Data Lake Storage Gen2 (contract document archive) | $1–$5 | $5–$20 |
| Power Automate Premium (document workflow automation, ~5–10 users @ $15/user/mo) | $75–$150 | $75–$150 |
| Microsoft 365 Copilot (drafting + review assistance, ~5–10 attorneys @ $30/user/mo) | $150–$300 | $150–$300 |
| Copilot Studio (contract workflow agent, 25K credits/mo prepaid pack) | $100–$200 | $100–$200 |
| Azure Monitor + App Insights | $25–$50 | $25–$50 |
| Azure Key Vault (shared) | ~$5 | ~$5 |
| **UC1 Total** | **~$369–$760/month** | **~$405–$1,005/month** |

### UC2 — AI-Assisted Attorney General Referral Packages – Well Violations

| Component | Build Period (Months 1–5) | Monthly Steady State |
|---|---|---|
| Azure AI Document Intelligence — Prebuilt/Custom (~2K–10K pages/month case files @ $10/1K pages) | $3–$100 | $20–$100 |
| Azure OpenAI — GPT-4o (case summarization + referral narrative drafting, ~500K–2M tokens/month) | $1–$5 | $5–$20 |
| Azure Data Lake Storage Gen2 (case file archive) | $1–$5 | $5–$20 |
| Azure SQL Database (Standard S1–S2, referral metadata + status tracking) | $30–$150 | $30–$150 |
| Power Automate Premium (checklist validation + routing flows, ~5–10 users @ $15/user/mo) | $75–$150 | $75–$150 |
| Microsoft 365 Copilot (referral drafting + summarization, ~5–10 attorneys @ $30/user/mo) | $150–$300 | $150–$300 |
| Copilot Studio (referral package agent + checklist validator, 25K credits/mo) | $100–$200 | $100–$200 |
| Azure Monitor + App Insights | $25–$50 | $25–$50 |
| Azure Key Vault (shared) | ~$5 | ~$5 |
| **UC2 Total** | **~$390–$965/month** | **~$410–$995/month** |

### Shared Costs Estimate

| Scenario | Monthly Cost |
|---|---|
| Build period (Months 1–5, both UCs running in parallel) | ~$759–$1,725/month |
| Post-launch steady state (both UCs) | ~$815–$2,000/month |
| Annual operational estimate (steady state × 12) | ~$9,780–$24,000/year |

---

## Team & Roles

| Role | Responsibility |
|---|---|
| Microsoft Solution Engineer | Overall solution architecture; Azure AI Foundry and Azure OpenAI configuration; technical guidance and PoC delivery |
| Azure AI Engineer | Azure OpenAI prompt engineering; Document Intelligence model configuration, training, and validation; pipeline build |
| Power Platform Developer | Power Automate workflow build; Copilot Studio agent development; Power BI dashboard |
| Agency IT Lead | Azure subscription administration; Entra ID and RBAC configuration; network security and data residency enforcement |
| Legal Subject Matter Expert | Contract clause domain expertise; conflict detection criteria definition; AG referral package requirements; UAT participation |
| Division Subject Matter Expert (Oil & Gas) | Well violation case file domain expertise; checklist criteria definition; field inspection data coordination |
| Program Manager | Initiative coordination; milestone tracking; stakeholder communication with AG office liaisons |

---

*Generated April 2026 — Office of Legal and Legislative Services AI Initiative*
*Built on Microsoft Azure AI Foundry + Azure OpenAI + Azure AI Services + Microsoft Power Platform*
