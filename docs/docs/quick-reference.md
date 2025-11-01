# 402fly Quick Reference Guide

## Installation

```bash
# Python
pip install 402fly-core 402fly-fastapi 402fly-client
pip install 402fly-langchain 402fly-langgraph

# TypeScript
npm install @402fly/core @402fly/fastapi @402fly/client
npm install @402fly/langchain @402fly/langgraph
```

---

## FastAPI Server Examples

### Simple Decorator Approach
```python
from fastapi import FastAPI
from 402fly_fastapi import payment_required

app = FastAPI()

@app.get("/premium-data")
@payment_required(
    amount="0.10",
    payment_address="YOUR_WALLET_ADDRESS",
    token_mint="FLY402_TOKEN_MINT",
    network="solana-devnet",
    description="Access to premium market data"
)
async def get_premium_data():
    return {"data": "Premium content", "price": 100.50}
```

### Dependency Injection Approach
```python
from fastapi import FastAPI, Depends
from 402fly_fastapi import verify_payment_factory, PaymentAuthorization

app = FastAPI()

@app.get("/expensive-data")
async def get_expensive_data(
    payment: PaymentAuthorization = Depends(
        verify_payment_factory(
            amount="1.00",
            payment_address="YOUR_WALLET_ADDRESS",
            token_mint="FLY402_TOKEN_MINT"
        )
    )
):
    return {
        "data": "Very expensive content",
        "payment_id": payment.payment_id,
        "amount_paid": payment.actual_amount
    }
```

### Global Configuration
```python
from 402fly_fastapi import Fly402Config, init_fly402

config = Fly402Config(
    payment_address="YOUR_WALLET_ADDRESS",
    token_mint="FLY402_TOKEN_MINT",
    network="solana-devnet",
    default_amount="0.01"
)
init_fly402(config)

@app.get("/data")
@payment_required(amount="0.05")  # Uses global config
async def get_data():
    return {"data": "content"}
```

---

## Client Examples

### Explicit Client (Manual Control)
```python
from 402fly_client import Fly402Client
from solders.keypair import Keypair

# Load wallet
keypair = Keypair()  # Or load from file

# Create client
client = Fly402Client(
    wallet_keypair=keypair,
    rpc_url="https://api.devnet.solana.com"
)

# Make initial request
response = await client.get("https://api.example.com/premium-data")

# Check if payment required
if client.payment_required(response):
    # Parse payment details
    payment_request = client.parse_payment_request(response)
    print(f"Payment required: {payment_request.max_amount_required} USDC")
    
    # Create and send payment
    authorization = await client.create_payment(payment_request)
    
    # Retry with payment
    response = await client.get(
        "https://api.example.com/premium-data",
        payment=authorization
    )

data = response.json()
print(data)
```

### Implicit Client (Auto-Payment)
```python
from 402fly_client import Fly402AutoClient
from solders.keypair import Keypair

# Load wallet
keypair = Keypair()

# Create auto-client
client = Fly402AutoClient(
    wallet_keypair=keypair,
    max_payment_amount="5.0"  # Safety limit
)

# Make request - automatically handles 402 and payment
response = await client.fetch("https://api.example.com/premium-data")
data = response.json()
print(data)

# Disable auto-retry for specific request
response = await client.fetch(
    "https://api.example.com/data",
    auto_retry=False
)
```

---

## LangChain Examples

### Using X402PaymentTool
```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from 402fly_langchain import X402PaymentTool
from solders.keypair import Keypair

# Load wallet
keypair = Keypair()

# Create payment tool
payment_tool = X402PaymentTool(
    wallet_keypair=keypair,
    max_payment="5.0",
    name="pay_for_api",
    description="Make payment to access premium API data"
)

# Create agent with payment tool
agent = initialize_agent(
    tools=[payment_tool],
    llm=ChatOpenAI(temperature=0),
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Agent can now pay for APIs
response = agent.run(
    "Get me the premium market data from https://api.example.com/premium-data"
)
print(response)
```

### Using X402RequestsWrapper (Middleware)
```python
from langchain.agents import load_tools, initialize_agent, AgentType
from langchain.chat_models import ChatOpenAI
from 402fly_langchain import X402RequestsWrapper
from solders.keypair import Keypair

# Load wallet
keypair = Keypair()

# Create X402-enabled requests wrapper
requests_wrapper = X402RequestsWrapper(
    wallet_keypair=keypair,
    max_payment="1.0"
)

# Load standard tools with X402 wrapper
tools = load_tools(
    ["requests_all"],
    llm=ChatOpenAI(),
    requests_wrapper=requests_wrapper
)

# Create agent
agent = initialize_agent(
    tools=tools,
    llm=ChatOpenAI(temperature=0),
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# All HTTP requests automatically handle X402 payments
response = agent.run("Fetch data from https://api.example.com/premium-data")
```

