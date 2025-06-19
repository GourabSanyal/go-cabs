import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PhantomSessionData {
  session: string;
  walletAddress: string;
  sessionData: any;
  sharedSecret: number[]; // Store as array since we can't serialize Uint8Array
}

interface WalletState {
  phantom: {
    isConnected: boolean;
    sessionData: PhantomSessionData | null;
  };
}

const initialState: WalletState = {
  phantom: {
    isConnected: false,
    sessionData: null,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setPhantomConnection: (state, action: PayloadAction<PhantomSessionData>) => {
      console.log('Setting Phantom connection with data:', action.payload);
      state.phantom = {
        isConnected: true, // Explicitly set to true when we have session data
        sessionData: action.payload,
      };
      console.log('Updated state:', state.phantom);
    },
    disconnectPhantom: (state) => {
      console.log('Disconnecting Phantom');
      state.phantom = {
        isConnected: false,
        sessionData: null,
      };
      console.log('Updated state after disconnect:', state.phantom);
    },
  },
});

export const { setPhantomConnection, disconnectPhantom } = walletSlice.actions;
export default walletSlice.reducer; 