import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    return listing;

  } catch (error) {
    console.error(error);
    return null;
  }
}

