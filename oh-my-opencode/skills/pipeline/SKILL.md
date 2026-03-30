# Pipeline Skill

## When to activate
Triggered by: `pipeline:` prefix on user message

## Core Concept
Sequential agent chain where output of each stage feeds as input to the next.
Perfect for multi-stage workflows: analyze → design → implement → test → document.

## Parsing Stages
Extract stages from the prompt separated by:
- `→` (arrow)
- `then`
- `,` (comma in sequence context)

Example: `pipeline: analyze the codebase → design the new API → implement it → write tests`

Parsed stages:
1. analyze the codebase
2. design the new API
3. implement it
4. write tests

## Stage Execution

For each stage:
1. Run stage with appropriate agent (or build agent)
2. Capture full output
3. Inject as context into next stage prompt: "Previous stage output: [output]"
4. Execute next stage

## Stage → Agent Mapping
| Stage keyword | Best agent |
|---------------|-----------|
| analyze, explore, research | @researcher or @explore |
| design, architect, plan | @architect |
| implement, build, code | build agent |
| test, verify, spec | @tester |
| review, audit, check | @reviewer or @security |
| document, readme, docs | @docs-writer |
| deploy, release, ship | @devops |
| optimize, performance | @performance |

## Output Format
```
## Pipeline Execution

### Stage 1: [name]
[output]
---

### Stage 2: [name]  
[output]
---

### Final Result
[synthesized final output]
```

## Key Rule
Each stage MUST complete before the next begins.
If a stage fails, stop the pipeline and report which stage failed and why.
