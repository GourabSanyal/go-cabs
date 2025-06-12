import {io, Socket} from "socket.io-client";
import {RideRequestSchema} from "../../../types/ride/schema/ride.request";
import {validate} from "../../../utils/zod/validate";
import {EventEmitter} from "events";
import {RideRequest} from "../../../types/ride/types/ride.types";
import {QuotationRequestPayload} from "../../../types/ride/types/ride.types";

// Define the server URL using an environment variable with a fallback
const SOCKET_SERVER_URL =
  process.env.EXPO_PUBLIC_SOCKET_SERVER_URL ||
  "https://go-cabs-native.onrender.com";

// Define a type for the ride progress state
export interface Bid {
  driverSocketId: string;
  bidDetails: any;
  driverInfo: any;
  bidAmount?: number;
}

// Interface for the data received with "new_bid_for_your_ride" event
export interface NewBidData extends Bid {
  rideId: string;
  bidding_room_id: string;
}

// Let's define BidDetails here if not already globally available
// This should match the structure of data.bidDetails from 'ride_confirmed_to_rider'
interface BidDetails {
  amount: number;
  currency: string;
  eta?: string; // Optional based on server data
  timestamp?: string; // Optional based on server data
}

export interface CurrentRideProgress {
  rideId?: string;
  bidding_room_id?: string;
  active_ride_room_id?: string;
  requestDetails?: RideRequest | QuotationRequestPayload;
  bids: Map<string, Bid>; // driverSocketId -> Bid object
  selectedDriverInfo?: any; // Consider typing this as DriverClientData from server types
  status:
    | "idle"
    | "creating_request"
    | "creating_quotation_request"
    | "pending_bids"
    | "driver_selection_pending"
    | "confirmed_in_progress"
    | "completed"
    | "cancelled"
    | "error";
  errorMessage?: string;
  acceptedBidDetails?: BidDetails; // Added field for accepted bid details
}

class SocketClient {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private socketId: string | null = null;
  // clientList is not primary for rider, specific ride data is more important.
  // private clientList: any[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private connectionAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private readonly PING_INTERVAL = 25000; // 25 seconds
  private readonly PONG_TIMEOUT = 10000; // 10 seconds
  private pingIntervalId: NodeJS.Timeout | null = null;
  private pongTimeoutId: NodeJS.Timeout | null = null;
  private currentRideProgress: CurrentRideProgress | null = null;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(private serverUrl: string) {
    console.log("[BroadcastSocket] Constructor called. Server URL:", serverUrl);
    this.resetRideProgress(); // Initialize with idle state
  }

  private resetRideProgress(
    status: CurrentRideProgress["status"] = "idle",
    errorMessage?: string,
  ) {
    console.log(
      `[BroadcastSocket] resetRideProgress called. Status: ${status}, Error: ${errorMessage}`,
    );
    this.currentRideProgress = {
      bids: new Map(),
      status: status,
      errorMessage: errorMessage,
    };
    this.triggerEvent("ride_progress_update", this.currentRideProgress);
  }

