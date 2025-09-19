# Lilt GUI Development Makefile
# This Makefile helps run the development environment using Docker

.PHONY: help install dev build test test-coverage lint lint-check format format-check typecheck dist shell clean install-local dev-local build-local test-local ci-install ci-test ci-lint ci-typecheck ci-build

# Default target
help: ## Show this help message
	@echo "Lilt GUI Docker Development Makefile"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make install"
	@echo "  make dev"
	@echo "  make test"
	@echo "  make lint-check     # Check code without fixing"
	@echo "  make lint           # Check and auto-fix code"
	@echo "  make format-check   # Check formatting without fixing"
	@echo "  make format         # Check and auto-fix formatting"
	@echo ""
	@echo "Distribution builds:"
	@echo "  - dist-mac/win/linux: Build for current Docker architecture"
	@echo "  - dist-*-arm64/x64: Build for specific architecture"
	@echo "  - dist-all-arch: Attempt to build all architectures"
	@echo "  Note: Cross-compilation from Docker may not work for all platforms"

install: ## Install dependencies
	@echo "Installing dependencies using Docker..."
	@if [ ! -f "package-lock.json" ]; then \
		echo "No package-lock.json found, running npm install to generate it..."; \
		docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm install; \
	else \
		docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm ci; \
	fi

dev: ## Start development server
	@echo "Starting development server using Docker..."
	@docker run --rm -it -v $$(pwd):/app -w /app -p 3000:3000 node:22-alpine npm run dev

build: ## Build the application
	@echo "Building application using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run build

test: ## Run tests
	@echo "Running tests using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm test

test-coverage: ## Run tests with coverage
	@echo "Running tests with coverage using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run test:coverage

lint: ## Run linter with auto-fix
	@echo "Running linter with auto-fix using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run lint

lint-check: ## Run linter in check-only mode (no fixes)
	@echo "Running linter check using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run lint:check

format: ## Run formatter with auto-fix
	@echo "Running formatter with auto-fix using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run format

format-check: ## Run formatter in check-only mode (no fixes)
	@echo "Running formatter check using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run format:check

typecheck: ## Run TypeScript type checking
	@echo "Running TypeScript type checking using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine npm run typecheck

dist: ## Build distributable packages
	@echo "Building distributable packages using Docker..."
	@echo "Note: Electron requires specific setup for cross-platform builds"
	@docker run --rm -v $$(pwd):/app -w /app node:22-alpine sh -c " \
		npm ci && \
		npm run build && \
		npm run dist:dir \
	"

dist-mac: ## Build Mac app directory using Docker (current arch only)
	@echo "Building Mac app directory using Docker (current architecture)..."
	@echo "Note: DMG creation requires macOS - this builds the .app directory only"
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-mac-docker \
	"

dist-mac-arm64: ## Build Mac ARM64 app directory using Docker
	@echo "Building Mac ARM64 app directory using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-mac-arm64 \
	"

dist-mac-x64: ## Build Mac Intel x64 app directory using Docker
	@echo "Building Mac Intel x64 app directory using Docker..."
	@echo "Warning: Cross-compilation may not work from ARM64 Docker"
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-mac-x64 \
	"

dist-win: ## Build Windows distributable using Docker (current arch only)
	@echo "Building Windows distributable using Docker (current architecture)..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-win-docker \
	"

dist-win-x64: ## Build Windows x64 using Docker
	@echo "Building Windows x64 using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-win-x64 \
	"

dist-win-arm64: ## Build Windows ARM64 using Docker
	@echo "Building Windows ARM64 using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-win-arm64 \
	"

dist-linux: ## Build Linux distributable using Docker (current arch only)
	@echo "Building Linux distributable using Docker (current architecture)..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-linux-docker \
	"

dist-linux-x64: ## Build Linux x64 using Docker
	@echo "Building Linux x64 using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-linux-x64 \
	"

dist-linux-arm64: ## Build Linux ARM64 using Docker
	@echo "Building Linux ARM64 using Docker..."
	@docker run --rm -v $$(pwd):/app -w /app node:22 sh -c " \
		apt-get update && \
		apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 && \
		npm run dist-linux-arm64 \
	"

dist-all-arch: ## Build for all supported architectures (may fail for cross-compilation)
	@echo "Building for all supported architectures..."
	@echo "Note: Cross-compilation may not work properly from Docker"
	@$(MAKE) dist-mac-arm64
	@$(MAKE) dist-mac-x64
	@$(MAKE) dist-win-x64
	@$(MAKE) dist-win-arm64
	@$(MAKE) dist-linux-x64
	@$(MAKE) dist-linux-arm64

shell: ## Open interactive shell in Docker container
	@echo "Opening interactive shell in Docker container..."
	@docker run --rm -it -v $$(pwd):/app -w /app node:22-alpine sh

clean: ## Clean Docker containers and volumes
	@echo "Cleaning Docker containers and volumes..."
	@docker system prune -f

# Local development targets (without Docker)
install-local: ## Install dependencies locally
	@echo "Installing dependencies locally..."
	@npm install

dev-local: ## Start development server locally
	@echo "Starting development server locally..."
	@npm run dev

build-local: ## Build the application locally
	@echo "Building application locally..."
	@npm run build

test-local: ## Run tests locally
	@echo "Running tests locally..."
	@npm test

# CI/CD targets
ci-install: ## Install dependencies for CI
	@npm ci

ci-test: ## Run tests for CI with coverage
	@npm run test:coverage

ci-lint: ## Run linter for CI
	@npm run lint:check

ci-typecheck: ## Run type checking for CI
	@npm run typecheck

ci-build: ## Build for CI
	@npm run build
