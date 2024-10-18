"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();
    return (
      <Image 
        onClick={() => router.push("/")} // Add this onClick handler
        alt="Logo"
        className="hidden md:block cursor-pointer"
        height="100" 
        width="100"
        src="/images/logo.png" // Adjust the file extension if necessary
      />
    );
};

export default Logo;