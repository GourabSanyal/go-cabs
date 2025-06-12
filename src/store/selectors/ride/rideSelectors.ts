import { selector } from 'recoil';
import { rideAtom } from '../../atoms/ride/rideAtom';

export const selectedRideTypeSelector = selector({
  key: 'selectedRideTypeSelector',
  get: ({ get }) => get(rideAtom).selectedRideType,
});

export const availableDriversSelector = selector({
  key: 'availableDriversSelector',
  get: ({ get }) => get(rideAtom).availableDrivers || [],
});

export const selectedDriverSelector = selector({
  key: 'selectedDriverSelector',
  get: ({ get }) => get(rideAtom).selectedDriver,
});

export const rideStatusSelector = selector({
  key: 'rideStatusSelector',
  get: ({ get }) => get(rideAtom).status,
});

export const rideFareSelector = selector({
  key: 'rideFareSelector',
  get: ({ get }) => get(rideAtom).fare,
});

export const rideLocationSelector = selector({
  key: 'rideLocationSelector',
  get: ({ get }) => ({
    pickup: get(rideAtom).pickupLocation,
    drop: get(rideAtom).dropLocation,
  }),
});

export const rideTimingsSelector = selector({
  key: 'rideTimingsSelector',
  get: ({ get }) => get(rideAtom).rideTimings,
});
