"use client";

import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import Container from "@/app/components/Container";
import { use, useCallback, useMemo, useState } from "react";
import ListingHead from "@/app/components/listings/listingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { categories } from "@/app/components/navbar/Categories";
import userLogInModal from "@/app/hooks/userLogInModel";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import { useEffect } from "react";

const initialDates = { startDate: new Date(), endDate: new Date(), key: "selection" };

interface ListingClientProps {
  reservation?: Reservation[];
  listing: Listing;
  currentUser: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservation = [],
  currentUser,
}) => {
  const logInModal = userLogInModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservation.forEach((res) => {
      const range = eachDayOfInterval({
        start: new Date(res.checkIn),
        end: new Date(res.checkOut),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservation]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dates, setDates] = useState<{ startDate: Date; endDate: Date; key: string }>(initialDates);

  const createReservation = useCallback(async () => {
    if (!currentUser) {
      logInModal.onOpen();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalPrice,
          listingId: listing.id,
          checkIn: dates.startDate,
          checkOut: dates.endDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to create reservation.");

      toast.success("Reservation created successfully");
      setDates(initialDates);
      // router.push("/reservations");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, totalPrice, listing.id, dates, logInModal, router]);

  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      const days = differenceInCalendarDays(dates.endDate, dates.startDate);
      setTotalPrice(days * listing.price);
    }
  }, [currentUser]);


  const category = useMemo(() => {
    return categories.find((category) => category.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-4">
          <ListingHead
            title={listing.title}
            imageSrc={listing.image}
            locationValue={listing.address as string}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={currentUser as SafeUser}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              bathroomCount={listing.bathroomCount}
              guestCount={listing.guestCount}
              locationValue={listing.address as string}
            />
            <div className="md:col-span-3">
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Reserve your stay</h2>
                  <span className="text-gray-500 text-sm">
                    ${listing.price} x {differenceInCalendarDays(dates.endDate, dates.startDate)}{" "}
                    nights
                  </span>
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="Check in"
                    value={dates.startDate.toDateString()}
                    readOnly
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="Check out"
                    value={dates.endDate.toDateString()}
                    readOnly
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="Total price"
                    value={`$${totalPrice}`}
                    readOnly
                  />
                </div>
                <button
                  className="mt-4 w-full bg-indigo-500 text-white p-3 rounded-lg"
                  onClick={createReservation}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Reserve"}
                </button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </Container>
    
  );
};

export default ListingClient;
