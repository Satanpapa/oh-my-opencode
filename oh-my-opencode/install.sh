#!/usr/bin/env bash
# oh-my-opencode installer
# Usage: curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-opencode/main/install.sh | bash

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Config ───────────────────────────────────────────────────────────────────
REPO="YOUR_USERNAME/oh-my-opencode"
BRANCH="main"
RAW_BASE="https://raw.githubusercontent.com/${REPO}/${BRANCH}"
OPENCODE_CONFIG="${HOME}/.config/opencode"

log()     { echo -e "${BOLD}${BLUE}[omc]${NC} $*"; }
success() { echo -e "${BOLD}${GREEN}[omc]${NC} ✅ $*"; }
warn()    { echo -e "${BOLD}${YELLOW}[omc]${NC} ⚠️  $*"; }
error()   { echo -e "${BOLD}${RED}[omc]${NC} ❌ $*" >&2; exit 1; }

# ─── Banner ───────────────────────────────────────────────────────────────────
echo -e "${CYAN}"
cat << 'EOF'
  ___  _   _  __  __  __  __     ___  ____  ____  _  _  ___  ___  ____  ____ 
 / _ \| |_| ||  \/  ||  \/  |_  / _ \|  _ \| ___|| \| |/ __/ _ \|  _ \| ___|
| | | |  _  || |\/| || |\/| \ \| | | | |_) | _|  | .` | (_| | | | | | | _|  
 \___/|_| |_||_|  |_||_|  |_|\_\\___/|  __/|_____|_|\_|\___\___/|_| |_|_____|
                                        |_|                                     
EOF
echo -e "${NC}"
log "oh-my-opencode installer v1.0.0"
echo ""

# ─── Check dependencies ───────────────────────────────────────────────────────
check_dep() {
  command -v "$1" &>/dev/null || error "$1 is required but not installed."
}

check_dep curl
check_dep opencode 2>/dev/null || warn "opencode CLI not found in PATH — install it from https://opencode.ai"

# ─── Create config directories ────────────────────────────────────────────────
log "Creating config directories..."
mkdir -p "${OPENCODE_CONFIG}/plugins"
mkdir -p "${OPENCODE_CONFIG}/agents"
mkdir -p "${OPENCODE_CONFIG}/skills/autopilot"
mkdir -p "${OPENCODE_CONFIG}/skills/ultrapilot"
mkdir -p "${OPENCODE_CONFIG}/skills/ecomode"
mkdir -p "${OPENCODE_CONFIG}/skills/ralph"
mkdir -p "${OPENCODE_CONFIG}/skills/swarm"
mkdir -p "${OPENCODE_CONFIG}/skills/pipeline"
mkdir -p "${OPENCODE_CONFIG}/commands"
success "Directories ready"

# ─── Download plugin ─────────────────────────────────────────────────────────
log "Downloading plugin..."

download() {
  local src="$1" dst="$2"
  curl -fsSL "${RAW_BASE}/${src}" -o "${dst}" || error "Failed to download ${src}"
}

# Main plugin
download "plugins/oh-my-opencode.ts" "${OPENCODE_CONFIG}/plugins/oh-my-opencode.ts"
success "Plugin downloaded"

# AGENTS.md
if [[ -f "${OPENCODE_CONFIG}/AGENTS.md" ]]; then
  warn "AGENTS.md already exists — backing up to AGENTS.md.bak"
  cp "${OPENCODE_CONFIG}/AGENTS.md" "${OPENCODE_CONFIG}/AGENTS.md.bak"
fi
download "AGENTS.md" "${OPENCODE_CONFIG}/AGENTS.md"
success "AGENTS.md installed"

# ─── Download agents ─────────────────────────────────────────────────────────
log "Downloading specialized agents..."

AGENTS=(
  "architect" "researcher" "debugger" "tester" "security"
  "performance" "docs-writer" "refactorer" "reviewer"
  "devops" "frontend" "api-designer" "database" "orchestrator"
)

for agent in "${AGENTS[@]}"; do
  download "agents/${agent}.md" "${OPENCODE_CONFIG}/agents/${agent}.md"
  echo -e "  ${GREEN}✓${NC} @${agent}"
done
success "All agents installed"

# ─── Download skills ─────────────────────────────────────────────────────────
log "Downloading skills..."

SKILLS=("autopilot" "ultrapilot" "ecomode" "ralph" "swarm" "pipeline")
for skill in "${SKILLS[@]}"; do
  download "skills/${skill}/SKILL.md" "${OPENCODE_CONFIG}/skills/${skill}/SKILL.md"
  echo -e "  ${GREEN}✓${NC} ${skill}"
done
success "All skills installed"

# ─── Download commands ────────────────────────────────────────────────────────
log "Downloading commands..."

COMMANDS=("omc-help" "omc-status" "omc-setup")
for cmd in "${COMMANDS[@]}"; do
  download "commands/${cmd}.md" "${OPENCODE_CONFIG}/commands/${cmd}.md"
  echo -e "  ${GREEN}✓${NC} /${cmd}"
done
success "All commands installed"

# ─── Update opencode.json ──────────────────────────────────────────────────────
OPENCODE_JSON="${OPENCODE_CONFIG}/opencode.json"
log "Updating opencode.json..."

if [[ ! -f "${OPENCODE_JSON}" ]]; then
  cat > "${OPENCODE_JSON}" << 'JSON'
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-opencode"]
}
JSON
  success "Created opencode.json with plugin entry"
else
  # Check if plugin already in config
  if grep -q "oh-my-opencode" "${OPENCODE_JSON}" 2>/dev/null; then
    warn "oh-my-opencode already in opencode.json — skipping"
  else
    warn "opencode.json exists — please add manually:"
    echo -e '  ${YELLOW}"plugin": ["oh-my-opencode"]${NC}'
  fi
fi

# ─── Done! ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║  oh-my-opencode installed! 🚀         ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""
log "Quick start:"
echo ""
echo -e "  ${CYAN}autopilot: build a REST API for task management${NC}"
echo -e "  ${CYAN}ralph: fix all TypeScript errors${NC}"
echo -e "  ${CYAN}ulw add tests for all untested functions${NC}"
echo -e "  ${CYAN}eco: refactor the database module${NC}"
echo -e "  ${CYAN}/omc-help${NC}"
echo ""
log "Restart opencode to load the plugin."
