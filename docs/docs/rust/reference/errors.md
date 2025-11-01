# Error Handling

Comprehensive guide to error handling in 402fly Rust SDK.

## Fly402Error Enum

All X402 operations return `X402Result<T>` which is an alias for `Result<T, Fly402Error>`.

```rust
pub enum Fly402Error {
    PaymentRequired(String),
    PaymentExpired(String),
    InsufficientFunds(String),
    PaymentVerification(String),
    TransactionBroadcast(String),
    InvalidPaymentRequest(String),
    InvalidPaymentAuthorization(String),
    Configuration(String),
    Network(String),
    Blockchain(String),
    Serialization(String),
}
```

## Error Types

### PaymentRequired

Payment is required to access the resource.

**When it occurs:**
- Client makes request without payment authorization
- Server returns 402 status code
- Auto client exceeds max payment amount

**Example:**
```rust
match client.get(url).await {
    Err(Fly402Error::PaymentRequired(msg)) => {
        eprintln!("Payment required: {}", msg);
        // Handle by creating payment
    }
    // ...
}
```

**Error code:** `PAYMENT_REQUIRED`

### PaymentExpired

The payment request or authorization has expired.

**When it occurs:**
- Payment request timestamp has passed
- Attempting to use expired payment authorization
- Server rejects expired payment

**Example:**
```rust
match processor.create_payment(&request, &keypair).await {
    Err(Fly402Error::PaymentExpired(msg)) => {
        eprintln!("Payment expired: {}", msg);
        // Request new payment details from server
    }
    // ...
}
```

**Error code:** `PAYMENT_EXPIRED`

### InsufficientFunds

Wallet doesn't have enough funds for the payment.

**When it occurs:**
- Token balance is less than required amount
- Not enough SOL for transaction fees

**Example:**
```rust
match processor.create_payment(&request, &keypair).await {
    Err(Fly402Error::InsufficientFunds(msg)) => {
        eprintln!("Insufficient funds: {}", msg);
        // Show user balance and required amount
        // Prompt to add funds
    }
    // ...
}
```

**Error code:** `INSUFFICIENT_FUNDS`

### PaymentVerification

Payment verification failed.

**When it occurs:**
- Transaction not found on-chain
- Amount doesn't match expected
- Transaction failed
- Invalid transaction signature

**Example:**
```rust
match processor.verify_payment(&auth, "0.10").await {
    Err(Fly402Error::PaymentVerification(msg)) => {
        eprintln!("Verification failed: {}", msg);
        // Payment may not be confirmed yet
        // Or transaction details don't match
    }
    // ...
}
```

**Error code:** `PAYMENT_VERIFICATION_FAILED`

### TransactionBroadcast

Failed to broadcast transaction to the blockchain.

**When it occurs:**
- Network connectivity issues
- RPC endpoint unavailable
- Invalid transaction
- Nonce errors

**Example:**
```rust
match processor.create_payment(&request, &keypair).await {
    Err(Fly402Error::TransactionBroadcast(msg)) => {
        eprintln!("Broadcast failed: {}", msg);
        // Retry with exponential backoff
        // Or try different RPC endpoint
    }
    // ...
}
```

**Error code:** `TRANSACTION_BROADCAST_FAILED`

### InvalidPaymentRequest

Payment request is malformed or invalid.

**When it occurs:**
- JSON parsing fails
- Required fields missing
- Invalid addresses
- Invalid amounts

**Example:**
```rust
match PaymentRequest::from_json(json) {
    Err(Fly402Error::InvalidPaymentRequest(msg)) => {
        eprintln!("Invalid payment request: {}", msg);
        // Server sent bad data
    }
    // ...
}
```

**Error code:** `INVALID_PAYMENT_REQUEST`

### InvalidPaymentAuthorization

Payment authorization is malformed or invalid.

**When it occurs:**
- Header parsing fails
- Base64 decoding fails
- Required fields missing
- Invalid format

**Example:**
```rust
match PaymentAuthorization::from_header_value(header) {
    Err(Fly402Error::InvalidPaymentAuthorization(msg)) => {
        eprintln!("Invalid authorization: {}", msg);
        // Client sent bad authorization
    }
    // ...
}
```

