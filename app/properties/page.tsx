import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/currentUser";
import getListings from "../actions/getListings";
import PropertiesClient from "@/app/properties/PropertiesClient"; // Ensure correct path

const propertiesPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState 
          title="You are not logged in" 
          subtitle="Please log in to view your properties"
        />
      </ClientOnly>
    );
  }

  const listings = await getListings({ userId: currentUser.id });

  if (!listings.length) {
    return (
      <ClientOnly>
        <EmptyState 
          title="No properties found" 
          subtitle="Add a property to see it here"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-4">
          <PropertiesClient 
            listings={listings} 
            currentUser={currentUser}
          />
        </div>
      </div>
    </ClientOnly>
  );
};

export default propertiesPage;
