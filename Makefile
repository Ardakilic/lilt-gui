.PHONY: help install dev dev-frontend dev-tauri build build-frontend build-tauri test lint format clean docker-build docker-dev docker-test docker-up docker-down

# Docker images
DOCKER_NODE_IMAGE := node:22-trixie-slim
DOCKER_TAURI_IMAGE := lilt-gui-tauri:latest
DOCKER_RUN := docker run --rm -v $(PWD):/app -w /app $(DOCKER_NODE_IMAGE)
DOCKER_RUN_IT := docker run --rm -it -v $(PWD):/app -w /app $(DOCKER_NODE_IMAGE)

# For Tauri development with Docker
DOCKER_TAURI_RUN := docker run --rm \
	-v $(PWD):/app \
	-w /app \
	-e DISPLAY=${DISPLAY} \
	-v /tmp/.X11-unix:/tmp/.X11-unix:rw \
	-v $(HOME)/.Xauthority:/root/.Xauthority:rw \
	--network host \
	--ipc host \
	$(DOCKER_TAURI_IMAGE)

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-docker: ## Check if Docker is running
	@docker info > /dev/null 2>&1 || (echo "Error: Docker is not running. Please start Docker Desktop." && exit 1)

install: check-docker ## Install dependencies using Docker
	@echo "Installing dependencies..."
	$(DOCKER_RUN) npm install
	@echo "✓ Dependencies installed successfully"

build-tauri-image: check-docker ## Build Tauri development Docker image
	@echo "Building Tauri Docker image..."
	@docker build -f Dockerfile.tauri -t $(DOCKER_TAURI_IMAGE) .
	@echo "✓ Tauri Docker image built successfully"

dev-frontend: check-docker ## Start Vite dev server using Docker
	@echo "Starting Vite development server..."
	@docker run --rm -v $(PWD):/app -w /app -p 1420:1420 $(DOCKER_NODE_IMAGE) npm run dev -- --host 0.0.0.0

dev-tauri: check-docker build-tauri-image ## Start Tauri dev using Docker (Linux/macOS with X11)
	@echo "Starting Tauri development mode..."
	@echo "Note: This requires X11 display forwarding"
	@if [ "$$(uname)" = "Darwin" ]; then \
		echo "macOS detected. Make sure XQuartz is running and 'xhost + localhost' is executed"; \
	fi
	$(DOCKER_TAURI_RUN) npm run tauri:dev

dev: ## Start full development using Docker Compose
	@echo "Starting development environment with Docker Compose..."
	docker-compose up

build-frontend: check-docker ## Build frontend using Docker
	@echo "Building frontend..."
	$(DOCKER_RUN) npm run build
	@echo "✓ Frontend built successfully"

build-tauri: check-docker build-tauri-image ## Build Tauri app using Docker
	@echo "Building Tauri application..."
	$(DOCKER_TAURI_RUN) npm run tauri:build
	@echo "✓ Tauri application built successfully"

build: build-frontend ## Build the application using Docker (frontend only)

test: check-docker ## Run tests using Docker
	@echo "Running tests..."
	$(DOCKER_RUN) npm test

test-coverage: check-docker ## Run tests with coverage using Docker
	@echo "Running tests with coverage..."
	$(DOCKER_RUN) npm run test:coverage

test-ui: check-docker ## Run tests with UI using Docker
	@echo "Running tests with UI..."
	@docker run --rm -v $(PWD):/app -w /app -p 51204:51204 $(DOCKER_NODE_IMAGE) npm run test:ui -- --host 0.0.0.0

lint: check-docker ## Run linter using Docker
	@echo "Running linter..."
	$(DOCKER_RUN) npm run lint

lint-fix: check-docker ## Fix linting issues using Docker
	@echo "Fixing linting issues..."
	$(DOCKER_RUN) npm run lint:fix

format: check-docker ## Format code using Docker
	@echo "Formatting code..."
	$(DOCKER_RUN) npm run format

clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	rm -rf node_modules dist coverage .vite
	rm -rf src-tauri/target
	@echo "✓ Cleaned successfully"

clean-docker: ## Clean Docker images and containers
	@echo "Cleaning Docker images..."
	docker-compose down -v 2>/dev/null || true
	docker rmi $(DOCKER_TAURI_IMAGE) 2>/dev/null || true
	@echo "✓ Docker cleaned successfully"

docker-shell: check-docker ## Open a shell in Node Docker container
	@echo "Opening shell in Docker container..."
	$(DOCKER_RUN_IT) sh

docker-shell-tauri: check-docker build-tauri-image ## Open a shell in Tauri Docker container
	@echo "Opening shell in Tauri Docker container..."
	docker run --rm -it -v $(PWD):/app -w /app $(DOCKER_TAURI_IMAGE) bash

docker-up: ## Start Docker Compose services
	@echo "Starting Docker Compose services..."
	docker-compose up -d

docker-down: ## Stop Docker Compose services
	@echo "Stopping Docker Compose services..."
	docker-compose down

docker-logs: ## View Docker Compose logs
	docker-compose logs -f

# Quick commands
quick-install: install ## Quick install (alias)

quick-dev: dev-frontend ## Quick development (frontend only)

quick-test: test ## Quick test

quick-build: build ## Quick build (frontend)

# Complete workflows
docker-build: build-frontend ## Complete build using Docker

docker-dev: dev-frontend ## Complete development using Docker (frontend only)

docker-test: test ## Complete test using Docker

# Info commands
info: ## Show project information
	@echo "=== Lilt GUI Project Information ==="
	@echo "Node version in Docker: $$(docker run --rm $(DOCKER_NODE_IMAGE) node --version)"
	@echo "npm version in Docker: $$(docker run --rm $(DOCKER_NODE_IMAGE) npm --version)"
	@echo "Project directory: $(PWD)"
	@echo "Tauri image: $(DOCKER_TAURI_IMAGE)"
	@echo ""
	@echo "Dependencies installed: $$(test -d node_modules && echo 'Yes' || echo 'No')"
	@echo "Docker running: $$(docker info > /dev/null 2>&1 && echo 'Yes' || echo 'No')"

# All-in-one commands
all: install lint test build ## Run all checks and build

ci: lint test-coverage build ## Run CI pipeline locally
