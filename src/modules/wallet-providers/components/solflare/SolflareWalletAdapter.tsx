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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/shared/state/store/store';
import type {AppDispatch} from '@/shared/state/store/store';
import {
  setSolflareConnection,
  disconnectSolflare,
} from '@/shared/state/wallet/reducer';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import Icons from '@/assets/svgs';
import styles from '@/screens/Common/login-screen/LoginScreen.styles';
import {activeNetwork, getNetworkEndpoint} from '@/shared/config/network';

interface SolflareWalletAdapterProps {
  onTransactionSigned: (signature: string) => void;
}

const SolflareWalletAdapter: React.FC<SolflareWalletAdapterProps> = ({
  onTransactionSigned,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isConnected, sessionData} = useSelector((state: RootState) => {
    console.log('Redux State in Solflare:', state);
    const solflareState = state?.wallet?.solflare || {
      isConnected: false,
      sessionData: null,
    };
    console.log('Solflare Connection State:', {
      isConnected: solflareState.isConnected,
      hasSessionData: !!solflareState.sessionData,
      sessionData: solflareState.sessionData
    });
    return solflareState;
  });

  const [dappKeyPair] = useState(() => nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solflareSessionData, setSolflareSessionData] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Create redirect URLs (lowercase to match Solflare's callback)
  const onConnectRedirectLink = 'gocabs://onsolflareconnect';
  const onSignTransactionRedirectLink = 'gocabs://onsolflareconnect';

  // Debug logging for state changes
  useEffect(() => {
    console.log('Component State:', {
      isConnected,
      hasSessionData: !!sessionData,
      hasSharedSecret: !!sharedSecret,
      hasSession: !!session,
      hasWalletAddress: !!walletAddress,
      hasSolflareSessionData: !!solflareSessionData,
    });
  }, [
    isConnected,
    sessionData,
    sharedSecret,
    session,
    walletAddress,
    solflareSessionData,
  ]);

  // Load persisted state from Redux on component mount and when sessionData changes
  useEffect(() => {
    if (sessionData) {
      console.log('Setting local state from sessionData:', sessionData);
      setSession(sessionData.session);
      setWalletAddress(sessionData.walletAddress);
      setSolflareSessionData(sessionData.sessionData);
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
      setSolflareSessionData(null);
      setSharedSecret(null);
    }
  }, [isConnected]);

  useEffect(() => {
    // Handle deep linking for both connect and sign transaction responses
    const handleDeepLink = async ({url}: {url: string}) => {
      if (url.toLowerCase().startsWith('gocabs://onsolflareconnect')) {
        console.log('Received connect callback:', url);
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const solflareEncryptionPublicKey = params.get(
          'solflare_encryption_public_key',
        );
        const nonce = params.get('nonce');
        const data = params.get('data');

        if (solflareEncryptionPublicKey && nonce && data) {
          try {
            // Create shared secret using Diffie-Hellman
            const secret = nacl.box.before(
              bs58.decode(solflareEncryptionPublicKey),
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
              console.log('Solflare Connection Data:', connectData);

              try {
                // Save session data to local state
                setSolflareSessionData(connectData);
                setWalletAddress(connectData.public_key);
                setSession(connectData.session);

                // Save state to Redux for persistence
                const connectionData = {
                  session: connectData.session,
                  walletAddress: connectData.public_key,
                  sessionData: connectData,
                  sharedSecret: Array.from(secret),
                };
                console.log('Dispatching Solflare connection data:', connectionData);
                
                // Dispatch connection data to Redux
                dispatch(setSolflareConnection(connectionData));

                Alert.alert('Success', 'Connected to Solflare wallet!');
              } catch (error) {
                console.error('Error saving Solflare connection data:', error);
                Alert.alert('Error', 'Failed to save Solflare connection data');
              }
            } else {
              Alert.alert('Error', 'Failed to decrypt connection response');
            }
          } catch (error) {
            console.error('Connection error:', error);
            Alert.alert('Error', 'Failed to connect to Solflare wallet');
          }
        } else {
          console.error('Missing connection parameters:', {
            hasSolflareEncryptionPublicKey: !!solflareEncryptionPublicKey,
            hasNonce: !!nonce,
            hasData: !!data,
          });
        }
      } else if (url.toLowerCase().startsWith('gocabs://onsolflareconnect')) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const nonce = params.get('nonce');
        const data = params.get('data');
        const errorCode = params.get('errorCode');
        const errorMessage = params.get('errorMessage');

        // Handle error responses from Solflare
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
            Alert.alert('Error', 'Invalid response from Solflare wallet');
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

  const connectSolflareWallet = async () => {
    try {
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);

      const params = new URLSearchParams({
        dapp_encryption_public_key: dappPublicKey,
        cluster: 'devnet',
        app_url: 'https://gocabs.com',
        redirect_link: onConnectRedirectLink,
      });

      const url = `https://solflare.com/ul/v1/connect?${params.toString()}`;

      // Check if Solflare is installed
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // If Solflare isn't installed, redirect to App Store
        await Linking.openURL(
          'https://apps.apple.com/app/solflare-wallet/id1580902717',
        );
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect to Solflare wallet');
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
      Alert.alert('Error', 'Please connect to Solflare wallet first');
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

      const url = `https://solflare.com/ul/v1/signTransaction?${params.toString()}`;

      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(
          'https://apps.apple.com/app/solflare-wallet/id1580902717',
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

  const handleDisconnectSolflare = () => {
    console.log('Disconnecting Solflare wallet');
    // Reset all connection-related state
    setSharedSecret(null);
    setSession(null);
    setWalletAddress(null);
    setSolflareSessionData(null);
    setIsSigning(false);

    // Clear persisted state in Redux
    dispatch(disconnectSolflare());

    Alert.alert(
      'Disconnected',
      'Successfully disconnected from Solflare wallet',
    );
  };

  const ArrowIcon = () => <Icons.Arrow width={20} height={20} fill="#ffffff" />;

  // Debug log before rendering
  console.log('Rendering Solflare with state:', {
    isConnected,
    hasWallet: !!walletAddress,
    hasSession: !!session,
    hasSharedSecret: !!sharedSecret,
    hasSolflareSessionData: !!solflareSessionData
  });

  if (Platform.OS !== 'ios') {
    return null; // Don't render on Android
  }

  return (
    <View style={styles.mobileWalletContainer}>
      {isConnected && walletAddress && session ? (
        <View style={{gap: 12}}>
          <TouchableOpacity
            style={[styles.walletButton, isSigning && {opacity: 0.7}]}
            onPress={signTransaction}
            disabled={isSigning}>
            <View style={styles.buttonContent}>
              <Icons.walletIcon width={24} height={24} />
              <Text style={styles.buttonText}>
                {isSigning ? 'Opening Solflare...' : 'Pay with Solflare'}
              </Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.walletButton, {backgroundColor: '#ff4444'}]}
            onPress={handleDisconnectSolflare}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Disconnect Solflare</Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.walletButton}
          onPress={connectSolflareWallet}>
          <View style={styles.buttonContent}>
            <Icons.walletIcon width={24} height={24} />
            <Text style={styles.buttonText}>Connect Solflare</Text>
          </View>
          <ArrowIcon />
        </TouchableOpacity>
      )}

      <Text style={[styles.agreementText, {position: 'relative', marginTop: 12}]}>
        {!isConnected
          ? 'Tap to connect your Solflare wallet first.'
          : isSigning
          ? 'Opening Solflare wallet for payment...'
          : 'Connected to Solflare. You can make payments or disconnect.'}
      </Text>
    </View>
  );
};

export default SolflareWalletAdapter;
