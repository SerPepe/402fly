# @x402fly/client

TypeScript HTTP client library for the X402 payment protocol with both manual and automatic payment handling.

## Overview

The client package provides HTTP client implementations for making requests to X402-protected resources. It includes two client types:
- **Fly402Client**: Manual payment control - you handle 402 responses and payment flow explicitly
- **Fly402AutoClient**: Automatic payment handling - automatically detects 402 responses and processes payments

## Features

- **Dual Client Modes**: Choose between manual or automatic payment handling
- **Solana Wallet Integration**: Built-in support for Solana keypair-based payments
- **Retry Logic**: Configurable automatic retry with payment
- **Safety Limits**: Optional maximum payment amount protection
- **Full TypeScript Support**: Complete type definitions and intellisense

## Installation

```bash
npm install @x402fly/client
# or
pnpm add @x402fly/client
# or
yarn add @x402fly/client
```

## Usage

### Automatic Payment Client (Recommended)

The `Fly402AutoClient` automatically handles payment flow when encountering 402 responses:

```typescript
import { Fly402AutoClient } from '@x402fly/client';
import { Keypair } from '@solana/web3.js';

// Load your wallet keypair
const walletKeypair = Keypair.fromSecretKey(secretKeyBytes);

// Create auto client
const client = new Fly402AutoClient(
  walletKeypair,
  'https://api.devnet.solana.com',
  {
    maxRetries: 1,
    autoRetry: true,
    maxPaymentAmount: '10000000' // Safety limit in lamports
  }
);

// Make requests - payment is handled automatically
const response = await client.fetch('https://api.example.com/premium-data');
console.log(response.data);

// Clean up
await client.close();
```

### Manual Payment Client

The `Fly402Client` gives you full control over the payment flow:

```typescript
import { Fly402Client } from '@x402fly/client';
import { Keypair } from '@solana/web3.js';

const walletKeypair = Keypair.fromSecretKey(secretKeyBytes);
const client = new Fly402Client(
  walletKeypair,
  'https://api.devnet.solana.com'
);

try {
  // First request
  const response = await client.fetch('https://api.example.com/premium-data');
  console.log(response.data);
} catch (error) {
  if (error.response?.status === 402) {
    // Extract payment request from 402 response
    const paymentRequest = error.response.data;

    // Process payment
    const authorization = await client.makePayment(paymentRequest);

    // Retry with payment authorization
    const response = await client.fetch(
      'https://api.example.com/premium-data',
      {
        headers: {
          'X-Payment-Authorization': authorization.toHeaderValue()
        }
      }
    );
    console.log(response.data);
  }
}

await client.close();
```

### POST Requests with Payment

```typescript
const client = new Fly402AutoClient(walletKeypair);

// POST request with automatic payment handling
const response = await client.fetch(
  'https://api.example.com/process',
  {
    method: 'POST',
    data: {
      input: 'some data'
    }
  }
);
```

### Custom Configuration

```typescript
import { Fly402AutoClient } from '@x402fly/client';

const client = new Fly402AutoClient(
  walletKeypair,
  'https://api.mainnet-beta.solana.com', // Custom RPC endpoint
  {
    maxRetries: 2,           // Retry up to 2 times
    autoRetry: true,         // Enable automatic retry
    maxPaymentAmount: '5000000' // Maximum 0.005 SOL equivalent
  }
);
```

## API Reference

### Fly402AutoClient

Constructor:
```typescript
constructor(
  walletKeypair: Keypair,
  rpcUrl?: string,
  options?: {
    maxRetries?: number;
    autoRetry?: boolean;
    maxPaymentAmount?: string;
  }
)
```

Methods:
- `fetch(url: string, options?: AxiosRequestConfig)` - Make HTTP request with automatic payment
- `close()` - Clean up resources

### Fly402Client

Constructor:
```typescript
constructor(walletKeypair: Keypair, rpcUrl?: string)
```

Methods:
- `fetch(url: string, options?: AxiosRequestConfig)` - Make HTTP request
- `makePayment(paymentRequest: PaymentRequest)` - Process payment manually
- `close()` - Clean up resources

## Documentation

For complete API documentation and guides, visit [402fly.github.io](https://402fly.github.io/docs/packages/typescript/fly402client/)

## Testing

```bash
pnpm test
```

## Contributing

See [CONTRIBUTING.md](https://github.com/SerPepe/402fly/blob/main/CONTRIBUTING.md)

## License

MIT - See [LICENSE](https://github.com/SerPepe/402fly/blob/main/LICENSE)
