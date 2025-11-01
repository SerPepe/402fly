# @402fly/nextjs

Next.js middleware and utilities for the 402fly payment protocol. This package provides seamless integration of blockchain-based micropayments into your Next.js applications.

## Installation

```bash
npm install @402fly/nextjs @402fly/core @solana/web3.js
```

## Features

- **App Router Support** - Built for Next.js 13+ App Router
- **Payment Verification** - Automatic on-chain payment verification
- **TypeScript** - Full type safety
- **Flexible Configuration** - Global or per-route configuration
- **Easy Integration** - Simple higher-order function API

## Usage

```typescript
import { Fly402Config, initFly402, withPayment } from '@402fly/nextjs';

// Initialize configuration
const config = new Fly402Config({
  paymentAddress: process.env.FLY402_PAYMENT_ADDRESS!,
  tokenMint: process.env.FLY402_TOKEN_MINT!,
  network: 'solana-devnet',
});

initFly402(config);

// Protect API routes
export const GET = withPayment(
  {
    amount: '0.10',
    description: 'Access to premium data',
  },
  async (req, context) => {
    return NextResponse.json({
      data: 'Premium content',
      payment_id: context.payment?.paymentId,
    });
  }
);
```

## License

MIT
