"""
Example FastAPI Server with 402 Payment Support

This example demonstrates how to add payment requirements to API endpoints.
"""
import os
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request
from fly402core import PaymentAuthorization
from fly402fastapi import (
    Fly402Config,
    init_fly402,
    payment_required,
    verify_payment_factory,
)

load_dotenv()

# Initialize 402 configuration from environment
payment_address = os.getenv("FLY402_PAYMENT_ADDRESS")
token_mint = os.getenv("FLY402_TOKEN_MINT")

if not payment_address or not token_mint:
    raise ValueError(
        "Missing required environment variables: "
        "FLY402_PAYMENT_ADDRESS and FLY402_TOKEN_MINT must be set. "
        "Copy .env.example to .env and fill in your wallet address and token mint."
    )

config = Fly402Config(
    payment_address=payment_address,
    token_mint=token_mint,
    network=os.getenv("FLY402_NETWORK", "solana-mainnet"),
    rpc_url=os.getenv("FLY402_RPC_URL"),
)
init_fly402(config)

app = FastAPI(
    title="402 Demo API",
    description="Example API with 402 payment requirements",
    version="0.1.0",
)


@app.get("/")
async def root():
    """Public endpoint - no payment required"""
    return {
        "message": "Welcome to 402 Demo API",
        "documentation": "/docs",
        "free_endpoint": "/free-data",
        "paid_endpoints": ["/premium-data", "/expensive-data"],
    }


@app.get("/free-data")
async def get_free_data():
    """Free data endpoint - no payment required"""
    return {
        "data": "This is free content available to everyone",
        "price": 0,
        "access": "public",
    }


@app.get("/premium-data")
@payment_required(
    amount=os.getenv("PREMIUM_DATA_PRICE", "5.00"),
    description="Access to premium market data",
)
async def get_premium_data(request: Request):
    """
    Premium data endpoint - requires payment (defaults to 5.00 units)

    This uses the decorator approach for payment enforcement.
    """
    return {
        "data": "This is premium content",
        "market_data": {
            "price": 100.50,
            "volume": 1_000_000,
            "timestamp": "2025-01-01T10:00:00Z",
        },
        "price_paid": os.getenv("PREMIUM_DATA_PRICE", "5.00"),
        "access": "premium",
    }


@app.get("/expensive-data")
async def get_expensive_data(
    payment: PaymentAuthorization = Depends(
        verify_payment_factory(
            amount="1.00",
            description="Access to expensive AI model inference",
        )
    )
):
    """
    Expensive endpoint - requires 1.00 units payment

    This uses the dependency injection approach, which gives you
    access to the payment authorization details.
    """
    return {
        "data": "This is very expensive AI-generated content",
        "model": "gpt-5-turbo",
        "result": "The meaning of life is 42, according to our advanced AI",
        "payment_id": payment.payment_id,
        "amount_paid": payment.actual_amount,
        "transaction_hash": payment.transaction_hash,
        "access": "premium-plus",
    }


@app.get("/tiered-data/{tier}")
@payment_required(
    amount="0.05",
    description="Tiered data access",
)
async def get_tiered_data(request: Request, tier: str):
    """
    Tiered endpoint with path parameter

    Payment is required regardless of tier, but could be customized
    based on the tier parameter in a real implementation.
    """
    tier_data = {
        "basic": {"quality": "720p", "ads": True},
        "standard": {"quality": "1080p", "ads": False},
        "premium": {"quality": "4K", "ads": False, "offline": True},
    }

    return {
        "tier": tier,
        "data": tier_data.get(tier, tier_data["basic"]),
        "price_paid": "0.05",
    }


if __name__ == "__main__":
    import uvicorn

    print("\n" + "=" * 60)
    print("🚀 Starting 402 Demo API Server")
    print("=" * 60)
    print(f"Payment Address: {config.payment_address}")
    print(f"Token Mint: {config.token_mint}")
    print(f"Network: {config.network}")
    print("\nEndpoints:")
    print("  - GET /          - API information (free)")
    print("  - GET /free-data - Free data (free)")
    print("  - GET /premium-data - Premium data (5.00 units)")
    print("  - GET /expensive-data - AI inference (1.00 units)")
    print("  - GET /tiered-data/{tier} - Tiered access (0.05 units)")
    print("\n📖 API Documentation: http://localhost:8000/docs")
    print("=" * 60 + "\n")

    uvicorn.run(app, host="0.0.0.0", port=8000)
