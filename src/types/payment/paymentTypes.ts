export interface PaymentSession {
  transactionId: string;
  userId: string;
  amount: number;
  solAmount: number;
  status: "pending" | "completed" | "expired" | "failed";
  startTime: number; // timestamp
  endTime: number; // timestamp
  walletAddress: string; // recipient wallet address
  rideId: string;
  bidId: string;
  transactionHash?: string; // Solana transaction hash when payment is confirmed
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSessionRequest {
  userId: string;
  amount: number;
  rideId: string;
  bidId: string;
}

export interface PaymentSessionResponse {
  session: PaymentSession;
  walletAddress: string;
  timeWindow: number; // in seconds
}

export interface SolanaTransactionVerification {
  signature: string;
  amount: number;
  recipient: string;
  sender: string;
  timestamp: number;
  confirmed: boolean;
}

export interface PaymentPollingResponse {
  status: "pending" | "completed" | "expired" | "failed";
  transactionHash?: string;
  confirmedAmount?: number;
  message?: string;
}

export type PaymentMethod =
  | "metamask"
  | "credit"
  | "debit"
  | "cash"
  | "Phantom"
  | "solana";

export interface PaymentState {
  currentSession?: PaymentSession;
  isProcessing: boolean;
  showModal: boolean;
  error?: string;
  method?: PaymentMethod;
}
