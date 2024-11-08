"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import HeartButton from "../HeartButton";
import Button from "../Button";
import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { on } from "events";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (action: string, id: string) => void;
  disableAction?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  onDelete?: (id: string) => void;  // Add an optional onDelete prop
  onLike?: (id: string, isLiked: boolean) => void;  // Add an optional onLike prop
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disableAction,
  actionLabel,
  actionId = "",
  currentUser,
  onDelete,  // Destructure the onDelete prop
  onLike,  // Destructure the onLike prop
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const [isLiked, setIsLiked] = useState(false); // Assuming initially it's not liked

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const isLiked = currentUser.favoriteIds?.includes(data.id);
    setIsLiked(isLiked || false);
  }, [currentUser, data.id]);


  const location =
    data.address && typeof data.address === "object"
      ? getByValue((data.address as ListingAddress).value) // Ensure data.address has value
      : typeof data.address === "string"
      ? getByValue(data.address)
      : null;

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (onAction && actionId) {
        onAction("cancel", actionId);
      }
    },
    [onAction, actionId]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (onDelete && data.id) {
        onDelete(data.id);  // Trigger delete action passed from parent
      }
    },
    [onDelete, data.id]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice; // If it's a reservation, show the total price for the stay
    }
    return data.price; // If it's a listing, show the price per night
  }, [reservation, data.price]);

  const reservationDetails = useMemo(() => {
    if (!reservation || !reservation.checkIn || !reservation.checkOut) {
      return null;
    }
    const start = new Date(reservation.checkIn);
    const end = new Date(reservation.checkOut);
    return `${format(start, "MMM dd yyyy")} - ${format(end, "MMM dd yyyy")}`;
  }, [reservation]);


  // Handle like/unlike action
  const handleLikeClick = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setIsLiked((prevState) => !prevState);

    try {
      if (isLiked) {
        await fetch(`/api/favorites/${data.id}`, { method: "DELETE" });
        onLike && onLike(data.id, false);  // Trigger onLike action passed from parent
      } else {
        await fetch(`/api/favorites/${data.id}`, { method: "POST" });
        onLike && onLike(data.id, true);  // Trigger onLike action passed from parent
      }
      console.log("Toggled like for listing:", data.id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="listing-card border rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:shadow-xl hover:scale-105"
    >
      <div className="relative h-60 w-full">
        <Image
          src={data.image}
          alt={data.title}
          layout="fill"
          objectFit="cover"
          className="w-full h-full transition-transform duration-300 ease-in-out"
        />
        <div className="absolute top-3 right-3">
          <HeartButton
            listingId={data.id}
            currentUser={currentUser}
            isLiked={isLiked} // Pass the liked state here
            onClick={handleLikeClick} // Pass the toggle like function
          />
        </div>
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg">
          {location?.label || "Unknown location"},{" "}
          {location?.region || "Unknown region"}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDetails || data.category}
        </div>
        <h2 className="text-xl font-bold my-2">{data.title}</h2>
        {reservationDetails && (
          <p className="text-sm text-neutral-600">{reservationDetails}</p>
        )}

        <p className="font-semibold text-lg text-neutral-800 mt-2">
          ${price}
          {!reservation && " per night"} {/* Only show 'per night' if it's not a reservation */}
        </p>

        {/* Conditional rendering of 'nights' text for listings only */}
        {actionLabel && onAction && (
          <Button
            onClick={handleCancel}
            small
            label={actionLabel}
            disabled={disableAction}
          />
        )}

        {/* DELETE BUTTON */}
        {onDelete && data.id && (
          <button
            onClick={handleDelete}
            className="text-red-500 mt-2 p-2 border rounded-md hover:bg-red-100"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
