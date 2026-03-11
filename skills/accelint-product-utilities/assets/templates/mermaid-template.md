# Mermaid Journey Diagram: [Scenario Name]

## Diagram

```mermaid
graph TD
    Start([Start: Trigger Event])

    Start --> Action1[Action or Step 1]
    Action1 --> Decision1{Decision Point 1}

    Decision1 -->|Option A| Action2A[Action 2A]
    Decision1 -->|Option B| Action2B[Action 2B]

    Action2A --> Touchpoint1[System Touchpoint 1]
    Action2B --> Touchpoint1

    Touchpoint1 --> PainPoint1[Pain Point: Manual Process]

    PainPoint1 --> Decision2{Decision Point 2}

    Decision2 -->|Success| Action3[Action 3]
    Decision2 -->|Failure| Retry[Retry or Workaround]

    Retry --> Action3

    Action3 --> End([End: Goal Achieved])

    style PainPoint1 fill:#ffcccc
    style Decision1 fill:#ffffcc
    style Decision2 fill:#ffffcc
```

## Diagram Legend

- **Rectangles** — Actions or steps
- **Diamonds** — Decision points (branching)
- **Rounded boxes** — Start/end states
- **Red-tinted** — Pain points or friction
- **Yellow-tinted** — Decision nodes

## Mapping to Journey Artifact

| Diagram Element | Journey Stage | Notes |
|-----------------|---------------|-------|
| Start | [Stage name] | [Trigger condition] |
| Action1 | [Stage name] | [What happens] |
| Decision1 | [Stage name] | [Decision criteria] |
| PainPoint1 | [Stage name] | [Specific friction] |
| End | [Final stage] | [Outcome] |

## Validation Checklist

- [ ] All journey stages represented in diagram
- [ ] All decision points from journey included
- [ ] All pain points marked in diagram
- [ ] No invented steps absent from journey
- [ ] Mermaid syntax validated
- [ ] All branches have resolution paths
