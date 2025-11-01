<!-- c6c3b24f-3b95-4d27-ae4e-b3ddb407d1ca 3fa67ce7-3090-458e-855d-c9d70d8ebc40 -->
# Rename 402fly to 402flyCore and Add 1% Fee Mechanism

## Overview

Complete rebranding and fee implementation for the forked codebase. This includes renaming all packages, classes, imports, and directories from `402fly`/`402fly`/`X402` to `402fly`/`402flyCore`/`Fly402`, implementing a 1% fee mechanism where clients pay 101% (100% to recipient + 1% to fee wallet), and configuring devnet with Helius RPC as default.

## Phase 1: Fee Mechanism Implementation

### 1.1 Update Core Config and Models

- **File**: `packages/python/402flycore/402flycore/config.py` (after rename)
- Add `fee_wallet` field to config class with env var `FLY402_FEE_WALLET` (default: `2kQGcstuXirRF5HyZvoEmjxdpf9vUpKVrVWcAn9V1gbg`)
- Add `fee_percentage` field (default: 0.01 for 1%)
- Update RPC URL default to Helius devnet: `https://devnet.helius-rpc.com/?api-key=8d4a82b0-d5c2-4ec5-8230-2b0c2261984c`
- Set default network to `solana-devnet`

### 1.2 Update Payment Processor

- **File**: `packages/python/402flycore/402flycore/solana_processor.py`
- Modify `create_payment_transaction()` to accept `fee_wallet_address` and `fee_percentage` parameters
- Create two SPL token transfer instructions:

1. Transfer `amount` to `recipient_address` (100% of requested)
2. Transfer `amount * fee_percentage` to `fee_wallet_address` (1% fee)

- Ensure both transfers are in same transaction atomicity

### 1.3 Update Client Payment Creation

- **File**: `packages/python/402flyclient/402flyclient/explicit_client.py`
- Update `create_payment()` to:
- Get fee wallet from config or env
- Pass fee wallet and fee percentage to `processor.create_payment_transaction()`
- Calculate total amount paid (amount * 1.01) for balance checks
- Update `PaymentAuthorization.actual_amount` to reflect total paid amount

### 1.4 Update TypeScript Implementation

- Apply same fee mechanism changes to TypeScript packages:
- `packages/typescript/402flycore/src/config.ts`
- `packages/typescript/402flycore/src/solana-processor.ts`
- `packages/typescript/402flyclient/src/explicit-client.ts`

## Phase 2: Comprehensive Renaming

### 2.1 Python Packages Structure

Rename directories and update package names:

- `packages/python/402fly-core/` → `packages/python/402flycore/`
- `packages/python/402fly-client/` → `packages/python/402flyclient/`
- `packages/python/402fly-fastapi/` → `packages/python/402flyfastapi/`
- `packages/python/402fly-langchain/` → `packages/python/402flylangchain/`
- `packages/python/402fly-langgraph/` → `packages/python/402flylanggraph/`

### 2.2 Python Module/Import Renaming

- Rename internal modules:
- `fly402core` → `fly402core`
- `fly402client` → `fly402client`
- `fly402fastapi` → `fly402fastapi`
- `fly402langchain` → `fly402langchain`
- `fly402langgraph` → `fly402langgraph`

### 2.3 Python Class/Function Renaming

Update class names:

- `Fly402Config` → `Fly402Config`
- `Fly402Client` → `Fly402Client`
- `Fly402AutoClient` → `Fly402AutoClient`
- `Fly402Error` → `Fly402Error`
- `X402PaymentTool` → `Fly402PaymentTool`
- `X402RequestsWrapper` → `Fly402RequestsWrapper`
- All error classes: `PaymentRequiredError`, `PaymentExpiredError`, etc. (keep descriptive names)

### 2.4 Python Package Metadata

- Update all `pyproject.toml` files with new package names
- Update `__init__.py` files with new exports
- Update workspace configuration in root `pyproject.toml`

### 2.5 TypeScript Packages Structure

- `packages/typescript/402fly-core/` → `packages/typescript/402flycore/`
- `packages/typescript/402fly-client/` → `packages/typescript/402flyclient/`
- `packages/typescript/402fly-express/` → `packages/typescript/402flyexpress/`
- Similar pattern for langchain, langgraph, nextjs packages

