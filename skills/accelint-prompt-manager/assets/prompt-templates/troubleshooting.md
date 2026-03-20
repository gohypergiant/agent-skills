# Troubleshooting Template

Use for: System issues, performance problems, incident response, operational debugging.

## Structure

```
Troubleshoot [SYSTEM/ISSUE]

Symptoms:
- [Observable problem 1]
- [Observable problem 2]
- Started: [When did this begin]
- Frequency: [Constant / Intermittent / Under specific conditions]

Impact:
- Users affected: [All / Specific segment / Percentage]
- Business impact: [Revenue loss / User experience / Data integrity]
- Severity: [Critical/High/Medium/Low]

Urgency: [Critical/High/Medium/Low]

Available tools:
- [Monitoring dashboards]: [URLs or access info]
- [Log access]: [Where to find logs]
- [Diagnostic commands]: [What can be run]
- [System access]: [What environments, what permissions]

Context:
- Recent changes: [Deployments, config changes, traffic spikes]
- Normal baseline: [What "good" looks like]
- Similar past incidents: [Reference to previous issues if applicable]

Investigation approach:
1. Immediate mitigation (if needed to stop bleeding)
2. Gather diagnostic data
3. Form hypotheses (most likely causes)
4. Test hypotheses systematically
5. Identify root cause
6. Implement permanent fix
7. Document findings and prevention

For each hypothesis:
- Theory: [Explanation of what might be wrong]
- Test: [How to validate/invalidate this theory]
- Expected result if theory correct: [What you'd observe]
- Actual result: [What you found]

Output:
- Immediate mitigation (if needed)
- Root cause analysis
- Permanent fix recommendation
- Prevention strategies (how to avoid in future)
```

## Example Usage

```
Troubleshoot API response time degradation causing timeout errors.

Symptoms:
- API response times increased from ~200ms to ~5000ms
- Users experiencing timeout errors (504 Gateway Timeout)
- Started: Today at 14:30 UTC
- Frequency: Constant since start, all endpoints affected
- Error rate: ~30% of requests timing out

Impact:
- Users affected: All users (~10k daily active)
- Business impact: Critical - users cannot complete core workflows
- Revenue impact: Estimated $5k/hour in lost transactions
- Severity: CRITICAL

Urgency: CRITICAL (requires immediate attention)

Available tools:
- Application logs: CloudWatch /aws/lambda/api-prod
- Database monitoring: RDS Performance Insights
- APM: Datadog dashboard (app.datadoghq.com/dash/api-prod)
- Infrastructure: AWS Console, can restart services
- Diagnostic: Can run queries against DB, check Redis cache

Context:
- Recent changes:
  - Deploy at 14:00 UTC (30 minutes before issue)
  - No infrastructure changes
  - No unusual traffic spike (normal load: 100 req/min)
- Normal baseline:
  - p50: ~150ms, p95: ~300ms, p99: ~500ms
  - Error rate: <0.1%
- Similar past incidents:
  - Last month: Similar issue caused by missing database index (fixed)

INVESTIGATION:

Hypothesis 1: Recent deployment introduced performance regression
- Theory: Code deployed at 14:00 has inefficient query or blocking operation
- Test: Check git diff for performance-sensitive changes
- Expected: Find suspicious database query or API call added
- Result: ✓ CONFIRMED
  - New feature added: bulk user export
  - Query: `SELECT * FROM users` (no LIMIT, fetches all 500k users)
  - Called on every request due to bug in middleware

Hypothesis 2: Database connection exhaustion
- Theory: App consuming all DB connections, requests queue
- Test: Check RDS connection count metrics
- Expected: Connection count at max (100), queue building up
- Result: ✓ PARTIALLY CONFIRMED
  - Connection count: 98/100 (near max)
  - Caused by Hypothesis 1 (slow query holds connections longer)

Hypothesis 3: Cache failure causing DB load spike
- Theory: Redis cache down, all reads hitting DB
- Test: Check Redis metrics and connection status
- Expected: Redis unavailable or cache hit rate dropped
- Result: ✗ REJECTED
  - Redis healthy, cache hit rate normal (~85%)

ROOT CAUSE IDENTIFIED:

Recent deployment introduced bulk user export feature with unoptimized query:
- Query fetches all 500k users without LIMIT
- Takes ~4 seconds to execute
- Runs on every API request due to middleware bug (should only run on export endpoint)
- Consumes DB connections, causing queueing
- Other requests timeout waiting for available connections

IMMEDIATE MITIGATION (stop the bleeding):

1. Rollback deployment to previous version
   ```bash
   git revert HEAD
   docker build -t api:rollback .
   kubectl set image deployment/api api=api:rollback
   ```
   Timeline: 2 minutes to rollback
   Expected impact: Response times return to normal, error rate drops

2. Monitor recovery
   - Watch dashboard: Response times should drop to <500ms within 1 minute
   - Error rate should drop to <1% within 2 minutes

EXECUTED: Rollback completed at 14:55 UTC
RESULT: ✓ Response times returned to ~200ms, error rate <0.1%

PERMANENT FIX:

Fix 1: Add LIMIT and pagination to export query
```javascript
// Before (broken):
const users = await db.query('SELECT * FROM users');

