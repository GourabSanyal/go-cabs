import { NavigationState } from '@react-navigation/native';

export const NavigationDebugger = {
  // Log navigation state changes
  logNavigationState: (state: NavigationState | undefined, label: string = 'Navigation State') => {
    if (__DEV__) {
      console.log(`[${label}]`, {
        routeNames: state?.routeNames,
        index: state?.index,
        currentRoute: state?.routes[state?.index || 0]?.name,
        params: state?.routes[state?.index || 0]?.params,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Validate navigation state structure
  validateNavigationState: (state: NavigationState | null): boolean => {
    if (!state) return false;
    
    try {
      return (
        typeof state === 'object' &&
        Array.isArray(state.routes) &&
        state.routes.length > 0 &&
        typeof state.index === 'number' &&
        state.index >= 0 &&
        state.index < state.routes.length
      );
    } catch (error) {
      console.error('Navigation state validation error:', error);
      return false;
    }
  },

  // Get current route info
  getCurrentRouteInfo: (state: NavigationState | null) => {
    if (!state || !NavigationDebugger.validateNavigationState(state)) {
      return null;
    }

    const currentRoute = state.routes[state.index];
    return {
      name: currentRoute.name,
      params: currentRoute.params,
      key: currentRoute.key,
    };
  },

  // Clear persisted navigation state (for debugging)
  clearPersistedNavigation: () => {
    if (__DEV__) {
      const { mmkvUtils } = require('../store/mmkv/storage');
      mmkvUtils.clearNavigationData();
      console.log('✅ All navigation data cleared - app will start fresh');
    }
  },

  // Force clear all navigation data
  forceResetNavigation: () => {
    if (__DEV__) {
      const { storage } = require('../store/mmkv/storage');
      storage.delete('navigationState');
      storage.delete('backgroundTimestamp');
      console.log('✅ Force reset: All navigation data cleared from MMKV');
    }
  },

  // Simulate app being backgrounded for testing
  simulateBackground: (minutesAgo: number = 5) => {
    if (__DEV__) {
      const { storage } = require('../store/mmkv/storage');
      const timestamp = Date.now() - (minutesAgo * 60 * 1000);
      storage.set('backgroundTimestamp', timestamp.toString());
      console.log(`✅ Simulated app backgrounded ${minutesAgo} minutes ago`);
    }
  },

  // Check current background status
  checkBackgroundStatus: () => {
    if (__DEV__) {
      const { mmkvUtils } = require('../store/mmkv/storage');
      const backgroundTime = mmkvUtils.getBackgroundTimestamp();
      
      if (!backgroundTime) {
        console.log('📱 No background timestamp - app was killed/closed');
        return;
      }

      const now = Date.now();
      const timeDiff = now - backgroundTime;
      const minutes = Math.round(timeDiff / 60000);
      
      console.log(`📱 App was backgrounded ${minutes} minutes ago`);
      console.log(`📱 Should restore navigation: ${mmkvUtils.shouldRestoreNavigation()}`);
    }
  },
}; 