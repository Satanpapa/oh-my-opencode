# oh-my-opencode

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![OpenCode](https://img.shields.io/badge/opencode-plugin-blue)](https://opencode.ai)

**Multi-agent orchestration for [OpenCode](https://opencode.ai). Zero learning curve. Maximum power.**

Inspired by [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode).

---

## Quick Start

```bash
# One-line install
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-opencode/main/install.sh | bash

# Then restart opencode and run:
/omc-setup
```

That's it. Now just type naturally:

```
autopilot: build a REST API for task management
```

---

## Execution Modes

| Keyword | Mode | Use For |
|---------|------|---------|
| `autopilot:` | 🤖 Autopilot | Full autonomous: plan → implement → verify |
| `ralph:` | 💪 Ralph | Persistence: never gives up, retries forever |
| `ulw` / `ultrapilot:` | ⚡ Ultrapilot | Parallel agents: 3-5x faster |
| `eco:` / `ecomode:` | 🌿 Ecomode | Token-efficient: minimal output, fast |
| `swarm:` | 🐝 Swarm | Coordinated specialists on the same goal |
| `pipeline:` | 🔗 Pipeline | Sequential chain: each stage feeds the next |
| `plan` | 🗺️ Plan | Analysis only, no code changes |

### Examples

```bash
# Build an entire feature autonomously
autopilot: add user authentication with JWT to this Express app

# Never-stop persistence mode
ralph: fix all failing tests in the test suite

# Parallel execution (3-5x faster)
ulw add unit tests for every function in src/utils/

# Token-efficient refactoring
eco: extract all magic numbers to named constants

# Multiple specialists attack the same goal
swarm: implement the payment processing module

# Sequential pipeline
pipeline: audit the codebase → design improvements → implement → write tests

# Just planning, no changes
plan the database migration strategy
```

---

## Specialized Agents

Invoke explicitly with `@mention` or let the orchestrator auto-route:

| Agent | Specialty | Auto-triggers |
|-------|-----------|---------------|
| `@architect` | System design, tech decisions | "architecture", "design", "stack" |
| `@researcher` | Deep research, codebase analysis | "research", "find", "investigate" |
| `@debugger` | Bug hunting, root cause analysis | "bug", "error", "crash", "exception" |
| `@tester` | Test writing, coverage, QA | "test", "coverage", "spec" |
| `@security` | Security audits, vulnerabilities | "security", "auth", "vulnerability" |
| `@performance` | Profiling, optimization | "slow", "optimize", "latency" |
| `@docs-writer` | README, API docs, comments | "docs", "README", "documentation" |
| `@refactorer` | Code cleanup, patterns, DRY | "refactor", "clean", "DRY" |
| `@reviewer` | Code review, best practices | "review", "PR", "feedback" |
| `@devops` | Docker, CI/CD, deployment | "deploy", "docker", "CI/CD" |
| `@frontend` | UI/UX, React, CSS, a11y | "UI", "frontend", "CSS", "React" |
| `@api-designer` | REST/GraphQL/RPC design | "API", "endpoint", "REST" |
| `@database` | Schema, queries, migrations | "database", "schema", "query" |

### Manual invocation
```
@security audit the authentication module
@architect design a caching strategy for this API
@tester write comprehensive tests for the user service
```

---

## Plugin Features

The TypeScript plugin adds:

- **🔔 Notifications** — desktop alerts when sessions complete (`osascript` on macOS, `notify-send` on Linux)
- **🛡️ .env Protection** — automatically blocks reads of `.env` files
- **⚠️ Dangerous Command Guard** — blocks `rm -rf /`, fork bombs, disk wipe commands
- **📊 Session Tracking** — tracks tool calls, files edited, agents spawned
- **🗜️ Smart Compaction** — injects session context + omc rules when conversation compacts
- **🔧 Custom Tools** — `omc-status`, `omc-version`, `omc-modes` available to the AI

---

## Manual Installation

### Option 1: Copy files (recommended)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/oh-my-opencode
cd oh-my-opencode

# Create config dirs
mkdir -p ~/.config/opencode/{plugins,agents,skills,commands}

# Copy everything
cp AGENTS.md ~/.config/opencode/AGENTS.md
cp -r agents/* ~/.config/opencode/agents/
cp -r skills/* ~/.config/opencode/skills/
cp -r commands/* ~/.config/opencode/commands/
cp plugins/oh-my-opencode.ts ~/.config/opencode/plugins/
```

### Option 2: npm plugin (after publishing)

Add to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-opencode"]
}
```

### Project-level install

Same process but use `.opencode/` instead of `~/.config/opencode/`:

```bash
mkdir -p .opencode/{plugins,agents,skills,commands}
cp plugins/oh-my-opencode.ts .opencode/plugins/
cp -r agents/* .opencode/agents/
# etc.
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/omc-help` | Show all modes, agents, and keywords |
| `/omc-status` | Current session stats |
| `/omc-setup` | Set up oh-my-opencode for current project |

---

## File Structure

```
oh-my-opencode/
├── plugins/
│   └── oh-my-opencode.ts    # Main plugin (hooks, tools, protection)
├── agents/
│   ├── orchestrator.md      # Primary orchestrator (magic keyword routing)
│   ├── architect.md         # System design
│   ├── researcher.md        # Deep research
│   ├── debugger.md          # Bug hunting
│   ├── tester.md            # Test writing
│   ├── security.md          # Security auditing
│   ├── performance.md       # Optimization
│   ├── docs-writer.md       # Documentation
│   ├── refactorer.md        # Code cleanup
│   ├── reviewer.md          # Code review
│   ├── devops.md            # CI/CD & deployment
│   ├── frontend.md          # UI/UX
│   ├── api-designer.md      # API design
│   └── database.md          # DB schema & queries
├── skills/
│   ├── autopilot/SKILL.md
│   ├── ultrapilot/SKILL.md
│   ├── ecomode/SKILL.md
│   ├── ralph/SKILL.md
│   ├── swarm/SKILL.md
│   └── pipeline/SKILL.md
├── commands/
│   ├── omc-help.md
│   ├── omc-status.md
│   └── omc-setup.md
├── AGENTS.md                # Global orchestration rules
├── install.sh               # One-line installer
└── package.json             # npm package config
```

---

## vs oh-my-claudecode

| Feature | oh-my-claudecode | oh-my-opencode |
|---------|-----------------|----------------|
| Target | Claude Code | OpenCode |
| Install | `/plugin install` | bash script or npm |
| Agent routing | CLAUDE.md magic keywords | AGENTS.md + orchestrator agent |
| Plugin system | Claude Code hooks | OpenCode TypeScript plugin API |
| Agents | 32 agents | 13 specialized + orchestrator |
| Execution modes | 5 modes | 6 modes (+ pipeline) |
| Notifications | Via hooks | `session.idle` event |
| HUD | statusline | `omc-status` tool |
| Protection | File hooks | `tool.execute.before` |

---

## Requirements

- [OpenCode](https://opencode.ai) v0.1.0+
- An Anthropic API key, AWS Bedrock, or OpenCode Zen subscription

---

## Contributing

PRs welcome! Especially for:
- New specialized agents
- New execution modes
- Provider-specific optimizations
- Windows/WSL compatibility improvements

---

## License

MIT — fork it, remix it, ship it.

---

**Inspired by:** [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) by Yeachan-Heo
