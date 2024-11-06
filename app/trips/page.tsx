import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/currentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "@/app/trips/TripsClient";

const tripsPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState 
        title="You are not logged in" 
        subtitle=" Please log in to view your trips"
        />
      </ClientOnly>
    );
  }

    const reservations = await getReservations({ userId: currentUser.id });

    if (!reservations.length) {
      return (
        <ClientOnly>
          <EmptyState 
          title="No trips found" 
          subtitle="Book a trip to see it here"
          />
        </ClientOnly>
      );
    }

    return (
        <ClientOnly>
            <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col gap-4">
                {reservations.map((reservation) => (
                <TripsClient
                 reservations={reservations} 
                 currentUser={currentUser}
                 />
                ))}
            </div>
            </div>
        </ClientOnly>
    );
};



export default tripsPage;