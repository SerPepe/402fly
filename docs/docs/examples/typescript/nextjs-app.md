# Next.js App Example with X402 Payment Support

This example demonstrates how to create a Next.js application with X402 payment requirements for API endpoints, including both server-side API routes and client-side payment handling.

## Features

- **Next.js App Router** - Modern Next.js 14 with App Router
- **Server-side API Routes** - Protected endpoints with payment requirements
- **Client-side Payment Handling** - React components with automatic payment flow
- **Free and Premium Endpoints** - Mix of public and paid content
- **TypeScript** - Full type safety
- **Tailwind CSS** - Modern styling
- **X402 Protocol** - Blockchain-based micropayments

## Setup

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

Or from npm:

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Solana wallet details:

```env
PAYMENT_WALLET_ADDRESS=your_solana_wallet_address_here
USDC_MINT_ADDRESS=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### 3. Build and Run

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will start on `http://localhost:3000`.

## API Endpoints

### Free Endpoints

- **GET /api** - API information (no payment)
- **GET /api/free-data** - Free data access (no payment)

### Paid Endpoints

- **GET /api/premium-data** - Premium data (0.10 USDC)
- **GET /api/expensive-data** - AI inference (1.00 USDC)
- **GET /api/tiered-data/[tier]** - Tiered content (0.05 USDC)
- **POST /api/process-data** - Data processing (0.25 USDC)

## How It Works

### Server-Side (API Routes)

1. **Initialize X402 Configuration** (`app/api/config.ts`):

```typescript
import { Fly402Config, initFly402 } from "@402fly/nextjs";

const config = new Fly402Config({
  paymentAddress: process.env.PAYMENT_WALLET_ADDRESS!,
  tokenMint: process.env.USDC_MINT_ADDRESS!,
  network: "solana-devnet",
});

initFly402(config);
```

2. **Protect API Routes** with `withPayment`:

```typescript
import { withPayment } from "@402fly/nextjs";

export const GET = withPayment(
  {
    amount: "0.10",
    description: "Access to premium data",
  },
  async (req, context) => {
    return NextResponse.json({
      data: "Premium content",
      payment_id: context.payment?.paymentId,
    });
  }
);
```

### Client-Side (React Components)

1. **Setup X402 Client Provider** (`app/components/Fly402ClientProvider.tsx`):

```typescript
import { Fly402AutoClient } from "@402fly/client";
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate(); // Or use browser wallet
const client = new Fly402AutoClient(keypair, rpcUrl);
```

2. **Make Requests** (automatic payment handling):

```typescript
const response = await client.get("/api/premium-data");
// Payment is handled automatically if required
```

## Payment Flow

1. **User clicks** "Try Endpoint" button
2. **Client makes request** to API endpoint
3. **Server responds** with 402 Payment Required (if no payment)
4. **Client detects 402** and creates payment
5. **Client retries** request with payment authorization
6. **Server verifies** payment on-chain
7. **Server returns** protected content

## Browser Wallet Integration

To integrate with browser wallets in production:

```typescript
// Instead of generating a keypair
import { useWallet } from "@solana/wallet-adapter-react";

const { publicKey, signTransaction } = useWallet();

// Use wallet adapter with Fly402Client
const client = new Fly402Client(/* wallet adapter */, rpcUrl);
```

## Development Tips

1. **Testing without funds**: The demo will show payment required errors, which is expected behavior
2. **Hot reload**: Changes to API routes and components are automatically reflected
3. **TypeScript**: Full type checking for both client and server code
4. **Tailwind CSS**: Utility-first styling for rapid UI development

## Learn More

- [402fly Documentation](https://402fly.github.io/docs)
- [X402 Protocol Specification](https://www.x402.org/x402-whitepaper.pdf)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js](https://solana.com/docs/clients/javascript)
