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
} from '@solana/web3.js';
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

  useEffect(() => {
    // Handle deep linking for both connect and sign transaction responses
    const handleDeepLink = async ({url}: {url: string}) => {
      if (url.startsWith('gocabs://onConnect')) {
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
              secret
            );

            if (decryptedData) {
              const decoded = new TextDecoder().decode(decryptedData);
              const connectData = JSON.parse(decoded);
              
              // Save session data to state
              setPhantomSessionData(connectData);
              setWalletAddress(connectData.public_key);
              setSession(connectData.session);
              setIsConnected(true);
              
              Alert.alert('Success', 'Connected to Phantom wallet!');
            } else {
              Alert.alert('Error', 'Failed to decrypt connection response');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to connect to Phantom wallet');
          }
        }
      } else if (url.startsWith('solanaappkit://onSignTransaction')) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        const nonce = params.get('nonce');
        const data = params.get('data');
        
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
              
              if (signData.signature) {
                onTransactionSigned(signData.signature);
                Alert.alert('Success', 'Transaction signed successfully!');
              } else {
                Alert.alert('Error', 'No signature in response');
              }
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to process transaction signature');
          }
        }
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
        app_url: 'https://solanaappkit.com',
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

    setIsSigning(true);

    try {
      // Create a test transaction
      const transaction = await createTestTransaction();
      
      // Serialize the transaction
      const serializedTransaction = transaction
        .serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
        .toString('base64');

      // Create the payload
      const payload = {
        transaction: serializedTransaction,
        session: session,
      };

      // Encrypt the payload
      const {nonce, encryptedPayload} = encryptPayload(payload);

      // Get dapp public key
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);

      // Create the URL with the encrypted payload
      const params = new URLSearchParams({
        dapp_encryption_public_key: dappPublicKey,
        nonce: nonce,
        redirect_link: onSignTransactionRedirectLink,
        payload: encryptedPayload,
      });
      
      const url = `https://phantom.app/ul/v1/signTransaction?${params.toString()}`;
      
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
    } catch (error: any) {
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
