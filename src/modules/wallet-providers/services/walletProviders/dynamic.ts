import {createClient} from '@dynamic-labs/client';
import {ReactNativeExtension} from '@dynamic-labs/react-native-extension';
import {SolanaExtension} from '@dynamic-labs/solana-extension';
import { activeNetwork, isMainnet } from '@/shared/config/network';

let dynamicClient: any | null = null;

/**
 * Initialize the dynamic client once.
 * @param environmentId The environment ID from your config.
 * @param appName (optional) The name of your app, also from config.
 * @param appLogoUrl (optional) The logo URL for your app.
 */
export function initDynamicClient(
  environmentId: string,
  appName?: string,
  appLogoUrl?: string,
) {
  if (!environmentId) {
    throw new Error('Dynamic environment ID is required');
  }

  // Use any type for client config to bypass TS errors with new properties
  const clientConfig: any = {
    environmentId,
    displayName: appName || 'Solana App Kit',
    appLogoUrl: appLogoUrl || '', // We may need to provide a default logo URL
    walletConnectors: ['dynamic_embedded_wallet'],
    evmNetworks: [],
    // Add Solana chain configuration
    settings: {
      chains: {
        solana: {
          enabled: true,
          mainnet: isMainnet(), // Use network configuration
        },
      },
      defaultChain: 'Sol',
      defaultNetwork: activeNetwork.cluster, // Use network configuration
      // Disable UI confirmations for transactions
      disableConfirmationModal: true,
      noTransactionConfirmationModal: true,
      autoSignEnabled: true,
      preventSolanaWalletSelectionModal: true,
      disableTransactionUI: true,
      skipConfirmationScreen: true,
      // Additional settings to ensure proper transaction handling
      walletConnectorsPriorityOrder: ['dynamic_embedded_wallet', 'wallet_connect'],
      enableVisitTrackingOnConnectOnly: false,
      enableAnalytics: false,
      // Add additional settings for no-UI experience
      alwaysShowSignatureBeforeRequest: false,
      // Enable social providers
      socialProvidersConfig: {
        google: {
          enabled: true,
        },
        apple: {
          enabled: true,
        },
      },
      // Add deeplink configuration for social login
      deepLinkConfig: {
        url: 'solanaappkit://dynamic-auth',
      },
    },
    eventsCallbacks: {
      onAuthSuccess: (data: any) => console.log('Dynamic auth success', data),
      onAuthFailure: (error: any) => console.error('Dynamic auth failure', error),
      onLogout: () => console.log('Dynamic logout'),
      onEmbeddedWalletCreated: (data: any) => console.log('Dynamic embedded wallet created', data),
      // Add social auth callbacks
      onSocialAuthSuccess: (data: any) => console.log('Social auth success', data),
      onSocialAuthFailure: (error: any) => console.error('Social auth failure', error),
    },
    // Add more configuration for permissions and events
    storageStrategy: {
      prefer: 'localStorage',
      fallback: 'memory',
    },
    flow: {
      defaultScreen: 'login',
    },
    debug: true, // This helps with diagnosing issues
  };

  return clientConfig;
}

/**
 * Get the previously initialized dynamic client.
 * If the client was never initialized, this throws an error.
 */
export function getDynamicClient() {
  if (!dynamicClient) {
    throw new Error(
      'Dynamic client not initialized. Call initDynamicClient first.',
    );
  }
  return dynamicClient;
}

/**
 * Utility function to check if a wallet is a Dynamic wallet
 */
export function isDynamicWallet(wallet: any): boolean {
  if (!wallet) return false;
  
  // Check if it's a Dynamic wallet by checking properties
  return (
    // Has Dynamic-specific properties
    (wallet.address && wallet.id && wallet.type === 'dynamic_embedded_wallet') ||
    // Or is explicitly marked as dynamic
    wallet.provider === 'dynamic'
  );
}
