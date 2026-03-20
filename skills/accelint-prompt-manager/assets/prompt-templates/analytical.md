# Analytical Template

Use for: Data analysis, metrics interpretation, research synthesis, pattern finding.

## Structure

```
Analyze [DATA_SOURCE] to answer: [SPECIFIC_QUESTIONS]

Data format: [STRUCTURE_DESCRIPTION]
Analysis methods: [STATISTICAL_TECHNIQUES_IF_APPLICABLE]

Context:
- [Background information]
- [Why this analysis matters]
- [What decisions depend on findings]

Output format:
1. Executive summary (key findings in 2-3 sentences)
2. Detailed analysis
   - Finding 1: [Evidence + reasoning]
   - Finding 2: [Evidence + reasoning]
   - Finding 3: [Evidence + reasoning]
3. Recommendations (actionable next steps)
4. Limitations/caveats (what this analysis can't tell us)

Success criteria:
✓ [Measurable validation criterion 1]
✓ [Measurable validation criterion 2]
```

## Example Usage

```
Analyze user engagement metrics from last quarter to identify factors driving retention.

Data format:
- Source: analytics.csv (50k rows)
- Columns: user_id, signup_date, last_active, feature_usage, subscription_tier
- Time period: Q4 2025 (Oct-Dec)

Analysis methods:
- Cohort analysis by signup month
- Correlation analysis between feature usage and retention
- Segment comparison (free vs paid users)

Context:
- Retention dropped from 75% to 68% last quarter
- Product team needs to prioritize features for Q1
- Decision: Which features to invest in for retention improvement

Output format:
1. Executive summary
   - Key finding: Power users of feature X have 2.3x higher retention
2. Detailed analysis
   - Finding 1: Feature X usage correlates strongest with retention (r=0.67)
   - Finding 2: Users who engage in first week have 3x higher 90-day retention
   - Finding 3: Free-to-paid conversion happens most at day 14 (spike in data)
3. Recommendations
   - Prioritize onboarding flow to drive feature X adoption in first week
   - Add day-14 upgrade prompt (catches conversion spike timing)
   - Investigate why feature X drives retention (qualitative research)
4. Limitations
   - Correlation ≠ causation (need A/B test to confirm causal relationship)
   - Data doesn't include customer support interactions
   - Small sample size for enterprise tier (only 200 users)

Success criteria:
✓ Analysis identifies top 3 retention drivers with statistical confidence
✓ Recommendations are actionable and prioritized by expected impact
✓ Limitations clearly stated to prevent over-confident decisions
```

## Common Pitfalls

- **Vague questions:** "Analyze user behavior" → Specify: "Which features correlate with retention?"
- **Missing context:** Don't know why analysis matters → Can't prioritize findings appropriately
- **No validation criteria:** How do you know analysis is complete and correct?
- **Ignoring limitations:** Every analysis has blind spots, state them explicitly
