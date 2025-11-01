# @402fly/express

Express.js middleware and utilities for implementing the X402 payment protocol in your web applications.

## Overview

The Express package provides middleware and helper functions to easily add X402 payment requirements to your Express.js routes. It handles payment verification, 402 response generation, and integrates seamlessly with Solana blockchain payments.

## Features

- **Payment Middleware**: Easy-to-use `paymentRequired()` middleware for protecting routes
- **Automatic Verification**: Built-in payment verification using Solana blockchain
- **Flexible Configuration**: Global configuration or per-route options
- **402 Response Builder**: Helper function for creating proper 402 responses
- **TypeScript Support**: Full type definitions for Express request extensions

## Installation

```bash
npm install @402fly/express
# or
pnpm add @402fly/express
# or
yarn add @402fly/express
```

## Usage

### Basic Setup with Global Configuration

```typescript
import express from 'express';
import { initFly402, paymentRequired } from '@402fly/express';

const app = express();

// Initialize X402 with global configuration
initFly402({
  paymentAddress: 'YourSolanaWalletAddress',
  tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  network: 'solana-devnet',
  autoVerify: true
});

// Protect a route with payment requirement
app.get('/premium-content',
  paymentRequired({
    amount: '1000000', // 1 USDC (6 decimals)
    description: 'Access to premium content'
  }),
  (req, res) => {
    // This code only runs after payment is verified
    res.json({
      content: 'Premium content here',
      paidBy: req.payment?.publicKey
    });
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Per-Route Configuration

```typescript
import { paymentRequired } from '@402fly/express';

// Override global config for specific routes
app.get('/api/data',
  paymentRequired({
    amount: '500000',
    paymentAddress: 'SpecificWalletAddress',
    tokenMint: 'So11111111111111111111111111111111111111112', // Native SOL
    network: 'solana-mainnet',
    description: 'API data access',
    expiresIn: 300, // 5 minutes
    autoVerify: true
  }),
  (req, res) => {
    res.json({ data: 'Your data here' });
  }
);
```

### Manual Payment Verification

```typescript
import { paymentRequired } from '@402fly/express';
import { Fly402Request } from '@402fly/express';

app.post('/custom-endpoint',
  paymentRequired({
    amount: '2000000',
    autoVerify: false // Disable automatic verification
  }),
  (req: Fly402Request, res) => {
    // Payment authorization is available but not verified
    const payment = req.payment;

    // Do custom verification logic
    if (payment && customVerificationLogic(payment)) {
      res.json({ success: true });
    } else {
      res.status(403).json({ error: 'Payment verification failed' });
    }
  }
);
```

### Building 402 Responses Manually

```typescript
import { build402Response } from '@402fly/express';

app.get('/custom-protected', (req, res) => {
  // Check some condition
  if (!userHasPaid) {
    const response = build402Response({
      amount: '1000000',
      paymentAddress: 'YourWalletAddress',
      tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      network: 'solana-devnet',
      resource: req.path,
      description: 'Custom payment required'
    });

    return res.status(402).json(response);
  }

  res.json({ content: 'Protected content' });
});
```

### Configuration Options

```typescript
import { initFly402, Fly402ConfigOptions } from '@402fly/express';

const config: Fly402ConfigOptions = {
  paymentAddress: string;      // Your Solana wallet address
  tokenMint: string;            // Token mint address (SPL token or SOL)
  network: string;              // 'solana-devnet' or 'solana-mainnet'
  rpcUrl?: string;              // Optional custom RPC endpoint
  autoVerify?: boolean;         // Auto-verify payments (default: true)
  expiresIn?: number;           // Payment expiration in seconds (default: 600)
};

initFly402(config);
```

### Accessing Payment Information

```typescript
import { Fly402Request } from '@402fly/express';

app.get('/payment-info',
  paymentRequired({ amount: '1000000' }),
  (req: Fly402Request, res) => {
    const payment = req.payment;

    res.json({
      paymentId: payment?.paymentId,
      amount: payment?.actualAmount,
      payer: payment?.publicKey,
      transactionHash: payment?.transactionHash,
      timestamp: payment?.timestamp
    });
  }
);
```

## API Reference

### Middleware

#### `paymentRequired(options: PaymentRequiredOptions)`

Middleware that requires payment to access a route.

Options:
- `amount: string` - Required payment amount in token base units
- `paymentAddress?: string` - Override global payment address
- `tokenMint?: string` - Override global token mint
- `network?: string` - Override global network
- `description?: string` - Payment description
- `expiresIn?: number` - Payment expiration in seconds
- `autoVerify?: boolean` - Enable automatic verification

### Configuration

#### `initFly402(config: Fly402ConfigOptions)`

Initialize global X402 configuration.

#### `getConfig()`

Get current configuration.

#### `isInitialized()`

Check if X402 is initialized.

### Response Builders

#### `build402Response(options: Build402ResponseOptions)`

Build a 402 Payment Required response object.

## Documentation

For complete API documentation and guides, visit [402fly.github.io](https://402fly.github.io/docs/packages/typescript/402fly-express/)

## Testing

```bash
pnpm test
```

## Contributing

See [CONTRIBUTING.md](https://github.com/SerPepe/402fly/blob/main/CONTRIBUTING.md)

## License

MIT - See [LICENSE](https://github.com/SerPepe/402fly/blob/main/LICENSE)
