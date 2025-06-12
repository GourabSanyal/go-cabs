import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert, Linking } from 'react-native';
import { useWallet } from '../../hooks/useWallet';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/shared/state/auth/reducer';
import Icons from '@/assets/svgs';
import styles from '@/screens/Common/login-screen/LoginScreen.styles';
import { Connection, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Mobile Wallet Adapter types
interface MobileWallet {
  name: string;
  packageName: string;
  icon: string;
  deepLinkScheme: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

interface MobileWalletAdapterProps {
  onWalletConnected: (info: { provider: string; address: string }) => void;
}

const SUPPORTED_WALLETS: MobileWallet[] = [
  {
    name: 'Phantom',
    packageName: 'app.phantom',
    icon: 'PhantomIcon',
    deepLinkScheme: 'phantom://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=app.phantom',
    appStoreUrl: 'https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977',
  },
  {
    name: 'Solflare',
    packageName: 'com.solflare.mobile',
    icon: 'SolflareIcon',
    deepLinkScheme: 'solflare://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.solflare.mobile',
    appStoreUrl: 'https://apps.apple.com/us/app/solflare/id1580902717',
  },
  {
    name: 'MetaMask',
    packageName: 'io.metamask',
    icon: 'MetaMaskIcon',
    deepLinkScheme: 'metamask://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.metamask',
    appStoreUrl: 'https://apps.apple.com/us/app/metamask/id1438144202',
  },
];

let transact: any = undefined;
let PublicKeyClass: any = undefined;
let Buffer: any = undefined;

// Only attempt to load Android-specific modules if we're on Android
if (Platform.OS === 'android') {
  try {
    const mwaModule = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
    transact = mwaModule.transact;
  } catch (error) {
    console.warn('Mobile Wallet Adapter not available:', error);
  }

  try {
    const web3Module = require('@solana/web3.js');
    PublicKeyClass = web3Module.PublicKey;
  } catch (error) {
    console.warn('Solana Web3 module not available:', error);
  }

  try {
    const bufferModule = require('buffer');
    Buffer = bufferModule.Buffer;
  } catch (error) {
    console.warn('Buffer module not available:', error);
  }
}

const MobileWalletAdapter: React.FC<MobileWalletAdapterProps> = ({ onWalletConnected }) => {
  const [availableWallets, setAvailableWallets] = useState<MobileWallet[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<{ name: string; address: string } | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Platform.OS === 'android') {
      detectWallets();
    }
  }, []);

  const detectWallets = async () => {
    try {
      // For now, show all supported wallets
      // In a production app, you would detect which wallets are actually installed
      setAvailableWallets(SUPPORTED_WALLETS);
    } catch (error) {
      console.error('Error detecting wallets:', error);
    }
  };

  const connectMobileWallet = async (wallet: MobileWallet) => {
    if (Platform.OS !== 'android') {
      Alert.alert('Not Supported', 'Mobile Wallet Adapter is only available on Android devices');
      return;
    }

    if (!transact || !PublicKeyClass || !Buffer) {
      Alert.alert(
        'Not Available',
        'Mobile Wallet Adapter is not available in this environment. Please use another login method.'
      );
      return;
    }

    const APP_IDENTITY = {
      name: 'Solana App Kit',
      uri: 'https://solanaappkit.com',
      icon: 'favicon.ico',
    };

    try {
      console.log(`Connecting to ${wallet.name}...`);

      const authorizationResult = await transact(async (mobileWallet: any) => {
        return await mobileWallet.authorize({
          cluster: 'devnet',
          identity: APP_IDENTITY,
          sign_in_payload: {
            domain: 'solanaappkit.com',
            statement: `You are signing in to Solana App Kit with ${wallet.name} (Devnet)`,
            uri: 'https://solanaappkit.com',
          },
        });
      });

      if (authorizationResult?.accounts?.length) {
        // Convert base64 pubkey to a Solana PublicKey
        const encodedPublicKey = authorizationResult.accounts[0].address;
        const publicKeyBuffer = Buffer.from(encodedPublicKey, 'base64');
        const publicKey = new PublicKeyClass(publicKeyBuffer);
        const base58Address = publicKey.toBase58();

        console.log(`${wallet.name} connection successful, address:`, base58Address);

        // Set connected wallet state
        setConnectedWallet({ name: wallet.name, address: base58Address });

        // Dispatch the loginSuccess action
        dispatch(
          loginSuccess({
            provider: 'mwa',
            address: base58Address,
          })
        );

        // Call the onWalletConnected callback
        onWalletConnected({
          provider: 'mwa',
          address: base58Address,
        });
      } else {
        Alert.alert('Connection Error', `No accounts found in ${wallet.name}`);
      }
    } catch (error) {
      console.error(`${wallet.name} connection error:`, error);
      Alert.alert('Connection Error', `Failed to connect to ${wallet.name}`);
    }
  };

  const sendTestTransaction = async (wallet: MobileWallet) => {
    if (!connectedWallet || !transact || !PublicKeyClass) {
      Alert.alert('Error', 'Please connect a wallet first');
      return;
    }

    try {
      console.log(`Sending test transaction via ${wallet.name}...`);

      const signature = await transact(async (mobileWallet: any) => {
        // Re-authorize to get session
        const authResult = await mobileWallet.authorize({
          cluster: 'devnet',
          identity: {
            name: 'Solana App Kit',
            uri: 'https://solanaappkit.com',
            icon: 'favicon.ico',
          },
        });

        if (!authResult?.accounts?.length) {
          throw new Error('No authorized accounts');
        }

        const encodedPublicKey = authResult.accounts[0].address;
        const publicKeyBuffer = Buffer.from(encodedPublicKey, 'base64');
        const fromPubkey = new PublicKeyClass(publicKeyBuffer);

        // Create a simple test transaction (sending 0.001 SOL to self)
        const toPubkey = fromPubkey; // Send to self for testing
        const lamports = 0.001 * LAMPORTS_PER_SOL;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports,
          })
        );

        // Get latest blockhash - using devnet
        const connection = new Connection('https://api.devnet.solana.com');
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        // Sign and send transaction
        const signedTransactions = await mobileWallet.signAndSendTransactions({
          transactions: [transaction],
        });

        return signedTransactions[0];
      });

      Alert.alert(
        'Transaction Sent! (Devnet)',
        `Test transaction completed via ${wallet.name}!\nSignature: ${signature.slice(0, 8)}...${signature.slice(-8)}\n\nNetwork: Devnet`
      );

      console.log(`Test transaction signature from ${wallet.name} (Devnet):`, signature);
    } catch (error) {
      console.error(`Test transaction error with ${wallet.name}:`, error);
      Alert.alert('Transaction Error', `Failed to send test transaction via ${wallet.name}`);
    }
  };

  const openWalletStore = async (wallet: MobileWallet) => {
    try {
      const storeUrl = Platform.OS === 'android' ? wallet.playStoreUrl : wallet.appStoreUrl;
      if (storeUrl) {
        await Linking.openURL(storeUrl);
      }
    } catch (error) {
      console.error('Error opening wallet store:', error);
    }
  };

  const getWalletIcon = (iconName: string) => {
    switch (iconName) {
      case 'PhantomIcon':
        return Icons.PhantomIcon;
      case 'SolflareIcon':
        return Icons.SolflareIcon;
      case 'MetaMaskIcon':
        return Icons.MetaMaskIcon;
      default:
        return Icons.walletIcon;
    }
  };

  const ArrowIcon = () => (
    <Icons.Arrow width={20} height={20} fill="#ffffff" />
  );

  if (Platform.OS !== 'android') {
    return null; // Don't render on iOS
  }

  return (
    <View style={styles.mobileWalletContainer}>
      <Text style={styles.walletSectionTitle}>Connect with Mobile Wallets (Devnet)</Text>
      {availableWallets.map((wallet) => {
        const WalletIcon = getWalletIcon(wallet.icon);
        const isConnected = connectedWallet?.name === wallet.name;
        
        return (
          <View key={wallet.packageName}>
            <TouchableOpacity
              style={[
                styles.walletButton,
                isConnected && { backgroundColor: '#1a1a2e', borderColor: '#16213e' }
              ]}
              onPress={() => connectMobileWallet(wallet)}
            >
              <View style={styles.buttonContent}>
                <WalletIcon width={24} height={24} />
                <Text style={styles.buttonText}>
                  {isConnected ? `Connected: ${wallet.name}` : `Connect with ${wallet.name}`}
                </Text>
              </View>
              <ArrowIcon />
            </TouchableOpacity>
            
            {/* Show test transaction button if this wallet is connected */}
            {isConnected && (
              <TouchableOpacity
                style={[styles.walletButton, { backgroundColor: '#0f3460', marginTop: 4 }]}
                onPress={() => sendTestTransaction(wallet)}
              >
                <View style={styles.buttonContent}>
                  <Icons.SwapIcon width={24} height={24} />
                  <Text style={styles.buttonText}>Send Test Transaction (Devnet)</Text>
                </View>
                <ArrowIcon />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
      
      {!connectedWallet && (
        <Text style={[styles.agreementText, { position: 'relative', marginTop: 12 }]}>
          Tap any wallet above to connect. Make sure the wallet app is installed on your device.
        </Text>
      )}
    </View>
  );
};

export default MobileWalletAdapter; 