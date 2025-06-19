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
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from '@/assets/svgs';
import styles from '@/screens/Common/login-screen/LoginScreen.styles';
import {activeNetwork, getNetworkEndpoint} from '@/shared/config/network';

interface PhantomWalletAdapterProps {
  onTransactionSigned: (signature: string) => void;
}

// Storage keys for persistence
const STORAGE_KEYS = {
  PHANTOM_SESSION: 'phantom_session',
  PHANTOM_WALLET_ADDRESS: 'phantom_wallet_address',
  PHANTOM_SESSION_DATA: 'phantom_session_data',
  PHANTOM_SHARED_SECRET: 'phantom_shared_secret',
};

const PhantomWalletAdapter: React.FC<PhantomWalletAdapterProps> = ({
  onTransactionSigned,
}) => {
  const [dappKeyPair] = useState(() => nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [phantomSessionData, setPhantomSessionData] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Create redirect URLs
  const onConnectRedirectLink = 'gocabs://onConnect';
  const onSignTransactionRedirectLink = 'gocabs://onSignTransaction';

  // Load persisted state on component mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [savedSession, savedWalletAddress, savedSessionData, savedSharedSecret] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PHANTOM_SESSION),
          AsyncStorage.getItem(STORAGE_KEYS.PHANTOM_WALLET_ADDRESS),
          AsyncStorage.getItem(STORAGE_KEYS.PHANTOM_SESSION_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.PHANTOM_SHARED_SECRET),
        ]);

        if (savedSession && savedWalletAddress && savedSharedSecret) {
          console.log('Restoring Phantom connection state...');
          setSession(savedSession);
          setWalletAddress(savedWalletAddress);
          setPhantomSessionData(savedSessionData ? JSON.parse(savedSessionData) : null);
          setSharedSecret(new Uint8Array(JSON.parse(savedSharedSecret)));
          setIsConnected(true);
          console.log('Phantom connection state restored successfully');
        }
      } catch (error) {
        console.error('Failed to restore Phantom state:', error);
      }
    };

    loadPersistedState();
  }, []);

  // Save state when it changes
  const saveState = async (newSession: string, newWalletAddress: string, newSessionData: any, newSharedSecret: Uint8Array) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PHANTOM_SESSION, newSession),
        AsyncStorage.setItem(STORAGE_KEYS.PHANTOM_WALLET_ADDRESS, newWalletAddress),
        AsyncStorage.setItem(STORAGE_KEYS.PHANTOM_SESSION_DATA, JSON.stringify(newSessionData)),
        AsyncStorage.setItem(STORAGE_KEYS.PHANTOM_SHARED_SECRET, JSON.stringify(Array.from(newSharedSecret))),
      ]);
      console.log('Phantom state saved successfully');
    } catch (error) {
      console.error('Failed to save Phantom state:', error);
    }
  };

  // Clear persisted state
  const clearPersistedState = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PHANTOM_SESSION),
        AsyncStorage.removeItem(STORAGE_KEYS.PHANTOM_WALLET_ADDRESS),
        AsyncStorage.removeItem(STORAGE_KEYS.PHANTOM_SESSION_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.PHANTOM_SHARED_SECRET),
      ]);
      console.log('Phantom state cleared successfully');
    } catch (error) {
      console.error('Failed to clear Phantom state:', error);
    }
  };

  useEffect(() => {
    // Handle deep linking for both connect and sign transaction responses
    const handleDeepLink = async ({url}: {url: string}) => {
      console.log('=== PHANTOM DEEPLINK RECEIVED ===');
      console.log('URL:', url);
      
      if (url.startsWith('gocabs://onConnect')) {
        console.log('Processing connection response...');
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const phantomPubKey = params.get('phantom_encryption_public_key');
        const nonce = params.get('nonce');
        const data = params.get('data');
        
        console.log('Connection params:', {
          phantomPubKey: phantomPubKey ? `${phantomPubKey.substring(0, 20)}...` : null,
          nonce: nonce ? `${nonce.substring(0, 20)}...` : null,
          data: data ? `${data.substring(0, 50)}...` : null
        });
        
        if (phantomPubKey && nonce && data) {
          try {
            // Create shared secret using Diffie-Hellman
            const secret = nacl.box.before(
              bs58.decode(phantomPubKey),
              dappKeyPair.secretKey,
            );
            setSharedSecret(secret);
            console.log('Shared secret created successfully');
            
            // Decrypt the response data
            const decryptedData = nacl.box.open.after(
              bs58.decode(data),
              bs58.decode(nonce),
              secret
            );

            if (decryptedData) {
              const decoded = new TextDecoder().decode(decryptedData);
              const connectData = JSON.parse(decoded);
              
              console.log('=== CONNECTION SUCCESS ===');
              console.log('Decrypted data:', connectData);
              console.log('Public key:', connectData.public_key);
              console.log('Session:', connectData.session);
              
              // Save session data to state
              setPhantomSessionData(connectData);
              setWalletAddress(connectData.public_key);
              setSession(connectData.session);
              setIsConnected(true);
              
              // Save state to AsyncStorage for persistence
              await saveState(connectData.session, connectData.public_key, connectData, secret);
              
              Alert.alert('Success', 'Connected to Phantom wallet!');
            } else {
              console.error('Failed to decrypt connection response');
              Alert.alert('Error', 'Failed to decrypt connection response');
            }
          } catch (error) {
            console.error('Connection processing error:', error);
            Alert.alert('Error', 'Failed to connect to Phantom wallet');
          }
        } else {
          console.error('Missing connection parameters:', {
            hasPhantomPubKey: !!phantomPubKey,
            hasNonce: !!nonce,
            hasData: !!data
          });
        }
      } else if (url.startsWith('gocabs://onSignTransaction')) {
        console.log('Processing transaction signing response...');
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const nonce = params.get('nonce');
        const data = params.get('data');
        const errorCode = params.get('errorCode');
        const errorMessage = params.get('errorMessage');
        
        console.log('Transaction signing params:', {
          nonce: nonce ? `${nonce.substring(0, 20)}...` : null,
          data: data ? `${data.substring(0, 50)}...` : null,
          hasSharedSecret: !!sharedSecret,
          errorCode,
          errorMessage
        });
        
        // Handle error responses from Phantom
        if (errorCode) {
          console.log('Phantom returned an error:', { errorCode, errorMessage });
          
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
              userFriendlyMessage = 'Transaction was rejected due to insufficient funds';
              break;
            case '4005':
              userFriendlyMessage = 'Transaction was rejected due to invalid transaction';
              break;
            default:
              userFriendlyMessage = errorMessage ? decodeURIComponent(errorMessage) : 'Transaction signing failed';
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
              sharedSecret
            );

            if (decryptedData) {
              const decoded = new TextDecoder().decode(decryptedData);
              const signData = JSON.parse(decoded);
              
              console.log('=== TRANSACTION SIGNING RESPONSE ===');
              console.log('Decrypted sign data:', signData);
              console.log('Signature:', signData.signature);
              console.log('All keys:', Object.keys(signData));
              console.log('Full response object:', JSON.stringify(signData, null, 2));
              
              // Handle different response formats from Phantom
              let signature: string | null = null;
              
              // Check if we got a direct signature
              if (signData.signature) {
                signature = signData.signature;
                console.log('Direct signature found:', signature);
              }
              // Check if we got a signed transaction (need to extract signature)
              else if (signData.transaction) {
                console.log('Signed transaction received, extracting signature...');
                
                try {
                  // Decode the signed transaction from base58
                  const signedTxBuffer = bs58.decode(signData.transaction);
                  console.log('Signed transaction buffer length:', signedTxBuffer.length);
                  
                  // Try to deserialize as VersionedTransaction first
                  try {
                    console.log('Attempting to deserialize as VersionedTransaction...');
                    const versionedTx = VersionedTransaction.deserialize(signedTxBuffer);
                    if (versionedTx.signatures.length > 0) {
                      signature = bs58.encode(versionedTx.signatures[0]);
                      console.log('Extracted signature from versioned transaction:', signature);
                    } else {
                      console.log('No signatures found in versioned transaction');
                    }
                  } catch (versionedError: any) {
                    console.log('VersionedTransaction deserialization failed:', versionedError.message);
                    console.log('Attempting to deserialize as legacy Transaction...');
                    
                    // Try as legacy Transaction
                    const legacyTx = Transaction.from(signedTxBuffer);
                    if (legacyTx.signatures.length > 0 && legacyTx.signatures[0].signature) {
                      signature = bs58.encode(legacyTx.signatures[0].signature);
                      console.log('Extracted signature from legacy transaction:', signature);
                    } else {
                      console.log('No signatures found in legacy transaction');
                      
                      // If no signature found in transaction, the transaction data itself might be the signature
                      if (signedTxBuffer.length === 64) {
                        signature = signData.transaction;
                        console.log('Transaction data appears to be the signature itself:', signature);
                      }
                    }
                  }
                } catch (extractError) {
                  console.error('Failed to extract signature from transaction:', extractError);
                }
              }
              // Check for other possible signature fields
              else if (signData.sig) {
                signature = signData.sig;
                console.log('Signature found in sig field:', signature);
              }
              else if (signData.txid) {
                signature = signData.txid;
                console.log('Signature found in txid field:', signature);
              }
              // Check for other common Phantom response fields
              else if (signData.result && signData.result.signature) {
                signature = signData.result.signature;
                console.log('Signature found in result.signature field:', signature);
              }
              else if (signData.data && signData.data.signature) {
                signature = signData.data.signature;
                console.log('Signature found in data.signature field:', signature);
              }
              // Check if the entire response might be the signature
              else if (typeof signData === 'string' && signData.length >= 80 && signData.length <= 100) {
                try {
                  const decoded = bs58.decode(signData);
                  if (decoded.length === 64) {
                    signature = signData;
                    console.log('Response is a direct signature:', signature);
                  }
                } catch (directError) {
                  console.log('Response is not a direct signature');
                }
              }
              
              if (signature) {
                console.log('Signature found, calling onTransactionSigned with:', signature);
                onTransactionSigned(signature);
                Alert.alert('Success', 'Transaction signed successfully!');
              } else {
                console.error('No signature in response. Full response:', signData);
                Alert.alert('Error', 'No signature in response');
              }
            } else {
              console.error('Failed to decrypt transaction response');
              Alert.alert('Error', 'Failed to decrypt transaction response');
            }
          } catch (error) {
            console.error('Transaction signing processing error:', error);
            Alert.alert('Error', 'Failed to process transaction signature');
          }
        } else {
          console.error('Missing transaction signing parameters:', {
            hasData: !!data,
            hasNonce: !!nonce,
            hasSharedSecret: !!sharedSecret
          });
          
          // If no data/nonce but no error code, user probably cancelled
          if (!errorCode && !data && !nonce) {
            console.log('User cancelled transaction signing');
            Alert.alert('Transaction Cancelled', 'Transaction signing was cancelled');
          } else if (!data || !nonce) {
            console.error('Invalid response from Phantom - missing required data');
            Alert.alert('Error', 'Invalid response from Phantom wallet');
          }
        }
      } else {
        console.log('Unknown deep link URL:', url);
      }
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, [sharedSecret, onTransactionSigned, dappKeyPair]);

  const connectPhantomWallet = async () => {
    try {
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);
      
      // Construct the deep link URL for connection
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

  const encryptPayload = (payload: any): {nonce: string, encryptedPayload: string} => {
    if (!sharedSecret) throw new Error('Shared secret not established');
    
    const messageBytes = new TextEncoder().encode(JSON.stringify(payload));
    const nonce = nacl.randomBytes(24);
    
    const encryptedMessage = nacl.box.after(messageBytes, nonce, sharedSecret);

    return {
      nonce: bs58.encode(nonce),
      encryptedPayload: bs58.encode(encryptedMessage)
    };
  };

  // Helper function to verify transaction data
  const verifyTransactionData = (transactionData: string): boolean => {
    try {
      // Check if the data is base58
      const buffer = bs58.decode(transactionData);
      
      // Minimum transaction size check (basic sanity check)
      if (buffer.length < 100) {
        console.log('Transaction data too small:', buffer.length);
        return false;
      }
      
      // Try to deserialize - if either works, it's valid
      try {
        VersionedTransaction.deserialize(buffer);
        console.log('Valid versioned transaction data');
        return true;
      } catch (versionedError) {
        try {
          Transaction.from(buffer);
          console.log('Valid legacy transaction data');
          return true;
        } catch (legacyError) {
          console.log('Not a valid transaction format');
          return false;
        }
      }
    } catch (error) {
      console.error('Transaction data verification failed:', error);
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
        lamports: 0.001 * LAMPORTS_PER_SOL, // 0.001 SOL
      }),
    );

    return transaction;
  };

  const signTransaction = async () => {
    if (!isConnected || !sharedSecret || !session) {
      Alert.alert('Error', 'Please connect to Phantom wallet first');
      return;
    }

    console.log('=== STARTING TRANSACTION SIGNING ===');
    console.log('Connection status:', isConnected);
    console.log('Session available:', !!session);
    console.log('Shared secret available:', !!sharedSecret);
    console.log('Wallet address:', walletAddress);

    setIsSigning(true);

    try {
      // Create a test transaction
      console.log('Creating test transaction...');
      const transaction = await createTestTransaction();
      console.log('Test transaction created successfully');
      
      // Ensure transaction is properly prepared
      if (!transaction.recentBlockhash) {
        const connection = new Connection(getNetworkEndpoint(), 'confirmed');
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
      }
      
      if (!transaction.feePayer && walletAddress) {
        transaction.feePayer = new PublicKey(walletAddress);
      }
      
      // Serialize the transaction to base58
      console.log('Serializing transaction...');
      const serializedTransaction = bs58.encode(
        transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
      );
      console.log('Transaction serialized, length:', serializedTransaction.length);

      // Create the payload
      const payload = {
        transaction: serializedTransaction,
        session: session,
      };
      console.log('Payload created:', { session: session, transactionLength: serializedTransaction.length });

      // Encrypt the payload
      console.log('Encrypting payload...');
      const {nonce, encryptedPayload} = encryptPayload(payload);
      console.log('Payload encrypted successfully');

      // Get dapp public key
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);
      console.log('Dapp public key:', dappPublicKey);

      // Create the URL with the encrypted payload
      const params = new URLSearchParams({
        dapp_encryption_public_key: dappPublicKey,
        nonce: nonce,
        redirect_link: onSignTransactionRedirectLink,
        payload: encryptedPayload,
      });
      
      const url = `https://phantom.app/ul/v1/signTransaction?${params.toString()}`;
      console.log('Opening Phantom with URL:', url);
      
      // Check if Phantom is installed
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        console.log('Phantom app found, opening...');
        await Linking.openURL(url);
      } else {
        console.log('Phantom not found, redirecting to App Store...');
        await Linking.openURL(
          'https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977',
        );
      }
    } catch (error: any) {
      console.error('Transaction signing error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      Alert.alert(
        'Error',
        `Failed to initiate transaction signing: ${error.message}`,
      );
    } finally {
      setIsSigning(false);
    }
  };

  const disconnectPhantom = () => {
    // Reset all connection-related state
    setSharedSecret(null);
    setSession(null);
    setIsConnected(false);
    setWalletAddress(null);
    setPhantomSessionData(null);
    setIsSigning(false);
    
    // Clear persisted state
    clearPersistedState();
    
    Alert.alert('Disconnected', 'Successfully disconnected from Phantom wallet');
  };

  const ArrowIcon = () => <Icons.Arrow width={20} height={20} fill="#ffffff" />;

  if (Platform.OS !== 'ios') {
    return null; // Don't render on Android
  }

  return (
    <View style={styles.mobileWalletContainer}>
      {!isConnected ? (
        <TouchableOpacity
          style={styles.walletButton}
          onPress={connectPhantomWallet}>
          <View style={styles.buttonContent}>
            <Icons.walletIcon width={24} height={24} />
            <Text style={styles.buttonText}>Connect Phantom</Text>
          </View>
          <ArrowIcon />
        </TouchableOpacity>
      ) : (
        <View style={{ gap: 12 }}>
          <TouchableOpacity 
            style={[styles.walletButton, isSigning && { opacity: 0.7 }]} 
            onPress={signTransaction}
            disabled={isSigning}>
            <View style={styles.buttonContent}>
              <Icons.walletIcon width={24} height={24} />
              <Text style={styles.buttonText}>
                {isSigning ? 'Opening Phantom...' : 'Sign Transaction with Phantom'}
              </Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.walletButton, { backgroundColor: '#ff4444' }]} 
            onPress={disconnectPhantom}>
            <View style={styles.buttonContent}>
              <Icons.walletIcon width={24} height={24} />
              <Text style={styles.buttonText}>Disconnect Phantom</Text>
            </View>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
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
