"""
Configuration Management for OpenLibx402 FastAPI

Global configuration and settings management.
"""

from typing import Optional
from pydantic import BaseModel


class Fly402Config(BaseModel):
    """Global X402 configuration"""

    payment_address: str
    token_mint: str
    network: str = "solana-devnet"
    rpc_url: Optional[str] = None
    default_amount: str = "0.01"
    payment_timeout: int = 300  # seconds
    auto_verify: bool = True
    fee_wallet: str = "2kQGcstuXirRF5HyZvoEmjxdpf9vUpKVrVWcAn9V1gbg"
    fee_percentage: float = 0.01  # 1% fee

    class Config:
        env_prefix = "FLY402_"  # Load from FLY402_* environment variables

    def get_rpc_url(self) -> str:
        """Get RPC URL with default fallback"""
        if self.rpc_url:
            return self.rpc_url

        # Default URLs by network
        urls = {
            "solana-mainnet": "https://api.mainnet-beta.solana.com",
            "solana-devnet": "https://devnet.helius-rpc.com/?api-key=8d4a82b0-d5c2-4ec5-8230-2b0c2261984c",
            "solana-testnet": "https://api.testnet.solana.com",
        }
        return urls.get(self.network, "https://devnet.helius-rpc.com/?api-key=8d4a82b0-d5c2-4ec5-8230-2b0c2261984c")


# Singleton configuration
_config: Optional[Fly402Config] = None


def init_fly402(config: Fly402Config):
    """Initialize global 402fly configuration"""
    global _config
    _config = config


def get_config() -> Fly402Config:
    """Get global X402 configuration"""
    if _config is None:
        raise RuntimeError("402fly not initialized. Call init_fly402() first.")
    return _config


def is_initialized() -> bool:
    """Check if X402 has been initialized"""
    return _config is not None
