import getCurrentUser from "@/app/actions/currentUser";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
6;
import prisma from "@/app/libs/prismadb";

export const GET = async (req: NextApiRequest) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "No current user found" },
      { status: 404 }
    );
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

  return NextResponse.json(safeFavorites);
};
