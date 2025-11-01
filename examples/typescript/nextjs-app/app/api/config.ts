/**
 * X402 Configuration for Next.js API Routes
 */

import { Fly402Config, initFly402 } from "@402fly/nextjs";

// Initialize X402 configuration
const config = new Fly402Config({
  paymentAddress: process.env.PAYMENT_WALLET_ADDRESS || "DEMO_WALLET_ADDRESS",
  tokenMint: process.env.USDC_MINT_ADDRESS || "DEMO_USDC_MINT",
  network: "solana-devnet",
  rpcUrl: process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
  // Disable on-chain verification for demo purposes
  // In production, keep autoVerify: true to verify payments on-chain
  autoVerify: process.env.NODE_ENV === "production",
});

initFly402(config);

export { config };
