import {useEffect, useState, useCallback} from "react";
import {
  socketClient,
  CurrentRideProgress, // Import from broadcastSocket
  Bid, // Import from broadcastSocket
  // NewBidData,       // Not directly used in useSocket state, but good to have if needed
} from "../services/socket/broadcast/broadcastSocket";
import {RideRequest} from "../types/ride/types/ride.types";
import {QuotationRequestPayload} from "../types/ride/types/ride.types";

// Removed local re-declarations of CurrentRideProgress and Bid

// Data for driver location updates
interface DriverLocationData {
  location: any;
}

// Define a default initial state for ride progress, similar to socketClient's resetRideProgress
const initialRideProgressState: CurrentRideProgress = {
  rideId: undefined,
  bidding_room_id: undefined,
  active_ride_room_id: undefined,
  requestDetails: undefined,
  bids: new Map<string, Bid>(),
  selectedDriverInfo: undefined,
  status: "idle",
  errorMessage: undefined,
};

// Define the interface for the current ride state
export interface SocketRideState extends CurrentRideProgress {}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(() => {
    const initialStatus = socketClient.getConnectionStatus();
    console.log("[useSocket] Initial connection status:", initialStatus);
    return initialStatus.isConnected;
  });
  const [socketId, setSocketId] = useState(() => {
    const initialStatus = socketClient.getConnectionStatus();
    return initialStatus.socketId;
  });
  // currentRideState is now guaranteed to be CurrentRideProgress, not null
  const [currentRideState, setCurrentRideState] = useState<SocketRideState>(
    () =>
      socketClient.getCurrentRideProgress() || {
        bids: new Map(),
        status: "idle",
      },
  );

  const [driverLocation, setDriverLocation] = useState<any | null>(null);

  useEffect(() => {
    const handleConnect = () => {
      console.log(
        "[useSocket] Received 'connect' event. Setting isConnected to true.",
      );
      setIsConnected(true);
      setSocketId(socketClient.getConnectionStatus().socketId);
    };

    const handleDisconnect = (reason?: string) => {
      console.log(
        "[useSocket] Received 'disconnect' event. Reason:",
        reason,
        "Setting isConnected to false.",
      );
      setIsConnected(false);
      setSocketId(null);
      // socketClient updates its internal state; sync ours.
      // getCurrentRideProgress can return null, so fallback to initial state.
      setCurrentRideState(
        socketClient.getCurrentRideProgress() ?? initialRideProgressState,
      );
    };

    const handleConnectError = (error: any) => {
      console.error(
        "[useSocket] Received 'connect_error' event. Error:",
        error,
      );
      setIsConnected(false);
      setSocketId(null);
      setCurrentRideState(initialRideProgressState);
    };

    // socketClient's "ride_progress_update" event should always pass a non-null CurrentRideProgress object.
    const handleRideProgressUpdate = (progress: CurrentRideProgress) => {
      console.log(
        "[useSocket] Received ride_progress_update from broadcastSocket:",
        progress,
      );
      setCurrentRideState(progress);
    };

    const handleDriverLocation = (data: DriverLocationData) => {
      setDriverLocation(data.location);
    };

    socketClient.on("connect", handleConnect);
    socketClient.on("disconnect", handleDisconnect);
    socketClient.on("connect_error", handleConnectError);
    socketClient.on("ride_progress_update", handleRideProgressUpdate);
    socketClient.on("driver_location_updated", handleDriverLocation);

    console.log("[useSocket] useEffect: Subscribed to socket events.");

    // Initial state sync
    const currentStatusOnMount = socketClient.getConnectionStatus();
    console.log(
      "[useSocket] useEffect: Syncing state on mount. Current status:",
      currentStatusOnMount,
    );
    if (currentStatusOnMount.isConnected) {
      handleConnect(); // Call handleConnect to ensure socketId is also set if already connected
    } else {
      // If not connected, ensure our state reflects that accurately from the start
      setIsConnected(false);
      setSocketId(null);
    }
    // Ensure currentRideState is set on mount with the latest or initial state
    setCurrentRideState(
      socketClient.getCurrentRideProgress() ?? initialRideProgressState,
    );

    // Attempt to connect if not already connected when the hook mounts
    if (!socketClient.getConnectionStatus().isConnected) {
      console.log(
        "[useSocket] useEffect: Not connected on mount, calling socketClient.connect().",
      );
      socketClient.connect(); // Directly call the client's connect method
    }

    return () => {
      socketClient.off("connect", handleConnect);
      socketClient.off("disconnect", handleDisconnect);
      socketClient.off("connect_error", handleConnectError);
      socketClient.off("ride_progress_update", handleRideProgressUpdate);
      socketClient.off("driver_location_updated", handleDriverLocation);
    };
  }, []);

  const connect = useCallback(() => {
    console.log(
      "[useSocket] connect function called. Attempting socketClient.connect().",
    );
    socketClient.connect();
  }, []);

  const disconnect = useCallback(() => {
    console.log(
      "[useSocket] disconnect function called. Attempting socketClient.disconnect().",
    );
    socketClient.disconnect();
  }, []);

  const createRideRequest = useCallback(
    (rideData: RideRequest) => {
      console.log(
        "[useSocket] createRideRequest called. Current connection status:",
        isConnected,
      );
      socketClient.createRideRequest(rideData);
    },
    [isConnected],
  );

  const submitQuotationRequest = useCallback(
    (quotationData: QuotationRequestPayload) => {
      console.log(
        "[useSocket] submitQuotationRequest called. Current connection status:",
        isConnected,
      );
      socketClient.submitQuotationRequest(quotationData);
    },
    [isConnected, socketClient],
  );

  // selectDriver in broadcastSocket.ts takes selectedDriverSocketId (string)
  // and uses its internal this.currentRideProgress.bidding_room_id
  const selectDriver = useCallback((selectedDriverSocketId: string) => {
    socketClient.selectDriver(selectedDriverSocketId);
  }, []);

  const notifyRideCompleted = useCallback(() => {
    socketClient.notifyRideCompleted();
  }, []);

  const getBids = useCallback(() => {
    // Ensure fallback if getCurrentRideProgress returns null
    const progress = socketClient.getCurrentRideProgress();
    return progress ? progress.bids : new Map<string, Bid>();
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    socketClient.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketClient.leaveRoom(roomId);
  }, []);

  const getRoomMembers = useCallback((roomId: string) => {
    socketClient.getRoomMembers(roomId);
  }, []);

  return {
    isConnected,
    socketId,
    currentRideState, // Now non-nullable CurrentRideProgress
    driverLocation,
    connect,
    disconnect,
    createRideRequest,
    submitQuotationRequest,
    selectDriver,
    notifyRideCompleted,
    getBids,
    joinRoom,
    leaveRoom,
    getRoomMembers,
    subscribe: socketClient.on.bind(socketClient),
    unsubscribe: socketClient.off.bind(socketClient),
  };
};
