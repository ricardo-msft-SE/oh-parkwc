# Success Metrics & KPIs — Methodology Guide

This guide explains how the success metrics and KPIs are derived and validated across all Office initiatives.

---

## Overview

Each initiative establishes measurable success criteria based on three categories:

1. **Technical Performance Metrics** — Objective measures of AI model accuracy and system performance
2. **Process Improvement Metrics** — Measured reduction in time, cost, or effort vs. current baseline
3. **Adoption Metrics** — User engagement and adoption rates

---

## Metric Categories

### Technical Performance Metrics (New Capabilities)

For capabilities that don't have a current baseline, metrics are validated against objective technical standards established during Phase 1 data collection.

#### F1 Score (Anomaly Detection, Classification Tasks)

**What it is:** The F1 score balances two competing concerns in machine learning classification:

- **Precision**: Of all the items the model *flags*, how many are actually correct? (minimize false alarms)
- **Recall**: Of all the true instances, how many does the model *catch*? (don't miss real cases)

**Formula:**
$$F1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

**Range:** 0.0–1.0 (1.0 = perfect accuracy, 0.0 = completely wrong)

**How it's derived:**
1. Collect historical sensor/document data where ground truth is known (e.g., past anomalies labeled by domain experts)
2. Hold out a test set (typically 20–30% of labeled data) not used for training
3. Run the trained model on the test set and compare predictions to ground truth
4. Calculate precision = (true positives) / (true positives + false positives)
5. Calculate recall = (true positives) / (true positives + false negatives)
6. Compute F1 as the harmonic mean

**Example:** A sensor anomaly detector with F1 ≥ 0.85 means it correctly identifies ~85% of real anomalies while keeping false alarm rates acceptable.

---

#### Document Extraction Accuracy (Document Intelligence)

**What it is:** The percentage of extracted data fields that match human-verified ground truth.

**How it's derived:**
1. Select a sample of representative documents (e.g., 50–100 permits, sensor reports)
2. Manually review each document and extract key fields (date, location, status, numeric values, etc.) as ground truth
3. Run the AI document analysis model on the same documents
4. Compare AI extraction to ground truth field-by-field
5. Calculate accuracy = (fields matching exactly) / (total fields)

**Target:** ≥ 90% means 9 out of 10 extracted fields are correct. Remaining 10% may need human review or refinement.

---

#### Reviewer-Rated Usefulness (Subjective Quality)

**What it is:** User survey rating of AI-generated summaries or assistance on a 1–5 scale.

**How it's derived:**
1. During pilot/UAT phase, show reviewers multiple AI-generated outputs (summaries, recommendations, extractions)
2. Ask them to rate usefulness: 1 = not helpful, 5 = extremely helpful
3. Collect scores from all pilot users (typically 5–15 staff)
4. Calculate average rating

**Target:** ≥ 4/5 indicates majority of users find the output helpful and usable.

---

### Process Improvement Metrics (vs. Baseline)

For processes that already exist, success is measured as *percentage reduction* vs. current manual baseline established in Phase 1.

#### Time Reduction Targets

**How it's derived:**
1. **Phase 1 Baseline:** Measure the current manual process. Example:
   - Average time per sensor QA review = 45 minutes
   - Average time per permit review = 8 hours

2. **Phase 3+ Performance:** Measure with AI assistance. Example:
   - Average time with AI anomaly flags = 20 minutes (55% reduction)
   - Average time with AI summary = 5 hours (37.5% reduction)

3. **Calculate improvement:**
   $$\text{Reduction \%} = \frac{\text{Baseline} - \text{New}}{\text{Baseline}} \times 100$$

**Target examples:**
- UC1 QA review time: ≥ 50% reduction
- UC1 anomaly detection time: ≥ 60% reduction (faster identification of failures)
- UC2 permit review cycle: ≥ 30% reduction

---

#### Consistency Improvement

**How it's derived:**
1. Measure inter-reviewer consistency in Phase 1 (e.g., variance in review outcomes, flag accuracy)
2. Measure consistency in Phase 3+ with AI guidance (AI summaries should reduce subjective variance)
3. Calculate improvement as reduction in variance or improvement in consistency scoring

---

### Adoption Metrics

**What it is:** Percentage of target users actively using the solution within 60 days of launch.

**How it's derived:**
1. Identify target user group (e.g., 10 Division staff for UC1)
2. Track usage telemetry:
   - Login frequency to Copilot Studio agent or Power Automate portal
   - Query counts or workflow invocations
   - Time spent per session
3. Define "active user" threshold (e.g., minimum 1 query per week OR use within 50% of days)
4. Count active users at 60 days post-launch
5. Calculate adoption % = (active users) / (target user group) × 100

**Target:** ≥ 75% of target users active within 60 days indicates strong adoption and willingness to use the tool.

---

## Validation & Reporting

### During Implementation

- **Phase 1:** Establish baselines; define success thresholds
- **Phase 2:** Prepare labeled datasets and validation methodology
- **Phase 3:** Measure model performance; begin pilot user testing
- **Phase 4:** Conduct full UAT; validate all metrics against targets; document results

### Success Criteria Decision Rules

| Metric | Target Met | Action |
|---|---|---|
| F1 Score < 0.80 | ❌ Retrain model; refine thresholds | Iterate Phase 3 |
| Extraction Accuracy < 85% | ⚠️ Manual review required; may limit scope | Refine model; consider hybrid approach |
| Reviewer Rating < 3.5/5 | ❌ Redesign output format; gather feedback | Rework Phase 3 |
| Adoption < 60% | ⚠️ Assess barriers; additional training needed | Extend Phase 4; train user |
| Time Reduction < 20% | ⚠️ Workflow inefficient; investigate bottleneck | Redesign workflow |

---

## Key Principles

1. **Measure Early:** Phase 1 baselines are critical; measure current state before building
2. **Be Objective:** Use data-driven metrics, not subjective judgments
3. **Iterate:** If targets aren't met, refine model/workflow and re-measure
4. **Report Transparently:** Share both successes and shortfalls with stakeholders
5. **Document Methods:** Record exactly how each metric was calculated for reproducibility

---

*Methodology Guide — Office Initiatives*  
*Last Updated: April 2026*
