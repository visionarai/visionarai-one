#!/bin/bash
# .scripts/utils.sh - Common shell utilities for Mqtizer scripts

# =========================
#  COLOR CODES
# =========================
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
RED="\033[1;31m"
RESET="\033[0m"
BOLD="\033[1m"
NC="\033[0m" # No Color

# =========================
#  LOGGING HELPERS
# =========================
LogInfo() {
    echo -e "${BLUE}ℹ️  [INFO]${RESET} $1"
}
LogSuccess() {
    echo -e "${GREEN}✅  [SUCCESS]${RESET} $1"
}
LogWarn() {
    echo -e "${YELLOW}⚠️  [WARN]${RESET} $1"
}
LogError() {
    echo -e "${RED}❌  [ERROR]${RESET} $1" >&2
}

# =========================
#  PROGRESS SPINNER
# =========================
spin() {
    local pid=$1
    local msg="$2"
    local spinstr='|/-\'
    local i=0
    tput civis
    while kill -0 $pid 2>/dev/null; do
        i=$(((i + 1) % 4))
        printf "\r${YELLOW}%s %s${RESET}" "${spinstr:$i:1}" "$msg"
        sleep 0.1
    done
    printf "\r"
    tput cnorm
}
# Usage: run_with_spinner <command> <message>
run_with_spinner() {
    (eval "$1") &
    local pid=$!
    spin $pid "$2"
    wait $pid
    return $?
}

# =========================
#  DIRECTORY CLEANER
# =========================
# Usage: ensure_clean_dir <dir_path>
ensure_clean_dir() {
    local dir="$1"
    mkdir -p "$dir"
    if [[ -n "$(ls -A "$dir" 2>/dev/null)" ]]; then
        LogWarn "The directory ${YELLOW}($dir)${NC} already contains files. Please clear it before proceeding."
        LogWarn "To clear the directory, run: rm -rf $dir/*"
        read -p "Do you want to clear the contents of $dir? (y/N): " confirm
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            rm -rf "$dir"
            mkdir -p "$dir"
            LogSuccess "Cleared contents of $dir."
        else
            LogError "Aborting process. Please clear the directory and try again."
            exit 1
        fi
    else
        LogInfo "No existing contents in $dir to clear."
    fi
}

# =========================
#  ENVIRONMENT CHECKER
# =========================
# Usage: require_envs VAR1 [VAR2 ...]
require_envs() {
    local missing=0
    for var in "$@"; do
        if [[ -z "${!var}" ]]; then
            LogError "$var is not set. Please set it in your .env file or environment."
            missing=1
        else
            LogInfo "Using $var: ${!var}"
        fi
    done
    if [[ $missing -eq 1 ]]; then
        exit 1
    fi
}
