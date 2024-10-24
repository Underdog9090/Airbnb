// app/api/favorites/[id]/route.ts

import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/currentUser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const { id } = params; // The listing ID from the route parameters
  if (!id) throw new Error("Invalid listing id");

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds: { push: id } }, // Push the listing ID to favorites
  });

  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const { id } = params; // The listing ID from the route parameters
  if (!id) throw new Error("Invalid listing id");

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds: { set: currentUser.favoriteIds.filter((favId) => favId !== id) } }, // Remove the listing ID from favorites
  });

  return NextResponse.json(user);
}
