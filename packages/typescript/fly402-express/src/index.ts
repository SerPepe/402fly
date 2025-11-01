/**
 * OpenLibx402 Express Package
 *
 * Express.js middleware and utilities for X402 payment protocol.
 */

export const VERSION = "0.1.1";

// Configuration
export { Fly402Config, initFly402, getConfig, isInitialized } from "./config";
export type { Fly402ConfigOptions } from "./config";

// Middleware
export { paymentRequired } from "./middleware";
export type { PaymentRequiredOptions, Fly402Request } from "./middleware";

// Response builders
export { build402Response } from "./responses";
export type { Build402ResponseOptions } from "./responses";

// Re-export core types for convenience
export type { PaymentRequest, PaymentAuthorization } from "@402fly/core";
