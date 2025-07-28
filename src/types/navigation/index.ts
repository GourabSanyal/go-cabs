export type SelectedLocation = {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type RootStackParamList = {
  MainHome: undefined;
  BookRide: {
    pickupLocation: SelectedLocation;
    dropOffLocation: SelectedLocation;
  };
  ViewBidsScreen: undefined;
};
