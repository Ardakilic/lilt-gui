# Lilt GUI Makefile
# All commands run through Docker to ensure consistent development environment

.PHONY: help install dev build test lint format clean docker-build docker-dev docker-test setup icons

# Default target
help: ## Show this help message
	@echo "Lilt GUI Development Commands"
	@echo "============================"
	@echo
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup commands
setup: ## Initial setup - install dependencies
	@echo "Setting up development environment..."
	docker-compose build dev
	@echo "Setup complete! Run 'make dev' to start development server."

install: ## Install dependencies
	docker-compose run --rm dev npm ci

# Development commands
dev: ## Start development server
	docker-compose up dev

build: ## Build the application for production
	docker-compose run --rm build

preview: ## Preview the built application
	docker run --rm -v "$(PWD)":/app -w /app -p 4173:4173 node:22 npm run preview

# Testing commands
test: ## Run tests
	docker-compose run --rm test npm test

test-coverage: ## Run tests with coverage
	docker-compose run --rm test npm run test:coverage

test-ui: ## Run tests with UI
	docker-compose run --rm -p 51204:51204 test npm run test:ui

# Code quality commands
lint: ## Run linter
	docker run --rm -v "$(PWD)":/app -w /app node:22 npm run lint

lint-fix: ## Run linter and fix issues
	docker run --rm -v "$(PWD)":/app -w /app node:22 npm run lint:fix

format: ## Format code
	docker run --rm -v "$(PWD)":/app -w /app node:22 npm run format

format-check: ## Check code formatting
	docker run --rm -v "$(PWD)":/app -w /app node:22 npm run format:check

# Tauri specific commands
tauri: ## Run generic Tauri command (use with ARGS="command")
	docker-compose run --rm dev npm run tauri $(ARGS)

tauri-dev: ## Start Tauri development mode
	docker-compose run --rm -p 1420:1420 dev npm run tauri:dev

tauri-build: ## Build Tauri application
	docker-compose run --rm build npm run tauri:build

# Icon generation
icons: ## Generate application icons from logo
	@echo "Generating application icons..."
	@mkdir -p src-tauri/icons
	@if command -v convert >/dev/null 2>&1; then \
		convert lilt-assets/logo-circle.png -resize 32x32 src-tauri/icons/32x32.png; \
		convert lilt-assets/logo-circle.png -resize 128x128 src-tauri/icons/128x128.png; \
		convert lilt-assets/logo-circle.png -resize 256x256 src-tauri/icons/128x128@2x.png; \
		convert lilt-assets/logo-circle.png -resize 512x512 src-tauri/icons/icon.png; \
		echo "Icons generated successfully!"; \
	else \
		echo "ImageMagick not found. Please install ImageMagick or manually create icons."; \
		echo "Required icons: 32x32.png, 128x128.png, 128x128@2x.png, icon.icns, icon.ico"; \
	fi

# Docker commands
docker-build: ## Build all Docker images
	docker-compose build

docker-dev: ## Start development environment with Docker
	docker-compose up -d dev

docker-test: ## Run tests in Docker
	docker-compose run --rm test

# NPM Docker shortcuts (equivalent to npm run docker:*)
npm-docker-dev: ## Run npm run docker:dev
	npm run docker:dev

npm-docker-build: ## Run npm run docker:build  
	npm run docker:build

npm-docker-test: ## Run npm run docker:test
	npm run docker:test

docker-clean: ## Clean Docker images and containers
	docker-compose down --rmi all --volumes --remove-orphans

# Cleanup commands
clean: ## Clean build artifacts and dependencies
	docker-compose down --volumes
	docker system prune -f
	rm -rf node_modules
	rm -rf src-tauri/target
	rm -rf dist

clean-all: clean docker-clean ## Clean everything including Docker images

# CI commands
ci-test: ## Run CI tests
	docker-compose run --rm test npm run test:coverage

ci-lint: ## Run CI linting
	docker-compose run --rm lint

ci-build: ## Run CI build
	docker-compose run --rm build

ci: ci-lint ci-test ci-build ## Run all CI checks

# Release commands
release-dev: ## Create development release
	docker-compose run --rm build npm run tauri:build -- --debug

release-prod: ## Create production release
	docker-compose run --rm build npm run tauri:build

# Development utilities
logs: ## Show development server logs
	docker-compose logs -f dev

shell: ## Open shell in development container
	docker-compose run --rm dev sh

node-shell: ## Open Node.js shell in development container
	docker-compose run --rm dev npm run node

# Package management
update-deps: ## Update dependencies
	docker-compose run --rm dev npm update

audit: ## Audit dependencies for security issues
	docker-compose run --rm dev npm audit

audit-fix: ## Fix security issues in dependencies
	docker-compose run --rm dev npm audit fix

# Documentation
docs: ## Generate documentation
	@echo "Documentation commands to be implemented"

# Backup and restore
backup-settings: ## Backup development settings
	@echo "Backing up settings..."
	@mkdir -p .backup
	@cp -f .env .backup/ 2>/dev/null || true
	@cp -f src-tauri/tauri.conf.json .backup/ 2>/dev/null || true
	@echo "Settings backed up to .backup/"

restore-settings: ## Restore development settings
	@echo "Restoring settings..."
	@cp -f .backup/.env . 2>/dev/null || true
	@cp -f .backup/src-tauri/tauri.conf.json src-tauri/ 2>/dev/null || true
	@echo "Settings restored from .backup/"