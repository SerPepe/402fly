# 402fly-fastapi

FastAPI middleware and decorators for adding X402 payment requirements to API endpoints.

## Overview

The `402fly-fastapi` package makes it easy to add payment requirements to your FastAPI endpoints. Simply decorate endpoints with payment requirements, and the middleware handles payment verification automatically.

## Features

- Easy-to-use decorators for payment-required endpoints
- Dependency injection support for accessing payment details
- Automatic 402 Payment Required response generation
- Configurable payment amounts and descriptions
- Seamless integration with existing FastAPI applications

## Installation

```bash
pip install 402fly-fastapi
```

## Quick Start

### 1. Initialize X402 Configuration

```python
from fastapi import FastAPI
from 402fly_fastapi import Fly402Config, init_fly402
import os

# Initialize 402 configuration
config = Fly402Config(
    payment_address=os.getenv("FLY402_PAYMENT_ADDRESS"),
    token_mint=os.getenv("FLY402_TOKEN_MINT"),
    network=os.getenv("FLY402_NETWORK", "solana-devnet"),
    rpc_url=os.getenv("FLY402_RPC_URL"),
)
init_fly402(config)

app = FastAPI()
```

### 2. Add Payment Requirements with Decorator

```python
from fastapi import Request
from 402fly_fastapi import payment_required

@app.get("/premium-data")
@payment_required(
    amount="0.10",
    description="Access to premium market data"
)
async def get_premium_data(request: Request):
    """Endpoint requires 0.10 USDC payment"""
    return {
        "data": "This is premium content",
        "market_data": {"price": 100.50, "volume": 1_000_000}
    }
```

### 3. Access Payment Details with Dependency Injection

```python
from fastapi import Depends
from 402fly_fastapi import verify_payment_factory
from 402fly_core import PaymentAuthorization

@app.get("/expensive-data")
async def get_expensive_data(
    payment: PaymentAuthorization = Depends(
        verify_payment_factory(
            amount="1.00",
            description="Access to expensive AI model inference"
        )
    )
):
    """Access payment details in your endpoint"""
    return {
        "data": "AI-generated content",
        "payment_id": payment.payment_id,
        "amount_paid": payment.actual_amount,
        "transaction_hash": payment.transaction_hash,
    }
```

## Usage Patterns

### Pattern 1: Simple Decorator (Recommended)

Best for endpoints that don't need to access payment details:

```python
@app.get("/data")
@payment_required(amount="0.05", description="Data access")
async def get_data(request: Request):
    return {"data": "content"}
```

### Pattern 2: Dependency Injection

Best when you need to access payment details (transaction hash, amount, etc.):

```python
@app.get("/data")
async def get_data(
    payment: PaymentAuthorization = Depends(
        verify_payment_factory(amount="0.05", description="Data access")
    )
):
    return {
        "data": "content",
        "payment_id": payment.payment_id,
        "tx_hash": payment.transaction_hash,
    }
```

### Pattern 3: Dynamic Pricing

Adjust payment requirements based on parameters:

```python
@app.get("/tiered-data/{tier}")
@payment_required(amount="0.05", description="Tiered data access")
async def get_tiered_data(request: Request, tier: str):
    """Payment required regardless of tier"""
    tier_data = {
        "basic": {"quality": "720p"},
        "premium": {"quality": "4K"},
    }
    return {"tier": tier, "data": tier_data.get(tier)}
```

## Complete Example

```python
from fastapi import FastAPI, Depends, Request
from 402fly_fastapi import (
    payment_required,
    verify_payment_factory,
    Fly402Config,
    init_fly402
)
from 402fly_core import PaymentAuthorization
import os

# Initialize 402 config
config = Fly402Config(
    payment_address=os.getenv("FLY402_PAYMENT_ADDRESS"),
    token_mint=os.getenv("FLY402_TOKEN_MINT"),
    network=os.getenv("FLY402_NETWORK", "solana-devnet"),
)
init_fly402(config)

app = FastAPI()

@app.get("/")
async def root():
    """Public endpoint - no payment required"""
    return {"message": "Welcome to the API"}

@app.get("/premium")
@payment_required(amount="0.10", description="Premium data")
async def premium(request: Request):
    """Protected endpoint - payment required"""
    return {"data": "premium content"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Configuration

### Fly402Config Options

- `payment_address`: Your Solana wallet address for receiving payments
- `token_mint`: Token mint address (e.g., USDC on Solana)
- `network`: Network name (e.g., "solana-devnet", "solana-mainnet")
- `rpc_url`: Solana RPC endpoint URL

## Documentation

For complete API reference and guides, see:
- [Documentation](https://402fly.github.io/docs)
- [GitHub Repository](https://github.com/SerPepe/402fly)
- [Full Example](https://github.com/SerPepe/402fly/tree/main/examples/python/fastapi-server)

## Testing

```bash
pytest tests/
```

## License

MIT License - See [LICENSE](LICENSE) file for details.
