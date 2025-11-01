/**
 * 402fly Next.js Package
 *
 * Next.js middleware and utilities for 402fly payment protocol.
 */

export const VERSION = "0.1.0";

// Configuration
export { Fly402Config, initFly402, getConfig, isInitialized } from "./config";
export type { Fly402ConfigOptions } from "./config";

// Middleware
export { withPayment } from "./middleware";
export type {
  PaymentRequiredOptions,
  X402Handler,
  X402HandlerContext,
} from "./middleware";

// Response builders
export { build402Response } from "./responses";
export type { Build402ResponseOptions } from "./responses";

// Re-export core types for convenience
export type {
  PaymentRequestData,
  PaymentAuthorizationData,
} from "@402fly/core";
export { PaymentRequest, PaymentAuthorization } from "@402fly/core";