// After (fixed):
const users = await db.query(
  'SELECT * FROM users LIMIT $1 OFFSET $2',
  [pageSize, offset]
);
```

Fix 2: Remove middleware bug (query shouldn't run on every request)
```javascript
// Before (broken):
app.use(exportMiddleware); // Runs on ALL routes

// After (fixed):
app.get('/api/export', exportMiddleware, exportHandler); // Only on export route
```

Fix 3: Add query timeout to prevent runaway queries
```javascript
const users = await db.query(
  'SELECT * FROM users LIMIT $1 OFFSET $2',
  [pageSize, offset],
  { timeout: 5000 } // Fail after 5 seconds
);
```

Fix 4: Add database index on export query sort column
```sql
CREATE INDEX idx_users_created_at ON users(created_at);
-- Improves sort performance for export
```

PREVENTION STRATEGIES:

1. Pre-deploy performance testing
   - Add load test that exercises new endpoints
   - Catch performance regressions before production

2. Query review checklist
   - All queries must have LIMIT or WHERE clause
   - Code review must check for full table scans
   - Enforce via linter rule

3. Query monitoring alerts
   - Alert when query execution time >1 second
   - Alert when connection pool utilization >80%
   - Catch issues before they cause outages

4. Staging environment load testing
   - Deploy to staging first
   - Run realistic traffic simulation
   - Monitor performance for 30 minutes before prod deploy

5. Feature flags for risky changes
   - New endpoints behind feature flag
   - Gradual rollout (5% → 25% → 100%)
   - Quick rollback if issues detected

TIMELINE:
- 14:00 - Deploy with bug
- 14:30 - Issue begins (traffic reaches new code)
- 14:35 - Alerts fire (response time, error rate)
- 14:40 - Investigation begins
- 14:55 - Rollback completed (25 minutes to mitigation)
- 15:10 - Root cause documented

LESSONS LEARNED:
- Full table scan in production is never acceptable
- Middleware placement matters (applies to all routes by default)
- Need pre-deploy load testing to catch this class of bug
- 25 minutes to mitigation is too slow for CRITICAL severity (target: <10 min)

POST-MORTEM: Scheduled for tomorrow, invite: dev team, SRE, PM
```

## Common Pitfalls

- **Jumping to solutions:** Fix symptoms without understanding root cause → Issue recurs
- **Random changes:** "Try restarting" without hypothesis → Wastes time, might make it worse
- **No mitigation plan:** Spending hours debugging while users suffer → Stop bleeding first
- **Poor documentation:** Solve issue but don't document → Next person starts from scratch
