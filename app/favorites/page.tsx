// app/favorites/page.tsx or pages/favorites.tsx
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/currentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import FavoritesClient from "@/app/favorites/FavoritesClient";
import { use, useEffect, useState } from "react";
import { SafeListing } from "../types";

const ListingPage = async () => {
    const currentUser = await getCurrentUser();
   

  return (
    <ClientOnly>
      <FavoritesClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ListingPage;