**Error code:** `INVALID_PAYMENT_AUTHORIZATION`

### Configuration

Configuration error.

**When it occurs:**
- Invalid wallet addresses
- Invalid network names
- Missing required configuration
- Invalid RPC URLs

**Example:**
```rust
let config = Fly402Config {
    payment_address: "invalid".to_string(),  // Invalid address
    // ...
};
// Error will occur when used
```

**Error code:** `CONFIGURATION_ERROR`

### Network

Network or HTTP error.

**When it occurs:**
- HTTP request fails
- Connection timeout
- DNS resolution fails
- Server unreachable

**Example:**
```rust
match client.get(url).await {
    Err(Fly402Error::Network(msg)) => {
        eprintln!("Network error: {}", msg);
        // Retry with backoff
    }
    // ...
}
```

**Error code:** `NETWORK_ERROR`

### Blockchain

Solana blockchain error.

**When it occurs:**
- RPC errors
- Account not found
- Program errors
- Transaction simulation fails

**Example:**
```rust
match processor.create_payment(&request, &keypair).await {
    Err(Fly402Error::Blockchain(msg)) => {
        eprintln!("Blockchain error: {}", msg);
        // May be transient, retry
    }
    // ...
}
```

**Error code:** `BLOCKCHAIN_ERROR`

### Serialization

JSON serialization/deserialization error.

**When it occurs:**
- JSON parsing fails
- Base64 encoding/decoding fails
- Invalid UTF-8

**Example:**
```rust
match payment_request.to_json() {
    Err(Fly402Error::Serialization(msg)) => {
        eprintln!("Serialization error: {}", msg);
        // Data structure issue
    }
    // ...
}
```

**Error code:** `SERIALIZATION_ERROR`

---

## Error Handling Patterns

### Basic Error Handling

```rust
use fly402core::Fly402Error;

match client.get(url).await {
    Ok(response) => {
        // Handle success
    }
    Err(e) => {
        eprintln!("Error: {}", e);
    }
}
```

### Match Specific Errors

```rust
match client.get(url).await {
    Ok(response) => {
        // Handle success
    }
    Err(Fly402Error::PaymentRequired(msg)) => {
        // Handle payment required
    }
    Err(Fly402Error::InsufficientFunds(msg)) => {
        // Handle insufficient funds
    }
    Err(Fly402Error::Network(msg)) => {
        // Handle network error
    }
    Err(e) => {
        // Handle other errors
        eprintln!("Error: {}", e);
    }
}
```

### Retry Logic

```rust
use tokio::time::{sleep, Duration};

async fn retry_with_backoff<F, T>(
    mut f: F,
    max_retries: u32,
) -> Result<T, Fly402Error>
where
    F: FnMut() -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<T, Fly402Error>>>>,
{
    let mut retries = 0;
    let mut delay = Duration::from_millis(100);

    loop {
        match f().await {
            Ok(result) => return Ok(result),
            Err(e) => {
                retries += 1;
                if retries >= max_retries {
                    return Err(e);
                }

                match e {
                    Fly402Error::Network(_) | Fly402Error::TransactionBroadcast(_) => {
                        // Retry network and broadcast errors
                        sleep(delay).await;
                        delay *= 2; // Exponential backoff
                    }
                    _ => return Err(e), // Don't retry other errors
                }
            }
        }
    }
}
```

### Error Recovery

```rust
async fn fetch_with_recovery(client: &Fly402AutoClient, url: &str) -> Result<String, Box<dyn std::error::Error>> {
    match client.get(url).await {
        Ok(response) => Ok(response.text().await?),
        Err(Fly402Error::PaymentExpired(_)) => {
            // Payment expired, retry automatically
            client.get(url).await?.text().await.map_err(Into::into)
        }
        Err(Fly402Error::InsufficientFunds(msg)) => {
            Err(format!("Please add funds to your wallet: {}", msg).into())
        }
        Err(Fly402Error::Network(_)) => {
            // Retry once for network errors
            sleep(Duration::from_secs(1)).await;
            client.get(url).await?.text().await.map_err(Into::into)
        }
        Err(e) => Err(e.into()),
    }
}
```

