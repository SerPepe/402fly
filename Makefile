# 402fly TypeScript Monorepo Makefile
# Similar to Python's uv-based Makefile

.PHONY: help install install-typescript install-python build test clean dev example-express example-langchain example-langgraph example-python-fastapi example-python-langchain example-python-langgraph

# Default target
help:
	@echo "402fly TypeScript Monorepo Commands"
	@echo "======================================"
	@echo ""
	@echo "Setup:"
	@echo "  make install             Install pnpm + uv dependencies"
	@echo "  make install-typescript  Install TypeScript dependencies (pnpm)"
	@echo "  make install-python      Sync Python dependencies (uv)"
	@echo "  make build               Build all TypeScript packages"
	@echo ""
	@echo "Development:"
	@echo "  make dev                 Watch mode for all packages"
	@echo "  make test                Run tests for all packages"
	@echo "  make lint                Lint all packages"
	@echo "  make clean               Clean build artifacts"
	@echo ""
	@echo "Examples (TypeScript):"
	@echo "  make example-express       Run Express.js example server"
	@echo "  make example-langchain     Run LangChain.js agent example"
	@echo "  make example-langgraph     Run LangGraph.js workflow example"
	@echo ""
	@echo "Examples (Python via uv):"
	@echo "  make example-python-fastapi   Run FastAPI server example"
	@echo "  make example-python-langchain Run LangChain agent example"
	@echo "  make example-python-langgraph Run LangGraph workflow example"
	@echo ""
	@echo "Individual packages:"
	@echo "  make build-core          Build @402fly/core"
	@echo "  make build-client        Build @402fly/client"
	@echo "  make build-express       Build @402fly/express"
	@echo "  make build-langchain     Build @402fly/langchain"
	@echo "  make build-langgraph     Build @402fly/langgraph"

# Setup
install: install-typescript install-python
	@echo "Dependencies installed!"

install-typescript:
	@echo "Installing TypeScript dependencies..."
	pnpm install

install-python:
	@echo "Syncing Python dependencies with uv..."
	@if command -v uv >/dev/null 2>&1; then \
		uv sync; \
	else \
		echo "uv not found; skipping Python dependency sync. Install uv to enable Python tooling."; \
	fi

# Build
build:
	@echo "Building all packages..."
	pnpm run build

build-core:
	@echo "Building @402fly/core..."
	pnpm --filter @402fly/core run build

build-client:
	@echo "Building @402fly/client..."
	pnpm --filter @402fly/client run build

build-express:
	@echo "Building @402fly/express..."
	pnpm --filter @402fly/express run build

build-langchain:
	@echo "Building @402fly/langchain..."
	pnpm --filter @402fly/langchain run build

build-langgraph:
	@echo "Building @402fly/langgraph..."
	pnpm --filter @402fly/langgraph run build

# Development
dev:
	@echo "Starting watch mode for all packages..."
	pnpm run dev

test:
	@echo "Running tests..."
	pnpm run test

lint:
	@echo "Linting..."
	pnpm run lint

clean:
	@echo "Cleaning build artifacts..."
	pnpm run clean
	@echo "Removing node_modules..."
	rm -rf node_modules
	rm -rf packages/typescript/*/node_modules
	rm -rf examples/typescript/*/node_modules

# Examples
example-express:
	@echo "Starting Express.js example server..."
	pnpm run example:express

example-langchain:
	@echo "Starting LangChain.js agent example..."
	pnpm run example:langchain

example-langgraph:
	@echo "Starting LangGraph.js workflow example..."
	pnpm run example:langgraph

example-python-fastapi:
	@echo "Starting FastAPI example server (uv)..."
	cd examples/python/fastapi-server && uv run uvicorn main:app --reload

example-python-langchain:
	@echo "Starting Python LangChain agent example (uv)..."
	cd examples/python/langchain-agent && uv run python main.py

example-python-langgraph:
	@echo "Starting Python LangGraph workflow example (uv)..."
	cd examples/python/langgraph-workflow && uv run python main.py

# Full setup (like uv sync)
setup: install build
	@echo "Setup complete!"

# Full rebuild
rebuild: clean setup
	@echo "Rebuild complete!"
