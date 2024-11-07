import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/currentUser";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { listingId, checkIn, checkOut, totalPrice } = body;

        // Get current user and ensure they are authenticated
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Validate essential fields
        if (!listingId || !checkIn || !checkOut || !totalPrice) {
            return NextResponse.json({ error: "Incomplete data provided" }, { status: 400 });
        }

        // Validate listing existence
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // Create reservation and attach to listing
        const reservationAndListing = await prisma.listing.update({
            where: { id: listingId },
            data: {
                reservations: {
                    create: {
                        checkIn: new Date(checkIn),
                        checkOut: new Date(checkOut),
                        totalPrice,
                        userId: currentUser.id,
                    },
                },
            },
            include: { reservations: true },
        });

        return NextResponse.json(reservationAndListing);
    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}