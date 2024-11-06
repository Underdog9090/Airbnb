import { User, Listing, Reservation } from "@prisma/client";

// Define SafeListing type with createAt
export type SafeListing = Omit<Listing, "createAt"> & {
  createAt: string; // Convert createAt to a string
};

// Define SafeReservation type with createAt, checkIn, checkOut, and listing as SafeListing
export type SafeReservation = Omit<Reservation, "createAt" | "checkIn" | "checkOut" | "listing"> & {
  createAt: string; 
  checkIn: string;
  checkOut: string;
  listing: SafeListing;
  paymentIntentId?: string | null;
  paymentMethodId?: string | null;
  status?: string | null;
};

// Define SafeUser type with createAt as a string
export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

// Export ReservationWithListing interface to include the listing field in Reservation
export interface ReservationWithListing extends Reservation {
  listing: Listing;
}
