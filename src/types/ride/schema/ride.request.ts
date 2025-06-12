import {z} from "zod";

// this data wil go to socket server
export const RideRequestSchema = z.object({
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  dropoffLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  bidAmount: z.number(),
  name: z.string(),
  phone: z.string(),
  status: z.enum(["pending", "accepted", "rejected", "completed"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  fare: z.object({
    baseFare: z.number(),
    finalFare: z.number(),
    breakdown: z.object({
      // values we will change later on
      baseCost: z.number(),
      serviceFee: z.number(),
      taxes: z.number(),
    }),
  }),
});
