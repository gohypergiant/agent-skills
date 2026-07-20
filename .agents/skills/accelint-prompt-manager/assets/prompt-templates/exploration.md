# Exploration Template

Use for: Codebase discovery, pattern finding, understanding architecture, learning new systems.

## Structure

```
Explore [CODEBASE/AREA] to understand [SPECIFIC_ASPECT]

Goals:
- [What to discover]
- [Patterns to identify]
- [Questions to answer]

Scope:
- [What to explore]: [Whole codebase / specific directory / specific feature]
- [What to skip]: [Known areas / out of scope]

Exploration approach:
1. Start with [entry points]: [files/functions to begin investigation]
2. Map [relationships/dependencies]: [How components connect]
3. Identify [key patterns/conventions]: [Recurring structures]
4. Document [findings organized by category]

Questions to answer:
- [Specific question 1]
- [Specific question 2]
- [Specific question 3]

Output format:
- Summary of [architecture/patterns discovered]
- Key files with their purposes
- Findings organized by [category]
- Diagrams [if helpful for understanding]

Stop condition: [When is exploration complete]
```

## Example Usage

```
Explore the authentication system to understand how user sessions are managed.

Goals:
- Understand session lifecycle (create, validate, refresh, expire)
- Identify where session data is stored
- Find all middleware that checks authentication
- Map the flow from login to protected route access

Scope:
- Explore: src/auth/, src/middleware/, database schema for sessions
- Skip: Frontend components (focusing on backend only), OAuth providers (out of scope for now)

Exploration approach:
1. Start with login endpoint (src/auth/login.ts)
   - Trace: credentials → validation → session creation → response
2. Map session storage
   - Database tables: sessions, users
   - Cache layer: Redis keys
3. Identify auth middleware
   - Find all files importing requireAuth or similar
   - Document: what each middleware checks, what routes use it
4. Document flow with sequence diagram

Questions to answer:
- How long do sessions last? (TTL in database vs cache)
- What triggers session refresh? (Automatic vs manual)
- How are expired sessions cleaned up? (Cron job? Lazy deletion?)
- Can users have multiple sessions? (Different devices)
- What data is stored in session? (User ID only vs full profile)

Output format:
- Summary: "Sessions stored in PostgreSQL (persistence) + Redis (fast lookup). 7-day expiry with sliding window. One session per device."

- Key files:
  - src/auth/login.ts: Creates sessions on successful login
  - src/auth/middleware.ts: validateSession() checks Redis then DB
  - src/jobs/cleanup-sessions.ts: Cron job removes expired sessions (runs daily)
  - database/migrations/002_sessions.sql: Session table schema

- Session lifecycle flow:
  1. Login → create session in DB + cache in Redis
  2. Request → middleware checks Redis (fast) → if miss, check DB
  3. Activity → extends expiry (sliding window, resets on each request)
  4. Logout → delete from DB + Redis
  5. Expiry → cron job cleanup (daily at 2am)

- Findings:
  - Redis cache prevents DB hit on every request (perf optimization)
  - Sliding window: Active users stay logged in indefinitely
  - Each device gets separate session (tracked by device_fingerprint)
  - Session stores only user_id and created_at (profile fetched separately)

Stop condition: Can answer all questions about session lifecycle, have mapping of key files
```

## Common Pitfalls

- **Unfocused exploration:** "Understand the codebase" too vague → Specify what aspect
- **No stop condition:** Explore forever without clear completion criteria
- **Poor organization:** Findings dumped without structure → Hard to reference later
- **Missing "why":** Document what code does without explaining design decisions
