# 402fly: Autonomous Payments for AI Agents

> Enable AI agents and web APIs to autonomously pay for services using HTTP 402 "Payment Required" and Solana blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## What is 402fly?

402fly is a library ecosystem that implements the [X402 protocol](https://www.x402.org/x402-whitepaper.pdf) - an open standard for enabling AI agents to autonomously pay for API access, data, and digital services using the HTTP 402 "Payment Required" status code and blockchain micropayments.

### Key Features

✨ **One-Line Integration** - Add payments to APIs with a single decorator  
🤖 **AI-Native** - Built specifically for autonomous agent workflows  
⚡ **Instant Settlement** - Payments settle in ~200ms on Solana  
💰 **Micropayments** - Support payments as low as $0.001  
🔐 **No Accounts** - No API keys, subscriptions, or manual billing  
🌐 **Chain-Agnostic Design** - Solana first, architected for multi-chain  
🛠️ **Framework Integrations** - FastAPI, LangChain, LangGraph, and more

## Quick Start

### Server (FastAPI)
```python
from fastapi import FastAPI
from fly402fastapi import payment_required

app = FastAPI()

@app.get("/premium-data")
@payment_required(
    amount="0.10",
    payment_address="YOUR_WALLET_ADDRESS",
    token_mint="USDC_MINT_ADDRESS"
)
async def get_premium_data():
    return {"data": "Premium content"}
```

### Client (Auto-Payment)
```python
from fly402client import Fly402AutoClient
from solders.keypair import Keypair

client = Fly402AutoClient(wallet_keypair=keypair)

# Automatically handles 402 and pays
response = await client.fetch("https://api.example.com/premium-data")
data = response.json()
```

### LangChain Agent
```python
from fly402langchain import create_x402_agent
from langchain.chat_models import ChatOpenAI

agent = create_x402_agent(
    wallet_keypair=keypair,
    llm=ChatOpenAI(),
    max_payment="5.0"
)

response = agent.run("Get premium market data from the API")
```

## How It Works

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│  AI Agent   │  ─1─→   │  API Server  │         │ Blockchain │
│   (Client)  │         │   (Server)   │         │  (Solana)  │
└─────────────┘         └──────────────┘         └────────────┘
       │                        │                        │
       │  GET /data             │                        │
       ├───────────────────────→│                        │
       │                        │                        │
       │  402 Payment Required  │                        │
       │  + Payment Details     │                        │
       │←───────────────────────┤                        │
       │                        │                        │
       │  Create & Broadcast    │                        │
       │  Payment Transaction   │                        │
       ├────────────────────────┼───────────────────────→│
       │                        │                        │
       │                        │   Verify Transaction   │
       │                        │←───────────────────────┤
       │                        │                        │
       │  GET /data             │                        │
       │  + Payment Auth Header │                        │
       ├───────────────────────→│                        │
       │                        │                        │
       │  200 OK + Data         │                        │
       │←───────────────────────┤                        │
```

## Documentation

📚 **[Technical Specification](402fly-technical-spec.md)** - Complete architecture and design  
📖 **[Quick Reference](quick-reference.md)** - Common patterns and examples  
📝 **[Project Summary](project-summary.md)** - Overview and next steps

## Packages

### Core
- **`402fly-core`** - Core protocol implementation
- **`@x402fly/core`** - TypeScript equivalent

### Server Frameworks
- **`402fly-fastapi`** - FastAPI middleware (Python)
- **`@x402fly/express`** - Express.js middleware (TypeScript)
- **`@x402fly/nextjs`** - Next.js API routes (TypeScript)
- **`@x402fly/hono`** - Hono middleware (TypeScript)

### Client Libraries
- **`402fly-client`** - HTTP client with payment support (Python)
- **`@x402fly/client`** - TypeScript client

### AI Agent Integrations
- **`402fly-langchain`** - LangChain Tool & Middleware (Python)
- **`402fly-langgraph`** - LangGraph nodes (Python)
- **`@x402fly/langchain`** - TypeScript LangChain integration
- **`@x402fly/langgraph`** - TypeScript LangGraph integration

## Use Cases

### For API Providers
- 💵 Monetize APIs with pay-per-use pricing
- 🚫 Eliminate API key management
- ⚡ Instant payment settlement
- 🛡️ No chargebacks or fraud risk

### For AI Agents
- 🔓 Access premium data without human intervention
- 💰 Pay exactly for what you use
- 🌍 No geographic restrictions
- 🤖 Fully autonomous operation

### Real-World Examples
- 📊 Research agent paying per financial data point
- 🎯 Trading bot accessing real-time market data
- 📰 Content aggregator paying per article
- 🖼️ Image generation API charging per image
- ☁️ GPU compute charged per minute

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ FastAPI  │  │LangChain │  │LangGraph │             │
│  │ Middleware│  │   Tool   │  │  Nodes   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼─────────────┼──────────────────────┘
        │             │             │
┌───────┴─────────────┴─────────────┴──────────────────────┐
│              402fly-core / @x402fly/core              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Payment    │  │    Solana    │  │     Error     │  │
│  │    Models    │  │  Processor   │  │   Handling    │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────────────────────┴──────────────────────────────┐
│                   Blockchain Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Solana  │  │ Ethereum │  │   Base   │  (Future)    │
│  │  Devnet  │  │ Mainnet  │  │    L2    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└──────────────────────────────────────────────────────────┘
```

## Development Status

### ✅ Phase 1: Python 
- ✅ Technical specification complete
- ✅ Core package (Python)
- ✅ FastAPI integration
- ✅ Client library
- ✅ LangChain integration
- ✅ LangGraph integration
- ✅ Example implementations

### 🏗️ Phase 2: TypeScript
- ✅ Core package (TypeScript)
- ✅ Express.js middleware
- ✅ Client library (TS)
- ✅ LangChain.js integration
- ✅ LangGraph.js integration
- 🏗️ Next.js integration


### 🔲 Phase 3: Ecosystem
- [ ] Flask middleware
- [ ] Django middleware
- [ ] Hono middleware
- [ ] Additional agent frameworks
- [ ] CLI tools

### 🔲 Phase 4: Advanced
- [ ] Multi-chain support (Ethereum, Base)
- [ ] Payment batching
- [ ] Admin dashboard
- [ ] Analytics & monitoring
- [ ] Browser extension

## Installation (When Available)

### Python
```bash
pip install fly402core 402fly-fastapi 402fly-client
pip install fly402langchain 402fly-langgraph
```

### TypeScript
```bash
npm install @x402fly/core @x402fly/express @x402fly/client
npm install @x402fly/langchain @x402fly/langgraph
```

## Examples

### FastAPI Server
```python
from fastapi import FastAPI
from fly402fastapi import Fly402Config, init_fly402, payment_required

# Initialize X402
config = Fly402Config(
    payment_address="YOUR_WALLET",
    token_mint="USDC_MINT",
    network="solana-devnet"
)
init_fly402(config)

app = FastAPI()

@app.get("/basic-data")
async def get_basic_data():
    return {"data": "Free content"}

@app.get("/premium-data")
@payment_required(amount="0.10", description="Premium market data")
async def get_premium_data():
    return {"data": "Premium content", "price": 100.50}
```

### LangChain Agent
```python
from langchain.chat_models import ChatOpenAI
from fly402langchain import create_x402_agent
from solders.keypair import Keypair

# Load wallet
keypair = Keypair()

# Create agent with X402 support
agent = create_x402_agent(
    wallet_keypair=keypair,
    llm=ChatOpenAI(),
    max_payment="5.0"
)

# Agent can now autonomously pay for API access
response = agent.run(
    "Get the latest market data from https://api.example.com/premium-data "
    "and summarize the key trends"
)
```

### LangGraph Workflow
```python
from typing import TypedDict
from langgraph.graph import StateGraph, END
from fly402langgraph import payment_node, check_payment_required
from solders.keypair import Keypair

class AgentState(TypedDict):
    api_url: str
    api_response: str
    payment_required: bool
    payment_completed: bool
    wallet_keypair: Keypair

workflow = StateGraph(AgentState)

workflow.add_node("fetch", fetch_api_node)
workflow.add_node("pay", payment_node)  # From 402fly-langgraph
workflow.add_node("process", process_node)

workflow.set_entry_point("fetch")

workflow.add_conditional_edges(
    "fetch",
    check_payment_required,
    {
        "payment_required": "pay",
        "success": "process",
        "error": END
    }
)

workflow.add_edge("pay", "fetch")
workflow.add_edge("process", END)

app = workflow.compile()
```

## Configuration

### Environment Variables
```bash
FLY402_PAYMENT_ADDRESS=YourServiceWalletAddress
X402_TOKEN_MINT=USDC_MINT_ADDRESS
X402_NETWORK=solana-devnet
X402_RPC_URL=https://api.devnet.solana.com
```

### Code Configuration
```python
from fly402fastapi import Fly402Config

config = Fly402Config(
    payment_address="YOUR_WALLET",
    token_mint="USDC_MINT",
    network="solana-devnet",
    rpc_url="https://api.devnet.solana.com",
    payment_timeout=300,  # 5 minutes
    auto_verify=True
)
```

## Security

🔐 **Key Security Features:**
- Private keys never leave client
- On-chain transaction verification
- Nonce-based replay protection
- Payment expiration timestamps
- Maximum payment limits
- HTTPS required for production

⚠️ **Security Best Practices:**
- Never log private keys
- Use environment variables for secrets
- Validate all payment fields
- Set reasonable payment timeouts
- Implement rate limiting
- Use hardware wallets in production

## Testing

### Mock Payment Processor
```python
from fly402core.testing import MockSolanaPaymentProcessor

processor = MockSolanaPaymentProcessor()
processor.balance = 100.0

# Use in tests without real blockchain
client = Fly402AutoClient(wallet_keypair=test_keypair)
client.client.processor = processor
```

### Test Server
```python
from fly402core.testing import TestServer

server = TestServer(
    payment_address="test_address",
    token_mint="test_usdc"
)
server.start(port=8402)

# Test against mock server
# ...
```

## Contributing

We welcome contributions! Here's how you can help:

1. 🐛 Report bugs via GitHub Issues
2. 💡 Suggest features or improvements
3. 📝 Improve documentation
4. 🔧 Submit pull requests
5. ⭐ Star the repository

### Development Setup
```bash
# Clone repository
git clone https://github.com/SerPepe/402fly.git
cd 402fly

# Install development dependencies
pip install -e "packages/python/402fly-core[dev]"

# Run tests
pytest

# Format code
black packages/python/
```

## Roadmap

### Q4 2025
- ✅ Technical specification
- ✅ Core libraries (Python & TypeScript)
- ✅ FastAPI integration
- ✅ LangChain/LangGraph integrations
- ✅ Express.js, Next.js integrations
- ✅ Documentation site
- 🔲 Additional framework support
- 🔲 CLI tools

### 2026
- 🔲 Multi-chain support (Ethereum, Base)
- 🔲 Admin dashboard
- 🔲 Analytics & monitoring
- 🔲 Production deployments
- 🔲 Browser extension
- 🔲 Wallet UI components
- 🔲 Zapier/Make.com integrations
- 🔲 Enterprise features

## FAQ

**Q: Why Solana first?**  
A: Solana offers ~200ms transaction finality and <$0.0001 fees, making it ideal for micropayments.

**Q: Will this support other blockchains?**  
A: Yes! The architecture is designed to be chain-agnostic. Ethereum and Base L2 support is planned.

**Q: Do I need crypto knowledge to use this?**  
A: Minimal. The libraries handle blockchain complexity. You just need a wallet and some tokens.

**Q: Is this production-ready?**  
A: Not yet. We're currently in development. Follow progress on GitHub.

**Q: How much do transactions cost?**  
A: On Solana devnet/mainnet, transaction fees are <$0.0001. Payment amounts are configurable.

**Q: Can agents really operate autonomously?**  
A: Yes! Once configured with a wallet, agents can discover, pay for, and use APIs without human intervention.

## Resources

- 📄 [X402 Whitepaper](https://www.x402.org/x402-whitepaper.pdf)
- 🌐 [X402 Protocol Website](https://www.x402.org)
- 📚 [Solana Documentation](https://docs.solana.com)
- 🔗 [SPL Token Program](https://spl.solana.com/token)
- 🦜 [LangChain Docs](https://python.langchain.com)
- 🕸️ [LangGraph Docs](https://langchain-ai.github.io/langgraph)

## Community

- 💬 [Discord](#) - Coming soon
- 🐦 [Twitter](https://x.com/402fly) - @402fly
- 📧 [Email](mailto:x402@github.com/SerPepe/402fly) - x402@github.com/SerPepe/402fly

## License

402fly is released under the [MIT License](https://github.com/SerPepe/402fly/blob/main/LICENSE).

## Acknowledgments

- Built on the [X402 protocol](https://www.x402.org) by Coinbase
- Powered by [Solana](https://solana.com) blockchain
- Integrates with [LangChain](https://langchain.com) and [LangGraph](https://langchain-ai.github.io/langgraph)

---

**Built with ❤️ for the autonomous AI economy**

[Documentation](402fly-technical-spec.md) | [Examples](#examples) | [Contribute](#contributing)
