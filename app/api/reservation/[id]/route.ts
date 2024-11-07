import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/currentUser";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Get current user and ensure they are authenticated
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find reservation to delete
        const reservation = await prisma.reservation.findUnique({
            where: { id },
        });
        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        // Check if the current user is the owner of the reservation
        if (reservation.userId !== currentUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete the reservation
        await prisma.reservation.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Reservation canceled successfully" });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
