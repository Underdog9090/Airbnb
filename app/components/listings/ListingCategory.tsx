"use client";

import { IconType } from "react-icons";

interface ListingCategoryProps {
  icon: IconType;
  label: string;
  description: string;
}

const ListingCategory: React.FC<ListingCategoryProps> = ({
  icon: Icon,
  label,
  description,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <Icon className="text-neutral-600" size={40} />
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>
      <p className="text-neutral-500">{description}</p>
    </div>
  );
};

export default ListingCategory;
