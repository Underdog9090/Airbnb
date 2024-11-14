import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/currentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId: string;
}

export async function DELETE(_: Request, { params }: { params: IParams }) {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.error();
    }

    // Get the listingId from params
    const { listingId } = params;
    if (!listingId || typeof listingId !== "string") {
      return NextResponse.error();
    }

    // Delete the listing only if it belongs to the current user
    await prisma.listing.delete({
      where: {
        id: listingId,
        userId: currentUser.id
      }
    });

    // Return success response
    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return NextResponse.error();
  }
}
