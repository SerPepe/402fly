# fly402client

HTTP client library for the X402 payment protocol with automatic and explicit payment handling.

This library provides both high-level (automatic) and low-level (explicit) APIs for interacting with X402-enabled services.

## Features

- **Fly402Client**: Explicit control over payment requests and responses
- **Fly402AutoClient**: Automatic payment handling with configurable payment limits and retry logic
- **Full HTTP Support**: GET and POST requests with transparent payment integration
- **Error Handling**: Proper error types for payment failures and network issues
- **Async/Await**: Built on Tokio for non-blocking operations

## Quick Start

Add to your `Cargo.toml`:

```toml
[dependencies]
fly402client = "0.0.1"
tokio = { version = "1.35", features = ["full"] }
```

### Automatic Payment (Recommended)

```rust
use fly402client::{Fly402AutoClient, AutoClientOptions};
use solana_sdk::signer::keypair::Keypair;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let keypair = Keypair::new();
    let client = Fly402AutoClient::new(
        keypair,
        None,  // use default RPC
        AutoClientOptions::default(),
    );

    // Request is automatically handled - client pays if needed
    let response = client.get("https://api.example.com/premium").await?;
    let body = response.text().await?;
    println!("{}", body);

    Ok(())
}
```

### Explicit Payment Control

```rust
use fly402client::Fly402Client;
use solana_sdk::signer::keypair::Keypair;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let keypair = Keypair::new();
    let client = Fly402Client::new(keypair, None)?;

    // Make request
    let response = client.get("https://api.example.com/premium").await?;

    // Check for payment requirement
    if client.is_payment_required(&response) {
        let payment_request = client.parse_payment_request(&response).await?;
        let auth = client.create_payment(&payment_request).await?;

        // Retry with payment
        let response = client.get_with_auth(
            "https://api.example.com/premium",
            auth
        ).await?;
        println!("{}", response.text().await?);
    }

    Ok(())
}
```

## Configuration

### AutoClientOptions

```rust
pub struct AutoClientOptions {
    pub max_payment_amount: String,  // Default: "10.0"
    pub auto_retry: bool,            // Default: true
    pub max_retries: u32,            // Default: 3
}
```

## Documentation

For full documentation, visit: https://402fly.github.io/docs

## License

MIT License - See LICENSE file for details.

## Related Packages

- [`fly402core`](https://crates.io/crates/fly402core) - Core protocol library
- [`402fly-rocket`](https://crates.io/crates/402fly-rocket) - Rocket server integration
- [`402fly-actix`](https://crates.io/crates/402fly-actix) - Actix Web server integration
