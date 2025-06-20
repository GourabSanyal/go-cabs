import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PhantomSessionData {
  session: string;
  walletAddress: string;
  sessionData: any;
  sharedSecret: number[]; // Store as array since we can't serialize Uint8Array
}

interface BackpackSessionData {
  session: string;
  walletAddress: string;
  sessionData: any;
  sharedSecret: number[];
}

interface WalletState {
  phantom: {
    isConnected: boolean;
    sessionData: PhantomSessionData | null;
  };
  backpack: {
    isConnected: boolean;
    sessionData: BackpackSessionData | null;
  };
}

const initialState: WalletState = {
  phantom: {
    isConnected: false,
    sessionData: null,
  },
  backpack: {
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
    setBackpackConnection: (state, action: PayloadAction<BackpackSessionData>) => {
      console.log('Setting Backpack connection with data:', action.payload);
      state.backpack = {
        isConnected: true,
        sessionData: action.payload,
      };
      console.log('Updated state:', state.backpack);
    },
    disconnectBackpack: (state) => {
      console.log('Disconnecting Backpack');
      state.backpack = {
        isConnected: false,
        sessionData: null,
      };
      console.log('Updated state after disconnect:', state.backpack);
    },
  },
});

export const { 
  setPhantomConnection, 
  disconnectPhantom,
  setBackpackConnection,
  disconnectBackpack,
} = walletSlice.actions;

export default walletSlice.reducer; 