### 2.6 TypeScript Package Names

- Update `package.json` files:
- `@402fly/core` → `@402fly/core`
- `@402fly/client` → `@402fly/client`
- `@402fly/express` → `@402fly/express`
- Similar for other packages

### 2.7 TypeScript Class/Type Renaming

- `Fly402Config` → `Fly402Config`
- `Fly402Client` → `Fly402Client`
- `Fly402AutoClient` → `Fly402AutoClient`
- `Fly402Error` → `Fly402Error`
- Update all TypeScript interfaces and types

### 2.8 Go Packages Renaming

- `packages/go/402fly-core/` → `packages/go/402flycore/`
- `packages/go/402fly-client/` → `packages/go/402flyclient/`
- `packages/go/402fly-nethttp/` → `packages/go/402flynethhttp/`
- `packages/go/402fly-echo/` → `packages/go/402flyecho/`
- Update Go module paths in `go.mod` files
- Update import paths in `IMPORT_PATHS.md`

### 2.9 Rust Packages Renaming

- `packages/rust/402fly-core/` → `packages/rust/402flycore/`
- `packages/rust/402fly-client/` → `packages/rust/402flyclient/`
- `packages/rust/402fly-rocket/` → `packages/rust/402flyrocket/`
- `packages/rust/402fly-actix/` → `packages/rust/402flyactix/`
- Update `Cargo.toml` files with new package names

### 2.10 Examples Renaming

- Update example directory names and imports
- Update example README files and documentation

### 2.11 Documentation Updates

- Update all README files (`README.md`, `README_GO.md`, `README_RUST.md`, `README_TYPESCRIPT.md`)
- Update `SETUP.md`, `CONTRIBUTING.md`, `INSTALL.md`
- Update documentation in `docs/` directory
- Update code examples in documentation

### 2.12 Configuration Files

- Update `package.json` root file
- Update `pnpm-workspace.yaml`
- Update `Makefile`
- Update `turbo.json` (if present)
- Update `pyproject.toml` root workspace configuration

## Phase 3: Testing and Verification

### 3.1 Update Test Files

- Rename test classes and imports
- Update test fixtures and mocks
- Ensure all tests reference new names

### 3.2 Integration Testing

- Test fee mechanism with devnet transactions
- Verify fee wallet receives 1% of payments
- Verify recipient receives 100% of requested amount
- Test with Helius RPC endpoint

## Key Files to Modify

**Python Core:**

- `packages/python/402flycore/402flycore/config.py` - Add fee config
- `packages/python/402flycore/402flycore/solana_processor.py` - Fee transaction logic
- `packages/python/402flycore/402flycore/models.py` - Model updates
- `packages/python/402flycore/402flycore/errors.py` - Error class renaming

**Python Client:**

- `packages/python/402flyclient/402flyclient/explicit_client.py` - Fee integration
- `packages/python/402flyclient/402flyclient/implicit_client.py` - Auto client updates

**Python FastAPI:**

- `packages/python/402flyfastapi/402flyfastapi/config.py` - Config updates
- `packages/python/402flyfastapi/402flyfastapi/decorator.py` - Decorator updates

**TypeScript:**

- Similar structure for TypeScript packages

**Root Files:**

- `README.md` - Main documentation
- `package.json` - Root package config
- `pyproject.toml` - Python workspace config
- All README files in subdirectories

## Environment Variables

New environment variable:

- `FLY402_FEE_WALLET` - Fee recipient wallet (default: `2kQGcstuXirRF5HyZvoEmjxdpf9vUpKVrVWcAn9V1gbg`)
- `FLY402_NETWORK` - Default: `solana-devnet`
- `FLY402_RPC_URL` - Default: Helius devnet URL

## Notes

- No smart contract deployment needed - using existing SPL Token Program
- Fee mechanism is implemented client-side in transaction creation
- All payments require 101% of requested amount (100% + 1% fee)
- Fee wallet receives payments directly on-chain
- Devnet configuration allows testing without mainnet costs