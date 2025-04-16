#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Store initial directory
INITIAL_DIR=$(pwd)

# Check if we're in scripts directory and navigate accordingly
if [[ $(basename $(pwd)) == "scripts" ]]; then
    cd ..
fi

echo "Starting race organizer (Python) server..."
cd python || {
    echo "Error: python directory not found"
    cd "$INITIAL_DIR"
    exit 1
}

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_DEBUG=1
python app.py &

# Store the Python server process ID
PYTHON_PID=$!

echo "Starting runner tracks (TypeScript) server..."
cd ../ts-web
npm install
npm run dev -- --no-clearScreen &

# Store the SvelteKit server process ID
SVELTE_PID=$!

# Sleep for 3 seconds
sleep 5

# Display the server URLs
echo -e "\n${GREEN}Race organizer (Python) server running at: http://localhost:5100${NC}"
echo -e "${GREEN}Runner tracks (TypeScript) server running at: http://localhost:5173${NC}\n"

echo "Ctl-C to stop the servers"

# Function to handle script termination
cleanup() {
    echo "Shutting down servers..."
    kill $PYTHON_PID
    kill $SVELTE_PID
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Keep the script running
wait