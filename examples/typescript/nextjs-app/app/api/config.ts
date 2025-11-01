/**
 * 402 Configuration for Next.js API Routes
 */

import { Fly402Config, initFly402 } from "@402fly/nextjs";

// Initialize 402 configuration
const config = new Fly402Config({
  paymentAddress: process.env.FLY402_PAYMENT_ADDRESS || "DEMO_WALLET_ADDRESS",
  tokenMint: process.env.FLY402_TOKEN_MINT || "DEMO_TOKEN_MINT",
  network: "solana-devnet",
  rpcUrl: process.env.FLY402_RPC_URL || "https://api.devnet.solana.com",
  // Disable on-chain verification for demo purposes
  // In production, keep autoVerify: true to verify payments on-chain
  autoVerify: process.env.NODE_ENV === "production",
});

initFly402(config);

export { config };
