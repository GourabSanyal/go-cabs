export const dummyRideRequest = {
    pickupLocation: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    dropoffLocation: {
      latitude: 12.9784,
      longitude: 77.6408
    },
    bidAmount: 250,
    name: "John Doe",
    phone: "9876543210",
    status: "pending",
    createdAt: "2024-03-20T10:30:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
    fare: {
      baseFare: 200,
      finalFare: 250,
      breakdown: {
        baseCost: 150, 
        serviceFee: 50,
        taxes: 50
      }
    }
  }; 