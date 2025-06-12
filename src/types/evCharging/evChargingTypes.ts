// Type definitions for Open Charge Map API response
export interface EvChargingStation {
  ID: number;
  UUID: string;
  AddressInfo: {
    ID: number;
    Title?: string;
    AddressLine1: string;
    AddressLine2?: string;
    Town?: string;
    StateOrProvince?: string;
    Postcode?: string;
    CountryID: number;
    Country?: {
      ID: number;
      ISOCode: string;
      Title: string;
    };
    Latitude: number;
    Longitude: number;
    ContactTelephone1?: string;
    ContactEmail?: string;
    AccessComments?: string;
    RelatedURL?: string;
  };
  Connections: Array<{
    ID: number;
    ConnectionTypeID: number;
    ConnectionType?: {
      ID: number;
      Title: string;
      FormalName?: string;
    };
    StatusTypeID?: number;
    StatusType?: {
      ID: number;
      Title: string;
      IsOperational: boolean;
    };
    PowerKW?: number;
    CurrentTypeID?: number;
    CurrentType?: {
      ID: number;
      Title: string;
    };
    Quantity?: number;
  }>;
  NumberOfPoints?: number;
  GeneralComments?: string;
  StatusTypeID?: number;
  StatusType?: {
    ID: number;
    Title: string;
    IsOperational: boolean;
  };
  OperatorInfo?: {
    ID: number;
    Title: string;
    WebsiteURL?: string;
    PhonePrimaryContact?: string;
  };
  UsageType?: {
    ID: number;
    Title: string;
    IsPayAtLocation: boolean;
    IsMembershipRequired: boolean;
  };
  UsageCost?: string;
  DateLastVerified?: string;
  DateLastStatusUpdate?: string;
}

// Used for passing charging station data to WebView
export interface EvChargingStationMarker {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  connectionTypes: string[];
  isOperational: boolean;
  powerKW?: number;
  numberOfPoints?: number;
  operator?: string;
}
