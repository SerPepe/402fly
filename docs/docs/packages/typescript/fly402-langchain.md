# @x402fly/langchain

LangChain.js integration for 402fly payment protocol.

## Installation

```bash
npm install @x402fly/langchain
```

## Features

- LangChain tools for 402fly payments
- AI agent payment handling
- Automatic payment workflows
- TypeScript support

## Usage

```typescript
import { 402flyPaymentTool } from '@x402fly/langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgent } from 'langchain/agents';

const paymentTool = new 402flyPaymentTool({
  wallet: keypair,
  maxPayment: '5.0'
});

const agent = await initializeAgent({
  tools: [paymentTool],
  llm: new ChatOpenAI()
});

const response = await agent.call({ input: 'Get premium data from API' });
```

## License

MIT