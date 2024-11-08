import prisma from "@/app/libs/prismadb";
import { SafeListing } from "../types";

const getListings = async (filter?: { userId?: string }): Promise<SafeListing[]> => {
  try {
    const listings = await prisma.listing.findMany({
      where: filter,
      orderBy: {
        createAt: "desc",
      },
    });

    // Convert the raw listings to SafeListing format
    return listings.map((listing) => ({
      ...listing,
      createAt: listing.createAt.toISOString(), // Convert Date to string (ISO format)
    }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw new Error("Error fetching listings");
  }
};

export default getListings;
