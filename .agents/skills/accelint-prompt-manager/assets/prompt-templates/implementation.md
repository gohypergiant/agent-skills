# Implementation Template

Use for: Feature building, coding, algorithm implementation, system building.

## Structure

```
Implement [FEATURE/COMPONENT] that [CORE_FUNCTIONALITY]

Requirements:
Functional:
- [What it must do - feature 1]
- [What it must do - feature 2]
- [What it must do - feature 3]

Non-functional:
- Performance: [Response time, throughput, resource usage targets]
- Security: [Auth, validation, data protection requirements]
- Reliability: [Error handling, availability expectations]

Constraints:
- Use [libraries/frameworks]: [Specific tech stack]
- Follow [patterns/conventions]: [Existing code patterns to match]
- Compatible with: [Existing systems/APIs/data formats]
- Don't use: [Things to avoid, with reasoning]

Error handling:
- [Scenario 1]: [How to handle - retry? fail? log?]
- [Scenario 2]: [How to handle]
- [Scenario 3]: [How to handle]

Testing:
- Unit tests for: [Components to test]
- Integration tests for: [End-to-end scenarios]
- Test these edge cases:
  - [Edge case 1]
  - [Edge case 2]
- Coverage target: [Percentage or specific scenarios]

Success criteria:
✓ [Requirement 1 met and verified]
✓ [Requirement 2 met and verified]
✓ Tests pass with [coverage target]
✓ No breaking changes to existing functionality
✓ [Performance target met]
```

## Example Usage

```
Implement rate limiting middleware for Express.js API that prevents abuse while allowing legitimate usage.

Requirements:
Functional:
- Limit requests per user per time window
- Support different limits for different user tiers (free: 100/hr, pro: 1000/hr)
- Return clear error messages when limit exceeded
- Include headers showing remaining quota

Non-functional:
- Performance: Add <5ms latency to requests
- Security: Prevent bypass via IP spoofing, multiple accounts
- Reliability: Continue serving requests if Redis fails (degrade gracefully)

Constraints:
- Use Redis for distributed rate limiting (multiple app instances)
- Follow existing middleware pattern (req, res, next signature)
- Compatible with current JWT auth middleware (extracts user_id)
- Don't use: Third-party rate limiting libraries (build in-house for learning)

Error handling:
- Rate limit exceeded: Return 429 with Retry-After header, don't crash
- Redis connection error: Log error, allow request through (fail open for availability)
- Invalid user tier: Default to free tier limits
- Missing user_id: Apply IP-based rate limit (stricter, 50/hr)

Testing:
- Unit tests for:
  - Rate limit calculation logic
  - Different user tiers
  - Redis key generation
- Integration tests for:
  - Sequential requests hitting limit
  - Concurrent requests (race conditions)
  - Redis failure fallback
- Test these edge cases:
  - User switching tiers mid-hour (how to handle quota?)
  - Clock skew across servers
  - Redis eviction policy (what if keys disappear early?)
- Coverage target: 85%+ lines, 100% branches for core logic

Implementation notes:
- Use sliding window algorithm (more accurate than fixed window)
- Redis key format: `ratelimit:{user_id}:{timestamp_bucket}`
- Store: sorted set with timestamps, remove old entries before checking

Success criteria:
✓ Free users limited to 100 requests/hour
✓ Pro users limited to 1000 requests/hour
✓ 429 response includes Retry-After header with seconds to wait
✓ Response headers include X-RateLimit-Remaining
✓ Redis failure degrades gracefully (logs error, allows requests)
✓ Latency <5ms for rate limit check (verified with benchmarks)
✓ Tests achieve 85%+ coverage
✓ Existing API functionality unchanged
```

## Common Pitfalls

- **Vague requirements:** "Add auth" → Specify exact auth method, where, how
- **Missing error handling:** Happy path only → Production needs failure handling
- **No testing strategy:** Code without tests → Regressions inevitable
- **Undefined success:** "Make it work" → Define what "works" means measurably
