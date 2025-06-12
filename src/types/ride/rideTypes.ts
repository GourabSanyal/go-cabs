import {DriverBid} from "../driver/driverBidTypes";
import {Driver} from "../driver/driverTypes";
import {PaymentSession} from "../payment/paymentTypes";

export interface RideState {
  email?: string;
  selectedRideType?: string;
  selectedBid?: DriverBid["bidId"];
  walletAddress?: Driver["walletAddress"];
  driver?: Driver;
  driverLocation?: {
    latitude: Driver["driverlocation"]["latitude"];
    longitude: Driver["driverlocation"]["longitude"];
  };
  fare?: {
    baseFare: number;
    finalFare?: Driver["bidAmount"];
    breakdown?: {
      baseCost: number;
      serviceFee: number;
      taxes: number;
    };
    currency: string;
    solAmount?: number; // Amount in SOL
  };
  pickupLocation?: {
    latitude: string;
    longitude: string;
    address?: string;
  };
  dropOffLocation?: {
    latitude: string;
    longitude: string;
    address?: string;
  };
  payment?: {
    method: "metamask" | "credit" | "debit" | "cash" | "Phantom" | "solana";
    confirmed: boolean;
    session?: PaymentSession;
    transactionHash?: string;
  };
  status?:
    | "idle"
    | "selecting_location"
    | "configuring_ride"
    | "creating_request"
    | "QUOTATION_REQUEST_INITIATED"
    | "PENDING_BIDS"
    | "BIDS_RECEIVED"
    | "PAYMENT_PENDING"
    | "PAYMENT_PROCESSING"
    | "PAYMENT_COMPLETED"
    | "PAYMENT_FAILED"
    | "PAYMENT_EXPIRED"
    | "searching"
    | "driverFound"
    | "confirmed"
    | "started"
    | "completed"
    | "cancelled"
    | "error";
  quotationRequestId?: string;
  errorMessage?: string;
}
