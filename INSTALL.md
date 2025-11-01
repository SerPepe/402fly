# Installation Guide

Complete installation guide for 402fly.

## Prerequisites

- Python 3.8 or higher
- pip package manager
- (Optional) Solana CLI for wallet management
- (Optional) OpenAI API key for LangChain examples

## Basic Installation

### Install from PyPI (When Published)

```bash
# Core protocol
pip install 402fly-core

# FastAPI integration
pip install 402fly-fastapi

# HTTP client
pip install 402fly-client

# LangChain integration
pip install 402fly-langchain

# LangGraph integration
pip install 402fly-langgraph

# Install all packages
pip install 402fly-core 402fly-fastapi 402fly-client 402fly-langchain 402fly-langgraph
```

### Install from Source

```bash
# Clone the repository
git clone https://github.com/402fly/402fly.git
cd 402fly

# Install packages in development mode
pip install -e packages/python/402fly-core
pip install -e packages/python/402fly-fastapi
pip install -e packages/python/402fly-client
pip install -e packages/python/402fly-langchain
pip install -e packages/python/402fly-langgraph
```

## Solana Setup

### Install Solana CLI (Optional)

```bash
# On Linux/Mac
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Verify installation
solana --version
```

### Create Wallet

```bash
# Using Solana CLI
solana-keygen new --outfile ~/.config/solana/wallet.json

# Using Python
python -c "from solders.keypair import Keypair; import json; kp = Keypair(); json.dump(list(bytes(kp)), open('wallet.json', 'w')); print(f'Address: {kp.pubkey()}')"
```

### Fund Wallet (Devnet)

```bash
# Get devnet SOL for transaction fees
solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet

# Check balance
solana balance YOUR_WALLET_ADDRESS --url devnet
```

### Get USDC (Devnet)

1. Visit Solana devnet faucets
2. Or use a devnet DEX to swap SOL for devnet USDC
3. Devnet USDC mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

## Framework-Specific Setup

### FastAPI Server

```bash
# Install FastAPI dependencies
pip install 402fly-core 402fly-fastapi
pip install fastapi uvicorn

# Create .env file
cat > .env << EOF
PAYMENT_WALLET_ADDRESS=YOUR_WALLET_ADDRESS
USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
SOLANA_RPC_URL=https://api.devnet.solana.com
EOF
```

### LangChain Agent

```bash
# Install LangChain dependencies
pip install 402fly-core 402fly-client 402fly-langchain
pip install langchain openai

# Set OpenAI API key
export OPENAI_API_KEY='your-key-here'

# Create wallet
python -c "from solders.keypair import Keypair; import json; kp = Keypair(); json.dump(list(bytes(kp)), open('wallet.json', 'w'))"
```

### LangGraph Workflow

```bash
# Install LangGraph dependencies
pip install 402fly-core 402fly-client 402fly-langgraph
pip install langgraph langchain

# Create wallet
python -c "from solders.keypair import Keypair; import json; kp = Keypair(); json.dump(list(bytes(kp)), open('wallet.json', 'w'))"
```

## Development Installation

For development and testing:

```bash
# Clone repository
git clone https://github.com/402fly/402fly.git
cd 402fly

# Install all packages with dev dependencies
pip install -e "packages/python/402fly-core[dev]"
pip install -e "packages/python/402fly-fastapi[dev]"
pip install -e "packages/python/402fly-client[dev]"
pip install -e "packages/python/402fly-langchain[dev]"
pip install -e "packages/python/402fly-langgraph[dev]"

# Install development tools
pip install black ruff mypy pytest pytest-asyncio

# Run tests
pytest
```

## Verification

Verify your installation:

```python
# Check core package
from 402fly_core import PaymentRequest
print("✅ 402fly-core installed")

# Check FastAPI package
from 402fly_fastapi import payment_required
print("✅ 402fly-fastapi installed")

# Check client package
from 402fly_client import Fly402AutoClient
print("✅ 402fly-client installed")

# Check LangChain package
from 402fly_langchain import create_x402_agent
print("✅ 402fly-langchain installed")

# Check LangGraph package
from 402fly_langgraph import payment_node
print("✅ 402fly-langgraph installed")
```

## Troubleshooting

### Import Errors

```bash
# Ensure packages are installed
pip list | grep 402fly

# Reinstall if needed
pip install --force-reinstall 402fly-core
```

### Solana Connection Issues

```bash
# Test RPC connection
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'

# Try different RPC endpoint
export SOLANA_RPC_URL='https://api.devnet.solana.com'
```

### Wallet Issues

```bash
# Check wallet file format
python -c "import json; print(json.load(open('wallet.json'))[:5])"

# Verify wallet address
solana-keygen pubkey wallet.json
```

### Missing Dependencies

```bash
# Install all Solana dependencies
pip install solana solders spl-token

# Install all FastAPI dependencies
pip install fastapi uvicorn pydantic

# Install all LangChain dependencies
pip install langchain langchain-openai
```

## Next Steps

1. **Run Examples**: Try the example implementations in the `examples/` directory
2. **Read Documentation**: Check out the [Technical Specification](docs/402fly-technical-spec.md)
3. **Join Community**: Participate in discussions and contribute
4. **Build Something**: Start integrating X402 into your project!

## Support

- 📖 [Documentation](docs/)
- 💬 [GitHub Discussions](https://github.com/402fly/402fly/discussions)
- 🐛 [Report Issues](https://github.com/402fly/402fly/issues)
- 📧 Email: hello@402fly.org
