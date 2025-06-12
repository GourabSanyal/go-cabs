import {Server} from "socket.io";
import {RideRequestSchema} from "../../types/ride/schema/ride.request";

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

const rooms = new Map<string, Set<string>>();
const clients = new Map<string, {id: string; rooms: Set<string>}>();

// New data structures for ride management
const DRIVERS_ROOM = "available_drivers_room";
const activeRideRequests = new Map<
  string, // bidding_room_id
  {
    rideId: string;
    rideDetails: any; // Consider using a more specific type based on RideRequestSchema
    riderSocketId: string;
    bids: Map<string, any>; // driverSocketId -> bidDetails
  }
>();

const activeRides = new Map<
  string, // active_ride_room_id
  {
    rideId: string;
    rideDetails: any; // Consider using a more specific type
    riderSocketId: string;
    driverSocketId: string;
  }
>();
// End of new data structures

io.on("connection", socket => {
  console.log("Client connected:", socket.id);
  clients.set(socket.id, {
    id: socket.id,
    rooms: new Set(),
  });

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId)?.add(socket.id);
    clients.get(socket.id)?.rooms.add(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  // New: Handler for drivers to announce availability
  socket.on("driver_ready", () => {
    console.log(`Driver ${socket.id} is ready and joining ${DRIVERS_ROOM}`);
    socket.join(DRIVERS_ROOM);
    // Optionally, confirm to the driver
    socket.emit("driver_room_joined", {roomId: DRIVERS_ROOM});
  });

  // Handler for client pings
  socket.on("ping_from_client", () => {
    console.log(`Received ping from client ${socket.id}. Sending pong.`);
    socket.emit("pong_from_server");
  });

  // add handler for getting room members
  socket.on("get_room_members", (roomId: string) => {
    const roomClients = rooms.get(roomId);
    if (roomClients) {
      const members = Array.from(roomClients).map(clientId => ({
        id: clientId,
        isCurrentUser: clientId === socket.id,
      }));
      socket.emit("room_members", {
        roomId,
        members,
        totalMembers: members.length,
      });
    } else {
      socket.emit("room_members", {
        roomId,
        members: [],
        totalMembers: 0,
      });
    }
  });

  // Modified: Existing "ride_request" might be deprecated or used for direct messages if needed.
  // For now, we focus on the new flow. The old "ride_request" is broad.
  // Let's rename or comment out parts of it to avoid conflict if it's not immediately removed.
  socket.on("DEPRECATED_ride_request", data => {
    try {
      const validatedData = RideRequestSchema.parse(data);
      console.log("Received ride request:", validatedData);
      socket.broadcast.emit("new_ride_request", {
        status: "new",
        data: validatedData,
      });

      socket.emit("ride_request_received", {
        status: "received",
        data: validatedData,
      });
    } catch (error) {
      console.error("Invalid ride request:", error);
      socket.emit("error", {
        status: "error",
        message: "Invalid ride request data",
      });
    }
  });

  // New: Rider initiates a ride request
  socket.on(
    "rider_create_ride_request",
    (
      rideData: any /*Type this with RideRequestSchema content if possible */,
    ) => {
      try {
        // Validate incoming data (optional here if client validates, but good practice)
        // const validatedRideData = RideRequestSchema.parse(rideData); // Assuming structure matches
        const validatedRideData = rideData; // For now, assuming client sends valid data

        const rideId = `ride_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}`;
        const bidding_room_id = `bidding_room_${rideId}`;

        // Store the ride request - rideDetails here uses validatedRideData directly
        activeRideRequests.set(bidding_room_id, {
          rideId,
          rideDetails: validatedRideData,
          riderSocketId: socket.id,
          bids: new Map(),
        });

        // Rider joins the bidding room
        socket.join(bidding_room_id);
        if (!rooms.has(bidding_room_id)) {
          rooms.set(bidding_room_id, new Set());
        }
        rooms.get(bidding_room_id)?.add(socket.id);
        clients.get(socket.id)?.rooms.add(bidding_room_id);

        console.log(
          `Rider ${socket.id} created ride request ${rideId}, joined bidding room ${bidding_room_id}`,
        );
        // Acknowledge rider with the data they sent, plus IDs
        socket.emit("ride_request_created_ack", {
          rideId,
          bidding_room_id,
          rideDetails: validatedRideData,
        });

        // Prepare a structured rideDetails object for the driver event
        const rideDetailsForDriverEvent = {
          pickupLocation: {
            latitude: validatedRideData.pickupLocation?.latitude || 0,
            longitude: validatedRideData.pickupLocation?.longitude || 0,
            address: validatedRideData.pickupLocation?.address, // Will be undefined if not in validatedRideData
          },
          dropoffLocation: {
            latitude: validatedRideData.dropoffLocation?.latitude || 0,
            longitude: validatedRideData.dropoffLocation?.longitude || 0,
            address: validatedRideData.dropoffLocation?.address, // Will be undefined if not in validatedRideData
          },
          // Spreading other properties from validatedRideData that are part of RideRequest type
          // This assumes validatedRideData is an object that can be spread.
          // And that its properties align with what the driver expects in rideDetails.
          name: validatedRideData.name,
          phone: validatedRideData.phone,
          bidAmount: validatedRideData.bidAmount,
          status: validatedRideData.status || "pending", // Default status if not provided
          createdAt: validatedRideData.createdAt || new Date().toISOString(),
          updatedAt: validatedRideData.updatedAt || new Date().toISOString(),
          fare: validatedRideData.fare,
          // Ensure all other fields that the driver's RideRequest type might expect are here.
          // For example, if the driver's RideRequest type (in go-drive/src/types/socket.ts)
          // also expects rideId and biddingRoomId INSIDE rideDetails, they should be added here.
          // However, typically, rideId and biddingRoomId are top-level in the event.
        };

        // Log what's being prepared for the driver
        console.log(
          "Emitting new_ride_to_bid_on with rideDetailsForDriverEvent:",
          rideDetailsForDriverEvent,
        );

        // Broadcast to available drivers
        socket.to(DRIVERS_ROOM).emit("new_ride_to_bid_on", {
          rideId: rideId, // Server-generated rideId
          bidding_room_id: bidding_room_id, // Server-generated bidding_room_id
          rideDetails: rideDetailsForDriverEvent, // Use the explicitly constructed object
        });
        console.log(`Broadcasted new ride ${rideId} to ${DRIVERS_ROOM}`);
      } catch (error) {
        console.error("Error processing rider_create_ride_request:", error);
        socket.emit("ride_request_error", {
          message: "Failed to create ride request.",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
  );

  // New: Rider submits a quotation request
  socket.on(
    "rider_submit_quotation_request",
    (
      quotationData: any /* Consider creating/using a QuotationRequestPayload type here */,
    ) => {
      try {
        console.log(
          `[Server] Received rider_submit_quotation_request from ${socket.id}:`,
          JSON.stringify(quotationData),
        );

        // Assuming quotationData matches QuotationRequestPayload from rider app
        // It should contain: riderId, pickupLocation, dropoffLocation, requestedAt, etc.

        const quotationId = `quot_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}`;
        const bidding_room_id = quotationId; // For quotations, bidding_room_id can be the quotationId

        // Store the quotation request
        // Adapting activeRideRequests for now. Ideally, a separate map or unified type might be better.
        activeRideRequests.set(bidding_room_id, {
          rideId: quotationId, // Using quotationId as the main identifier
          rideDetails: quotationData, // This is the QuotationRequestPayload
          riderSocketId: socket.id,
          bids: new Map(),
        });

        socket.join(bidding_room_id);
        if (!rooms.has(bidding_room_id)) {
          rooms.set(bidding_room_id, new Set());
        }
        rooms.get(bidding_room_id)?.add(socket.id);
        clients.get(socket.id)?.rooms.add(bidding_room_id);

        console.log(
          `[Server] Rider ${socket.id} created quotation request ${quotationId}, joined bidding room ${bidding_room_id}`,
        );

        // Acknowledge rider
        socket.emit("quotation_request_created_ack", {
          quotationId: quotationId,
          bidding_room_id: bidding_room_id,
          quotationDetails: quotationData, // Send back the original payload
        });

        // Construct payload for drivers (matching QuotationRequest type in driver app)
        const quotationForDriverEvent = {
          id: quotationId, // This is the quotationRequestId for the driver
          riderId: quotationData.riderId, // From payload
          userName: quotationData.userName, // Added: Rider's name
          fareOffer: quotationData.fareOffer, // Added: Rider's offered fare
          pickupLocation: quotationData.pickupLocation, // Directly from payload
          dropoffLocation: quotationData.dropoffLocation, // Directly from payload
          requestedAt: quotationData.requestedAt, // Directly from payload
          preferredPaymentMethod: quotationData.preferredPaymentMethod, // Optional
          vehicleType: quotationData.vehicleType, // Optional
          // Add any other fields from QuotationRequestPayload that are relevant to QuotationRequest type
        };

        console.log(
          "[Server] Emitting new_ride_to_bid_on with quotationForDriverEvent:",
          JSON.stringify(quotationForDriverEvent),
        );

        // Broadcast to available drivers
        io.to(DRIVERS_ROOM).emit("new_ride_to_bid_on", {
          rideId: quotationId, // Top-level rideId for the event (can be same as quotationId)
          bidding_room_id: bidding_room_id, // Top-level bidding_room_id
          rideDetails: quotationForDriverEvent, // The structured QuotationRequest
        });
        console.log(
          `[Server] Broadcasted new quotation ${quotationId} to ${DRIVERS_ROOM}`,
        );
      } catch (error) {
        console.error(
          "[Server] Error processing rider_submit_quotation_request:",
          error,
        );
        socket.emit("quotation_request_error", {
          message: "Failed to create quotation request.",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
  );

  // New: Driver submits a bid for a ride
  socket.on(
    "driver_submit_bid",
    (data: {
      bidding_room_id: string;
      bidDetails: any; // e.g., { amount: number, eta: string }
      driverInfo: any; // e.g., { name: string, vehicle: string, rating: number }
    }) => {
      const {bidding_room_id, bidDetails, driverInfo} = data;
      const rideRequest = activeRideRequests.get(bidding_room_id);

      if (!rideRequest) {
        console.error(
          `Bid received for non-existent bidding room: ${bidding_room_id}`,
        );
        socket.emit("bid_error", {
          message: "Bidding room not found or ride request expired.",
        });
        return;
      }

      // Store the bid
      rideRequest.bids.set(socket.id, {bidDetails, driverInfo});
      console.log(
        `Driver ${socket.id} submitted bid for ride ${rideRequest.rideId} in room ${bidding_room_id}`,
      );

      // Notify the rider about the new bid
      console.log(
        `[Server] Attempting to emit 'new_bid_for_your_ride' to rider ${rideRequest.riderSocketId} for quotation ${rideRequest.rideId}`,
      );
      io.to(rideRequest.riderSocketId).emit("new_bid_for_your_ride", {
        rideId: rideRequest.rideId, // This is the quotationId
        bidding_room_id,
        driverSocketId: socket.id,
        bidDetails,
        driverInfo,
      });
      // Send ack to driver, ensuring quotationRequestId is used as expected by driver client
      socket.emit("bid_submission_ack", {
        quotationRequestId: rideRequest.rideId,
      });
    },
  );

  // New: Rider selects a driver
  socket.on(
    "rider_selects_driver",
    (data: {bidding_room_id: string; selectedDriverSocketId: string}) => {
      const {bidding_room_id, selectedDriverSocketId} = data;
      const rideRequest = activeRideRequests.get(bidding_room_id);

      if (!rideRequest) {
        console.error(
          `Driver selection for non-existent bidding room: ${bidding_room_id}`,
        );
        socket.emit("selection_error", {message: "Ride request not found."});
        return;
      }

      if (socket.id !== rideRequest.riderSocketId) {
        console.error(
          `Unauthorized driver selection attempt by ${socket.id} for ride ${rideRequest.rideId}`,
        );
        socket.emit("selection_error", {
          message: "Not authorized to select driver for this ride.",
        });
        return;
      }

      const selectedBid = rideRequest.bids.get(selectedDriverSocketId);
      if (!selectedBid) {
        console.error(
          `Selected driver ${selectedDriverSocketId} did not bid on ride ${rideRequest.rideId}`,
        );
        socket.emit("selection_error", {
          message: "Selected driver did not place a bid or bid withdrawn.",
        });
        return;
      }

      const {rideId, rideDetails, riderSocketId} = rideRequest;
      const active_ride_room_id = `active_ride_${rideId}`;

      // Store active ride details
      activeRides.set(active_ride_room_id, {
        rideId,
        rideDetails,
        riderSocketId,
        driverSocketId: selectedDriverSocketId,
      });

      const riderSocket = io.sockets.sockets.get(riderSocketId);
      const driverSocket = io.sockets.sockets.get(selectedDriverSocketId);

      if (!riderSocket || !driverSocket) {
        console.error(
          `Could not find rider or driver socket for ride ${rideId}. Rider: ${riderSocketId}, Driver: ${selectedDriverSocketId}`,
        );
        // Rollback activeRides addition or handle error
        activeRides.delete(active_ride_room_id);
        socket.emit("selection_error", {
          message: "Rider or Driver no longer connected. Please try again.",
        });
        // Potentially notify the other party if one is found
        if (riderSocket)
          riderSocket.emit("selection_failed_participant_disconnected", {
            rideId,
          });
        if (driverSocket)
          driverSocket.emit("selection_failed_participant_disconnected", {
            rideId,
          });
        return;
      }

      // Move rider and selected driver to the new active ride room
      riderSocket.join(active_ride_room_id);
      driverSocket.join(active_ride_room_id);
      console.log(
        `Moved rider ${riderSocketId} and driver ${selectedDriverSocketId} to active ride room ${active_ride_room_id}`,
      );

      // Notify rider and driver
      riderSocket.emit("ride_confirmed_to_rider", {
        active_ride_room_id,
        rideId,
        rideDetails,
        driverInfo: selectedBid.driverInfo,
        bidDetails: selectedBid.bidDetails,
      });
      driverSocket.emit("ride_confirmed_to_driver", {
        active_ride_room_id,
        rideId,
        rideDetails, // Send full ride details to driver
        // riderInfo: { id: riderSocketId /* add more rider details if available */ },
        acceptedBidAmount: selectedBid.bidDetails.amount, // Added: Accepted bid amount
        acceptedBidCurrency: selectedBid.bidDetails.currency, // Added: Accepted bid currency
        // Pass along the full original bid details as well, could be useful for driver
        acceptedBidDetails: selectedBid.bidDetails,
        // driverInfo is already known by the driver, but can be included if needed
        // driverInfo: selectedBid.driverInfo
      });

      // Notify other bidders and clean up bidding room
      rooms.get(bidding_room_id)?.forEach(clientInBiddingRoomId => {
        const clientSocket = io.sockets.sockets.get(clientInBiddingRoomId);
        if (clientSocket) {
          if (
            clientInBiddingRoomId !== riderSocketId &&
            clientInBiddingRoomId !== selectedDriverSocketId
          ) {
            clientSocket.emit("bidding_closed_ride_assigned", {
              bidding_room_id,
              rideId,
            });
          }
          // Make everyone leave the old bidding room
          clientSocket.leave(bidding_room_id);
          clients.get(clientInBiddingRoomId)?.rooms.delete(bidding_room_id);
        }
      });

      console.log(
        `Cleaned up bidding room ${bidding_room_id} for ride ${rideId}`,
      );
      activeRideRequests.delete(bidding_room_id);
      rooms.delete(bidding_room_id);
    },
  );

  // New: Events during an active ride
  socket.on(
    "driver_sends_location",
    (data: {active_ride_room_id: string; location: any}) => {
      const {active_ride_room_id, location} = data;
      const ride = activeRides.get(active_ride_room_id);

      if (!ride || ride.driverSocketId !== socket.id) {
        console.error(
          `Invalid location update from ${socket.id} for room ${active_ride_room_id}`,
        );
        socket.emit("location_update_error", {
          message: "Invalid ride room or not authorized.",
        });
        return;
      }
      // Relay location to the rider in the same room
      socket
        .to(active_ride_room_id)
        .emit("driver_location_updated", {location});
      // console.log(`Relayed location from driver ${socket.id} in room ${active_ride_room_id}`);
    },
  );

  socket.on(
    "ride_is_completed",
    (data: {active_ride_room_id: string; rideId: string}) => {
      const {active_ride_room_id, rideId} = data;
      const ride = activeRides.get(active_ride_room_id);

      if (!ride || ride.rideId !== rideId) {
        console.error(
          `Completion attempt for invalid ride or room: ${rideId}, ${active_ride_room_id}`,
        );
        socket.emit("ride_completion_error", {
          message: "Invalid ride or room for completion.",
        });
        return;
      }

      // Ensure the person completing is part of the ride
      if (
        socket.id !== ride.riderSocketId &&
        socket.id !== ride.driverSocketId
      ) {
        console.error(
          `Unauthorized ride completion attempt by ${socket.id} for ride ${ride.rideId}`,
        );
        socket.emit("ride_completion_error", {
          message: "Not authorized to complete this ride.",
        });
        return;
      }

      console.log(
        `Ride ${rideId} in room ${active_ride_room_id} marked as completed by ${socket.id}`,
      );

      const riderSocket = io.sockets.sockets.get(ride.riderSocketId);
      const driverSocket = io.sockets.sockets.get(ride.driverSocketId);

      const completionData = {rideId, status: "completed"};

      // Notify both participants in the room
      io.to(active_ride_room_id).emit("ride_finalized", completionData);

      // Make them leave the room
      if (riderSocket) {
        riderSocket.leave(active_ride_room_id);
        clients.get(ride.riderSocketId)?.rooms.delete(active_ride_room_id);
      }
      if (driverSocket) {
        driverSocket.leave(active_ride_room_id);
        clients.get(ride.driverSocketId)?.rooms.delete(active_ride_room_id);
      }

      // Clean up
      activeRides.delete(active_ride_room_id);
      rooms.delete(active_ride_room_id);
      console.log(
        `Cleaned up active ride room ${active_ride_room_id} for ride ${rideId}`,
      );
    },
  );

  // keep only one client in a room and disconnect others
  socket.on("keep_one_client", (roomId: string, keepClientId: string) => {
    const roomClients = rooms.get(roomId);
    if (roomClients) {
      // check if the requesting user is the only one in the room
      if (roomClients.size === 1 && roomClients.has(keepClientId)) {
        console.log("Only you are present in the room:", {
          roomId,
          clientId: keepClientId,
        });
        socket.emit("room_status", {
          status: "single_user",
          message: "You are the only one in the room",
        });
        return;
      }

      console.log("Keep one client request:", {
        roomId,
        keepClientId,
        requestFrom: socket.id,
      });

      const disconnectedClients: string[] = [];

      roomClients.forEach(clientId => {
        if (clientId !== keepClientId) {
          // disconnect other clients
          io.sockets.sockets.get(clientId)?.disconnect(true);
          clients.delete(clientId);
          disconnectedClients.push(clientId);
          console.log(`Disconnected client ${clientId} from room ${roomId}`);
        }
      });

      // update room to only contain the kept client
      rooms.set(roomId, new Set([keepClientId]));

      // notify the kept client
      socket.emit("room_status", {
        status: "success",
        message: "Other clients have been disconnected",
        keptClient: keepClientId,
        disconnectedClients,
      });

      console.log("Room cleanup complete:", {
        roomId,
        keptClient: keepClientId,
        disconnectedClients,
        remainingClients: Array.from(rooms.get(roomId) || []),
      });
    } else {
      console.log(`Room ${roomId} not found or already empty`);
      socket.emit("room_status", {
        status: "error",
        message: `Room ${roomId} not found or already empty`,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Clean up DRIVERS_ROOM if driver disconnects
    // Note: socket.rooms automatically handles leaving rooms on disconnect.
    // We might need more specific cleanup for activeRideRequests if a rider disconnects
    // or activeRides if a participant disconnects.

    // Existing cleanup for generic rooms map
    rooms.forEach((clientsInRoom, currentRoomId) => {
      if (clientsInRoom.has(socket.id)) {
        clientsInRoom.delete(socket.id);
        if (clientsInRoom.size === 0) {
          rooms.delete(currentRoomId);
          console.log(`Room ${currentRoomId} deleted as it became empty.`);
        }
      }
    });

    // Rider-specific cleanup: If a rider disconnects, invalidate their pending ride requests
    activeRideRequests.forEach((request, biddingRoom) => {
      if (request.riderSocketId === socket.id) {
        // Notify drivers in that bidding room? Or just remove.
        console.log(
          `Rider ${socket.id} disconnected, removing their ride request ${request.rideId} from bidding room ${biddingRoom}`,
        );
        // Potentially notify drivers in bidding_room_${request.rideId}
        io.to(biddingRoom).emit("ride_request_cancelled_by_rider", {
          rideId: request.rideId,
          bidding_room_id: biddingRoom,
        });
        activeRideRequests.delete(biddingRoom);
        // Clean up the bidding room itself from the general 'rooms' map
        if (rooms.has(biddingRoom)) {
          rooms.delete(biddingRoom);
          console.log(
            `Bidding room ${biddingRoom} deleted due to rider disconnect.`,
          );
        }
      }
    });

    // Driver-specific cleanup: If a driver disconnects, remove their bids
    activeRideRequests.forEach(request => {
      if (request.bids.has(socket.id)) {
        request.bids.delete(socket.id);
        console.log(
          `Driver ${socket.id} disconnected, removed their bid from ride ${request.rideId}`,
        );
        // Notify the rider in that bidding room?
        io.to(request.riderSocketId).emit(
          "driver_bid_withdrawn_due_to_disconnect",
          {
            rideId: request.rideId,
            driverSocketId: socket.id,
          },
        );
      }
    });

    // Active ride cleanup: If a participant in an active ride disconnects
    activeRides.forEach((ride, activeRideRoom) => {
      if (
        ride.riderSocketId === socket.id ||
        ride.driverSocketId === socket.id
      ) {
        console.log(
          `Participant ${socket.id} disconnected from active ride ${ride.rideId} in room ${activeRideRoom}`,
        );
        // Notify the other participant
        const otherParticipantSocketId =
          ride.riderSocketId === socket.id
            ? ride.driverSocketId
            : ride.riderSocketId;
        io.to(otherParticipantSocketId).emit("ride_participant_disconnected", {
          rideId: ride.rideId,
          disconnectedUser: socket.id,
        });
        // Potentially mark ride as "interrupted" or remove from activeRides
        // For now, just log and notify. Decide on state change later.
        // activeRides.delete(activeRideRoom); // Or update its status
      }
    });

    // remove client from tracking (general client tracking)
    clients.delete(socket.id);
  });
});

io.listen(4000);

console.log("Socket.IO server running on port 4000");
