---
mode: 'agent'
description: 'Add a new shell script to the Visionari-one project in the .scripts directory, following established conventions.'
---

- Ask the users about the requirements of the script if not already provided.

# Prompt: Add a New Shell Script to `.scripts`

## Purpose

This prompt guides you to add a new shell script to the `.scripts` directory of the Visionari-one project. The script should follow the conventions and structure established in existing scripts, especially `build_bundles.sh`.

## Instructions

1. **Script Location & Naming**

   - Place the new script in the `.scripts` directory at the project root.
   - Use a clear, descriptive filename (e.g., `my_task.sh`).

2. **Script Structure**

   - Start with a shebang (`#!/bin/bash`) and a comment header describing the script’s purpose and usage.
   - Use `set -e` to exit on error.
   - Add a signal handler for `Ctrl+C` (see `build_bundles.sh`).
   - Define all relevant paths and environment variables at the top.
   - Source [`.scripts/utils.sh`](../../.scripts/utils.sh) for logging, color, and helper functions.

```bash
#!/bin/bash
# ===============================
# <script_name>
# ===============================
# This script performs <describe the main task>.
# It is designed to be run in the Visionari-one project environment.
# It should be placed in the .scripts directory.
# ===============================


# Usage: ./<script_name> [options]

set -e

# =========================

# SIGNAL HANDLING

# =========================

trap 'echo -e "\nAborted by user (Ctrl+C). Exiting."; exit 130' INT

# =========================

# PATHS & ENVIRONMENT

# =========================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$PROJECT_DIR/.scripts"

# ... other paths as needed...

# =========================

# UTILITIES

# =========================

source "$SCRIPT_DIR/utils.sh"

# =========================

# DIRECTORY PREPARATION

# =========================

ensure_clean_dir <required_output_directory>

# =========================

# ENVIRONMENT VARIABLES

# =========================

if [[-f "$ENV_FILE"]]; then
source "$ENV_FILE"
else
LogWarn "Warning: .env file not found. Ensure environment variables are set."
fi
require_envs FIREBASE_APP_ID

# =========================

# HELP MESSAGE

# =========================

show_help() {
echo -e "${BOLD}Visionari-one Script - <script_name>${RESET}"
echo -e "Usage: $0 [options]"
echo -e "Options:"
echo -e " -h, --help Show this help message"
echo -e " -o, --output Specify output directory (default: <default_output_dir>)"
echo -e "Examples:"
echo -e " $0 --output /path/to/output"
}

```

3. **Reusable Logic**

- Place globally reusable functions in [`utils.sh`](../../.scripts/utils.sh).
- If the logic is specific to your script, define it within your script file.
- If a new set of utilities is needed for a group of scripts, create a new utility file in [`scripts`](../../.scripts) and source it as needed.

4. **Logging & Output**

- Use the logging helpers from `utils.sh` (`LogInfo`, `LogSuccess`, `LogWarn`, `LogError`) for all user-facing output.
- Use color and icons for clarity and consistency.

5. **Argument Parsing & Help**

- Provide a help message function (`show_help`) that describes usage, options, and examples.
- Parse arguments using a `while` loop and `case` statement.

6. **Directory & Environment Handling**

- Use `ensure_clean_dir` from `utils.sh` to prepare output directories if needed.
- Use `require_envs` to check for required environment variables.

7. **Execution Flow**

- Organize the script into logical sections with clear comments (e.g., `# BUILD EXECUTION`).
- Use spinner/progress indicators for long-running tasks via `run_with_spinner` from `utils.sh`.

8. **Exit Codes**

- Exit with a non-zero code on error, and with `0` on success.

---

By following these instructions, you will ensure that all shell scripts in the project are consistent, maintainable, and leverage shared utilities effectively.
