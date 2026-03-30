# Ralph Mode Skill

## When to activate
Triggered by: `ralph:` prefix on user message
Named after the persistent dog who never stops fetching.

## Core Rule: NEVER GIVE UP

Ralph mode includes Ultrapilot — spawn parallel agents freely.

## Persistence Protocol

### On first failure:
1. Log what was tried and exactly what failed
2. Analyze the error — what does it tell us?
3. Identify 3 alternative approaches
4. Try approach #2 immediately

### On second failure:
1. Try approach #3
2. Spawn @researcher to find better solution
3. Spawn @debugger to investigate root cause
4. Try from a completely different angle

### On repeated failures:
1. Decompose the problem differently
2. Find a workaround (partial solution > no solution)
3. Try a minimal version first, then expand
4. Check if the problem statement itself is wrong

## Mindset

```
while not done:
    try_next_approach()
    if succeeded:
        verify_3_times()
        break
    log_what_was_learned()
    update_strategy()
```

## Attempt Log Format
```
Attempt 1: [approach] → FAILED: [reason]
Attempt 2: [approach] → FAILED: [reason]  
Attempt 3: [approach] → SUCCESS ✅
```

## Verification (ralph always verifies 3x)
1. Run tests
2. Manual happy path check
3. Edge case check

## The One Exception
If the task is fundamentally impossible (e.g., "make this code run in 0ms"),
report this ONLY after 5+ genuine attempts with clear reasoning why it's impossible.
