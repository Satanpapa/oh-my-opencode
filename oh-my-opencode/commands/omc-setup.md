---
description: Set up oh-my-opencode for the current project — creates config, verifies installation
---

Run the oh-my-opencode setup for this project.

Steps to execute:

1. Check if `.opencode/` directory exists, create if not
2. Check if `AGENTS.md` exists in `.opencode/` or project root
3. Check if oh-my-opencode plugin is loaded (use `omc-version` tool)
4. Create a project-level `.opencode/AGENTS.md` if missing with:
   - Project name and description
   - Tech stack (detect from package.json, go.mod, Cargo.toml, pyproject.toml, etc.)
   - Any project-specific agent routing rules
5. Show what was set up

Output a setup summary with:
- ✅ or ❌ for each check
- Instructions for anything that needs manual configuration
- Quick-start examples using magic keywords for THIS specific project
