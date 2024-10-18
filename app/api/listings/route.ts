import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getCurrentUser from "@/app/actions/currentUser";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  console.log("Current User:", user); // Log the current user
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log("Request Body:", body); // Log the request body

  const {
    category,
    address,
    guestCount,
    roomCount,
    bathroomCount,
    image,
    price,
    title,
    description,
    // type, // Ensure this is included
  } = body;

  const requiredFields = ["category", "address", "guestCount", "roomCount", "bathroomCount", "image", "price", "title", "description",]; //todo: ADD back type
  const missingFields = requiredFields.filter(field => !body[field])
  if (missingFields.length) {
    return NextResponse.json({ error: "Missing required fields", fields: missingFields }, { status: 400 });
  }

  const prisma = new PrismaClient();
  try {
    await prisma.listing.create({
      data: { 
        title,
        description,
        price: parseInt(price, 10),
        category,
        roomCount,
        bathroomCount,
        guestCount,
        address,
        image,
        // type, // Include the type field here
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return NextResponse.json({ message: "Listing created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error); // Log the error for debugging
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
