/**
 * Configuration Management for OpenLibx402 Next.js
 *
 * Global configuration and settings management.
 */

export interface Fly402ConfigOptions {
  paymentAddress: string;
  tokenMint: string;
  network?: string;
  rpcUrl?: string;
  defaultAmount?: string;
  paymentTimeout?: number; // seconds
  autoVerify?: boolean;
}

export class Fly402Config {
  paymentAddress: string;
  tokenMint: string;
  network: string;
  rpcUrl?: string;
  defaultAmount: string;
  paymentTimeout: number;
  autoVerify: boolean;

  constructor(options: Fly402ConfigOptions) {
    this.paymentAddress = options.paymentAddress;
    this.tokenMint = options.tokenMint;
    this.network = options.network || "solana-devnet";
    this.rpcUrl = options.rpcUrl;
    this.defaultAmount = options.defaultAmount || "0.01";
    this.paymentTimeout = options.paymentTimeout || 300;
    this.autoVerify =
      options.autoVerify !== undefined ? options.autoVerify : true;
  }

  getRpcUrl(): string {
    if (this.rpcUrl) {
      return this.rpcUrl;
    }

    // Default URLs by network
    const urls: Record<string, string> = {
      "solana-mainnet": "https://api.mainnet-beta.solana.com",
      "solana-devnet": "https://api.devnet.solana.com",
      "solana-testnet": "https://api.testnet.solana.com",
    };
    return urls[this.network] || "https://api.devnet.solana.com";
  }
}

// Singleton configuration
let _config: Fly402Config | null = null;

export function initFly402(config: Fly402Config): void {
  _config = config;
}

export function getConfig(): Fly402Config {
  if (_config === null) {
    throw new Error("X402 not initialized. Call initFly402() first.");
  }
  return _config;
}

export function isInitialized(): boolean {
  return _config !== null;
}
