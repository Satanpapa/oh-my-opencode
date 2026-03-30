# Autopilot Skill

## When to activate
Triggered by: `autopilot:` prefix on user message

## Behavior Protocol

### Phase 1: PLAN (think before acting)
- Read relevant files to understand current state
- Identify all components that need to be built or modified
- Create a numbered execution checklist
- Estimate 3 potential blockers and mitigation

### Phase 2: IMPLEMENT (execute completely)
- Work through the checklist systematically
- Spawn specialist subagents for domain-specific work:
  - Architecture decisions → @architect
  - Tests → @tester  
  - Security review → @security
  - Documentation → @docs-writer
- Never stop mid-implementation

### Phase 3: VERIFY (confirm it works)
- Run the test suite
- Check for TypeScript/linting errors
- Verify the happy path manually (bash commands)
- Confirm edge cases are handled

### Phase 4: REPORT (concise summary)
```
## ✅ Autopilot Complete

**Built:** [what was created]
**Modified:** [list of changed files]
**Tests:** [test results]
**How to use:** [1-2 sentence usage guide]
```

## Rules
- Never ask clarifying questions mid-execution (make best judgment)
- If blocked, try 3 different approaches before stopping
- Parallel-execute independent tasks using Task tool
- Tests must pass before declaring done
