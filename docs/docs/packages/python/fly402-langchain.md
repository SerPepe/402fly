# 402fly LangChain

LangChain integration for the 402fly payment protocol.

## Installation

```bash
pip install fly402langchain
```

## Features

- Fly402PaymentTool for LangChain agents
- Fly402RequestsWrapper for automatic payment handling
- Convenience function for creating 402fly-enabled agents

## Usage

### Using Fly402PaymentTool

```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from fly402langchain import Fly402PaymentTool
from solders.keypair import Keypair

keypair = Keypair()

payment_tool = Fly402PaymentTool(
    wallet_keypair=keypair,
    max_payment="5.0"
)

agent = initialize_agent(
    tools=[payment_tool],
    llm=ChatOpenAI(),
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION
)

response = agent.run("Get premium data from https://api.example.com/data")
```

### Using Fly402RequestsWrapper

```python
from langchain.agents import load_tools
from fly402langchain import Fly402RequestsWrapper

requests_wrapper = 402flyRequestsWrapper(
    wallet_keypair=keypair,
    max_payment="1.0"
)

tools = load_tools(
    ["requests_all"],
    llm=ChatOpenAI(),
    requests_wrapper=requests_wrapper
)

agent = initialize_agent(tools=tools, llm=ChatOpenAI())
```

### Convenience Function

```python
from fly402langchain import create_x402_agent

agent = create_x402_agent(
    wallet_keypair=keypair,
    max_payment="5.0"
)

response = agent.run("Get premium data from API")
```

## License

MIT
