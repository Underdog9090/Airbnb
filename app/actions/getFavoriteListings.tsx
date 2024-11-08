import prisma from "../../app/libs/prismadb";
import getCurrentUser from "./currentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log("No current user found");
      return null;
    }

    const favoriteListings = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    });

    const safeFavorites = favoriteListings.map((listing: any) => ({
      ...listing,
    }));

    return safeFavorites;
  } catch (error: any) {
    console.error("Error fetching favorite listings:", error);
    return null;
  }
}
