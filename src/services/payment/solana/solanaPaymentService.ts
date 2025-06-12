import {Connection, PublicKey, LAMPORTS_PER_SOL} from "@solana/web3.js";
import {
  PaymentSession,
  PaymentSessionRequest,
  PaymentSessionResponse,
  PaymentPollingResponse,
  SolanaTransactionVerification,
} from "../../../types/payment/paymentTypes";
import {convertINRtoSOL} from "../../../utils/currency/currencyConverter";
import {
  getCurrentRpcUrl,
  getPaymentWalletAddress,
  getSessionTimeout,
  SOLANA_PAYMENT_CONFIG,
} from "../../../config/payment.config";

class SolanaPaymentService {
  private connection: Connection;
  private activeSessions: Map<string, PaymentSession> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    const rpcUrl = getCurrentRpcUrl();
    this.connection = new Connection(rpcUrl, "confirmed");

    if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
      console.log(`[SolanaPaymentService] Initialized with RPC: ${rpcUrl}`);
      console.log(
        `[SolanaPaymentService] Payment wallet: ${getPaymentWalletAddress()}`,
      );
    }
  }

  /**
   * Create a new payment session
   */
  async createPaymentSession(
    request: PaymentSessionRequest,
  ): Promise<PaymentSessionResponse> {
    try {
      const solAmount = await convertINRtoSOL(request.amount);
      const now = Date.now();
      const sessionTimeout = getSessionTimeout();
      const transactionId = this.generateTransactionId();
      const walletAddress = getPaymentWalletAddress();

      const session: PaymentSession = {
        transactionId,
        userId: request.userId,
        amount: request.amount,
        solAmount,
        status: "pending",
        startTime: now,
        endTime: now + sessionTimeout * 1000,
        walletAddress,
        rideId: request.rideId,
        bidId: request.bidId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store session in memory (in production, this should be in a database)
      this.activeSessions.set(transactionId, session);

      // Start polling for this session
      this.startSessionPolling(transactionId);

      if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
        console.log(
          `[SolanaPaymentService] Created payment session: ${transactionId}`,
        );
        console.log(
          `[SolanaPaymentService] Amount: ₹${
            request.amount
          } (${solAmount.toFixed(4)} SOL)`,
        );
        console.log(`[SolanaPaymentService] Timeout: ${sessionTimeout}s`);
      }

      return {
        session,
        walletAddress,
        timeWindow: sessionTimeout,
      };
    } catch (error) {
      console.error(
        "[SolanaPaymentService] Error creating payment session:",
        error,
      );
      throw new Error("Failed to create payment session");
    }
  }

  /**
   * Get payment session status
   */
  async getSessionStatus(
    transactionId: string,
  ): Promise<PaymentPollingResponse> {
    const session = this.activeSessions.get(transactionId);

    if (!session) {
      return {
        status: "failed",
        message: "Session not found",
      };
    }

    // Check if session has expired
    if (Date.now() > session.endTime) {
      session.status = "expired";
      session.updatedAt = new Date().toISOString();
      this.stopSessionPolling(transactionId);

      if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
        console.log(`[SolanaPaymentService] Session expired: ${transactionId}`);
      }

      return {
        status: "expired",
        message: "Payment session has expired",
      };
    }

    return {
      status: session.status,
      transactionHash: session.transactionHash,
      confirmedAmount:
        session.status === "completed" ? session.solAmount : undefined,
    };
  }

  /**
   * Verify payment for a session by checking Solana blockchain
   */
  async verifyPayment(transactionId: string): Promise<boolean> {
    const session = this.activeSessions.get(transactionId);

    if (!session || session.status !== "pending") {
      return false;
    }

    // Mock payments for testing
    if (SOLANA_PAYMENT_CONFIG.DEBUG.MOCK_PAYMENTS) {
      const now = Date.now();
      // Simulate payment completion after 30 seconds for testing
      if (now - session.startTime > 30000) {
        session.status = "completed";
        session.transactionHash = "mock_transaction_hash_" + Date.now();
        session.updatedAt = new Date().toISOString();
        this.stopSessionPolling(transactionId);

        console.log(
          `[SolanaPaymentService] Mock payment completed for session: ${transactionId}`,
        );
        return true;
      }
      return false;
    }

    try {
      // Get recent transactions to the payment wallet
      const publicKey = new PublicKey(getPaymentWalletAddress());
      const signatures = await this.connection.getSignaturesForAddress(
        publicKey,
        {limit: SOLANA_PAYMENT_CONFIG.SESSION.TRANSACTION_SEARCH_LIMIT},
      );

      // Filter transactions within the session time window
      const relevantSignatures = signatures.filter(
        sig =>
          sig.blockTime &&
          sig.blockTime * 1000 >= session.startTime &&
          sig.blockTime * 1000 <= session.endTime,
      );

      if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
        console.log(
          `[SolanaPaymentService] Checking ${relevantSignatures.length} transactions for session: ${transactionId}`,
        );
      }

      for (const sig of relevantSignatures) {
        const transaction = await this.connection.getTransaction(
          sig.signature,
          {
            maxSupportedTransactionVersion: 0,
          },
        );

        if (transaction && transaction.meta) {
          const verification = this.verifyTransactionAmount(
            transaction,
            session.solAmount,
          );

          if (verification.confirmed) {
            // Payment found and verified
            const updatedSession: PaymentSession = {
              ...session,
              status: "completed",
              transactionHash: sig.signature,
              updatedAt: new Date().toISOString(),
            };
            this.activeSessions.set(transactionId, updatedSession);

            if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
              console.log(
                `[SolanaPaymentService] Payment verified for session: ${transactionId}`,
              );
              console.log(
                `[SolanaPaymentService] Transaction hash: ${sig.signature}`,
              );
              console.log(
                `[SolanaPaymentService] Amount: ${verification.amount} SOL`,
              );
            }

            this.stopSessionPolling(transactionId);
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("[SolanaPaymentService] Error verifying payment:", error);
      return false;
    }
  }

  /**
   * Start polling for payment verification
   */
  private startSessionPolling(transactionId: string): void {
    const pollInterval = setInterval(async () => {
      const session = this.activeSessions.get(transactionId);

      if (!session || session.status !== "pending") {
        this.stopSessionPolling(transactionId);
        return;
      }

      // Check if session expired
      if (Date.now() > session.endTime) {
        session.status = "expired";
        session.updatedAt = new Date().toISOString();
        this.stopSessionPolling(transactionId);

        if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
          console.log(
            `[SolanaPaymentService] Session expired during polling: ${transactionId}`,
          );
        }
        return;
      }

      // Verify payment
      const isVerified = await this.verifyPayment(transactionId);
      if (isVerified && SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
        console.log(
          `[SolanaPaymentService] Payment completed for session: ${transactionId}`,
        );
      }
    }, SOLANA_PAYMENT_CONFIG.SESSION.POLLING_INTERVAL_MS);

    this.pollingIntervals.set(transactionId, pollInterval);

    if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
      console.log(
        `[SolanaPaymentService] Started polling for session: ${transactionId}`,
      );
    }
  }

  /**
   * Stop polling for a session
   */
  private stopSessionPolling(transactionId: string): void {
    const interval = this.pollingIntervals.get(transactionId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(transactionId);

      if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
        console.log(
          `[SolanaPaymentService] Stopped polling for session: ${transactionId}`,
        );
      }
    }
  }

  /**
   * Verify transaction amount and recipient
   */
  private verifyTransactionAmount(
    transaction: any,
    expectedSolAmount: number,
  ): SolanaTransactionVerification {
    try {
      const meta = transaction.meta;
      if (!meta || meta.err) {
        return {
          signature: "",
          amount: 0,
          recipient: "",
          sender: "",
          timestamp: 0,
          confirmed: false,
        };
      }

      // Calculate the amount transferred to our wallet
      const publicKey = new PublicKey(getPaymentWalletAddress());
      const accountIndex =
        transaction.transaction.message.accountKeys.findIndex(
          (key: PublicKey) => key.equals(publicKey),
        );

      if (accountIndex === -1) {
        return {
          signature: "",
          amount: 0,
          recipient: "",
          sender: "",
          timestamp: 0,
          confirmed: false,
        };
      }

      const preBalance = meta.preBalances[accountIndex] || 0;
      const postBalance = meta.postBalances[accountIndex] || 0;
      const transferredLamports = postBalance - preBalance;
      const transferredSol = transferredLamports / LAMPORTS_PER_SOL;

      // Allow for small differences due to floating point precision
      const tolerance = SOLANA_PAYMENT_CONFIG.AMOUNT_TOLERANCE;
      const amountMatches =
        Math.abs(transferredSol - expectedSolAmount) <= tolerance;

      if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS && transferredSol > 0) {
        console.log(`[SolanaPaymentService] Transaction verification:`);
        console.log(`  Expected: ${expectedSolAmount.toFixed(4)} SOL`);
        console.log(`  Received: ${transferredSol.toFixed(4)} SOL`);
        console.log(
          `  Difference: ${Math.abs(transferredSol - expectedSolAmount).toFixed(
            6,
          )} SOL`,
        );
        console.log(`  Tolerance: ${tolerance} SOL`);
        console.log(`  Match: ${amountMatches}`);
      }

      return {
        signature: transaction.transaction.signatures[0],
        amount: transferredSol,
        recipient: getPaymentWalletAddress(),
        sender: transaction.transaction.message.accountKeys[0].toString(),
        timestamp: transaction.blockTime || 0,
        confirmed: amountMatches && transferredSol > 0,
      };
    } catch (error) {
      console.error(
        "[SolanaPaymentService] Error verifying transaction amount:",
        error,
      );
      return {
        signature: "",
        amount: 0,
        recipient: "",
        sender: "",
        timestamp: 0,
        confirmed: false,
      };
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Clean up expired sessions (should be called periodically)
   */
  public cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [transactionId, session] of this.activeSessions.entries()) {
      if (now > session.endTime && session.status === "pending") {
        session.status = "expired";
        session.updatedAt = new Date().toISOString();
        this.stopSessionPolling(transactionId);
        expiredSessions.push(transactionId);
      }
    }

    if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS && expiredSessions.length > 0) {
      console.log(
        `[SolanaPaymentService] Cleaned up ${expiredSessions.length} expired sessions`,
      );
    }
  }

  /**
   * Get active session by ride and bid ID
   */
  public getActiveSessionByRide(
    rideId: string,
    bidId: string,
  ): PaymentSession | undefined {
    for (const session of this.activeSessions.values()) {
      if (
        session.rideId === rideId &&
        session.bidId === bidId &&
        session.status === "pending"
      ) {
        return session;
      }
    }
    return undefined;
  }

  /**
   * Cancel a payment session
   */
  public cancelSession(transactionId: string): void {
    const session = this.activeSessions.get(transactionId);
    if (session && session.status === "pending") {
      session.status = "failed";
      session.updatedAt = new Date().toISOString();
      this.stopSessionPolling(transactionId);
      this.activeSessions.delete(transactionId);

      if (SOLANA_PAYMENT_CONFIG.DEBUG.ENABLE_LOGS) {
        console.log(
          `[SolanaPaymentService] Cancelled session: ${transactionId}`,
        );
      }
    }
  }
}

// Export singleton instance
export const solanaPaymentService = new SolanaPaymentService();
