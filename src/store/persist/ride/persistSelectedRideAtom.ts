import {AtomEffect} from "recoil";
import {storage} from "../../mmkv/storage";
import {RideState} from "../../../types/ride/rideTypes";
import {STORAGE_KEYS} from "../../constants/storageKeys";

const RIDE_SELECTION_KEY = STORAGE_KEYS.RIDE;

export const persistSelectedRideAtom: AtomEffect<RideState> = ({
  onSet,
  setSelf,
  trigger,
}) => {
  if (trigger === "get") {
    const storedValue = storage.getString(RIDE_SELECTION_KEY);
    console.log("Loaded stored string for key", RIDE_SELECTION_KEY, ":", storedValue);
    if (storedValue != null) {
      try {
        const parsedData = JSON.parse(storedValue);
        console.log("Parsed data for setSelf:", parsedData);
        setSelf(parsedData);
      } catch (e) {
        console.error("Error parsing stored ride selection data:", e);
      }
    } else {
      console.log("No stored value found for key:", RIDE_SELECTION_KEY, "- atom will use default.");
    }
  }

  onSet((newValue, _, isReset) => {
    if (isReset || newValue == null) {
      storage.delete(RIDE_SELECTION_KEY);
      return;
    }

    const dataToPersist = {
      pickupLocation: newValue.pickupLocation,
      dropOffLocation: newValue.dropOffLocation,
      selectedRideType: newValue.selectedRideType,
      fare: newValue.fare,
      payment: newValue.payment,
      status: newValue.status,
    };

    console.log("Persisting data:", JSON.stringify(dataToPersist));
    console.log("Is newValue.fare defined?", newValue.fare);
    console.log("Is newValue.status defined?", newValue.status);
    try {
      storage.set(RIDE_SELECTION_KEY, JSON.stringify(dataToPersist));
      console.log("Data supposedly persisted for key:", RIDE_SELECTION_KEY);
    } catch (e) {
      console.error("Error storing ride selection data:", e);
    }
  });
};
