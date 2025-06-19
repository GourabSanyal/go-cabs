import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../auth/reducer';
import walletReducer from '../wallet/reducer';
import threadReducer from '../thread/reducer';
import transactionReducer from '../transaction/reducer';
import usersReducer from '../users/reducer';
import notificationReducer from '../notification/reducer';
import profileReducer from '../profile/reducer';
import chatReducer from '../chat/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
  thread: threadReducer,
  transaction: transactionReducer,
  users: usersReducer,
  notification: notificationReducer,
  profile: profileReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['wallet', 'auth'],
  debug: __DEV__,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['profile.actions.data'],
      },
      immutableCheck: {
        warnAfter: 200,
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer> & {
  _persist?: { version: number; rehydrated: boolean };
};

export type AppDispatch = typeof store.dispatch; 