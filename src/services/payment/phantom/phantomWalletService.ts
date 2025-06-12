import {solanaPaymentService} from "../solana/solanaPaymentService";
import {PaymentSessionRequest} from "../../../types/payment/paymentTypes";

export const PhantomWalletService = {
  /**
   * Create a payment session (delegated to SolanaPaymentService)
   */
  createPaymentSession: async (request: PaymentSessionRequest) => {
    console.log(
      "[PhantomWalletService] Creating payment session via SolanaPaymentService",
    );
    return await solanaPaymentService.createPaymentSession(request);
  },

  /**
   * Get payment session status
   */
  getSessionStatus: async (transactionId: string) => {
    console.log(
      "[PhantomWalletService] Getting session status:",
      transactionId,
    );
    return await solanaPaymentService.getSessionStatus(transactionId);
  },

  /**
   * Verify payment
   */
  verifyPayment: async (transactionId: string) => {
    console.log("[PhantomWalletService] Verifying payment:", transactionId);
    return await solanaPaymentService.verifyPayment(transactionId);
  },

  /**
   * Legacy function - now just logs
   */
  init: () => {
    console.log(
      "[PhantomWalletService] Phantom wallet service initialized - delegating to SolanaPaymentService",
    );
  },

  /**
   * Cancel payment session
   */
  cancelSession: (transactionId: string) => {
    console.log("[PhantomWalletService] Cancelling session:", transactionId);
    solanaPaymentService.cancelSession(transactionId);
  },

  /**
   * Get active session by ride ID
   */
  getActiveSessionByRide: (rideId: string, bidId: string) => {
    return solanaPaymentService.getActiveSessionByRide(rideId, bidId);
  },
};
