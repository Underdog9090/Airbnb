import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/currentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "../reservations/ReservationClients"; // Correct path

const reservationsPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please log in" />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    userId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState title="No Reservations" subtitle="You have no reservations yet" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}  // Make sure you're passing the correct props
      />
    </ClientOnly>
  );
};

export default reservationsPage;