### Convenience Function
```python
from 402fly_langchain import create_x402_agent
from langchain.chat_models import ChatOpenAI
from solders.keypair import Keypair

# Load wallet
keypair = Keypair()

# Create agent with X402 support (one function!)
agent = create_x402_agent(
    wallet_keypair=keypair,
    llm=ChatOpenAI(),
    max_payment="5.0"
)

response = agent.run("Get premium data from API")
```

---

## LangGraph Examples

### Basic Payment Node
```python
from typing import TypedDict
from langgraph.graph import StateGraph, END
from 402fly_langgraph import payment_node, check_payment_required
from 402fly_client import Fly402AutoClient
from solders.keypair import Keypair

# Define state
class AgentState(TypedDict):
    api_url: str
    api_response: str
    payment_required: bool
    payment_completed: bool
    payment_error: str | None
    wallet_keypair: Keypair

# Load wallet
keypair = Keypair()

# Build workflow
workflow = StateGraph(AgentState)

workflow.add_node("fetch_api", fetch_api_node)
workflow.add_node("make_payment", payment_node)  # From 402fly-langgraph
workflow.add_node("process", process_response_node)

workflow.set_entry_point("fetch_api")

# Conditional edge based on payment
workflow.add_conditional_edges(
    "fetch_api",
    check_payment_required,  # From 402fly-langgraph
    {
        "payment_required": "make_payment",
        "success": "process",
        "error": END
    }
)

workflow.add_edge("make_payment", "fetch_api")  # Retry after payment
workflow.add_edge("process", END)

# Compile and run
app = workflow.compile()
result = app.invoke({
    "api_url": "https://api.example.com/data",
    "wallet_keypair": keypair,
})
```

### Combined Fetch-and-Pay Node
```python
from 402fly_client import Fly402AutoClient

async def fetch_with_payment_node(state: AgentState) -> AgentState:
    """Node that fetches API and handles payment automatically"""
    client = Fly402AutoClient(
        wallet_keypair=state["wallet_keypair"],
        max_payment_amount="1.0"
    )
    
    try:
        response = await client.fetch(state["api_url"])
        state["api_response"] = response.text
        state["payment_completed"] = True
    except Exception as e:
        state["payment_error"] = str(e)
    
    return state

# Use in workflow
workflow.add_node("fetch", fetch_with_payment_node)
```

---

## Error Handling

### Catching Specific Errors
```python
from 402fly_core import (
    InsufficientFundsError,
    PaymentExpiredError,
    PaymentVerificationError,
    TransactionBroadcastError
)
from 402fly_client import Fly402AutoClient

client = Fly402AutoClient(wallet_keypair=keypair)

try:
    response = await client.fetch("https://api.example.com/data")
    
except InsufficientFundsError as e:
    print(f"Insufficient funds: need {e.required_amount}, have {e.available_amount}")
    # Prompt user to add funds
    
except PaymentExpiredError as e:
    print("Payment request expired, retrying...")
    # Automatically handled by auto-client, but you can catch it
    
except TransactionBroadcastError as e:
    print(f"Transaction failed: {e.message}")
    # Check network connection
    
except PaymentVerificationError as e:
    print(f"Payment verification failed: {e.message}")
    # Contact API provider
```

### Handling All X402 Errors
```python
from 402fly_core import Fly402Error

try:
    response = await client.fetch("https://api.example.com/data")
except Fly402Error as e:
    print(f"X402 Error: {e.code}")
    print(f"Message: {e.message}")
    print(f"Details: {e.details}")
```

---

## Configuration

### Environment Variables
```bash
# .env file
FLY402_PAYMENT_ADDRESS=YourSolanaWalletAddress
FLY402_TOKEN_MINT=YOUR_TOKEN_MINT_ADDRESS
FLY402_NETWORK=solana-devnet
FLY402_RPC_URL=https://api.devnet.solana.com
FLY402_DEFAULT_AMOUNT=0.01
```

```python
from 402fly_fastapi import Fly402Config, init_fly402
import os
from dotenv import load_dotenv

load_dotenv()

config = Fly402Config(
    payment_address=os.getenv("FLY402_PAYMENT_ADDRESS"),
    token_mint=os.getenv("FLY402_TOKEN_MINT"),
    network=os.getenv("FLY402_NETWORK", "solana-devnet"),
    rpc_url=os.getenv("FLY402_RPC_URL"),
)

init_fly402(config)
```

---

## Testing

