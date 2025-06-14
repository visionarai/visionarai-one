#!/usr/bin/env bash

# ===============================
# Clean Script for Nx Workspace
# ===============================
# This script resets Nx, runs all clean targets, and deletes common build/output directories.
# It is safe to run multiple times and will not delete node_modules, .git, or .yarn.

set -e

# Step 1: Reset Nx state
printf "\033[1;34m[INFO]\033[0m Resetting Nx state...\n"
yarn nx reset

# Step 2: Run all 'clean' targets in parallel
printf "\033[1;34m[INFO]\033[0m Running all Nx 'clean' targets in parallel...\n"
yarn nx run-many --target=clean --all --parallel

# Step 3: Delete common output and cache directories
printf "\033[1;34m[INFO]\033[0m Deleting build, cache, and temp directories (dist, coverage, .next, .turbo, tmp, .nx, .docusaurus)...\n"

# List of directory names to clean
CLEAN_DIRS=(
    "dist"
    "coverage"
    ".next"
    ".turbo"
    "tmp"
    ".nx"
    ".docusaurus"
)

# Find and delete directories, skipping node_modules, .git, and .yarn
FOUND=0
for dir_name in "${CLEAN_DIRS[@]}"; do
    find . -type d -name "$dir_name" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/.yarn/*" \
        -prune -print0 | while IFS= read -r -d $'\0' dir; do
        if [ -d "$dir" ]; then
            echo "Deleting directory: $dir"
            rm -rf "$dir"
            FOUND=1
        fi
    done
done

if [ $FOUND -eq 0 ]; then
    printf "\033[1;33m[WARN]\033[0m No directories found to delete.\n"
else
    printf "\033[1;32m[SUCCESS]\033[0m Cleanup complete.\n"
fi
