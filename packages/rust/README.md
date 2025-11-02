# 402fly Rust Packages

This directory contains the Rust implementation of 402fly, providing a comprehensive SDK for the X402 payment protocol.

## 📦 Workspace Structure

```
packages/rust/
├── fly402core/        # Core types and Solana payment processor
├── fly402client/      # HTTP client with payment handling
├── 402fly-rocket/      # Rocket web framework integration
└── 402fly-actix/       # Actix Web framework integration
```

## 🚀 Getting Started

See the main [Rust documentation](../../README_RUST.md) for complete guides and examples.

## 🛠️ Building

Build all packages:

```bash
cargo build
```

Build in release mode:

```bash
cargo build --release
```

## 🧪 Testing

Run all tests:

```bash
cargo test
```

Test a specific package:

```bash
cargo test -p fly402core
```

## 📚 Documentation

Generate API documentation:

```bash
cargo doc --open
```

## 📖 Package Details

### fly402core

Core library providing:
- `PaymentRequest` and `PaymentAuthorization` models
- Error types and result aliases
- `SolanaPaymentProcessor` for blockchain operations
- Serialization utilities

### fly402client

HTTP client library providing:
- `Fly402Client` - Explicit payment flow control
- `Fly402AutoClient` - Automatic payment handling
- Configurable retry and payment limits

### 402fly-rocket

Rocket framework integration providing:
- `PaymentGuard` - Request guard for payment enforcement
- `Fly402Config` - Server configuration
- Helper functions for payment requests

### 402fly-actix

Actix Web framework integration providing:
- `PaymentExtractor` - Payment extractor for routes
- `X402State` - Application state
- Helper functions for payment responses

## 🔗 Resources

- [Main Rust Documentation](../../README_RUST.md)
- [Examples](../../examples/rust/)
- [Project Website](https://x402.org)
