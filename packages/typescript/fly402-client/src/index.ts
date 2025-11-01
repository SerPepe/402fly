/**
 * OpenLibx402 Client Package
 *
 * TypeScript HTTP client library for X402 payment protocol.
 */

export const VERSION = "0.1.1";

// Explicit client (manual payment control)
export { Fly402Client } from "./explicit-client";

// Auto client (automatic payment handling)
export { Fly402AutoClient } from "./auto-client";

// Re-export core types for convenience
export type {
  PaymentRequest,
  PaymentAuthorization,
  PaymentRequestData,
  PaymentAuthorizationData,
} from "@402fly/core";
