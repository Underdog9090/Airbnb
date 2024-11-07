"use client";

import toast from "react-hot-toast";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard"; // Assuming you have a ListingCard component
import { SafeReservation, SafeUser } from "../types"; // Import your types
import { useCallback } from "react";


interface ReservationsClientProps {
  reservations: SafeReservation[];  // Ensure you're accepting an array of reservations
  currentUser?: SafeUser;  // Accept the current user object
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletedReservationId, setDeletedReservationId] = useState<string | null>(null);

//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`/api/reservation/${id}`, {
//         method: "DELETE",
//       });
//       setDeletedReservationId(id);
//       toast.success("Reservation canceled successfully");
//       router.refresh(); // Optionally, refresh the page after deletion
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to cancel reservation");
//     }
//   };

const onCancel = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete reservation");
      }
      setDeletedReservationId(id);
      toast.success("Reservation canceled successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel reservation");
    }
  }, [router]);
  

  return (
    <Container>
      <Heading title="Reservations" subtitle="Your upcoming reservations" />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 px-4">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="relative">
            <ListingCard
              data={reservation.listing}  // Pass the listing data
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel} // Trigger handleDelete function
              actionLabel="Cancel Reservation"
              currentUser={currentUser}
              disableAction={deletedReservationId === reservation.id}
            />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
