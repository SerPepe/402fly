/**
 * 402fly LangChain Package
 *
 * LangChain.js integration for 402fly payment protocol.
 */

export const VERSION = "0.1.1";

// Payment tool
export { X402PaymentTool, createX402PaymentTool } from "./payment-tool";
export type { X402PaymentToolOptions } from "./payment-tool";

// Re-export client for convenience
export { Fly402AutoClient } from "@402fly/client";
