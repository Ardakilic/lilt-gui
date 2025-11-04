.PHONY: help install dev build test lint format clean

DOCKER_NODE_IMAGE = node:18-alpine
DOCKER_GO_IMAGE = golang:1.21-alpine
DOCKER_WAILS_IMAGE = ghcr.io/wailsapp/wails:v2.8.0

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "Installing frontend dependencies..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm install
	@echo "Installing Go dependencies..."
	docker run --rm -v $(PWD):/app -w /app $(DOCKER_GO_IMAGE) go mod download

dev-frontend: ## Run frontend development server
	@echo "Starting frontend dev server..."
	docker run --rm -it -v $(PWD)/frontend:/app -w /app -p 34115:34115 $(DOCKER_NODE_IMAGE) npm run dev

dev: ## Run wails dev mode (requires wails installed locally or use dev-frontend)
	@echo "Run 'wails dev' for development mode with hot reload"
	@echo "Or use 'make dev-frontend' to run frontend only"

build: ## Build the application using Wails
	@echo "Building application..."
	docker run --rm -v $(PWD):/app -w /app $(DOCKER_WAILS_IMAGE) wails build

build-frontend: ## Build frontend only
	@echo "Building frontend..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm run build

test: ## Run tests
	@echo "Running tests..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm test

test-coverage: ## Run tests with coverage
	@echo "Running tests with coverage..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm run test

lint: ## Run linter
	@echo "Running linter..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm run lint

lint-fix: ## Fix linting issues
	@echo "Fixing linting issues..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm run lint:fix

format: ## Format code
	@echo "Formatting code..."
	docker run --rm -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) npm run format

clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf frontend/node_modules frontend/dist build/ dist/
	rm -rf .wails/

go-mod-tidy: ## Tidy Go modules
	@echo "Tidying Go modules..."
	docker run --rm -v $(PWD):/app -w /app $(DOCKER_GO_IMAGE) go mod tidy

shell-node: ## Open a shell in Node container
	docker run --rm -it -v $(PWD)/frontend:/app -w /app $(DOCKER_NODE_IMAGE) sh

shell-go: ## Open a shell in Go container
	docker run --rm -it -v $(PWD):/app -w /app $(DOCKER_GO_IMAGE) sh
