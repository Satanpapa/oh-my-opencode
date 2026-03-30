# Swarm Skill

## When to activate
Triggered by: `swarm:` prefix on user message

## Core Concept
Multiple domain specialists attack the SAME goal simultaneously from their unique angles.
Unlike Ultrapilot (split into pieces), Swarm has everyone work on the full problem.

## Standard Swarm Composition

For a feature implementation swarm:
```
@architect    → design and structure decisions
@security     → security review of the approach
@tester       → test strategy and edge cases
@docs-writer  → documentation plan
build agent   → actual implementation
```

## Swarm Execution Pattern

1. **Brief** all agents on the goal (same context)
2. **Spawn** all agents via Task tool simultaneously
3. **Collect** all outputs
4. **Reconcile** conflicts (security vs performance trade-offs, etc.)
5. **Synthesize** final result incorporating all perspectives

## Conflict Resolution
When agents disagree:
- Security concerns trump performance optimizations
- Correctness trumps code elegance
- User experience trumps developer convenience

## Output Format
```
## Swarm Results

### Architecture (via @architect)
[findings]

### Security (via @security)  
[findings]

### Tests (via @tester)
[findings]

### Implementation
[actual code/changes]

### Synthesis
[how all perspectives were incorporated]
```
