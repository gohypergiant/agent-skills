# Planning Template

Use for: Architecture design, approach design, project planning, task breakdown.

## Structure

```
Design approach for [PROJECT/FEATURE]

Goals:
- [Primary objective - the main thing to accomplish]
- [Secondary objectives - nice-to-haves]

Constraints:
- Technical: [Existing systems, tech stack, compatibility requirements]
- Resources: [Team size, skill level, time available]
- Budget: [Infrastructure costs, licensing]
- Timeline: [Deadlines, milestones]

Current state:
- [Relevant existing architecture]
- [Systems this will interact with]
- [Technical debt or limitations to consider]

Unknowns to resolve:
- [Question 1 needing investigation]
- [Question 2 needing decision]
- [Question 3 with multiple valid approaches]

Expected output:
1. Recommended approach with rationale
2. Alternative approaches with trade-offs
3. Phased implementation plan
4. Risk assessment (what could go wrong)
5. Decision points needing user input
6. Success criteria and validation strategy

Design considerations:
- Scalability: [How to handle growth]
- Maintainability: [How to keep it understandable]
- Security: [How to protect against threats]
- Performance: [How to meet speed requirements]

Success criteria:
✓ Clear, actionable plan that team can execute
✓ Trade-offs explicitly documented
✓ Risks identified with mitigation strategies
✓ All major technical decisions have rationale
```

## Example Usage

```
Design approach for adding real-time collaboration features to document editor.

Goals:
- Primary: Enable 2-10 users to edit same document simultaneously
- Secondary: Show live cursors, typing indicators, presence awareness

Constraints:
- Technical: React frontend, Node.js backend, PostgreSQL database
- Resources: 2 backend engineers, 1 frontend engineer, 6 weeks
- Budget: <$500/month infrastructure increase
- Timeline: MVP in 6 weeks, full release in 10 weeks

Current state:
- Documents stored in PostgreSQL (JSON column for content)
- REST API for CRUD operations (not real-time)
- No WebSocket infrastructure yet
- Frontend uses Draft.js for editor

Unknowns to resolve:
- Conflict resolution strategy: OT (Operational Transform) vs CRDT (Conflict-free Replicated Data Type)?
- How to handle user disconnections and reconnections?
- What's acceptable latency for "feels real-time"? (<100ms, <500ms?)

Expected output:

1. Recommended approach: CRDT with Yjs
   Rationale:
   - CRDTs are easier to reason about than OT (less complexity)
   - Yjs has good Draft.js integration (faster implementation)
   - Works offline-first (better UX for flaky connections)
   - Widely used, battle-tested (lower risk)

2. Alternative approaches:

   Option A: Operational Transform (Google Docs style)
   ✅ Pros: Minimal data transfer, mature theory
   ❌ Cons: Complex implementation, hard to debug, 8+ weeks to build
   Trade-off: Best efficiency, but beyond timeline/team expertise

   Option B: Simple last-write-wins with WebSocket
   ✅ Pros: Simplest implementation, 2 weeks to MVP
   ❌ Cons: Users overwrite each other, poor UX, conflict resolution manual
   Trade-off: Fast to ship but unacceptable UX for collaboration

3. Phased implementation plan:

   Phase 1 (weeks 1-2): Infrastructure
   - Add WebSocket server (Socket.io)
   - Room management (users join/leave document)
   - Presence tracking (who's online)

   Phase 2 (weeks 3-4): CRDT integration
   - Integrate Yjs with Draft.js
   - Sync document changes via WebSockets
   - Handle basic conflict resolution

   Phase 3 (weeks 5-6): Polish
   - Live cursors and selection highlights
   - Typing indicators
   - Offline support with sync on reconnect

   Phase 4 (weeks 7-10): Production hardening
   - Load testing (100+ concurrent users per document)
   - Error handling (disconnects, network issues)
   - Monitoring and alerting

4. Risk assessment:
   - Risk: Yjs learning curve → Mitigation: Spike in week 1 to validate
   - Risk: WebSocket scaling → Mitigation: Use Socket.io with Redis adapter
   - Risk: Data model change → Mitigation: Keep old API, add new for collab
   - Risk: Timeline slip → Mitigation: Phase 3 (live cursors) is optional for MVP

5. Decision points:
   - Latency target: Confirm <200ms is acceptable (affects infrastructure)
   - Document size limits: How big can documents be? (affects performance strategy)
   - Concurrent user limit: 10 users or plan for 100? (affects scaling approach)

6. Success criteria:
   ✓ 2+ users can edit simultaneously without data loss
   ✓ Changes appear within 200ms
   ✓ Handles network disconnects gracefully
   ✓ Infrastructure cost <$500/month at 1000 daily active users
   ✓ MVP ships in 6 weeks
```

## Common Pitfalls

- **Solution before problem:** Jumping to "use technology X" without evaluating alternatives
- **Ignoring constraints:** Designing ideal solution that's not feasible with resources
- **No trade-off analysis:** Presenting one approach without explaining what you're giving up
- **Vague phases:** "Then we implement" → Break into concrete, measurable milestones
