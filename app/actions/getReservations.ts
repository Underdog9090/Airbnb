import prisma from "@/app/libs/prismadb";
import { ReservationWithListing, SafeReservation } from "@/app/types";

interface IParams {
  listingId?: string;
  userId?: string;
  authId?: string;
}

export async function getReservations(params: IParams): Promise<SafeReservation[]> {
  const { listingId, userId, authId } = params;

  const query: any = {
    where: {},
    include: {
      listing: true,
    },
    orderBy: {
      createAt: "desc" as const,
    },
  };

  if (listingId) query.where.listingId = listingId;
  if (userId) query.where.userId = userId;
  if (authId) query.where.authId = authId;

  try {
    const reservations = await prisma.reservation.findMany(query) as ReservationWithListing[];

    const safeReservations: SafeReservation[] = reservations.map((reservation) => ({
      id: reservation.id,
      listingId: reservation.listingId,
      userId: reservation.userId,
      createAt: reservation.createAt.toISOString(), // Using createAt as in your schema
      checkIn: reservation.checkIn.toISOString(),
      checkOut: reservation.checkOut.toISOString(),
      paymentIntentId: reservation.paymentIntentId,
      paymentMethodId: reservation.paymentMethodId,
      status: reservation.status,
      totalPrice: reservation.totalPrice,
      listing: {
        id: reservation.listing.id,
        title: reservation.listing.title,
        description: reservation.listing.description,
        image: reservation.listing.image,
        address: reservation.listing.address,
        price: reservation.listing.price,
        userId: reservation.listing.userId,
        createAt: reservation.listing.createAt.toISOString(), // Corrected to use createAt
        category: reservation.listing.category,
        roomCount: reservation.listing.roomCount,
        bathroomCount: reservation.listing.bathroomCount,
        guestCount: reservation.listing.guestCount,
      },
    }));

    return safeReservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Failed to fetch reservations");
  }
}

export default getReservations;
