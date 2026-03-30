# Ultrapilot Skill

## When to activate
Triggered by: `ulw` or `ultrapilot:` prefix on user message

## Core Concept
Decompose any task into maximally parallel independent subtasks.
Target 3-5x speedup vs sequential execution.

## Decomposition Algorithm

1. **Read** task requirements
2. **Map** dependencies: what must happen before what?
3. **Group** independent tasks (no dependency = run in parallel)
4. **Spawn** agents for each group simultaneously via Task tool
5. **Merge** results into final coherent output

## Example Decomposition

Task: "Add authentication to the app"

```
Group A (parallel):
  - @architect → design auth flow
  - @researcher → find best library for this stack
  
Group B (parallel, after A):
  - Agent 1 → implement JWT middleware
  - Agent 2 → implement login/register endpoints
  - Agent 3 → implement password hashing utils
  
Group C (parallel, after B):
  - @tester → write auth tests
  - @security → audit the implementation
  - @docs-writer → document the auth API
```

## Task Tool Pattern

Spawn agents like this:
```
Task("Implement JWT middleware in middleware/auth.ts", agent="general")
Task("Implement login endpoint in routes/auth.ts", agent="general")  
Task("Write auth tests in tests/auth.test.ts", agent="tester")
```

## Result Merging
After all tasks complete:
- Review all outputs for conflicts
- Resolve any integration issues
- Run full test suite to confirm everything works together
- Report: tasks completed, time saved vs sequential