  private initializeSocket() {
    console.log("[BroadcastSocket] initializeSocket called.");
    if (this.socket) {
      console.log(
        "[BroadcastSocket] Existing socket found, disconnecting before re-initializing.",
      );
      this.socket.disconnect();
      this.socket = null;
    }

    console.log(
      "[BroadcastSocket] Initializing new socket instance with URL:",
      this.serverUrl,
    );
    this.socket = io(this.serverUrl, {
      transports: ["websocket"], // Prioritize websocket
      secure: true, // Ensure wss for https URLs
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000, // Start with 1s
      timeout: 10000, // Connection attempt timeout
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(
        "[BroadcastSocket] Event: 'connect'. Socket connected. ID:",
        this.socket?.id,
      );
      this.isConnected = true;
      this.connectionAttempts = 0;
      if (this.socket?.id) {
        this.socketId = this.socket.id;
      }
      console.log("[BroadcastSocket] Socket connected. ID:", this.socketId);
      this.startPingPong();
      this.triggerEvent("connect");
    });

    this.socket.on("connect_error", error => {
      console.error(
        "[BroadcastSocket] Event: 'connect_error'. Message:",
        error.message,
        "Details:",
        error,
      );
      this.connectionAttempts++;
      if (this.connectionAttempts >= this.maxReconnectAttempts) {
        this.isConnected = false;
        if (
          this.currentRideProgress &&
          (this.currentRideProgress.status === "creating_request" ||
            this.currentRideProgress.status === "pending_bids" ||
            this.currentRideProgress.status === "confirmed_in_progress")
        ) {
          this.currentRideProgress.status = "error";
          this.currentRideProgress.errorMessage =
            "Connection failed permanently.";
          this.triggerEvent("ride_progress_update", this.currentRideProgress);
        }
        this.triggerEvent("connect_error", error);
      }
    });

    this.socket.on("disconnect", reason => {
      console.log(
        "[BroadcastSocket] Event: 'disconnect'. Reason:",
        reason,
        ". Was connected:",
        this.isConnected,
        "Socket ID was:",
        this.socketId,
      );
      this.isConnected = false;
      this.socketId = null;
      // this.clientList = []; // Obsolete
      if (
        this.currentRideProgress &&
        (this.currentRideProgress.status === "creating_request" ||
          this.currentRideProgress.status === "pending_bids" ||
          this.currentRideProgress.status === "confirmed_in_progress")
      ) {
        this.currentRideProgress.status = "error"; // Or perhaps a specific disconnected status
        this.currentRideProgress.errorMessage = `Disconnected: ${reason}`;
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("disconnect", reason);
      this.stopPingPong();
      if (reason === "io server disconnect") {
        console.log(
          "[BroadcastSocket] Server initiated disconnect. Auto-reconnection will attempt if configured.",
        );
      } else if (reason === "io client disconnect") {
        console.log("[BroadcastSocket] Client initiated disconnect.");
      } else {
        console.log(
          "[BroadcastSocket] Disconnected due to other reason:",
          reason,
        );
      }
    });

    // --- New Event Listeners for Rider Flow ---
    this.socket.on("ride_request_created_ack", data => {
      console.log(
        "[BroadcastSocket] Event: 'ride_request_created_ack'. Received.",
      );
      if (
        this.currentRideProgress &&
        (this.currentRideProgress.status === "creating_request" ||
          this.currentRideProgress.status === "creating_quotation_request")
      ) {
        this.currentRideProgress.rideId = data.rideId;
        this.currentRideProgress.bidding_room_id = data.bidding_room_id;
        if (data.rideDetails) {
          this.currentRideProgress.requestDetails = data.rideDetails;
        }
        this.currentRideProgress.status = "pending_bids";
        this.currentRideProgress.errorMessage = undefined;
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("ride_request_created_ack", data);
    });

    this.socket.on("ride_request_error", data => {
      console.log("[BroadcastSocket] Event: 'ride_request_error'. Received.");
      if (
        this.currentRideProgress &&
        (this.currentRideProgress.status === "creating_request" ||
          this.currentRideProgress.status === "creating_quotation_request")
      ) {
        this.currentRideProgress.status = "error";
        this.currentRideProgress.errorMessage =
          data.message || "Failed to create ride/quotation request.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("ride_request_error", data);
    });

    // Specific ack for quotation request, if backend sends a different event
    // Otherwise, the generic ride_request_created_ack might be sufficient if backend adapts
    this.socket.on("quotation_request_created_ack", data => {
      console.log(
        "[BroadcastSocket] Event: 'quotation_request_created_ack'. Received.",
      );
      if (
        this.currentRideProgress &&
        this.currentRideProgress.status === "creating_quotation_request"
      ) {
        this.currentRideProgress.rideId = data.quotationId;
        this.currentRideProgress.bidding_room_id = data.bidding_room_id;
        if (data.quotationDetails) {
          this.currentRideProgress.requestDetails = data.quotationDetails;
        }
        this.currentRideProgress.status = "pending_bids";
        this.currentRideProgress.errorMessage = undefined;
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("quotation_request_created_ack", data);
    });

    this.socket.on("quotation_request_error", data => {
      console.log(
        "[BroadcastSocket] Event: 'quotation_request_error'. Received.",
      );
      if (
        this.currentRideProgress &&
        this.currentRideProgress.status === "creating_quotation_request"
      ) {
        this.currentRideProgress.status = "error";
        this.currentRideProgress.errorMessage =
          data.message || "Failed to create quotation request.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("quotation_request_error", data);
    });

    this.socket.on("new_bid_for_your_ride", (data: NewBidData) => {
      console.log(
        "[BroadcastSocket] Event: 'new_bid_for_your_ride'. Received.",
      );
      if (
        this.currentRideProgress &&
        this.currentRideProgress.rideId === data.rideId
      ) {
        // When storing the bid, we only need the Bid part, not the extra rideId/bidding_room_id
        const bidToStore: Bid = {
          driverSocketId: data.driverSocketId,
          bidDetails: data.bidDetails,
          driverInfo: data.driverInfo,
        };

        // Create a new Map for bids to ensure reference change for React state updates
        const newBids = new Map(this.currentRideProgress.bids);
        newBids.set(data.driverSocketId, bidToStore);

        // Create a new object for currentRideProgress to ensure reference change
        this.currentRideProgress = {
          ...this.currentRideProgress,
          bids: newBids, // Assign the new Map
        };

        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("new_bid_for_your_ride", data); // Trigger with full NewBidData for UI
    });

    this.socket.on(
      "driver_bid_withdrawn_due_to_disconnect",
      (data: {rideId: string; driverSocketId: string}) => {
        console.log(
          "[BroadcastSocket] Event: 'driver_bid_withdrawn_due_to_disconnect'. Received.",
        );
        if (
          this.currentRideProgress &&
          this.currentRideProgress.rideId === data.rideId
        ) {
          if (this.currentRideProgress.bids.has(data.driverSocketId)) {
            this.currentRideProgress.bids.delete(data.driverSocketId);
            this.triggerEvent("ride_progress_update", this.currentRideProgress);
          }
        }
        this.triggerEvent("driver_bid_withdrawn_due_to_disconnect", data);
      },
    );

    this.socket.on("selection_error", data => {
      console.log("[BroadcastSocket] Event: 'selection_error'. Received.");
      if (
        this.currentRideProgress &&
        this.currentRideProgress.status === "driver_selection_pending"
      ) {
        this.currentRideProgress.status = "pending_bids"; // Go back to bid selection
        this.currentRideProgress.errorMessage =
          data.message || "Driver selection failed.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("selection_error", data);
    });

    this.socket.on(
      "ride_confirmed_to_rider",
      (data: {
        active_ride_room_id: string;
        rideId: string;
        rideDetails: QuotationRequestPayload;
        driverInfo: any; // Should ideally be a defined type like DriverClientData
        bidDetails: BidDetails;
      }) => {
        console.log(
          "[BroadcastSocket] Event: 'ride_confirmed_to_rider'. Received.",
        );
        if (!this.currentRideProgress) {
          this.resetRideProgress(
            "error",
            "currentRideProgress was unexpectedly null",
          );
          // Early return or throw error if this state is critical and unexpected
          if (!this.currentRideProgress) return; // Guard against resetRideProgress failing (highly unlikely)
        }

        this.currentRideProgress = {
          ...this.currentRideProgress,
          status: "confirmed_in_progress",
          rideId: data.rideId,
          active_ride_room_id: data.active_ride_room_id,
          requestDetails: data.rideDetails,
          selectedDriverInfo: data.driverInfo
            ? {
                // Check if driverInfo exists
                id: data.driverInfo.id,
                name: data.driverInfo.name,
                vehicle: data.driverInfo.vehicle,
                rating: data.driverInfo.rating,
                fcmToken: data.driverInfo.fcmToken, // If fcmToken can be undefined, this is fine.
                // If driverInfo itself can be null, already handled.
              }
            : undefined, // Set to undefined if driverInfo is not present
          bids: this.currentRideProgress.bids, // bids map is initialized in resetRideProgress
          acceptedBidDetails: data.bidDetails,
        };
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
        this.triggerEvent("ride_confirmed_to_rider", data);
      },
    );

    this.socket.on("driver_location_updated", data => {
      console.log(
        "[BroadcastSocket] Event: 'driver_location_updated'. Received.",
      );
      this.triggerEvent("driver_location_updated", data);
    });

    this.socket.on("ride_finalized", data => {
      console.log("[BroadcastSocket] Event: 'ride_finalized'. Received.");
      if (
        this.currentRideProgress &&
        this.currentRideProgress.rideId === data.rideId
      ) {
        this.currentRideProgress.status = "completed";
        this.currentRideProgress.errorMessage = undefined;
        if (this.currentRideProgress.active_ride_room_id) {
          this.leaveRoom(this.currentRideProgress.active_ride_room_id);
        }
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
        // Consider calling this.resetRideProgress() after a delay or UI confirmation
      }
      this.triggerEvent("ride_finalized", data);
    });

    this.socket.on("ride_request_cancelled_by_rider", data => {
      console.log(
        "[BroadcastSocket] Event: 'ride_request_cancelled_by_rider'. Received.",
      );
      if (
        this.currentRideProgress &&
        this.currentRideProgress.rideId === data.rideId
      ) {
        this.resetRideProgress("cancelled", "Ride request was cancelled.");
      }
      this.triggerEvent("ride_request_cancelled_by_rider", data);
    });

    this.socket.on("ride_participant_disconnected", data => {
      console.log(
        "[BroadcastSocket] Event: 'ride_participant_disconnected'. Received.",
      );
      if (
        this.currentRideProgress &&
        this.currentRideProgress.rideId === data.rideId &&
        this.currentRideProgress.status === "confirmed_in_progress"
      ) {
        this.currentRideProgress.status = "error"; // Or a specific "driver_disconnected_mid_ride" status
        this.currentRideProgress.errorMessage =
          "Driver disconnected during the ride.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      this.triggerEvent("ride_participant_disconnected", data);
    });

    // General error from server not tied to a specific action
    this.socket.on("error", error => {
      console.error(
        "[BroadcastSocket] Event: 'error'. Message:",
        error.message,
      );
      this.triggerEvent("error", error); // Generic error for UI to handle
    });

    // room_members listener (from get_room_members server event) can be kept if needed for bidding UI
    this.socket.on("room_members", data => {
      console.log("[BroadcastSocket] Event: 'room_members'. Received.");
      this.triggerEvent("room_members", data);
    });

    // Removing obsolete listeners
    // this.socket.on("ride_request_received", ...);
    // this.socket.on("new_ride_request", ...);
    // this.socket.on("ride_accepted", ...);
    // this.socket.on("client_list", ...);
    // this.socket.on("room_status", ...);
  }

  private triggerEvent(eventName: string, data?: any) {
    console.log(
      `[BroadcastSocket] triggerEvent: Emitting '${eventName}'. Connected: ${this.isConnected}, Socket ID: ${this.socketId}.`,
    );
    const listeners = this.eventListeners.get(eventName) || [];
    listeners.forEach(listener => listener(data));
  }

  public on(eventName: string, callback: Function) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)?.push(callback);
  }

  public off(eventName: string, callback: Function) {
    const listeners = this.eventListeners.get(eventName) || [];
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  public connect() {
    console.log(
      "[BroadcastSocket] connect method called. Current isConnected state:",
      this.isConnected,
    );
    if (!this.socket) {
      console.log("[BroadcastSocket] No socket instance, initializing first.");
      this.initializeSocket(); // This will also setup listeners
    }

    if (this.socket && !this.socket.connected) {
      console.log(
        "[BroadcastSocket] Socket exists but not connected. Calling socket.connect().",
      );
      this.socket.connect();
    } else if (this.socket && this.socket.connected) {
      console.log(
        "[BroadcastSocket] connect method called, but socket is already connected. ID:",
        this.socket.id,
      );
    }
  }

  public disconnect() {
    console.log(
      "[BroadcastSocket] disconnect method called. Current isConnected state:",
      this.isConnected,
      "Socket ID:",
      this.socketId,
    );
    this.stopPingPong();
    if (this.socket) {
      console.log("[BroadcastSocket] Calling socket.disconnect().");
      this.socket.disconnect();
      // State updates (isConnected, socketId, currentRideProgress) are handled by the 'disconnect' event listener
    } else {
      console.log(
        "[BroadcastSocket] disconnect: No socket instance to disconnect.",
      );
    }
  }

  // --- New/Refactored Public Methods for Rider ---
  public createRideRequest(rideData: RideRequest) {
    if (!this.socket || !this.isConnected) {
      this.triggerEvent("error", {message: "Not connected to server."});
      this.resetRideProgress("error", "Not connected to server.");
      return;
    }
    try {
      // const validatedData = validate(RideRequestSchema, rideData); // Zod validation if needed
      const validatedData = rideData;

      this.currentRideProgress = {
        ...this.currentRideProgress, // Preserve existing bids map etc. if any, or ensure clean state
        requestDetails: validatedData,
        bids: this.currentRideProgress?.bids || new Map(), // Preserve bids if any
        status: "creating_request", // Generic status
      };
      this.triggerEvent("ride_progress_update", this.currentRideProgress);
      this.socket.emit("rider_create_ride_request", validatedData);
      console.log("Emitted: rider_create_ride_request", validatedData);
    } catch (error) {
      console.error("Data validation failed for ride request:", error);
      this.resetRideProgress("error", "Invalid ride data provided.");
      this.triggerEvent("error", {
        message: "Invalid ride data for submission.",
        details: error,
      });
    }
  }

  public submitQuotationRequest(quotationData: QuotationRequestPayload) {
    if (!this.socket || !this.isConnected) {
      this.triggerEvent("error", {message: "Not connected to server."});
      // Consider not calling resetRideProgress here unless it's a definite full reset
      // Setting error status locally might be enough if a request was already in some state.
      if (this.currentRideProgress) {
        this.currentRideProgress.status = "error";
        this.currentRideProgress.errorMessage =
          "Not connected to server (quotation attempt).";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      } else {
        this.resetRideProgress(
          "error",
          "Not connected to server (quotation attempt).",
        );
      }
      return;
    }
    try {
      // No Zod schema for QuotationRequestPayload yet, but can be added
      const validatedData = quotationData;

      this.currentRideProgress = {
        ...this.currentRideProgress, // Preserve existing bids map etc. if any
        requestDetails: validatedData, // Store quotation details
        bids: this.currentRideProgress?.bids || new Map(), // Preserve bids
        status: "creating_quotation_request", // New specific status
      };
      this.triggerEvent("ride_progress_update", this.currentRideProgress);
      // Emit a new, specific event for quotation requests
      this.socket.emit("rider_submit_quotation_request", validatedData);
      console.log("Emitted: rider_submit_quotation_request", validatedData);
    } catch (error) {
      console.error("Data validation failed for quotation request:", error);
      if (this.currentRideProgress) {
        this.currentRideProgress.status = "error";
        this.currentRideProgress.errorMessage =
          "Invalid quotation data provided.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      } else {
        this.resetRideProgress("error", "Invalid quotation data provided.");
      }
      this.triggerEvent("error", {
        message: "Invalid quotation data for submission.",
        details: error,
      });
    }
  }

  public selectDriver(selectedDriverSocketId: string) {
    if (
      !this.socket ||
      !this.isConnected ||
      !this.currentRideProgress ||
      !this.currentRideProgress.bidding_room_id
    ) {
      this.triggerEvent("error", {
        message:
          "Cannot select driver: Not connected or no active ride request.",
      });
      if (this.currentRideProgress) {
        this.currentRideProgress.status = "error";
        this.currentRideProgress.errorMessage =
          "Cannot select driver: Not connected or no active ride request.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      return;
    }
    if (!this.currentRideProgress.bids.has(selectedDriverSocketId)) {
      this.triggerEvent("error", {
        message: "Cannot select driver: Driver did not bid or bid withdrawn.",
      });
      this.currentRideProgress.status = "error";
      this.currentRideProgress.errorMessage =
        "Cannot select driver: Driver did not bid or bid withdrawn.";
      this.triggerEvent("ride_progress_update", this.currentRideProgress);
      return;
    }

    this.currentRideProgress.status = "driver_selection_pending";
    this.triggerEvent("ride_progress_update", this.currentRideProgress);
    this.socket.emit("rider_selects_driver", {
      bidding_room_id: this.currentRideProgress.bidding_room_id,
      selectedDriverSocketId,
    });
    console.log("Emitted: rider_selects_driver", {
      bidding_room_id: this.currentRideProgress.bidding_room_id,
      selectedDriverSocketId,
    });
  }

  public notifyRideCompleted() {
    if (
      !this.socket ||
      !this.isConnected ||
      !this.currentRideProgress ||
      !this.currentRideProgress.active_ride_room_id ||
      !this.currentRideProgress.rideId
    ) {
      this.triggerEvent("error", {
        message:
          "Cannot complete ride: Not connected or not in an active ride.",
      });
      if (this.currentRideProgress) {
        this.currentRideProgress.status = "error";
        this.currentRideProgress.errorMessage =
          "Cannot complete ride: Not connected or not in an active ride.";
        this.triggerEvent("ride_progress_update", this.currentRideProgress);
      }
      return;
    }
    this.socket.emit("ride_is_completed", {
      active_ride_room_id: this.currentRideProgress.active_ride_room_id,
      rideId: this.currentRideProgress.rideId,
    });
    console.log(
      "Emitted: ride_is_completed for ride:",
      this.currentRideProgress.rideId,
    );
  }
  // --- End of New/Refactored Public Methods for Rider ---

  // Kept generic join/leave room as they are useful for specific room interactions if needed by UI
  // e.g. rejoining a room if connection drops and then is re-established and server supports it.
  public joinRoom(roomId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }
    this.socket.emit("join_room", roomId);
  }

  public leaveRoom(roomId: string) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit("leave_room", roomId);
  }

  // --- Obsolete methods from previous logic ---
  // public sendRideRequest(...) -> Replaced by createRideRequest
  // public acceptRide(...) -> Rider selects, doesn't accept
  // public listClients(...) -> Not rider's concern
  // public keepOneClient(...) -> Server handles this logic
  // public joinRoomAndSendRequest(...) -> Obsolete flow

  // public getClientList() -> Obsolete
  // --- End of obsolete methods ---

  public getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socketId,
    };
  }

  // Getter for the current ride progress state for UI to consume
  public getCurrentRideProgress(): Readonly<CurrentRideProgress> | null {
    return this.currentRideProgress
      ? {
          ...this.currentRideProgress,
          bids: new Map(this.currentRideProgress.bids),
        }
      : null;
  }

  public getRoomMembers(roomId: string) {
    if (!this.socket || !this.isConnected) {
      this.triggerEvent("room_members", {
        roomId,
        members: [],
        totalMembers: 0,
      });
      return;
    }
    this.socket.emit("get_room_members", roomId);
  }

  private startPingPong(): void {
    this.stopPingPong();
    console.log(
      "[BroadcastSocket] Starting ping-pong mechanism. Socket ID:",
      this.socketId,
    );
    this.pingIntervalId = setInterval(() => {
      if (this.socket && this.socket.connected) {
        console.log(
          "[BroadcastSocket] Sending ping_from_client. Socket ID:",
          this.socketId,
        );
        this.socket.emit("ping_from_client", () => {
          /* Optional ack log */
        });
        this.pongTimeoutId = setTimeout(() => {
          console.warn(
            "[BroadcastSocket] Pong not received for ID:",
            this.socketId,
            ". Disconnecting.",
          );
          this.socket?.disconnect();
        }, this.PONG_TIMEOUT);
      }
    }, this.PING_INTERVAL);

    this.socket?.on("pong_from_server", () => {
      console.log(
        "[BroadcastSocket] pong_from_server received. Socket ID:",
        this.socketId,
      );
      if (this.pongTimeoutId) clearTimeout(this.pongTimeoutId);
      this.pongTimeoutId = null;
    });
  }

  private stopPingPong(): void {
    if (this.pingIntervalId || this.pongTimeoutId)
      console.log(
        "[BroadcastSocket] Stopping ping-pong. Socket ID:",
        this.socketId,
      );
    if (this.pingIntervalId) clearInterval(this.pingIntervalId);
    if (this.pongTimeoutId) clearTimeout(this.pongTimeoutId);
    this.pingIntervalId = null;
    this.pongTimeoutId = null;
    this.socket?.off("pong_from_server");
  }
}

export const socketClient = new SocketClient(SOCKET_SERVER_URL);
