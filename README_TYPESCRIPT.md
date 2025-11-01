# 402fly - TypeScript/Node.js Implementation

Complete TypeScript/Node.js implementation of the X402 payment protocol for autonomous AI agent payments.

## Overview

402fly brings HTTP 402 "Payment Required" to life using Solana blockchain for micropayments. This TypeScript implementation provides the same functionality as the Python version, with full support for Express.js, LangChain.js, and LangGraph.js.

## 🎯 Key Features

- **TypeScript-first** - Full type safety and IntelliSense support
- **Express.js Integration** - Easy-to-use middleware for API monetization
- **Automatic Payment Handling** - Clients handle 402 responses transparently
- **AI Agent Support** - LangChain.js and LangGraph.js integrations
- **Solana Blockchain** - SPL token payments on Solana (devnet/mainnet)
- **Type-safe** - Complete TypeScript definitions

## 📦 Packages

### Core Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@402fly/core](./packages/typescript/402fly-core) | Core models, errors, and Solana processor | 0.1.0 |
| [@402fly/client](./packages/typescript/402fly-client) | HTTP clients with payment handling | 0.1.0 |
| [@402fly/express](./packages/typescript/402fly-express) | Express.js middleware | 0.1.0 |

### AI Agent Integration

| Package | Description | Version |
|---------|-------------|---------|
| [@402fly/langchain](./packages/typescript/402fly-langchain) | LangChain.js tools | 0.1.0 |
| [@402fly/langgraph](./packages/typescript/402fly-langgraph) | LangGraph.js workflow nodes | 0.1.0 |

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/402fly.git
cd 402fly

# Install and build all TypeScript packages
cd packages/typescript/402fly-core
npm install && npm run build

cd ../402fly-client
npm install && npm run build

cd ../402fly-express
npm install && npm run build

cd ../402fly-langchain
npm install && npm run build

cd ../402fly-langgraph
npm install && npm run build
```

### Running the Express.js Example

```bash
cd examples/express-server
npm install
npm run build
npm start
```

Server will start at `http://localhost:3000`.

## 💡 Usage Examples

### Server Side (Express.js)

```typescript
import express from 'express';
import { Fly402Config, initFly402, paymentRequired } from '@402fly/express';

const app = express();

// Initialize X402
const config = new Fly402Config({
  paymentAddress: process.env.FLY402_PAYMENT_ADDRESS!,
  tokenMint: process.env.FLY402_TOKEN_MINT!,
  network: 'solana-devnet',
});
initFly402(config);

// Free endpoint
app.get('/free-data', (req, res) => {
  res.json({ data: 'Free content' });
});

// Paid endpoint (requires 0.10 USDC)
app.get(
  '/premium-data',
  paymentRequired({
    amount: '0.10',
    description: 'Access to premium data',
  }),
  (req, res) => {
    res.json({ data: 'Premium content' });
  }
);

app.listen(3000);
```

### Client Side (Automatic Payments)

```typescript
import { Keypair } from '@solana/web3.js';
import { Fly402AutoClient } from '@402fly/client';

// Load wallet
const keypair = Keypair.fromSecretKey(/* your secret key */);

// Create client with automatic payment handling
const client = new Fly402AutoClient(keypair, 'https://api.devnet.solana.com', {
  maxPaymentAmount: '5.0', // Safety limit
});

// Request automatically handles payment if required
const response = await client.get('http://localhost:3000/premium-data');
console.log(response.data); // Premium content

await client.close();
```

### Client Side (Manual Payment Control)

```typescript
import { Fly402Client } from '@402fly/client';
import { Keypair } from '@solana/web3.js';

const keypair = Keypair.fromSecretKey(/* your secret key */);
const client = new Fly402Client(keypair);

// Make initial request
let response = await client.get('http://localhost:3000/premium-data');

// Check if payment required
if (client.paymentRequired(response)) {
  const paymentRequest = client.parsePaymentRequest(response);

  // Create payment
  const authorization = await client.createPayment(paymentRequest);

  // Retry with payment
  response = await client.get('http://localhost:3000/premium-data', {
    payment: authorization,
  });
}

console.log(response.data);
await client.close();
```

### LangChain.js Integration

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { X402PaymentTool } from '@402fly/langchain';
import { Keypair } from '@solana/web3.js';

const keypair = Keypair.fromSecretKey(/* your secret key */);

// Create payment tool
const paymentTool = new X402PaymentTool({
  walletKeypair: keypair,
  maxPayment: '5.0',
});

// Create agent with payment capability
const llm = new ChatOpenAI({ temperature: 0 });
const tools = [paymentTool];

const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  /* prompt */
});

const executor = new AgentExecutor({
  agent,
  tools,
});

