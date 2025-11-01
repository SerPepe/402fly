# Repository Guidelines

## Project Structure & Module Organization
The FastAPI application resides in `main.py`, which wires `FastAPI`, `fly402fastapi`, and environment configuration in a single module. Dependency metadata lives in `pyproject.toml`, while pinned runtime dependencies are captured in `requirements.txt` and `uv.lock`. Keep new service code in dedicated modules or packages under the repository root (for example `app/routers/`) and import them from `main.py` to avoid clutter and preserve clear ownership of endpoints.

## Build, Test, and Development Commands
Run `pip install -r requirements.txt` inside an isolated virtual environment to install FastAPI, Uvicorn, and the 402fly integrations. Start the server with `python main.py` to boot the bundled Uvicorn runner, or use `uvicorn main:app --reload` for hot-reload during iteration. Use `python -m pip check` after dependency updates to verify the lockfiles remain consistent.

## Coding Style & Naming Conventions
Follow standard Python conventions: four-space indentation, type hints for public functions, and docstrings that describe billing rules or tiers. Name new routes with lowercase, hyphenated paths (e.g., `/usage-report`) and use descriptive handler functions such as `get_usage_report`. Environment variables must stay uppercase with the `FLY402_` prefix to match the existing configuration lookup pattern.

## Testing Guidelines
Automated tests are not yet present; add `pytest`-based suites under a `tests/` directory. Prefer request-level tests that exercise FastAPI routes with `TestClient`, ensuring premium endpoints reject unpaid requests and accept valid authorizations. Include targeted curl examples in PR descriptions, for instance `curl http://localhost:8000/premium-data` with a signed payment header, when automated coverage is not feasible.

## Commit & Pull Request Guidelines
Write commit subjects in the imperative mood (e.g., “Add tiered usage router”) and keep them under 72 characters. Squash work-in-progress commits before opening a review, and link to relevant issues. Pull requests should outline the change, list any new environment variables or pricing tiers, and document manual verification steps or screenshots from `/docs` that confirm the new routes behave as expected.

## Security & Configuration Tips
The server requires `FLY402_PAYMENT_ADDRESS`, `FLY402_TOKEN_MINT`, and optional network settings such as `FLY402_NETWORK` and `FLY402_RPC_URL`; configure them via a local `.env` and never commit secrets. When sharing instructions, redact wallet addresses and transaction hashes, and rotate credentials if accidental exposure occurs.
