"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client"; // Ensure correct import for Prisma models
import { useRouter } from "next/navigation";
import Image from "next/image"; // Assuming you are using Next/Image for handling images

interface ListingCardProps {
  data: Listing;
  reservation?: Reservation;
  onAction?: (action: string, id: string) => void; // Make sure the action handler takes the id
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

  const location = getByValue(data.address);

  const handleAction = () => {
    if (disableAction) return;
    if (onAction) {
      onAction(actionLabel ?? "", actionId);
    }
  };

  return (
    <div className="listing-card border rounded-lg overflow-hidden shadow-lg">
      {/* Image */}
      <div className="relative h-60 w-full">
        <Image
          src={data.image} // Assuming image field holds the image URL
          alt={data.title}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Listing Info */}
      <div className="p-4">
        <h2 className="text-xl font-bold">{data.title}</h2>
        <p className="text-gray-500">{location?.label}</p>

        {/* Reservation details */}
        {reservation ? (
          <div className="text-sm text-gray-600">
            <p>
              Check-in: {new Date(reservation.checkIn).toLocaleDateString()}
            </p>
            <p>
              Check-out: {new Date(reservation.checkOut).toLocaleDateString()}
            </p>
            <p>Total price: ${reservation.totalPrice}</p>
          </div>
        ) : (
          <p className="font-semibold text-lg">${data.price} per night</p>
        )}

        {/* Action button */}
        {onAction && actionLabel && (
          <button
            onClick={handleAction}
            disabled={disableAction}
            className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded ${
              disableAction ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
