# 402fly TypeScript Packages

TypeScript/JavaScript implementation of the X402 payment protocol for autonomous AI agent payments on Solana blockchain.

## Packages

### Core Packages

- **[@402fly/core](./402fly-core)** - Core models, errors, and Solana payment processor
- **[@402fly/client](./402fly-client)** - HTTP client with automatic payment handling
- **[@402fly/express](./402fly-express)** - Express.js middleware and utilities

### AI Agent Integration

- **[@402fly/langchain](./402fly-langchain)** - LangChain.js tools for autonomous payments
- **[@402fly/langgraph](./402fly-langgraph)** - LangGraph.js workflow nodes

## Quick Start

### 1. Install Dependencies

```bash
cd packages/typescript/402fly-core
npm install
npm run build

cd ../402fly-client
npm install
npm run build

cd ../402fly-express
npm install
npm run build

cd ../402fly-langchain
npm install
npm run build

cd ../402fly-langgraph
npm install
npm run build
```

### 2. Run the Express.js Example Server

```bash
cd ../../examples/express-server
npm install
npm run build
npm start
```

### 3. Create a Client Application

```typescript
import { Keypair } from '@solana/web3.js';
import { Fly402AutoClient } from '@402fly/client';

// Load your wallet keypair
const keypair = Keypair.fromSecretKey(/* your secret key */);

// Create auto client (handles payments automatically)
const client = new Fly402AutoClient(keypair, 'https://api.devnet.solana.com');

// Make request - payment happens automatically if required
const response = await client.get('http://localhost:3000/premium-data');
console.log(response.data);

await client.close();
```

## Package Architecture

### @402fly/core

Core payment protocol implementation:

- **Models**: `PaymentRequest`, `PaymentAuthorization`
- **Errors**: `Fly402Error`, `PaymentRequiredError`, etc.
- **Processor**: `SolanaPaymentProcessor` for blockchain operations

### @402fly/client

HTTP clients with payment support:

- **Fly402Client**: Manual payment control
- **Fly402AutoClient**: Automatic payment handling

### @402fly/express

Express.js integration:

- **Middleware**: `paymentRequired()` for protecting routes
- **Config**: Global configuration management
- **Responses**: Helper functions for 402 responses

### @402fly/langchain

LangChain.js integration:

- **X402PaymentTool**: Tool for agents to make payments
- Automatic payment handling in agent workflows

### @402fly/langgraph

LangGraph.js workflow integration:

- **paymentNode**: Node for handling payments
- **fetchWithPaymentNode**: Combined fetch + payment node
- **Conditional edges**: Payment routing logic

## Examples

See the [examples](../../examples) directory for complete applications:

- **[express-server](../../examples/express-server)** - Express.js API with payment requirements
- More examples coming soon!

## Development

### Building Packages

```bash
# Build individual package
cd packages/typescript/402fly-core
npm run build

# Watch mode for development
npm run dev
```

### Testing

```bash
npm test
```

## Environment Variables

Create a `.env` file in your application:

```env
FLY402_PAYMENT_ADDRESS=your_solana_wallet_address
FLY402_TOKEN_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Protocol Overview

The X402 protocol extends HTTP 402 "Payment Required" for blockchain-based micropayments:

1. Client requests protected endpoint
2. Server returns 402 with `PaymentRequest` JSON
3. Client creates Solana SPL token transfer
4. Client signs transaction and broadcasts to blockchain
5. Client retries with `X-Payment-Authorization` header
6. Server verifies payment and returns 200 with data

## License

MIT
