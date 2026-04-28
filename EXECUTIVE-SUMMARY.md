# ODNR Division of Parks and Watercraft — AI Initiative
## Executive Summary

> **Agency:** Ohio Department of Natural Resources (ODNR) — Division of Parks and Watercraft
> **Platform:** Microsoft Azure AI Foundry + Azure AI Services
> **Date:** March 2026
> **Full Technical Plan:** [README.md](README.md)

---

## Initiative Overview

The Division of Parks and Watercraft is pursuing two AI-enabled initiatives to modernize data operations and improve public-facing services. Both are delivered on a shared **Microsoft Azure AI Foundry** platform and follow Ohio's public-sector cloud standards.

| # | Initiative | Primary Benefit |
|---|---|---|
| 1 | **Watercraft Customer Data Merge** | Eliminate duplicate records across 2M+ customer accounts to improve data accuracy, compliance, and staff efficiency |
| 2 | **AI Enabled State Parks Assistant** | Provide 24/7 natural language access to park information across web, mobile, and voice channels |

---

## Level of Effort

### Summary

| | UC1 — Data Merge | UC2 — Parks Assistant |
|---|---|---|
| **Total Duration** | 6 months | 6 months |
| **Parallel execution** | Months 1–6 | Months 1–6 |
| **Initial build effort** | ~2,600 hours | ~2,200 hours |
| **Ongoing support (monthly)** | ~40 hrs/month | ~60 hrs/month |

### UC1 — Watercraft Customer Data Merge

| Phase | Duration | Key Activities | Est. Hours |
|---|---|---|---|
| Discovery & Data Assessment | Weeks 1–4 | Data profiling, PII classification, schema mapping, landing zone provisioning | 320 hrs |
| Data Pipeline Design | Weeks 5–8 | ADF pipelines, Bronze/Silver/Gold medallion zones, Purview catalog | 480 hrs |
| AI Model Development | Weeks 9–14 | Foundry setup, Prompt Flow orchestration, GPT-4o integration, audit logging, Power Apps queue | 640 hrs |
| Pilot Implementation | Weeks 15–18 | 200K-record pilot, precision/recall evaluation, threshold tuning, UAT | 320 hrs |
| Full Production & Training | Weeks 19–24 | 2M+ record run, scheduled dedup cadence, staff training, runbooks | 480 hrs |
| **Total** | **24 weeks** | | **~2,240 hrs** |

### UC2 — AI Enabled State Parks Assistant

| Phase | Duration | Key Activities | Est. Hours |
|---|---|---|---|
| Content Inventory & KB Design | Weeks 1–4 | Content audit, taxonomy design, AI Search index schema, infrastructure provisioning | 280 hrs |
| Knowledge Base Ingestion | Weeks 5–9 | Document Intelligence pipeline, chunking/embedding, hybrid search configuration | 480 hrs |
| Foundry Agent & API Layer | Weeks 10–15 | Agent configuration, Prompt Flow, system prompt authoring, API Management, Content Safety | 560 hrs |
| Channel Integration | Weeks 16–19 | Website widget, Teams bot, voice evaluation, WCAG accessibility audit | 320 hrs |
| Pilot, Training & Rollout | Weeks 20–24 | Soft launch, feedback tuning, content team training, public launch, monitoring | 320 hrs |
| **Total** | **24 weeks** | | **~1,960 hrs** |

> **Note:** Hours assume a blended team of ODNR staff, contract developers, and Microsoft FastTrack specialists. Contract providers supporting legacy data extraction are estimated separately.

---

## Development Teams & Skills Required

### Team Composition

