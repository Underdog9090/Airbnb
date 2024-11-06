import getCurrentUser from "@/app/actions/currentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "@/app/listings/[listingId]/ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  if (!params.listingId) {
    return <div>Error: Listing ID is required</div>;
  }

  const listing = await getListingById({ listingId: params.listingId });
  const currentUser = await getCurrentUser();
  const reservations = await getReservations({ listingId: params.listingId });

  // Log outputs to check data
  console.log("Listing:", listing);
  console.log("CurrentUser:", currentUser);
  console.log("Reservations:", reservations);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient 
        listing={listing} 
        reservation={reservations} // changed to `reservations`
        currentUser={currentUser} 
      />
    </ClientOnly>
  );
};

export default ListingPage;
