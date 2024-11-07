import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/currentUser";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Step 1: Get the current user and ensure they are authenticated
    const currentUser = await getCurrentUser();
    console.log(currentUser, "Current user is ");
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Check if the reservation exists
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Step 3: Ensure the current user is the owner of the reservation
    if (reservation.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Step 4: Delete the reservation
    await prisma.reservation.delete({
      where: { id },
    });

    // Step 5: Respond with a success message
    return NextResponse.json({ message: "Reservation canceled successfully" });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
