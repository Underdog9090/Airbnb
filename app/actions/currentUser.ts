import {getServerSession} from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '../../app/libs/prismadb';

// Function to get the session
export async function getSession() {
    const session = await getServerSession(authOptions);
    console.log("Session Retrieved:", session); // Add logging to check session
    return session;
}

// Function to get the current user
export default async function getCurrentUser() {
    try {
        const session = await getSession();
        console.log(" Session Validations",session)
        if (!session || !session.user || !session.user.email) {
            console.log("No session or no email found in session");
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!currentUser) {
            console.log("No user found in database");
            return null;
        }

        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        };
    } catch (error: any) {
        console.error("Error fetching current user:", error);
        return null;
    }
}