| Role | Count | Primary Responsibility | Required Skills |
|---|---|---|---|
| **AI Engineer** | 2 | Azure AI Foundry configuration, Prompt Flow, agent development, embeddings pipelines | Azure AI Foundry, Azure OpenAI, Python, Prompt engineering, RAG patterns |
| **Data Engineer** | 2 | ADF/Databricks pipelines, medallion architecture, SQL schema, data quality | Azure Data Factory, Azure Databricks, PySpark, Azure SQL, ADLS Gen2 |
| **Cloud/Infrastructure Engineer** | 1 | Azure landing zone, VNet, private endpoints, Key Vault, RBAC, Policy | Azure networking, Bicep/ARM, Entra ID, Azure Policy, Defender for Cloud |
| **Full-Stack Developer** | 1 | Chat widget (React), REST API integration, Power Apps queue | React, REST APIs, Power Apps, Azure API Management |
| **Data Analyst / QA** | 1 | Ground truth validation, KPI measurement, Power BI dashboards | Power BI, SQL, data quality analysis, statistical evaluation |
| **Content Curator (ODNR)** | 1 | Park knowledge base content, approval workflows, content governance | Content management, SharePoint/CMS, domain knowledge of ODNR parks |
| **UX Designer** | 1 | Chat widget design, accessibility compliance | UX design, WCAG 2.1, prototyping tools |
| **Contract Data Provider** | TBD | Legacy system extraction, initial data profiling (UC1) | Legacy system expertise, ETL, data migration |
| **ODNR IT Lead** | 1 | Environment ownership, governance, stakeholder coordination | Azure administration, project management |

### Critical Skill Areas

- **Prompt Engineering & LLM Orchestration** — Design of system prompts, retrieval-augmented generation patterns, and Foundry Agent tooling
- **Entity Resolution & MDM** — Probabilistic matching, fuzzy deduplication logic, merge decision auditing
- **Azure Data Platform** — ADF, ADLS Gen2, Databricks/Synapse, Azure Purview for large-scale data pipelines
- **Responsible AI** — Content Safety configuration, bias evaluation, audit logging, Foundry evaluation suite
- **Public Sector Security** — Entra ID, private endpoints, NIST 800-53 control mapping, PII handling

---

## Key Azure Services to Deploy

### Shared Platform (Both Use Cases)

| Service | Purpose |
|---|---|
| **Azure AI Foundry Hub** | Unified AI workspace: model catalog, Prompt Flow, monitoring, governance |
| **Azure OpenAI Service (GPT-4o)** | Core LLM for reasoning, decision generation, and natural language responses |
| **Microsoft Entra ID** | Identity, RBAC, Managed Identities for service-to-service authentication |
| **Azure Key Vault** | Secrets, API keys, and connection string management |
| **Azure Monitor + Log Analytics** | Operational logging, alerting, and unified dashboards |
| **Azure Virtual Network + Private Endpoints** | Private network isolation for all PaaS services |
| **Azure Policy + Defender for Cloud** | Compliance guardrails and threat protection |

### UC1 — Watercraft Customer Data Merge

| Service | Purpose |
|---|---|
| **Azure Data Factory** | ELT pipelines from legacy source systems |
| **Azure Data Lake Storage Gen2** | Bronze / Silver / Gold medallion data zones |
| **Azure Databricks** | Large-scale transformation and feature engineering |
| **Azure AI Language** | Named entity recognition for name/address normalization |
| **Azure SQL Database** | Customer master golden record store |
| **Azure Purview** | Data catalog, lineage tracking, and PII classification |
| **Power Apps** | Human review queue for exception records |
| **Power BI** | Merge analytics and data quality reporting |

### UC2 — AI Enabled State Parks Assistant

| Service | Purpose |
|---|---|
| **Azure AI Search** | Hybrid vector + keyword retrieval over park knowledge base |
| **Azure OpenAI (text-embedding-3-large)** | Vector embeddings for park content chunks |
| **Azure Document Intelligence** | Extraction from PDF and scanned park documents |
| **Azure AI Content Safety** | Input/output filtering for responsible AI guardrails |
| **Azure Cosmos DB** | Conversation history, session state, and interaction analytics |
| **Azure API Management** | API gateway: rate limiting, auth, versioning, CORS |
| **Azure Bot Service** | Teams channel integration for internal staff assistant |
| **Azure Maps** | Location lookup, directions, and proximity search |
| **Bing Grounding (via Foundry)** | Real-time events and weather context enrichment |
| **Azure Communication Services** | Optional: voice channel for phone-based assistant |

