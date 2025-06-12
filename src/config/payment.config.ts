// Solana Payment Configuration
export const SOLANA_PAYMENT_CONFIG = {
  // Network Configuration
  NETWORK: "devnet" as "mainnet-beta" | "devnet" | "testnet",
  RPC_URL: {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
  },

  // Payment Wallet Configuration
  PAYMENT_WALLET: {
    // For devnet testing, using a common test wallet address
    ADDRESS: "7fDgaeRcsY8jdrECFc5qAJkwpuY8qqGbx2RYiVKomyMh",

    // For mainnet production:
    // ADDRESS: "7fDgaeRcsY8jdrECFc5qAJkwpuY8qqGbx2RYiVKomyMh",
  },

  // Session Configuration
  SESSION: {
    TIMEOUT_SECONDS: 300, // 5 minutes
    POLLING_INTERVAL_MS: 10000, // 10 seconds (backend polling)
    FRONTEND_POLLING_INTERVAL_MS: 5000, // 5 seconds (frontend polling)
    TRANSACTION_SEARCH_LIMIT: 50, // Number of recent transactions to check
  },

  // Payment Tolerance
  AMOUNT_TOLERANCE: 0.001, // 0.001 SOL tolerance for amount matching

  // QR Code Configuration
  QR_CODE: {
    SIZE: 200,
    BACKGROUND_COLOR: "white",
    FOREGROUND_COLOR: "black",
  },

  // App branding for Solana Pay
  BRANDING: {
    LABEL: "Go Cabs Payment",
    MESSAGE_PREFIX: "Ride payment",
  },

  // Development/Debug flags
  DEBUG: {
    ENABLE_LOGS: __DEV__, // Enable detailed logging in development
    MOCK_PAYMENTS: false, // Set to true to mock successful payments (for testing)
    REDUCED_TIMEOUT: false, // Set to true to use shorter timeouts for testing
  },
};

// Helper function to get current RPC URL
export const getCurrentRpcUrl = (): string => {
  return SOLANA_PAYMENT_CONFIG.RPC_URL[SOLANA_PAYMENT_CONFIG.NETWORK];
};

// Helper function to get current wallet address
export const getPaymentWalletAddress = (): string => {
  return SOLANA_PAYMENT_CONFIG.PAYMENT_WALLET.ADDRESS;
};

// Helper function to get session timeout
export const getSessionTimeout = (): number => {
  if (SOLANA_PAYMENT_CONFIG.DEBUG.REDUCED_TIMEOUT) {
    return 60; // 1 minute for testing
  }
  return SOLANA_PAYMENT_CONFIG.SESSION.TIMEOUT_SECONDS;
};

// Validation function to check if wallet address is valid format
export const isValidSolanaAddress = (address: string): boolean => {
  // Basic validation - Solana addresses are base58 encoded and typically 44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
};

// Environment-specific configurations
export const ENVIRONMENT_CONFIG = {
  development: {
    NETWORK: "devnet" as const,
    WALLET_ADDRESS: "YourDevnetWalletAddressHere",
  },
  production: {
    NETWORK: "mainnet-beta" as const,
    WALLET_ADDRESS: "GoC4bs1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S",
  },
};

// Get configuration based on environment
export const getEnvironmentConfig = () => {
  return __DEV__
    ? ENVIRONMENT_CONFIG.development
    : ENVIRONMENT_CONFIG.production;
};
