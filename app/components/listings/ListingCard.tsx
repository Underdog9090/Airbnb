"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns"; // Corrected the import for `format`
import HeartButton from "../HeartButton";
import { on } from "events";
import Button from "../Button";

interface ListingCardProps {
  data: Listing;
  reservation?: Reservation;
  onAction?: (action: string, id: string) => void;
  disableAction?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disableAction,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  console.log(data.address, "this si DATA");
  const location =
    data.address && typeof data.address === "object"
      ? getByValue((data.address as  ListingAddress).value) // Ensure data.address has value
      : typeof data.address === "string"
      ? getByValue(data.address)
      : null;

  if (!location) {
    console.error("Location not found for address:", data.address);
  }

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (onAction) {
        onAction("cancel", data.id);
      }
    },
    [onAction, actionId, disableAction, data.id]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data.price;
  }, [reservation, data.price]);

  const reservationDetails = useMemo(() => {
    if (!reservation) {
      return null;
    }
    const start = new Date(reservation.checkIn);
    const end = new Date(reservation.checkOut);
    return `${format(start, "MMM dd")} - ${format(end, "MMM dd")}`;
  }, [reservation]);

  // State to manage whether the listing is liked
  const [isLiked, setIsLiked] = useState(false); // Assuming initially it's not liked

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
      } else {
        await fetch(`/api/favorites/${data.id}`, { method: "POST" });
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
          ${price} per night
        </p>
        {actionLabel && onAction && (
          <Button
            onClick={handleCancel}
            small
            label={actionLabel}
            disabled={disableAction}
          ></Button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
