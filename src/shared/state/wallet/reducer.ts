import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletSessionData {
  session: string;
  walletAddress: string;
  sessionData: any;
  sharedSecret: number[];
}

interface WalletState {
  phantom: {
    isConnected: boolean;
    sessionData: WalletSessionData | null;
  };
  backpack: {
    isConnected: boolean;
    sessionData: WalletSessionData | null;
  };
  solflare: {
    isConnected: boolean;
    sessionData: WalletSessionData | null;
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
  solflare: {
    isConnected: false,
    sessionData: null,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setPhantomConnection: (state, action: PayloadAction<WalletSessionData>) => {
      state.phantom.isConnected = true;
      state.phantom.sessionData = action.payload;
    },
    disconnectPhantom: (state) => {
      state.phantom.isConnected = false;
      state.phantom.sessionData = null;
    },
    setBackpackConnection: (state, action: PayloadAction<WalletSessionData>) => {
      state.backpack.isConnected = true;
      state.backpack.sessionData = action.payload;
    },
    disconnectBackpack: (state) => {
      state.backpack.isConnected = false;
      state.backpack.sessionData = null;
    },
    setSolflareConnection: (state, action: PayloadAction<WalletSessionData>) => {
      console.log('Setting Solflare connection with data:', action.payload);
      state.solflare = {
        isConnected: true,
        sessionData: action.payload,
      };
      console.log('Updated Solflare state:', state.solflare);
    },
    disconnectSolflare: (state) => {
      console.log('Disconnecting Solflare');
      state.solflare = {
        isConnected: false,
        sessionData: null,
      };
      console.log('Updated Solflare state after disconnect:', state.solflare);
    },
  },
});

export const {
  setPhantomConnection,
  disconnectPhantom,
  setBackpackConnection,
  disconnectBackpack,
  setSolflareConnection,
  disconnectSolflare,
} = walletSlice.actions;

export default walletSlice.reducer; 