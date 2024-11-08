"use client";   
// components/FavoritesClient.tsx
import Container from "../components/Container";
import { SafeListing, SafeUser } from "../types";
import Heading from "../components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "../components/EmptyState";
import { useEffect, useState } from "react";

interface FavoritesClientProps {
  currentUser?: SafeUser | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  currentUser,
}) => {
    const [ favorites, setFavorites ] = useState<SafeListing[]>([]);
    

    useEffect(() => {
        if(currentUser?.favoriteIds && currentUser.favoriteIds.length > 0) {
            fetchFavorites();
        }
    }, [currentUser?.favoriteIds]);

    const fetchFavorites = async () => {
        const favorites = await fetch("api/listings/favorites");

        if (favorites.ok) {
            const data = await favorites.json();
            setFavorites(data);
        }
    }

  if (!favorites || favorites.length === 0) {
    return (
        <EmptyState
          title="Dina favoriter fhghdhdh"
          subtitle="Något gick fel, försök igen senare"
        />
    );
  }
  return (
    <Container>
      <Heading title="Dina favoriter" subtitle="Här är dina favoriter" />
      <div
        className="
      mt-10
      grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
        
      "
      >
        {favorites.map((listing) => (
            <ListingCard
                key={listing.id}
                data={listing}
                currentUser={currentUser}
                onLike={(listingId, isLiked) => {
                    fetchFavorites();
                }}
            />  
        )
        )}
      </div>
    </Container>
  );
};

export default FavoritesClient;
