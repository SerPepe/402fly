/**
 * 402fly Core Package
 *
 * Core TypeScript implementation of the 402fly payment protocol for autonomous AI agent payments.
 */

export const VERSION = "0.1.1";

// Models
export { PaymentRequest, PaymentAuthorization } from "./models";
export type { PaymentRequestData, PaymentAuthorizationData } from "./models";

// Errors
export {
  Fly402Error,
  PaymentRequiredError,
  PaymentExpiredError,
  InsufficientFundsError,
  PaymentVerificationError,
  TransactionBroadcastError,
  InvalidPaymentRequestError,
  ERROR_CODES,
} from "./errors";
export type { ErrorDetails } from "./errors";

// Solana
export { SolanaPaymentProcessor } from "./solana-processor";
