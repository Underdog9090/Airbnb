import { useState } from "react";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";
import { IconType } from "react-icons";

interface ListingHeadProps {
    title: string;
    category?: { icon: IconType; label: string; description?: string };
    imageSrc: string;
    locationValue: string;
    id: string;
    currentUser: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    imageSrc,
    category,
    locationValue,
    id,
    currentUser,
}) => {
    const { getByValue } = useCountries();
    const [isLiked, setIsLiked] = useState(false);

    const location = typeof locationValue === "string" ? getByValue(locationValue) : locationValue;

    const handleLikeClick = () => {
        setIsLiked((prev) => !prev);
    };

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-md bg-white">
            <div className="relative h-[60vh] w-full">
                <Image
                    src={imageSrc}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="w-full h-full"
                    quality={100} // Ensures high-quality rendering
                />
                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                        isLiked={isLiked}
                        onClick={handleLikeClick}
                    />
                </div>
            </div>
            <div className="p-6">
                <Heading
                    title={title}
                    subtitle={`${location?.region ?? "Unknown region"}, ${location?.label ?? "Unknown location"}`}
                />
                {category && (
                    <div className="mt-2 text-neutral-500 font-medium text-sm italic flex items-center gap-2">
                        <category.icon size={20} className="text-neutral-600" />
                        <span>{category.label}</span>
                        {category.description && (
                            <p className="text-neutral-400 text-xs ml-2">{category.description}</p>
                        )}
                    </div>
                )}
                <div className="text-neutral-600 text-sm mt-2">
                    Listing ID: <span className="font-semibold">{id}</span>
                </div>
            </div>
        </div>
    );
};

export default ListingHead;
