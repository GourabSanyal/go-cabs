import { DriverBid } from "./driverBidTypes";

export interface BidError {
  code: string;
  message: string;
  details?: any;
}

export interface BidResponse {
  success: boolean;
  data?: DriverBid;
  error?: BidError;
}
