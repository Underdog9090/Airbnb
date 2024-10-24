"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";
import useFavorites from "../hooks/useFavorites";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
  isLiked: boolean; // u added these 2 props
  onClick: () => void;// ||
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
  isLiked,
  onClick,
}) => {

    const toggleLike = () => {
    if (!currentUser) {
      // Redirect to login
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={(e)=> {
        e.preventDefault(); //
        e.stopPropagation();
        toggleLike();
      }}
      className="
        relative
        hover:bg-opacity-80
        transition
        duration-200
        cursor-pointer
      "
      role="button"
    >
      {/* Outlined Heart */}
      <AiOutlineHeart
        size={28}
        className={`
          absolute
          top-2
          right-2
          ${isLiked ? "opacity-0" : "opacity-100"}
          text-white
          transition
          duration-200
        `}
      />
      {/* Filled Heart */}
      <AiFillHeart
        size={28}
        className={`
          absolute
          top-2
          right-2
          ${isLiked ? "text-red-500 opacity-100" : "opacity-0"}
          transition
          duration-200
        `}
      />
    </div>
  );
};

export default HeartButton;
