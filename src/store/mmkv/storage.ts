import {MMKV} from "react-native-mmkv";
import {User} from '../../types/user/userTypes'
import { NavigationState } from '@react-navigation/native';

export const storage = new MMKV({
  id: "app-storage",
  encryptionKey: "optional-encryption-key",
});

export const mmkvUtils = {
// gets user data
  getUser: (): User | null => {
    const userData = storage.getString("userAtom");
    return userData ? JSON.parse(userData) : null;
  },
// sets user data
  setUser: (user: User | null) => {
    if (user) {
      storage.set("userAtom", JSON.stringify(user));
    } else {
      storage.delete("userAtom");
    }
  },

  // Navigation state utilities
  getNavigationState: (): NavigationState | null => {
    try {
      const navigationData = storage.getString("navigationState");
      return navigationData ? JSON.parse(navigationData) : null;
    } catch (error) {
      console.error("Error parsing navigation state:", error);
      storage.delete("navigationState");
      return null;
    }
  },

  setNavigationState: (state: NavigationState | null) => {
    try {
      if (state) {
        storage.set("navigationState", JSON.stringify(state));
      } else {
        storage.delete("navigationState");
      }
    } catch (error) {
      console.error("Error storing navigation state:", error);
    }
  },

  // Background timestamp utilities
  setBackgroundTimestamp: () => {
    storage.set("backgroundTimestamp", Date.now().toString());
  },

  getBackgroundTimestamp: (): number | null => {
    const timestamp = storage.getString("backgroundTimestamp");
    return timestamp ? parseInt(timestamp, 10) : null;
  },

  clearBackgroundTimestamp: () => {
    storage.delete("backgroundTimestamp");
  },

  // Check if navigation should be restored based on background time
  shouldRestoreNavigation: (): boolean => {
    const backgroundTime = mmkvUtils.getBackgroundTimestamp();
    
    if (!backgroundTime) {
      // No background timestamp = app was killed/closed
      console.log('No background timestamp found - app was killed/closed');
      return false;
    }

    const now = Date.now();
    const timeDiff = now - backgroundTime;
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes

    if (timeDiff > tenMinutesInMs) {
      console.log(`App was backgrounded for ${Math.round(timeDiff / 1000)}s (>${tenMinutesInMs/1000}s) - treating as fresh start`);
      return false;
    }

    console.log(`App was backgrounded for ${Math.round(timeDiff / 1000)}s (<${tenMinutesInMs/1000}s) - restoring navigation`);
    return true;
  },

  // Clear navigation and background data for fresh start
  clearNavigationData: () => {
    mmkvUtils.setNavigationState(null);
    mmkvUtils.clearBackgroundTimestamp();
    console.log('Navigation data cleared for fresh start');
  },

  // clears all storage
  clearStorage: () => {
    storage.clearAll();
  },
};
