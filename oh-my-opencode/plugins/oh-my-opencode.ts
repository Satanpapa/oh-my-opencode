import type { Plugin } from "@opencode-ai/plugin"

// ============================================================
// oh-my-opencode — Multi-agent orchestration for OpenCode
// Inspired by oh-my-claudecode by Yeachan-Heo
// ============================================================

const VERSION = "1.0.0"

// Magic keywords → execution modes
const MAGIC_KEYWORDS = {
  autopilot: "🤖 AUTOPILOT",
  ralph: "💪 RALPH (persistence)",
  ulw: "⚡ ULTRAPILOT (parallel)",
  ultrapilot: "⚡ ULTRAPILOT (parallel)",
  eco: "🌿 ECOMODE (token-efficient)",
  ecomode: "🌿 ECOMODE (token-efficient)",
  swarm: "🐝 SWARM (coordinated)",
  pipeline: "🔗 PIPELINE (sequential)",
  plan: "🗺️  PLAN (no changes)",
} as const

// Session state tracker (in-memory per session)
interface SessionState {
  mode: string
  startTime: number
  toolCalls: number
  filesEdited: Set<string>
  tasksSpawned: number
}

const sessionStates = new Map<string, SessionState>()

function detectMode(prompt: string): string | null {
  const lower = prompt.toLowerCase().trim()
  for (const [keyword, label] of Object.entries(MAGIC_KEYWORDS)) {
    if (lower.startsWith(keyword + ":") || lower.startsWith(keyword + " ")) {
      return label
    }
    if (lower === keyword) return label
  }
  return null
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export const OhMyOpencode: Plugin = async ({ project, client, $, directory }) => {
  // Log startup
  await client.app.log({
    body: {
      service: "oh-my-opencode",
      level: "info",
      message: `oh-my-opencode v${VERSION} loaded`,
      extra: { directory, project: project?.name ?? "unknown" },
    },
  })

  return {
    // ─── Session lifecycle ────────────────────────────────────────────

    "session.created": async ({ event }) => {
      const sessionId = (event as any).properties?.sessionID
      if (!sessionId) return
      sessionStates.set(sessionId, {
        mode: "build",
        startTime: Date.now(),
        toolCalls: 0,
        filesEdited: new Set(),
        tasksSpawned: 0,
      })
    },

    "session.idle": async ({ event }) => {
      const sessionId = (event as any).properties?.sessionID
      const state = sessionId ? sessionStates.get(sessionId) : null
      const elapsed = state ? formatDuration(Date.now() - state.startTime) : "?"
      const edits = state?.filesEdited.size ?? 0
      const tools = state?.toolCalls ?? 0

      // Desktop notification (cross-platform)
      const msg = `✅ Done! ${tools} tool calls · ${edits} files · ${elapsed}`
      try {
        // macOS
        await $`which osascript && osascript -e 'display notification "${msg}" with title "oh-my-opencode"'`.quiet()
      } catch {
        try {
          // Linux (libnotify)
          await $`which notify-send && notify-send "oh-my-opencode" "${msg}"`.quiet()
        } catch {
          // Fallback: TUI toast
          await client.app.log({
            body: { service: "oh-my-opencode", level: "info", message: msg },
          })
        }
      }
    },

    "session.error": async ({ event }) => {
      const err = (event as any).properties?.error ?? "unknown error"
      try {
        await $`which osascript && osascript -e 'display notification "❌ Error: ${err}" with title "oh-my-opencode"'`.quiet()
      } catch {
        try {
          await $`which notify-send && notify-send "oh-my-opencode ❌" "${err}"`.quiet()
        } catch {
          // silent
        }
      }
    },

    // ─── Tool tracking ────────────────────────────────────────────────

    "tool.execute.before": async (input, output) => {
      // Track session state
      const sessionId = (input as any).sessionID
      if (sessionId && sessionStates.has(sessionId)) {
        const state = sessionStates.get(sessionId)!
        state.toolCalls++

        // Track file edits
        if (["write", "edit", "patch"].includes(input.tool)) {
          const filePath = (output as any).args?.filePath ?? (output as any).args?.path
          if (filePath) state.filesEdited.add(filePath)
        }

        // Track subagent spawns
        if (input.tool === "task") {
          state.tasksSpawned++
        }
      }

      // ── .env protection ──────────────────────────────────────────
      if (input.tool === "read") {
        const filePath = (output as any).args?.filePath ?? ""
        if (/\.env(\.|$)/i.test(filePath) && !filePath.includes(".env.example")) {
          throw new Error(
            "[oh-my-opencode] Blocked: reading .env files is not allowed. " +
            "Use .env.example as a reference."
          )
        }
      }

      // ── Dangerous command guard ───────────────────────────────────
      if (input.tool === "bash") {
        const cmd: string = (output as any).args?.command ?? ""
        const dangerous = [
          /\brm\s+-rf\s+\/\b/,
          /\bsudo\s+rm\s+-rf/,
          /:\(\)\s*\{.*\}/,          // fork bomb
          />\s*\/dev\/sda/,
          /dd\s+if=\/dev\/zero\s+of=\/dev\/(sd|hd)/,
        ]
        for (const pattern of dangerous) {
          if (pattern.test(cmd)) {
            throw new Error(`[oh-my-opencode] Blocked dangerous command: ${cmd}`)
          }
        }
      }
    },

    "tool.execute.after": async (input, output) => {
      // Log slow tool calls (>10s)
      const duration = (output as any).duration ?? 0
      if (duration > 10_000) {
        await client.app.log({
          body: {
            service: "oh-my-opencode",
            level: "warn",
            message: `Slow tool call: ${input.tool} took ${formatDuration(duration)}`,
          },
        })
      }
    },

    // ─── File tracking ────────────────────────────────────────────────

    "file.edited": async ({ event }) => {
      const file = (event as any).properties?.file
      if (!file) return
      // Could integrate with git status tracking here
    },

    // ─── Compaction: inject persistent context ────────────────────────

    "experimental.session.compacting": async (input, output) => {
      const sessionId = (input as any).sessionID
      const state = sessionId ? sessionStates.get(sessionId) : null

      const contextBlocks: string[] = []

      if (state) {
        contextBlocks.push(`
## oh-my-opencode Session State
- **Execution mode**: ${state.mode}
- **Tool calls so far**: ${state.toolCalls}
- **Files edited**: ${state.filesEdited.size > 0 ? [...state.filesEdited].join(", ") : "none"}
- **Subagents spawned**: ${state.tasksSpawned}
- **Session duration**: ${formatDuration(Date.now() - state.startTime)}
`)
      }

      contextBlocks.push(`
## oh-my-opencode Orchestration Rules
You are operating under oh-my-opencode orchestration. Key rules:
- Magic keywords trigger execution modes: autopilot, ralph, ulw/ultrapilot, eco/ecomode, swarm, pipeline
- You have access to specialized subagents: @architect, @researcher, @debugger, @tester, @security, @performance, @docs-writer, @refactorer, @reviewer, @devops, @frontend, @api-designer, @database
- Always verify completion: run tests, check for errors, confirm expected behavior
- In RALPH mode: never give up, retry with different approaches if blocked
- In ULTRAPILOT mode: spawn parallel subagents for independent tasks
`)

      output.context.push(...contextBlocks)
    },

    // ─── Shell: inject helpful env vars ──────────────────────────────

    "shell.env": async (input, output) => {
      output.env.OH_MY_OPENCODE_VERSION = VERSION
      output.env.OH_MY_OPENCODE_DIR = directory
    },

    // ─── Custom tools ─────────────────────────────────────────────────

    tool: {
      // omc-status: show current session stats
      "omc-status": {
        description: "Show oh-my-opencode session statistics: mode, tool calls, files edited, duration",
        args: {} as any,
        execute: async (_args: Record<string, never>, context: { directory: string; worktree: string }) => {
          const states = [...sessionStates.entries()]
          if (states.length === 0) return "No active sessions tracked."

          const lines: string[] = ["## oh-my-opencode Session Status\n"]
          for (const [id, state] of states) {
            lines.push(
              `**Session** \`${id.slice(0, 8)}\``,
              `- Mode: ${state.mode}`,
              `- Tool calls: ${state.toolCalls}`,
              `- Files edited: ${state.filesEdited.size}`,
              `- Subagents spawned: ${state.tasksSpawned}`,
              `- Duration: ${formatDuration(Date.now() - state.startTime)}`,
              ""
            )
          }
          return lines.join("\n")
        },
      },

      // omc-version: print version info
      "omc-version": {
        description: "Show oh-my-opencode version information",
        args: {} as any,
        execute: async (_args: Record<string, never>) => {
          return `oh-my-opencode v${VERSION}\nInspired by oh-my-claudecode by Yeachan-Heo\nhttps://github.com/YOUR_USERNAME/oh-my-opencode`
        },
      },

      // omc-modes: show available execution modes
      "omc-modes": {
        description: "List all available oh-my-opencode execution modes and their magic keywords",
        args: {} as any,
        execute: async (_args: Record<string, never>) => {
          return `## oh-my-opencode Execution Modes

| Keyword | Mode | Description |
|---------|------|-------------|
| \`autopilot:\` | 🤖 Autopilot | Full autonomous: plan → implement → verify |
| \`ralph:\` | 💪 Ralph | Persistence mode: never give up, retry forever |
| \`ulw\` / \`ultrapilot:\` | ⚡ Ultrapilot | Parallel execution across multiple subagents |
| \`eco:\` / \`ecomode:\` | 🌿 Ecomode | Token-efficient: uses lighter models |
| \`swarm:\` | 🐝 Swarm | Coordinated parallel agents on shared goal |
| \`pipeline:\` | 🔗 Pipeline | Sequential agent chain: output feeds next |
| \`plan\` | 🗺️  Plan | Analysis only, no code changes |

**Examples:**
\`\`\`
autopilot: build a REST API for user management
ralph: fix all TypeScript errors in the project
ulw add tests for all untested functions
eco: refactor the database module
swarm: implement the full payment flow
pipeline: analyze → design → implement → test the auth system
\`\`\``
        },
      },
    },
  }
}
