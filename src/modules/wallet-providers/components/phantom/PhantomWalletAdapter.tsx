import React, {useState, useEffect} from 'react';
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
import { setPhantomConnection, disconnectPhantom } from '@/shared/state/wallet/reducer';
import type { AppDispatch } from '@/shared/state/store/store';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import Icons from '@/assets/svgs';
import styles from '@/screens/Common/login-screen/LoginScreen.styles';
import {activeNetwork, getNetworkEndpoint} from '@/shared/config/network';

interface PhantomWalletAdapterProps {
  onTransactionSigned: (signature: string) => void;
}

const PhantomWalletAdapter: React.FC<PhantomWalletAdapterProps> = ({
  onTransactionSigned,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, sessionData } = useSelector((state: RootState) => {
    console.log('Redux State:', state);
    const phantomState = state?.wallet?.phantom || {
      isConnected: false,
      sessionData: null
    };
    console.log('Phantom State:', phantomState);
    return phantomState;
  });
  
  const [dappKeyPair] = useState(() => nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [phantomSessionData, setPhantomSessionData] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Create redirect URLs
  const onConnectRedirectLink = 'gocabs://onConnect';
  const onSignTransactionRedirectLink = 'gocabs://onSignTransaction';

  // Debug logging for state changes
  useEffect(() => {
    console.log('Component State:', {
      isConnected,
      hasSessionData: !!sessionData,
      hasSharedSecret: !!sharedSecret,
      hasSession: !!session,
      hasWalletAddress: !!walletAddress,
      hasPhantomSessionData: !!phantomSessionData,
    });
  }, [isConnected, sessionData, sharedSecret, session, walletAddress, phantomSessionData]);

  // Load persisted state from Redux on component mount and when sessionData changes
  useEffect(() => {
    if (sessionData) {
      console.log('Setting local state from sessionData:', sessionData);
      setSession(sessionData.session);
      setWalletAddress(sessionData.walletAddress);
      setPhantomSessionData(sessionData.sessionData);
      setSharedSecret(new Uint8Array(sessionData.sharedSecret));
    }
  }, [sessionData]);

  // Synchronize local state with Redux state
  useEffect(() => {
    console.log('Connection state changed:', isConnected);
    if (!isConnected) {
      // Clear local state when disconnected in Redux
      setSession(null);
      setWalletAddress(null);
      setPhantomSessionData(null);
      setSharedSecret(null);
    }
  }, [isConnected]);

  useEffect(() => {
    // Handle deep linking for both connect and sign transaction responses
    const handleDeepLink = async ({url}: {url: string}) => {
      if (url.startsWith('gocabs://onConnect')) {
        console.log('Received connect callback:', url);
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const phantomPubKey = params.get('phantom_encryption_public_key');
        const nonce = params.get('nonce');
        const data = params.get('data');

        if (phantomPubKey && nonce && data) {
          try {
            // Create shared secret using Diffie-Hellman
            const secret = nacl.box.before(
              bs58.decode(phantomPubKey),
              dappKeyPair.secretKey,
            );
            setSharedSecret(secret);

            // Decrypt the response data
            const decryptedData = nacl.box.open.after(
              bs58.decode(data),
              bs58.decode(nonce),
              secret,
            );

            if (decryptedData) {
              const decoded = new TextDecoder().decode(decryptedData);
              const connectData = JSON.parse(decoded);
              console.log('Connection data:', connectData);
              
              // Save session data to local state
              setPhantomSessionData(connectData);
              setWalletAddress(connectData.public_key);
              setSession(connectData.session);

              // Save state to Redux for persistence
              const connectionData = {
                session: connectData.session,
                walletAddress: connectData.public_key,
                sessionData: connectData,
                sharedSecret: Array.from(secret),
              };
              console.log('Dispatching connection data:', connectionData);
              dispatch(setPhantomConnection(connectionData));

              Alert.alert('Success', 'Connected to Phantom wallet!');
            } else {
              Alert.alert('Error', 'Failed to decrypt connection response');
            }
          } catch (error) {
            console.error('Connection error:', error);
            Alert.alert('Error', 'Failed to connect to Phantom wallet');
          }
        } else {
          console.error('Missing connection parameters:', {
            hasPhantomPubKey: !!phantomPubKey,
            hasNonce: !!nonce,
            hasData: !!data,
          });
        }
      } else if (url.startsWith('gocabs://onSignTransaction')) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const nonce = params.get('nonce');
        const data = params.get('data');
        const errorCode = params.get('errorCode');
        const errorMessage = params.get('errorMessage');

        // Handle error responses from Phantom
        if (errorCode) {
          let userFriendlyMessage = 'Transaction signing failed';

          switch (errorCode) {
            case '4001':
              userFriendlyMessage = 'Transaction was rejected by user';
              break;
            case '4002':
              userFriendlyMessage = 'Transaction was rejected by wallet';
              break;
            case '4003':
              userFriendlyMessage = 'Transaction was rejected by network';
              break;
            case '4004':
              userFriendlyMessage =
                'Transaction was rejected due to insufficient funds';
              break;
            case '4005':
              userFriendlyMessage =
                'Transaction was rejected due to invalid transaction';
              break;
            default:
              userFriendlyMessage = errorMessage
                ? decodeURIComponent(errorMessage)
                : 'Transaction signing failed';
          }

          Alert.alert('Transaction Rejected', userFriendlyMessage);
          return;
        }

        if (data && nonce && sharedSecret) {
          try {
            // Decrypt the response
            const decryptedData = nacl.box.open.after(
              bs58.decode(data),
              bs58.decode(nonce),
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

                    onTransactionSigned(signature);
                    Alert.alert(
                      'Success',
                      'Transaction sent and confirmed successfully!',
                    );
                  } catch (confirmError) {
                    onTransactionSigned(signature);
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
                  throw error;
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
        } else {
          // If no data/nonce but no error code, user probably cancelled
          if (!errorCode && !data && !nonce) {
            Alert.alert(
              'Transaction Cancelled',
              'Transaction signing was cancelled',
            );
          } else if (!data || !nonce) {
            Alert.alert('Error', 'Invalid response from Phantom wallet');
          }
        }
      } else {
        console.log('Unknown deep link URL:', url);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, [sharedSecret, onTransactionSigned, dappKeyPair, dispatch]);

  const connectPhantomWallet = async () => {
    try {
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);

      const params = new URLSearchParams({
        dapp_encryption_public_key: dappPublicKey,
        cluster: activeNetwork.cluster,
        app_url: 'https://gocabs.com',
        redirect_link: onConnectRedirectLink,
      });

      const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;

      // Check if Phantom is installed
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // If Phantom isn't installed, redirect to App Store
        await Linking.openURL(
          'https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977',
        );
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect to Phantom wallet');
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

  // Helper function to verify transaction data
  const verifyTransactionData = (transactionData: string): boolean => {
    try {
      // Check if the data is base58
      const buffer = bs58.decode(transactionData);

      // Minimum transaction size check (basic sanity check)
      if (buffer.length < 100) {
        return false;
      }

      // Try to deserialize - if either works, it's valid
      try {
        VersionedTransaction.deserialize(buffer);
        return true;
      } catch (versionedError) {
        try {
          Transaction.from(buffer);
          return true;
        } catch (legacyError) {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
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
      Alert.alert('Error', 'Please connect to Phantom wallet first');
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

      const url = `https://phantom.app/ul/v1/signTransaction?${params.toString()}`;

      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(
          'https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977',
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        `Failed to initiate transaction signing: ${error.message}`,
      );
    } finally {
      setIsSigning(false);
    }
  };

  const handleDisconnectPhantom = () => {
    console.log('Disconnecting Phantom wallet');
    // Reset all connection-related state
    setSharedSecret(null);
    setSession(null);
    setWalletAddress(null);
    setPhantomSessionData(null);
    setIsSigning(false);

    // Clear persisted state in Redux
    dispatch(disconnectPhantom());

    Alert.alert(
      'Disconnected',
      'Successfully disconnected from Phantom wallet',
    );
  };

  const ArrowIcon = () => <Icons.Arrow width={20} height={20} fill="#ffffff" />;

  if (Platform.OS !== 'ios') {
    return null; // Don't render on Android
  }

  // Debug log before rendering
  console.log('Rendering with state:', { isConnected, hasWallet: !!walletAddress });

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
                  ? 'Opening Phantom...'
                  : 'Sign Transaction with Phantom'}
              </Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.walletButton, {backgroundColor: '#ff4444'}]}
            onPress={handleDisconnectPhantom}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Disconnect Phantom</Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.walletButton}
          onPress={connectPhantomWallet}>
          <View style={styles.buttonContent}>
            <Icons.walletIcon width={24} height={24} />
            <Text style={styles.buttonText}>Connect Phantom</Text>
          </View>
          <ArrowIcon />
        </TouchableOpacity>
      )}

      <Text
        style={[styles.agreementText, {position: 'relative', marginTop: 12}]}>
        {!isConnected
          ? 'Tap to connect your Phantom wallet first.'
          : isSigning
          ? 'Opening Phantom wallet for transaction signing...'
          : 'Connected to Phantom. You can sign transactions or disconnect.'}
      </Text>
    </View>
  );
};

export default PhantomWalletAdapter;
