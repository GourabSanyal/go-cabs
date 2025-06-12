export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Address extends GeoLocation {
  address?: string;
  placeId?: string;
}
