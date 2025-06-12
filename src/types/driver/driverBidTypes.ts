import { Driver } from "./driverTypes";

export interface DriverBid {
    bidId: string;
    driverId: Driver['id'];
    requestId: string;
    amount: number;
    estimatedArrivalMinutes: number;
    estimatedTripDurationMinutes: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
    createdAt: Date;
    expiresAt: Date;
    driverLocation: {
      latitude: number;
      longitude: number;
    };
    vehicleStatus: {
      batteryLevel: number;
      estimatedRange: number;
    };
    walletAddress: Driver['walletAddress'];
  }