### Mock Payment Processor
```python
from 402fly_core.testing import MockSolanaPaymentProcessor

# Use in tests
processor = MockSolanaPaymentProcessor()
processor.balance = 100.0  # Set mock balance

client = Fly402AutoClient(wallet_keypair=test_keypair)
client.client.processor = processor

# Make requests without real blockchain
response = await client.fetch("http://localhost:8000/data")

# Check mock transactions
assert len(processor.transactions) == 1
```

### Test Server
```python
from 402fly_core.testing import TestServer

# Create test server
server = TestServer(
    payment_address="test_address",
    token_mint="test_usdc"
)

@server.require_payment(amount="0.10", resource="/test")
async def test_endpoint():
    return {"data": "test"}

server.start(port=8402)

# Test against mock server
# ...

server.stop()
```

---

## Wallet Setup

### Creating a New Wallet
```python
from solders.keypair import Keypair
import json

# Generate new keypair
keypair = Keypair()

# Save to file
wallet_data = list(bytes(keypair))
with open("wallet.json", "w") as f:
    json.dump(wallet_data, f)

print(f"Wallet address: {keypair.pubkey()}")
```

### Loading Wallet
```python
from solders.keypair import Keypair
import json

# Load from file
with open("wallet.json") as f:
    wallet_data = json.load(f)
    keypair = Keypair.from_bytes(bytes(wallet_data))

print(f"Loaded wallet: {keypair.pubkey()}")
```

### Getting Devnet SOL (for fees)
```bash
# Use Solana CLI
solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet

# Or use web faucet
# https://faucet.solana.com
```

---

## Common Patterns

### Retry Configuration
```python
from 402fly_client import Fly402AutoClient, RetryConfig

config = RetryConfig(
    enabled=True,
    max_retries=1,
    retry_on_402=True,
    retry_on_network_error=True
)

client = Fly402AutoClient(
    wallet_keypair=keypair,
    retry_config=config
)
```

### Custom Payment Amount
```python
# Pay custom amount (less than max required)
response = await client.get("https://api.example.com/data")

if client.payment_required(response):
    request = client.parse_payment_request(response)
    # Pay 50% of requested amount (if API supports it)
    auth = await client.create_payment(request, amount="0.05")
    response = await client.get(url, payment=auth)
```

### Multiple APIs
```python
# Configure client with higher payment limit
client = Fly402AutoClient(
    wallet_keypair=keypair,
    max_payment_amount="10.0"
)

# Fetch from multiple paid APIs
data1 = await client.fetch("https://api1.example.com/data")
data2 = await client.fetch("https://api2.example.com/data")
data3 = await client.fetch("https://api3.example.com/data")

# Client automatically handles payment for each
```

---

## Devnet Quick Start

```bash
# 1. Install packages
pip install 402fly-core 402fly-fastapi 402fly-client

# 2. Create wallet
python -c "from solders.keypair import Keypair; import json; kp = Keypair(); \
json.dump(list(bytes(kp)), open('wallet.json', 'w')); \
print(f'Address: {kp.pubkey()}')"

# 3. Get devnet SOL
solana airdrop 1 <YOUR_ADDRESS> --url devnet

# 4. Run example server
cd examples/fastapi-server
pip install -r requirements.txt
python main.py

# 5. Run example client
cd examples/langchain-agent
pip install -r requirements.txt
python main.py
```

---

## Production Checklist

- [ ] Use mainnet RPC URL
- [ ] Use real USDC mint address
- [ ] Never log private keys
- [ ] Use HTTPS for all APIs
- [ ] Implement rate limiting
- [ ] Set up monitoring
- [ ] Configure reasonable payment timeouts
- [ ] Implement proper error handling
- [ ] Use environment variables for config
- [ ] Test with small amounts first
- [ ] Set maximum payment limits
- [ ] Implement wallet balance monitoring

---

## Resources

- **X402 Whitepaper**: https://www.x402.org/x402-whitepaper.pdf
- **Solana Docs**: https://docs.solana.com
- **SPL Token**: https://spl.solana.com/token
- **FastAPI**: https://fastapi.tiangolo.com
- **LangChain**: https://python.langchain.com
- **LangGraph**: https://langchain-ai.github.io/langgraph

---

## Common Issues

### "Insufficient Funds" Error
- Check wallet balance: `solana balance <ADDRESS> --url devnet`
- Ensure you have both SOL (for fees) and USDC (for payment)

### "Transaction Failed" Error
- Check network connectivity
- Verify RPC endpoint is accessible
- Ensure devnet is not experiencing issues

### "Payment Verification Failed"
- Transaction may not be confirmed yet
- Check transaction on Solana Explorer
- Verify payment address and amount are correct

### Import Errors
- Ensure all packages are installed
- Check Python version (requires 3.8+)
- Verify virtual environment is activated

---

**Happy Building! 🚀**
