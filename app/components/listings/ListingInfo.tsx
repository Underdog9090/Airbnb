"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import L from "leaflet";

// Load `Map` dynamically
const Map = dynamic(() => import("../Map"), { ssr: false });

interface ListingInfoProps {
  user: SafeUser;
  category?: {
    icon: IconType;
    label: string;
    description: string | undefined;
  };
  description: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string; // Location identifier
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  category,
  description,
  roomCount,
  bathroomCount,
  guestCount,
  locationValue,
}) => {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  // 1. Check if `location?.latlng` returns correct coordinates
  const coordinates = location?.latlng;

  // 2. Set up state to manage map position
  const [position, setPosition] = useState<L.LatLngExpression | undefined>(coordinates);

  // 3. Effect to update position when coordinates change
  useEffect(() => {
    if (coordinates) {
      setPosition(coordinates); // Ensure position syncs with coordinates
    }
  }, [coordinates]);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold flex flex-row items-center gap-2">
            Hosted by {user?.name}
            <Avatar src={user?.image} />
            <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
              <div>{guestCount} guests</div>
              <div>{roomCount} rooms</div>
              <div>{bathroomCount} bathrooms</div>
            </div>
          </div>
        </div>
        <hr className="border-neutral-200" />
        {category?.description && (
          <ListingCategory
            icon={category.icon}
            label={category.label}
            description={category.description}
          />
        )}
        <hr />
        <div>
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-neutral-500">{description}</p>
        </div>
        <hr />
        {/* 4. Pass `coordinates` as center and setPosition to Map */}
        <Map center={coordinates} position={position} setPosition={setPosition} />
      </div>
    </div>
  );
};

export default ListingInfo;
