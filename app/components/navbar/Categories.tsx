"use client"; 
import Container from "../Container";
import { TbBeach, TbMountain, TbPool  } from "react-icons/tb";
import { GiBarn, GiBoatFishing, GiCactus, GiCampingTent, GiCastle, GiCaveEntrance, GiDeadEye, GiIsland, GiWindmill } from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "./CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSkiingNordic } from "react-icons/fa";
import {BsSnow} from "react-icons/bs"
import {IoDiamond} from "react-icons/io5"

// Categories data
export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "Sunny beaches and sandy shores",
  },
  {
    label: "Windmills",
    icon: GiWindmill,
    description: "Majestic mountains and serene valleys",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "Modern architectural designs and city landscapes",
  },
  {
    label: "CountrySide",
    icon: TbMountain,
    description: "Welcome to the country sides",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This property has a pool for your enjoyment",
  }, {
    label: "Island",
    icon: GiIsland,
    description: "This property is on an island",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property is near a lake",
  },
  {
    label: "Skiing",
    icon: FaSkiingNordic,
    description: "This property is near a ski resort",
  },
  {
    label: "Castles",
    icon: GiCastle,
    description: "This property is a castle",
  },
  {
    label: "Camping",
    icon: GiCampingTent,
    description: "this is camping activities",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "Modern architectural designs and city landscapes",
  },
  {
    label: "Cave",
    icon: GiCaveEntrance,
    description: "This property is in a cave",
  },
  {
    label: "Desert",
    icon: GiCactus,
    description: "This propert is in the desert",
  },
  {
    label: "GiBarns",
    icon: GiBarn,
    description: "This property is in the barn",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "his property is luxurious",
  }

];

const Categories = () => {
  const params = useSearchParams();
  const categoryFromParams = params?.get("category");
  const pathname = usePathname();

  // Initialize state for selectedCategory
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Update selectedCategory based on URL params when component loads or params change
  useEffect(() => {
    if (categoryFromParams) {
      setSelectedCategory(categoryFromParams);
    }
  }, [categoryFromParams]);

  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          pt-4
          flex
          flex-row
          items-center
          justify-between
          overflow-x-auto
        "
      >
        {categories.map((category) => (
          <CategoryBox
            key={category.label}
            label={category.label}
            selected={selectedCategory === category.label} // Compare with selectedCategory
            icon={category.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
