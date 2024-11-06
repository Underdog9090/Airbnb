"use client";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "../types";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { useState } from "react";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface TripsClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    currentUser,
}) => {
    const router = useRouter();
    const [deletedReservationId, setDeletedReservationId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/reservations/${id}`, {
                method: "DELETE",
            });
            setDeletedReservationId(id);
            toast.success("Reservation deleted successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete reservation");
        }
    };

    return (
        <Container>
            <div className="flex flex-col items-center space-y-4 mb-10">
                <Heading title="Your Trips" subtitle="Manage your upcoming trips" />
                <p className="text-gray-500 text-sm mt-2">Review, manage, or cancel your reservations.</p>
            </div>

            {reservations.length > 0 ? (
                <div
                    className="
                        grid
                        gap-6
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-3
                        2xl:grid-cols-4
                        px-4
                    "
                >
                    {reservations.map((reservation) => (
                        <div className="relative">
                            <ListingCard
                                key={reservation.id}
                                data={reservation.listing}
                                reservation={reservation}
                                actionId={reservation.id}
                                onAction={handleDelete}
                                actionLabel="Cancel Trip"
                                currentUser={currentUser}
                                disableAction={deletedReservationId === reservation.id}
                                // className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-10 text-gray-600">
                    <p>You have no trips scheduled. Start exploring and booking your next adventure!</p>
                </div>
            )}
        </Container>
    );
};

export default TripsClient;
