import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/shared/state/auth/reducer';
import Icons from '@/assets/svgs';
import styles from '@/screens/Common/login-screen/LoginScreen.styles';
import { activeNetwork, NetworkType } from '@/shared/config/network';

interface MobileWalletAdapterProps {
  onWalletConnected: (info: { provider: string; address: string }) => void;
}

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
  const [connectedWallet, setConnectedWallet] = useState<{ address: string } | null>(null);
  const dispatch = useDispatch();

  const connectMobileWallet = async () => {
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
      name: 'Go Cabs',
      uri: 'https://gocabs.com',
      icon: 'favicon.ico',
    };

    try {
      console.log('Connecting to mobile wallet...');

      const authorizationResult = await transact(async (mobileWallet: any) => {
        return await mobileWallet.authorize({
          cluster: activeNetwork.cluster as NetworkType,
          identity: APP_IDENTITY,
          sign_in_payload: {
            domain: 'gocabs.com',
            statement: `You are signing in to Go Cabs with Mobile Wallet (${activeNetwork.cluster})`,
            uri: 'https://gocabs.com',
          },
        });
      });

      if (authorizationResult?.accounts?.length) {
        // Convert base64 pubkey to a Solana PublicKey
        const encodedPublicKey = authorizationResult.accounts[0].address;
        const publicKeyBuffer = Buffer.from(encodedPublicKey, 'base64');
        const publicKey = new PublicKeyClass(publicKeyBuffer);
        const base58Address = publicKey.toBase58();

        console.log('Mobile wallet connection successful, address:', base58Address);

        // Set connected wallet state
        setConnectedWallet({ address: base58Address });

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
        Alert.alert('Connection Error', 'No accounts found in mobile wallet');
      }
    } catch (error) {
      console.error('Mobile wallet connection error:', error);
      Alert.alert('Connection Error', 'Failed to connect to mobile wallet');
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
      <TouchableOpacity
        style={[
          styles.walletButton,
          connectedWallet && { backgroundColor: '#1a1a2e', borderColor: '#16213e' }
        ]}
        onPress={connectMobileWallet}
      >
        <View style={styles.buttonContent}>
          <Icons.walletIcon width={24} height={24} />
          <Text style={styles.buttonText}>
            {connectedWallet ? `Connected: ${connectedWallet.address.slice(0, 6)}...` : 'Pay with wallet'}
          </Text>
        </View>
        <ArrowIcon />
      </TouchableOpacity>
      
      {!connectedWallet && (
        <Text style={[styles.agreementText, { position: 'relative', marginTop: 12 }]}>
          Tap to connect your mobile wallet. Make sure you have a compatible wallet app installed.
        </Text>
      )}
    </View>
  );
};

export default MobileWalletAdapter; 