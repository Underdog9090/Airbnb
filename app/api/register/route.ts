import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server"; 

export async function POST(request: Request) {
    console.log("User created successfully", );
  const body = await request.json();
  const { email, password, name } = body;

  const hashedPassword = await bcrypt.hash(password, 12); // Hash the password

  const user = await prisma.user.create({
    // Create a new user
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user); // Redirect to the homepage
}
