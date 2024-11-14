"use client";
import { useRouter } from "next/navigation";
import { SafeListing, SafeUser } from "../types";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { useState } from "react";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface PropertiesClientProps {
  listings: SafeListing[];  // Assuming properties is an array of SafeListing
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings ,
  currentUser,
}) => {
  const router = useRouter();
  const [deletedPropertyId, setDeletedPropertyId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(errorDetails || "Failed to delete property");
      }
  
      setDeletedPropertyId(id);
      toast.success("Property deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting property:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete property");
      } else {
        toast.error("Failed to delete property");
      }
    }
  };
  

  return (
    <Container>
      <div className="flex flex-col items-center space-y-4 mb-10">
        <Heading title="Your Properties" subtitle="Manage your listed properties" />
        <p className="text-gray-500 text-sm mt-2">
          Edit, manage, or remove your property listings.
        </p>
      </div>

      {listings.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 px-4">
          {listings.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard
                data={listing}
                actionId={listing.id}
                onAction={() => handleDelete(listing.id)} // Calls handleDelete function with listing ID
                actionLabel="Delete property"
                currentUser={currentUser}
                disableAction={deletedPropertyId === listing.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-600">
          <p>
            You have no properties listed. Start by adding a new property to showcase!
          </p>
        </div>
      )}
    </Container>
  );
};

export default PropertiesClient;
