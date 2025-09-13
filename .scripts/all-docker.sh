# find and run all docker compose files in the PLATFORM_SETUP sub dir
# supports 3 commands up, down, ps, pull, clean

# Define colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Allow overriding base directory through environment variable
BASE_DIR=${PLATFORM_SETUP_DIR:-"./PLATFORM_SETUP"}

print_separator() {
  echo
  echo "----------------------------------------"
  [ ! -z "$1" ] && echo -e "$1"
}

ALLOWED_COMMANDS="up down ps clean pull"
COMMAND=$1

# Validate docker is installed
if ! command -v docker &>/dev/null; then
  echo -e "${RED}Error: docker is not installed${NC}"
  exit 1
fi

# Validate if docker daemon is running
if ! docker info &>/dev/null; then
  echo -e "${RED}Error: Docker daemon is not running${NC}"
  exit 1
fi

# Validate docker-compose is installed
if ! command -v docker compose &>/dev/null; then
  echo -e "${RED}Error: docker compose is not installed${NC}"
  exit 1
fi

# Validate base directory exists
if [ ! -d "$BASE_DIR" ]; then
  echo -e "${RED}Error: Directory $BASE_DIR does not exist${NC}"
  exit 1
fi

ALL_DOCKER_COMPOSE_FILES=$(find "$BASE_DIR" -name "docker-compose.yml")

if [ -z "$ALL_DOCKER_COMPOSE_FILES" ]; then
  echo -e "${RED}No docker-compose files found in $BASE_DIR${NC}"
  exit 1
fi

TEXT_LOGO="
${GREEN}
  ____ _     _____    _    _   _      ____   ___   ____ _  _______ ____
 / ___| |   | ____|  / \  | \ | |    |  _ \ / _ \ / ___| |/ / ____|  _ \\
| |   | |   |  _|   / _ \ |  \| |    | | | | | | | |   | ' /|  _| | |_) |
| |___| |___| |___ / ___ \| |\  |    | |_| | |_| | |___| . \| |___|  _ <
 \____|_____|_____/_/   \_\_| \_|    |____/ \___/ \____|_|\_\_____|_| \_\\
${NC}
"

HELP_TEXT_PARAGRAPH="
${GREEN}Available commands:${NC}

${BLUE}up${NC}:    starts all docker compose files in the $BASE_DIR sub dir
${BLUE}down${NC}:  stops all docker compose files in the $BASE_DIR sub dir
${BLUE}ps${NC}:    lists all docker compose files in the $BASE_DIR sub dir
${BLUE}pull${NC}:  pulls all docker compose files in the $BASE_DIR sub dir
${BLUE}clean${NC}: deletes all data directories in the $BASE_DIR sub dir
${BLUE}help${NC}:  shows this help text
"

echo -e "$TEXT_LOGO"
print_separator "Found docker compose files:"
echo -e "$ALL_DOCKER_COMPOSE_FILES"
print_separator

if [ -z "$COMMAND" ] || [[ ! $ALLOWED_COMMANDS =~ $COMMAND ]]; then
  echo "HELP "
  echo -e "$HELP_TEXT_PARAGRAPH"
  exit 1
fi

# function to take a file path and return the path of the directory and data directory
get_data_dir() {
  local file_path=$1
  local dir_path=$(dirname "$file_path")
  local data_dir="$dir_path/data"
  echo "$data_dir"
}

# Function to execute docker-compose command
execute_docker_compose() {
  local file=$1
  local cmd=$2
  print_separator "Processing $file..."

  if [ "$cmd" == "up" ]; then
    if ! docker-compose -f "$file" up -d; then
      echo -e "${RED}Failed to execute $cmd for $file${NC}"
      return 1
    fi
  elif [ "$cmd" == "down" ]; then
    if ! docker-compose -f "$file" down -v; then
      echo -e "${RED}Failed to execute $cmd for $file${NC}"
      return 1
    fi
  else
    if ! docker-compose -f "$file" "$cmd"; then
      echo -e "${RED}Failed to execute $cmd for $file${NC}"
      return 1
    fi
  fi
  echo -e "${GREEN}Successfully executed $cmd for $file${NC}"
}

# Execute commands
for DOCKER_COMPOSE_FILE in $ALL_DOCKER_COMPOSE_FILES; do
  if [ "$COMMAND" == "clean" ]; then
    DATA_DIR=$(get_data_dir "$DOCKER_COMPOSE_FILE")
    echo "Data dir: $DATA_DIR"
    if [ -d "$DATA_DIR" ]; then
      print_separator "Cleaning data directory $DATA_DIR"
      rm -rf "$DATA_DIR"/*
    fi

  else
    execute_docker_compose "$DOCKER_COMPOSE_FILE" "$COMMAND"
  fi
done

print_separator "${GREEN}All operations completed${NC}"
