import axios from "axios";  
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import toast, { Toast } from "react-hot-toast";
import { SafeUser } from "../types";
import { Interface } from "readline";
import  useLogInModal from "./userLogInModel";
import { on } from "events";


interface IUseFavorites {
    listingId: string;
    currentUser: SafeUser | null;
}

const useFavorites = ({ listingId, currentUser }: IUseFavorites) => {
    const router = useRouter();
    const logInModal = useLogInModal();

    const isLiked = useMemo(() => {
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId);

    }, [currentUser, listingId]);

    const toggleFavorite = useCallback(async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (!currentUser) {
            logInModal.onOpen();
            return;
        }

        try {
            let response;
            if (isLiked) {
            response = await axios.delete(`/api/favorites/${listingId}`);
            console.log("Listing removed from favorites");
            } else {
            response = await axios.post(`/api/favorites/${listingId}`);
            console.log("Listing added to favorites");
            }
        } catch (error) {
            console.error("Failed to update favorites");
            toast.error("Failed to update favorites", {
                duration: 4000,
                icon: "❌",
            });
        }

        await router.replace(router.asPath);
        toast.success("Favorites updated", {
            duration: 4000,
            icon: "🎉",
        });
    }, [currentUser, listingId, isLiked, logInModal, router]);

    return { isLiked, toggleFavorite };
};

export default useFavorites;