### Logging Errors

```rust
use log::{error, warn, info};

match client.get(url).await {
    Ok(response) => {
        info!("Request successful");
    }
    Err(Fly402Error::PaymentRequired(msg)) => {
        info!("Payment required: {}", msg);
    }
    Err(Fly402Error::PaymentExpired(msg)) => {
        warn!("Payment expired: {}", msg);
    }
    Err(Fly402Error::InsufficientFunds(msg)) => {
        error!("Insufficient funds: {}", msg);
    }
    Err(e) => {
        error!("Unexpected error: {}", e);
    }
}
```

### Custom Error Types

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("X402 error: {0}")]
    X402(#[from] Fly402Error),

    #[error("Database error: {0}")]
    Database(String),

    #[error("Application error: {0}")]
    Application(String),
}

async fn app_logic() -> Result<(), AppError> {
    let response = client.get(url).await?;  // Auto-converts Fly402Error
    // ... other logic
    Ok(())
}
```

---

## Error Methods

### code()

Get the error code as a string.

```rust
let error = Fly402Error::PaymentRequired("Payment needed".to_string());
println!("Code: {}", error.code());  // "PAYMENT_REQUIRED"
```

### message()

Get the error message.

```rust
let error = Fly402Error::InsufficientFunds("Not enough USDC".to_string());
println!("Message: {}", error.message());  // "Insufficient funds: Not enough USDC"
```

---

## Best Practices

### 1. Always Handle Payment Required

```rust
match client.get(url).await {
    Ok(response) => { /* ... */ }
    Err(Fly402Error::PaymentRequired(_)) => {
        // Expected error, handle gracefully
    }
    Err(e) => {
        // Unexpected error, log and handle
        eprintln!("Unexpected error: {}", e);
    }
}
```

### 2. Provide User-Friendly Messages

```rust
match error {
    Fly402Error::InsufficientFunds(_) => {
        "You don't have enough USDC in your wallet. Please add funds."
    }
    Fly402Error::PaymentExpired(_) => {
        "Payment request expired. Refreshing..."
    }
    Fly402Error::Network(_) => {
        "Network connection issue. Retrying..."
    }
    _ => "An error occurred. Please try again."
}
```

### 3. Log Errors Appropriately

```rust
// Info level for expected errors
info!("Payment required: {}", msg);

// Warn level for recoverable errors
warn!("Payment expired, retrying");

// Error level for unexpected errors
error!("Transaction broadcast failed: {}", msg);
```

### 4. Retry Transient Errors

```rust
match error {
    Fly402Error::Network(_) |
    Fly402Error::TransactionBroadcast(_) |
    Fly402Error::Blockchain(_) => {
        // These are often transient, retry
        retry_operation().await?
    }
    _ => return Err(error),
}
```

### 5. Don't Retry User Errors

```rust
match error {
    Fly402Error::InsufficientFunds(_) |
    Fly402Error::InvalidPaymentRequest(_) |
    Fly402Error::Configuration(_) => {
        // User action required, don't retry
        return Err(error);
    }
    _ => { /* ... */ }
}
```

---

## Testing with Errors

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_insufficient_funds() {
        // Test handling of insufficient funds
        let keypair = Keypair::new();  // Empty wallet
        let client = Fly402Client::new(keypair, None);

        match client.create_payment(&payment_request).await {
            Err(Fly402Error::InsufficientFunds(_)) => {
                // Expected error
            }
            _ => panic!("Expected InsufficientFunds error"),
        }
    }

    #[tokio::test]
    async fn test_expired_payment() {
        let expired_request = PaymentRequest {
            expires_at: Utc::now() - Duration::seconds(10),
            // ...
        };

        let processor = SolanaPaymentProcessor::new(rpc_url, None);
        match processor.create_payment(&expired_request, &keypair).await {
            Err(Fly402Error::PaymentExpired(_)) => {
                // Expected error
            }
            _ => panic!("Expected PaymentExpired error"),
        }
    }
}
```

## See Also

- [API Reference](api-reference.md)
- [Configuration](configuration.md)
- [Core Library](../libraries/core.md)
- [Client Library](../libraries/client.md)
