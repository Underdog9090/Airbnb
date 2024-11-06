"use client";

import { Range as DateRangeType } from "react-date-range";
import { SafeReservation, SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import Container from "@/app/components/Container";
import { useCallback, useMemo, useState, useEffect } from "react";
import ListingHead from "@/app/components/listings/listingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { categories } from "@/app/components/navbar/Categories";
import userLogInModal from "@/app/hooks/userLogInModel";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import ListingReservations from "@/app/components/listings/ListingReservations";

const initialDates: DateRangeType[] = [
  {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  },
];

interface ListingClientProps {
  reservation?: SafeReservation[];
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
  const [dates, setDates] = useState<DateRangeType[]>(initialDates);

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
          checkIn: dates[0].startDate,
          checkOut: dates[0].endDate,
        }),
      });
      if (!response.ok) throw new Error("Failed to create reservation.");
      toast.success("Reservation created successfully");
      setDates(initialDates);
      router.push("/trips");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, totalPrice, listing.id, dates, logInModal, router]);

  useEffect(() => {
    if (dates[0].startDate && dates[0].endDate) {
      const days = differenceInCalendarDays(
        dates[0].endDate,
        dates[0].startDate
      );
      setTotalPrice(days * listing.price);
    }
  }, [dates, listing.price]);

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

            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservations
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDates([value])} // Update to use alias
                dateRange={dates} // Pass alias here
                onSubmit={createReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
