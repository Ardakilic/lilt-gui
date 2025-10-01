#!/bin/bash

# Lilt GUI Docker Setup Script
# This script sets up everything you need to develop with Docker

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          Lilt GUI - Docker Development Setup                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "→ Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    echo "  Please start Docker Desktop and try again"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Check OS
echo "→ Detecting operating system..."
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Windows;;
    MINGW*)     MACHINE=Windows;;
    *)          MACHINE="UNKNOWN:${OS}"
esac
echo -e "${GREEN}✓ Detected: ${MACHINE}${NC}"
echo ""

# Install dependencies
echo "→ Installing dependencies using Docker..."
make install
echo ""

# Setup X11 for GUI (Linux/macOS only)
if [ "$MACHINE" = "Linux" ] || [ "$MACHINE" = "Mac" ]; then
    echo "→ Setting up X11 for GUI development..."
    
    if [ "$MACHINE" = "Mac" ]; then
        echo ""
        echo -e "${YELLOW}macOS Setup Required:${NC}"
        echo "  1. Install XQuartz: https://www.xquartz.org/"
        echo "  2. Open XQuartz"
        echo "  3. In XQuartz preferences: Security > Enable 'Allow connections from network clients'"
        echo "  4. Run: xhost + localhost"
        echo ""
        echo "  After completing these steps, you can run Tauri dev with Docker."
        echo ""
        
        # Check if XQuartz is installed
        if command -v xquartz &> /dev/null; then
            echo -e "${GREEN}✓ XQuartz is installed${NC}"
            
            # Try to enable xhost
            if xhost + localhost > /dev/null 2>&1; then
                echo -e "${GREEN}✓ xhost configured${NC}"
            else
                echo -e "${YELLOW}⚠ Please run: xhost + localhost${NC}"
            fi
        else
            echo -e "${YELLOW}⚠ XQuartz not found. Please install it.${NC}"
        fi
    else
        # Linux
        echo -e "${GREEN}✓ Linux detected - X11 should work out of the box${NC}"
        
        # Enable xhost for Docker
        if xhost + local:docker > /dev/null 2>&1; then
            echo -e "${GREEN}✓ xhost configured for Docker${NC}"
        else
            echo -e "${YELLOW}⚠ Could not configure xhost. You may need to run: xhost + local:docker${NC}"
        fi
    fi
    echo ""
fi

# Build Tauri Docker image
echo "→ Building Tauri development Docker image..."
echo "  This may take a few minutes on first run..."
make build-tauri-image
echo ""

# Test the setup
echo "→ Testing the setup..."
echo "  Running linter..."
if make lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Linter works${NC}"
else
    echo -e "${YELLOW}⚠ Linter check skipped (no source files yet)${NC}"
fi
echo ""

# Success!
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! 🎉                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Available commands:"
echo ""
echo "  ${GREEN}Frontend Development:${NC}"
echo "    make dev-frontend          # Start Vite dev server in Docker"
echo "    make quick-dev             # Quick frontend dev (alias)"
echo ""
echo "  ${GREEN}Tauri Development:${NC}"
if [ "$MACHINE" = "Linux" ] || [ "$MACHINE" = "Mac" ]; then
    echo "    make dev-tauri             # Start Tauri dev with GUI in Docker"
    echo "    make dev                   # Start full stack with docker-compose"
else
    echo "    ${YELLOW}Tauri dev in Docker requires Linux or macOS with X11${NC}"
    echo "    For Windows, please install Node.js and Rust locally"
fi
echo ""
echo "  ${GREEN}Testing & Quality:${NC}"
echo "    make test                  # Run tests in Docker"
echo "    make test-coverage         # Run tests with coverage"
echo "    make lint                  # Run linter"
echo "    make format                # Format code"
echo ""
echo "  ${GREEN}Building:${NC}"
echo "    make build                 # Build frontend in Docker"
echo "    make build-tauri           # Build Tauri app in Docker"
echo ""
echo "  ${GREEN}Utilities:${NC}"
echo "    make clean                 # Clean build artifacts"
echo "    make docker-shell          # Open shell in container"
echo "    make help                  # Show all commands"
echo "    make info                  # Show project info"
echo ""
echo "Quick start:"
echo "  ${GREEN}make dev-frontend${NC}  or  ${GREEN}make dev${NC}"
echo ""
echo "For more information, see:"
echo "  - README.md"
echo "  - NEXT_STEPS.md"
echo "  - DOCKER_GUIDE.md"
echo ""
