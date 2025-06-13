import { Cluster } from '@solana/web3.js';

export type NetworkType = 'mainnet-beta' | 'devnet' | 'testnet';
export type NetworkEnvironment = 'development' | 'staging' | 'production';

interface NetworkConfig {
  cluster: NetworkType;
  environment: NetworkEnvironment;
  endpoints: {
    default: string;
    fallback: string;
  };
  websocketEndpoint?: string;
}

// Define the network configurations type as a Record
type NetworkConfigurations = Record<NetworkType, NetworkConfig>;

// Default RPC endpoints for different networks
const DEFAULT_ENDPOINTS: Record<NetworkType, string> = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  'devnet': 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com'
};

// Helper to safely get environment variables in both React Native and Node.js
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  // For React Native, we use the imported env variables
  try {
    // @ts-ignore - env variables are imported from @env
    return require('@env')[key];
  } catch (e) {
    return undefined;
  }
};

// Network configurations for different environments
const NETWORK_CONFIGS: NetworkConfigurations = {
  'mainnet-beta': {
    cluster: 'mainnet-beta',
    environment: 'production',
    endpoints: {
      default: getEnvVar('MAINNET_RPC_URL') || DEFAULT_ENDPOINTS['mainnet-beta'],
      fallback: DEFAULT_ENDPOINTS['mainnet-beta']
    },
    websocketEndpoint: getEnvVar('MAINNET_WS_URL')
  },
  'devnet': {
    cluster: 'devnet',
    environment: 'development',
    endpoints: {
      default: getEnvVar('DEVNET_RPC_URL') || DEFAULT_ENDPOINTS['devnet'],
      fallback: DEFAULT_ENDPOINTS['devnet']
    },
    websocketEndpoint: getEnvVar('DEVNET_WS_URL')
  },
  'testnet': {
    cluster: 'testnet',
    environment: 'staging',
    endpoints: {
      default: getEnvVar('TESTNET_RPC_URL') || DEFAULT_ENDPOINTS['testnet'],
      fallback: DEFAULT_ENDPOINTS['testnet']
    },
    websocketEndpoint: getEnvVar('TESTNET_WS_URL')
  }
};

// Set the active network - this can be controlled by environment variable
const ACTIVE_NETWORK: NetworkType = (getEnvVar('SOLANA_CLUSTER') as NetworkType) || 'devnet';

// Export the active network configuration
export const activeNetwork = NETWORK_CONFIGS[ACTIVE_NETWORK];

// Utility functions
export const getNetworkConfig = (network: NetworkType = ACTIVE_NETWORK): NetworkConfig => {
  return NETWORK_CONFIGS[network];
};

export const getNetworkEndpoint = (network: NetworkType = ACTIVE_NETWORK): string => {
  return NETWORK_CONFIGS[network].endpoints.default;
};

export const getFallbackEndpoint = (network: NetworkType = ACTIVE_NETWORK): string => {
  return NETWORK_CONFIGS[network].endpoints.fallback;
};

export const getWebsocketEndpoint = (network: NetworkType = ACTIVE_NETWORK): string | undefined => {
  return NETWORK_CONFIGS[network].websocketEndpoint;
};

// Helper to check if we're on mainnet
export const isMainnet = (): boolean => {
  return ACTIVE_NETWORK === 'mainnet-beta';
};

// Helper to check if we're on devnet
export const isDevnet = (): boolean => {
  return ACTIVE_NETWORK === 'devnet';
};

// Helper to check if we're on testnet
export const isTestnet = (): boolean => {
  return ACTIVE_NETWORK === 'testnet';
};

// Export constants
export const NETWORK_CONSTANTS = {
  ACTIVE_NETWORK,
  DEFAULT_ENDPOINTS,
  NETWORK_CONFIGS
} as const; 