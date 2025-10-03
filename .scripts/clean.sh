#!/usr/bin/env bash

# ===============================
# Clean Script for Nx Workspace
# ===============================
# This script resets Nx, runs all clean targets, and deletes common build/output directories.
# It is safe to run multiple times and will not delete node_modules, .git, or .yarn.
#
# Usage: ./clean.sh [options]
#
# Options:
#   -h, --help     Show this help message and exit
#   -y, --yes      Run non-interactively (do not prompt for confirmation)
#
# Examples:
#   ./clean.sh
#   ./clean.sh --yes
# ===============================

set -e

# =========================
#  SIGNAL HANDLING
# =========================
trap 'echo -e "\nAborted by user (Ctrl+C). Exiting."; exit 130' INT

# =========================
#  PATHS & UTILITIES
# =========================
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$PROJECT_DIR/.scripts"
source "$SCRIPT_DIR/utils.sh"

# =========================
#  HELP MESSAGE
# =========================
show_help() {
    echo -e "${BOLD}Visionarai-one Script - clean.sh${RESET}"
    echo -e "Usage: $0 [options]"
    echo -e "Options:"
    echo -e "  -h, --help     Show this help message and exit"
    echo -e "  -y, --yes      Run non-interactively (do not prompt for confirmation)"
    echo -e "Examples:"
    echo -e "  $0"
    echo -e "  $0 --yes"
}

# =========================
#  ARGUMENT PARSING
# =========================
YES_MODE=0
while [[ $# -gt 0 ]]; do
    case $1 in
    -h | --help)
        show_help
        exit 0
        ;;
    -y | --yes)
        YES_MODE=1
        shift
        ;;
    *)
        LogError "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
done

# =========================
#  INTERACTIVE CONFIRMATION
# =========================
if [[ $YES_MODE -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  This will reset Nx, run all clean targets, and delete build/output directories. Continue? [y/N]${RESET}"
    read -r -p "Proceed with cleanup? [y/N]: " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        LogWarn "Cleanup aborted by user."
        exit 0
    fi
fi

# Step 1: Reset Nx state
LogInfo "Resetting Nx state..."
yarn nx reset

# Step 2: Run all 'clean' targets in parallel
LogInfo "Running all Nx 'clean' targets in parallel..."
yarn nx run-many --target=clean --all --parallel

# Step 3: Delete common output and cache directories
LogInfo "Deleting build, cache, and temp directories (dist, coverage, .next, .turbo, tmp, .nx, .docusaurus)..."

# List of directory names to clean
CLEAN_DIRS=(
    "dist"
    "coverage"
    ".next"
    ".turbo"
    "tmp"
    ".nx"
    ".docusaurus"
    ".netlify"
)

# Find and delete directories, skipping node_modules, .git, and .yarn
DELETED_DIRS=()
for dir_name in "${CLEAN_DIRS[@]}"; do
    while IFS= read -r -d $'\0' dir; do
        if [ -d "$dir" ]; then
            LogWarn "Deleting directory: $dir"
            rm -rf "$dir"
            DELETED_DIRS+=("$dir")
        fi
    done < <(find . -type d -name "$dir_name" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/.yarn/*" \
        -prune -print0)
done

if [ ${#DELETED_DIRS[@]} -eq 0 ]; then
    LogWarn "No directories found to delete."
else
    LogInfo "Cleanup complete. Deleted ${#DELETED_DIRS[@]} directories."
fi
