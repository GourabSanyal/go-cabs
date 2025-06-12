import {atom} from "recoil";
import {NavigationState} from "@react-navigation/native";
import {persistAtom} from "../../persist/persist";

// Navigation state atom WITHOUT automatic persistence (handled manually in hook)
export const navigationStateAtom = atom<NavigationState | null>({
  key: "navigationState",
  default: null,
  // Remove persistAtom effect to prevent infinite loop
});

// Loading state for navigation restoration
export const navigationLoadingAtom = atom<boolean>({
  key: "navigationLoading",
  default: true,
});

// Flag to indicate if this is the first app launch (no persisted navigation)
export const isFirstLaunchAtom = atom<boolean>({
  key: "isFirstLaunch",
  default: true,
});

// Timer state atoms for background persistence
export const timerStartTimeAtom = atom<number | null>({
  key: "timerStartTime",
  default: null,
  effects: [persistAtom<number | null>()],
});

export const timerDurationAtom = atom<number>({
  key: "timerDuration",
  default: 300, // 5 minutes default
  effects: [persistAtom<number>()],
});

export const modalOpenAtom = atom<boolean>({
  key: "modalOpen",
  default: false,
  effects: [persistAtom<boolean>()],
});

// Helper to reset timer state
export const resetTimerState = () => {
  // This will be used to clear cached timer state
  return {
    timerStartTime: null,
    timerDuration: 300,
    modalOpen: false,
  };
};
