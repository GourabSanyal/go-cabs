import {atom} from "recoil";
import {RideState} from "../../../types/ride/rideTypes";
import {persistSelectedRideAtom} from "../../persist/ride/persistSelectedRideAtom";

export const rideAtom = atom<RideState>({
  key: "rideState",
  default: {},
  effects_UNSTABLE: [persistSelectedRideAtom]
});
