import { useEffect, useCallback, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NavigationState } from '@react-navigation/native';
import { AppState, AppStateStatus } from 'react-native';
import { 
  navigationStateAtom, 
  isFirstLaunchAtom 
} from '../store/atoms/navigation/navigationAtoms';
import { mmkvUtils } from '../store/mmkv/storage';
import { NavigationDebugger } from '../utils/navigationDebugger';

export const useNavigationPersistence = () => {
  const [navigationState, setNavigationState] = useRecoilState(navigationStateAtom);
  const setIsFirstLaunch = useSetRecoilState(isFirstLaunchAtom);
  
  // Prevent multiple initializations
  const isInitialized = useRef(false);
  const isRestoring = useRef(false);

  // Save navigation state when it changes (but not during restoration)
  const handleNavigationStateChange = useCallback((state: NavigationState | undefined) => {
    // Don't save during restoration to prevent loops
    if (isRestoring.current || !isInitialized.current) {
      return;
    }
    
    if (state && NavigationDebugger.validateNavigationState(state)) {
      NavigationDebugger.logNavigationState(state, 'Navigation State Changed');
      setNavigationState(state);
      mmkvUtils.setNavigationState(state);
    }
  }, [setNavigationState]);

  // Handle app state changes with smart background logic
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      console.log('App going to background - saving timestamp');
      mmkvUtils.setBackgroundTimestamp();
      
      // Also save current navigation state
      if (navigationState && !isRestoring.current) {
        NavigationDebugger.logNavigationState(navigationState, 'Saving to Background');
        mmkvUtils.setNavigationState(navigationState);
      }
    } else if (nextAppState === 'active') {
      console.log('App came to foreground');
      // Background timestamp and navigation restoration logic handled in initialization
    }
  }, [navigationState]);

  useEffect(() => {
    // Initialize navigation state on app start (only once)
    const initializeNavigation = () => {
      if (isInitialized.current || isRestoring.current) {
        return;
      }
      
      isInitialized.current = true;
      isRestoring.current = true;
      
      try {
        console.log('Initializing navigation state...');
        
        // Check if we should restore navigation based on background time
        const shouldRestore = mmkvUtils.shouldRestoreNavigation();
        
        if (shouldRestore) {
          // App was just minimized recently - restore navigation
          const persistedState = mmkvUtils.getNavigationState();
          
          if (persistedState && NavigationDebugger.validateNavigationState(persistedState)) {
            NavigationDebugger.logNavigationState(persistedState, 'Restored Navigation State');
            setNavigationState(persistedState);
            setIsFirstLaunch(false);
            // Clear the background timestamp since we've successfully restored
            mmkvUtils.clearBackgroundTimestamp();
          } else {
            console.log('No valid navigation state found - starting fresh');
            mmkvUtils.clearNavigationData();
            setNavigationState(null);
            setIsFirstLaunch(true);
          }
        } else {
          // App was killed or too much time passed - fresh start
          console.log('Starting fresh - clearing navigation data');
          mmkvUtils.clearNavigationData();
          setNavigationState(null);
          setIsFirstLaunch(true);
        }
      } catch (error) {
        console.error('Failed to restore navigation state:', error);
        mmkvUtils.clearNavigationData();
        setNavigationState(null);
        setIsFirstLaunch(true);
      } finally {
        isRestoring.current = false;
        console.log('Navigation initialization complete');
      }
    };

    // Initialize only once
    if (!isInitialized.current) {
      initializeNavigation();
    }

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [setNavigationState, setIsFirstLaunch, handleAppStateChange]);

  return {
    navigationState,
    handleNavigationStateChange,
  };
}; 