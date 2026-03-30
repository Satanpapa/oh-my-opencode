# Ecomode Skill

## When to activate
Triggered by: `eco:` or `ecomode:` prefix on user message

## Behavior: Maximum Efficiency

### Output rules (strict)
- Zero preamble — start doing immediately
- Zero summary unless explicitly requested
- Skip all "I'll now..." and "Let me..." phrases
- Report only errors and final result
- Prefer one-line bash over multi-line explanations

### Execution rules
- Targeted edits over full file rewrites
- Batch all changes to same file into one edit
- Use @explore for read-only codebase navigation (fast)
- Skip creating backups or intermediate files
- If a decision is obvious: make it, don't ask

### Model hints
In ecomode, prefer lighter/faster models for subagent tasks.
Use @explore (read-only) instead of @general when possible.

## Output Template (ecomode)
```
[action]: [result]
[action]: [result]
...
Done. [optional: 1 line if something important]
```

## Anti-patterns (never do in ecomode)
❌ "Great question! Let me analyze..."
❌ "I'll start by reading the files..."
❌ Rewriting entire files for small changes
❌ Creating example/test files nobody asked for
❌ Asking "should I also...?"
