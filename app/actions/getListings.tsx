import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createAt: "desc", // Make sure the field in the model is 'createdAt'
      },
    });
    return listings;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
