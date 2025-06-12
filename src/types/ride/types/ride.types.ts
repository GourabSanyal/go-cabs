import {z} from "zod";
import {RideRequestSchema} from "../schema/ride.request";
import {RideSchema} from "../schema/ride";

export type RideRequest = z.infer<typeof RideRequestSchema>;
export type Ride = z.infer<typeof RideSchema>;

// Payload for submitting a new quotation request
export interface QuotationRequestPayload {
  riderId: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  requestedAt: string; // ISO string for timestamp
  preferredPaymentMethod?: "metamask" | "credit" | "debit" | "cash"; // Optional
  vehicleType?: string; // Optional, e.g., "Sedan", "SUV"
  // Any other specific details rider wants to send for the quotation
}

// Structure for a Bid object (as received from backend or stored in state)
// This might also live in a more general types file or bid.types.ts
export interface Bid {
  id: string; // Bid ID
  quotationRequestId: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  driverFcmToken?: string; // For notifications
  vehicleDetails: string; // e.g., "Toyota Camry - ABC 123"
  bidAmount: number;
  currency?: string; // e.g., "USD", "ETH"
  estimatedArrivalTime: string; // e.g., "5 mins"
  bidAt: string; // ISO string for timestamp
  status:
    | "PENDING_RIDER_APPROVAL"
    | "ACCEPTED_BY_RIDER"
    | "REJECTED_BY_RIDER"
    | "EXPIRED"
    | "CANCELLED";
  // Potentially driver's current location if needed for ETA calculation on frontend
  driverLocation?: {latitude: number; longitude: number};
}