---

## Estimated Run Costs

> All figures are indicative. Refine with the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) based on finalized sizing.

### UC1 — Watercraft Customer Data Merge

| Component | One-Time (Initial Run) | Monthly (Recurring Dedup) |
|---|---|---|
| Azure OpenAI GPT-4o (2M records) | $2,000–$4,000 | $300–$600 |
| Azure Databricks | $500–$1,500 | $200–$400 |
| Azure Data Factory | $200–$400 | $100–$200 |
| Azure Data Lake Storage Gen2 | $100–$200 | $50–$100 |
| Azure SQL Database | $300–$600 | $300–$600 |
| Azure Purview | $200–$400 | $200–$400 |
| Azure Monitor / App Insights | $50–$100 | $50–$100 |
| **Total** | **~$3,350–$7,200 (one-time)** | **~$1,200–$2,400/month** |

### UC2 — AI Enabled State Parks Assistant

| Component | Monthly Estimate (50K queries/month) |
|---|---|
| Azure OpenAI GPT-4o | $800–$1,500 |
| Azure AI Search (S1 tier) | ~$250 |
| Azure API Management (Standard) | ~$300 |
| Azure Cosmos DB | $100–$200 |
| Azure Document Intelligence (indexing) | $50–$150 |
| Azure Bot Service | $50–$100 |
| Azure Monitor + App Insights | $100–$200 |
| Azure Maps | $50–$100 |
| **Total** | **~$1,700–$2,800/month** |

### Shared Costs Platform Cost Estimate

| Scenario | Monthly Run Cost |
|---|---|
| **Initial build period (Months 1–6)** | ~$3,000–$5,500/month (both use cases active in dev/test) |
| **Post-launch steady state** | **~$2,900–$5,200/month** |
| **Annual operational estimate** | **~$35,000–$62,000/year** |

> The one-time initial data merge processing cost of **~$3,350–$7,200** is a non-recurring expense tied to the first full 2M-record run.

---

## Timeline at a Glance

```
Month     1     2     3     4     5     6
          ├─────┼─────┼─────┼─────┼─────┤

Platform  ████ (Foundry Hub, shared infra — Month 1)

UC1       ████  ████  ██████████  ████  ████████
          Disc  Pipe  AI Dev      Pilot Production

UC2       ████  ████████  ██████████  ████  ████
          Inv   KB Build  Agent Dev  Chnl  Launch
```

| Key Milestone | Target |
|---|---|
| Azure AI Foundry Hub live | End of Month 1 |
| UC1 Data pipeline operational | End of Month 2 |
| UC2 Park knowledge base indexed | End of Month 2 |
| UC1 Pilot complete (200K records) | End of Month 4 |
| UC2 Internal staff pilot | End of Month 4 |
| UC1 Full 2M+ production run | End of Month 5 |
| UC2 Public launch | End of Month 6 |
| Monthly dedup cadence live | End of Month 6 |

---

## Recommendation

Both initiatives are well-suited for concurrent delivery within a **6-month program**. The shared Azure AI Foundry platform reduces duplication of infrastructure investment and governance overhead. Key dependencies are:

1. **Legacy data access** (UC1) — Early engagement with the contract data provider is critical to avoid pipeline delays.
2. **ODNR content governance** (UC2) — Establishing a park content approval workflow in Month 1 enables the Month 2 indexing target.
3. **Azure subscription provisioning** — Requires Owner-level access and AI Foundry enablement before Month 1 work can begin.

A **Proof of Concept** scoped to a single park district (UC2) and a 50K-record sample (UC1) is recommended as a Month 1 parallel activity to validate architecture assumptions before full-scale investment.

---

*For full technical architecture, implementation phases, and security design, see [README.md](README.md).*
*Prepared by ODNR Division of Parks and Watercraft AI Initiative team — March 2026.*
