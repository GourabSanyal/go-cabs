import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {
  PublicKey,
  Transaction,
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
} from '@solana/web3.js';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/state/store/store';
import type { AppDispatch } from '@/shared/state/store/store';
import { setBackpackConnection, disconnectBackpack } from '@/shared/state/wallet/reducer';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import Icons from '@/assets/svgs';
import styles from '@/screens/Common/login-screen/LoginScreen.styles';
import { activeNetwork, getNetworkEndpoint } from '@/shared/config/network';

interface BackpackWalletAdapterProps {
  onWalletConnected: (info: { provider: string; address: string }) => void;
}

const BackpackWalletAdapter: React.FC<BackpackWalletAdapterProps> = ({
  onWalletConnected,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, sessionData } = useSelector((state: RootState) => {
    const backpackState = state?.wallet?.backpack || {
      isConnected: false,
      sessionData: null
    };
    console.log('Backpack State:', backpackState);
    return backpackState;
  });

  // State for encryption and session management
  const [dappKeyPair] = useState(() => nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [backpackSessionData, setBackpackSessionData] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Create redirect URLs
  const onConnectRedirectLink = 'gocabs://onBackpackConnect';
  const onSignTransactionRedirectLink = 'gocabs://onBackpackSignTransaction';

  // Synchronize local state with Redux state
  useEffect(() => {
    console.log('Connection state changed:', isConnected);
    if (!isConnected) {
      // Clear local state when disconnected in Redux
      setSession(null);
      setWalletAddress(null);
      setBackpackSessionData(null);
      setSharedSecret(null);
    }
  }, [isConnected]);

  // Load persisted state from Redux on component mount and when sessionData changes
  useEffect(() => {
    if (sessionData) {
      console.log('Setting local state from sessionData:', sessionData);
      setSession(sessionData.session);
      setWalletAddress(sessionData.walletAddress);
      setBackpackSessionData(sessionData.sessionData);
      setSharedSecret(new Uint8Array(sessionData.sharedSecret));
    }
  }, [sessionData]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Backpack Component State:', {
      isConnected,
      hasSessionData: !!sessionData,
      hasSharedSecret: !!sharedSecret,
      hasSession: !!session,
      hasWalletAddress: !!walletAddress,
      hasBackpackSessionData: !!backpackSessionData,
    });
  }, [isConnected, sessionData, sharedSecret, session, walletAddress, backpackSessionData]);

  useEffect(() => {
    // Handle deep linking for both connect and sign transaction responses
    const handleDeepLink = async ({url}: {url: string}) => {
      if (url.startsWith('gocabs://onBackpackConnect')) {
        console.log('Received Backpack connect callback:', url);
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const walletEncryptionPublicKey = params.get('wallet_encryption_public_key');
        const data = params.get('data');

        if (walletEncryptionPublicKey && data) {
          try {
            // Create shared secret using Diffie-Hellman
            const secret = nacl.box.before(
              bs58.decode(walletEncryptionPublicKey),
              dappKeyPair.secretKey,
            );
            setSharedSecret(secret);

            // Decrypt the response data
            const decryptedData = nacl.box.open.after(
              bs58.decode(data),
              bs58.decode(params.get('nonce') || ''),
              secret,
            );

            if (decryptedData) {
              const decoded = new TextDecoder().decode(decryptedData);
              const connectData = JSON.parse(decoded);
              console.log('Backpack connection data:', connectData);

              // Save session data to local state
              setBackpackSessionData(connectData);
              setWalletAddress(connectData.public_key);
              setSession(connectData.session);

              // Save state to Redux for persistence
              const connectionData = {
                session: connectData.session,
                walletAddress: connectData.public_key,
                sessionData: connectData,
                sharedSecret: Array.from(secret),
              };
              console.log('Dispatching Backpack connection data:', connectionData);
              dispatch(setBackpackConnection(connectionData));

              // Notify parent component
              onWalletConnected({
                provider: 'backpack',
                address: connectData.public_key,
              });

              Alert.alert('Success', 'Connected to Backpack wallet!');
            } else {
              Alert.alert('Error', 'Failed to decrypt connection response');
            }
          } catch (error) {
            console.error('Backpack connection error:', error);
            Alert.alert('Error', 'Failed to connect to Backpack wallet');
          }
        }
      } else if (url.startsWith('gocabs://onBackpackSignTransaction')) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const data = params.get('data');
        const errorCode = params.get('errorCode');
        const errorMessage = params.get('errorMessage');

        // Handle error responses from Backpack
        if (errorCode) {
          let userFriendlyMessage = 'Transaction signing failed';

          switch (errorCode) {
            case '4001':
              userFriendlyMessage = 'Transaction was rejected by user';
              break;
            case '4002':
              userFriendlyMessage = 'Transaction was rejected by wallet';
              break;
            default:
              userFriendlyMessage = errorMessage
                ? decodeURIComponent(errorMessage)
                : 'Transaction signing failed';
          }

          Alert.alert('Transaction Rejected', userFriendlyMessage);
          setIsSigning(false);
          return;
        }

        if (data && sharedSecret) {
          try {
            // Decrypt the response
            const decryptedData = nacl.box.open.after(
              bs58.decode(data),
              bs58.decode(params.get('nonce') || ''),
              sharedSecret,
            );

            if (decryptedData) {
              const decoded = new TextDecoder().decode(decryptedData);
              const signData = JSON.parse(decoded);

              // Handle the signed transaction
              if (signData.transaction) {
                try {
                  // Create connection
                  const connection = new Connection(
                    getNetworkEndpoint(),
                    'confirmed',
                  );
                  const signature = await connection.sendRawTransaction(
                    bs58.decode(signData.transaction),
                    {
                      skipPreflight: false,
                      preflightCommitment: 'confirmed',
                      maxRetries: 3,
                    },
                  );

                  // Start confirmation process
                  try {
                    const confirmation = await connection.confirmTransaction(
                      signature,
                      'confirmed',
                    );

                    if (confirmation.value.err) {
                      throw new Error(
                        `Transaction failed: ${confirmation.value.err}`,
                      );
                    }

                    Alert.alert(
                      'Success',
                      'Transaction sent and confirmed successfully!',
                    );
                  } catch (confirmError) {
                    Alert.alert(
                      'Transaction Sent',
                      'Transaction was sent but confirmation timed out. Check the explorer for final status.',
                    );
                  }
                } catch (error: any) {
                  Alert.alert(
                    'Error',
                    `Failed to send transaction: ${error.message}`,
                  );
                }
              } else {
                Alert.alert('Error', 'No transaction data in response');
              }
            }
          } catch (error: any) {
            Alert.alert(
              'Error',
              `Failed to process transaction: ${error.message}`,
            );
          }
        }
        setIsSigning(false);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, [sharedSecret, dappKeyPair, dispatch, onWalletConnected]);

  const connectBackpackWallet = async () => {
    try {
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);

      const params = new URLSearchParams({
        dapp_encryption_public_key: dappPublicKey,
        cluster: 'mainnet-beta', // change it manually as of now
        app_url: 'https://gocabs.com',
        redirect_link: onConnectRedirectLink,
      });

      const url = `https://backpack.app/ul/v1/connect?${params.toString()}`;

      // Check if Backpack is installed
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // If Backpack isn't installed, redirect to App Store
        await Linking.openURL(
          'https://apps.apple.com/app/backpack-wallet/id1626107061',
        );
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect to Backpack wallet');
    }
  };

  const encryptPayload = (
    payload: any,
  ): {nonce: string; encryptedPayload: string} => {
    if (!sharedSecret) throw new Error('Shared secret not established');

    const messageBytes = new TextEncoder().encode(JSON.stringify(payload));
    const nonce = nacl.randomBytes(24);

    const encryptedMessage = nacl.box.after(messageBytes, nonce, sharedSecret);

    return {
      nonce: bs58.encode(nonce),
      encryptedPayload: bs58.encode(encryptedMessage),
    };
  };

  const createTestTransaction = async (): Promise<Transaction> => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    // Create connection to get recent blockhash
    const connection = new Connection(getNetworkEndpoint(), 'confirmed');

    // Get recent blockhash
    const {blockhash} = await connection.getLatestBlockhash();

    // Create a simple transfer transaction (0.001 SOL to self)
    const fromPubkey = new PublicKey(walletAddress);
    const toPubkey = new PublicKey(walletAddress); // Send to self for testing

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromPubkey,
    });

    // Add a transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      }),
    );

    return transaction;
  };

  const signTransaction = async () => {
    if (!isConnected || !sharedSecret || !session) {
      Alert.alert('Error', 'Please connect to Backpack wallet first');
      return;
    }

    setIsSigning(true);

    try {
      // Create a test transaction
      const transaction = await createTestTransaction();

      // Ensure transaction is properly prepared
      if (!transaction.recentBlockhash) {
        const connection = new Connection(getNetworkEndpoint(), 'confirmed');
        const {blockhash} = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
      }

      if (!transaction.feePayer && walletAddress) {
        transaction.feePayer = new PublicKey(walletAddress);
      }

      // Serialize the transaction to base58
      const serializedTransaction = bs58.encode(
        transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        }),
      );

      const payload = {
        transaction: serializedTransaction,
        session: session,
      };

      const {nonce, encryptedPayload} = encryptPayload(payload);
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);

      const params = new URLSearchParams({
        dapp_encryption_public_key: dappPublicKey,
        nonce: nonce,
        redirect_link: onSignTransactionRedirectLink,
        payload: encryptedPayload,
      });

      const url = `https://backpack.app/ul/v1/signTransaction?${params.toString()}`;

      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(
          'https://apps.apple.com/app/backpack-wallet/id1626107061',
        );
        setIsSigning(false);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        `Failed to initiate transaction signing: ${error.message}`,
      );
      setIsSigning(false);
    }
  };

  const handleDisconnectBackpack = () => {
    console.log('Disconnecting Backpack wallet');
    // Reset all connection-related state
    setSharedSecret(null);
    setSession(null);
    setWalletAddress(null);
    setBackpackSessionData(null);
    setIsSigning(false);

    // Dispatch disconnect action
    dispatch(disconnectBackpack());

    Alert.alert(
      'Disconnected',
      'Successfully disconnected from Backpack wallet',
    );
  };

  const ArrowIcon = () => <Icons.Arrow width={20} height={20} fill="#ffffff" />;

  if (Platform.OS !== 'ios') {
    return null; // Don't render on Android
  }

  // Debug log before rendering
  console.log('Rendering Backpack with state:', { isConnected, hasWallet: !!walletAddress });

  return (
    <View style={styles.mobileWalletContainer}>
      {isConnected && walletAddress ? (
        <View style={{gap: 12}}>
          <TouchableOpacity
            style={[styles.walletButton, isSigning && {opacity: 0.7}]}
            onPress={signTransaction}
            disabled={isSigning}>
            <View style={styles.buttonContent}>
              <Icons.walletIcon width={24} height={24} />
              <Text style={styles.buttonText}>
                {isSigning
                  ? 'Opening Backpack...'
                  : 'Pay with Backpack'}
              </Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.walletButton, {backgroundColor: '#ff4444'}]}
            onPress={handleDisconnectBackpack}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Disconnect Backpack</Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.walletButton}
          onPress={connectBackpackWallet}>
          <View style={styles.buttonContent}>
            <Icons.walletIcon width={24} height={24} />
            <Text style={styles.buttonText}>Connect Backpack</Text>
          </View>
          <ArrowIcon />
        </TouchableOpacity>
      )}

      <Text
        style={[styles.agreementText, {position: 'relative', marginTop: 12}]}>
        {!isConnected
          ? 'Tap to connect your Backpack wallet first.'
          : isSigning
          ? 'Opening Backpack wallet for payment...'
          : 'Connected to Backpack. You can make payments or disconnect.'}
      </Text>
    </View>
  );
};

export default BackpackWalletAdapter; 