// Agent can now make payments autonomously
await executor.invoke({
  input: 'Fetch premium data from http://localhost:3000/premium-data',
});
```

### LangGraph.js Integration

```typescript
import { StateGraph } from '@langchain/langgraph';
import { fetchWithPaymentNode, checkPaymentCompleted } from '@402fly/langgraph';
import { Keypair } from '@solana/web3.js';

const keypair = Keypair.fromSecretKey(/* your secret key */);

// Define state
interface State {
  wallet_keypair: Keypair;
  api_url: string;
  api_response?: string;
  payment_completed?: boolean;
}

// Create workflow
const workflow = new StateGraph<State>({
  channels: {
    wallet_keypair: null,
    api_url: null,
    api_response: null,
    payment_completed: null,
  },
});

// Add payment node
workflow.addNode('fetch_api', fetchWithPaymentNode);

// Execute workflow
const result = await workflow.invoke({
  wallet_keypair: keypair,
  api_url: 'http://localhost:3000/premium-data',
});

console.log(result.api_response);
```

## 🏗️ Architecture

### Payment Flow

```
1. Client → Server: GET /premium-data
2. Server → Client: 402 Payment Required + PaymentRequest JSON
3. Client: Creates Solana SPL token transfer
4. Client: Signs and broadcasts transaction
5. Client → Server: GET /premium-data + X-Payment-Authorization header
6. Server: Verifies payment on-chain
7. Server → Client: 200 OK + Data
```

### Package Dependencies

```
@402fly/langgraph
    ↓
@402fly/langchain
    ↓
@402fly/express → @402fly/client → @402fly/core
                         ↓
                    @solana/web3.js
                    @solana/spl-token
```

## 📚 API Reference

### @402fly/core

**Models:**
- `PaymentRequest` - Payment request from 402 response
- `PaymentAuthorization` - Signed payment authorization

**Errors:**
- `Fly402Error` - Base error class
- `PaymentRequiredError` - 402 response received
- `PaymentExpiredError` - Payment request expired
- `InsufficientFundsError` - Insufficient wallet balance
- `PaymentVerificationError` - Payment verification failed
- `TransactionBroadcastError` - Transaction broadcast failed
- `InvalidPaymentRequestError` - Invalid payment request format

**Processor:**
- `SolanaPaymentProcessor` - Handles Solana blockchain operations

### @402fly/client

**Clients:**
- `Fly402Client` - Manual payment control
- `Fly402AutoClient` - Automatic payment handling

### @402fly/express

**Middleware:**
- `paymentRequired(options)` - Protect routes with payment requirement
- `initFly402(config)` - Initialize global configuration
- `getConfig()` - Get global configuration

**Types:**
- `Fly402Config` - Configuration class
- `X402Request` - Extended Express request with payment

### @402fly/langchain

**Tools:**
- `X402PaymentTool` - LangChain tool for payments
- `createX402PaymentTool()` - Factory function

### @402fly/langgraph

**Nodes:**
- `paymentNode` - Handle payment in workflow
- `fetchWithPaymentNode` - Combined fetch + payment
- `checkPaymentRequired` - Conditional edge function
- `checkPaymentCompleted` - Check payment status

## 🧪 Testing

```bash
# Run tests for all packages
cd packages/typescript/402fly-core
npm test

cd ../402fly-client
npm test

cd ../402fly-express
npm test
```

## 🔧 Configuration

### Environment Variables

```env
# Server configuration
FLY402_PAYMENT_ADDRESS=your_solana_wallet_address
FLY402_TOKEN_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
SOLANA_RPC_URL=https://api.devnet.solana.com
PORT=3000

# Client configuration (optional)
FLY402_MAX_PAYMENT=5.0
FLY402_AUTO_RETRY=true
```

### Fly402Config Options

```typescript
interface Fly402ConfigOptions {
  paymentAddress: string;      // Recipient wallet
  tokenMint: string;           // Token mint address (USDC)
  network?: string;            // "solana-devnet" | "solana-mainnet"
  rpcUrl?: string;             // Custom RPC URL
  defaultAmount?: string;      // Default payment amount
  paymentTimeout?: number;     // Payment validity (seconds)
  autoVerify?: boolean;        // Auto verify on-chain
}
```

## 📖 Examples

See the [examples](./examples) directory for complete applications:

- **[express-server](./examples/express-server)** - Complete Express.js API with payment requirements and client examples

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Python Implementation](./packages/python)
- [Protocol Specification](https://github.com/SerPepe/402fly)
- [Solana Documentation](https://docs.solana.com)
- [Express.js](https://expressjs.com)
- [LangChain.js](https://js.langchain.com)

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/yourusername/402fly/issues)
- Documentation: [Read the docs](./packages/typescript/README.md)

---

**Built with ❤️ for the AI agent economy**
