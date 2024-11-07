
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

  const handleDelete = async (action: string, id: string) => {
    if (action === "cancel") {
      try {
        const response = await fetch(`/api/reservation/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error(await response.text()); // Read response for errors
        setDeletedReservationId(id);
        toast.success("Reservation canceled successfully");
        router.refresh();
      } catch (error) {
        console.error("Error canceling reservation:", error); // More detailed error logging
        toast.error("Failed to cancel reservation");
      }
    }
  };
  

  return (
    <Container>
      <div className="flex flex-col items-center space-y-4 mb-10">
        <Heading title="Your Trips" subtitle="Manage your upcoming trips" />
        <p className="text-gray-500 text-sm mt-2">
          Review, manage, or cancel your reservations.
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 px-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="relative">
              <ListingCard
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={handleDelete} // Trigger handleDelete function on action
                actionLabel="Cancel Trip"
                currentUser={currentUser}
                disableAction={deletedReservationId === reservation.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-600">
          <p>
            You have no trips scheduled. Start exploring and booking your next adventure!
          </p>
        </div>
      )}
    </Container>
  );
};

export default TripsClient;
