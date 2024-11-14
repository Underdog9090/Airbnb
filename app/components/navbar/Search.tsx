"use client";
import useSearchModal from "@/app/hooks/useSearchModel"; // Custom hook
import { BiSearch } from "react-icons/bi"; // Icon

export default function Search() {
    // Call the hook inside the functional component
    const searchModal = useSearchModal();

    return (
        <div
            onClick={searchModal.onOpen} // Triggering modal open
            className="
                border-[1px]
                w-full
                md:w-auto
                py-2
                rounded-full
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
            "
        >
            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold px-6">
                    Start your search
                </div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                    Add dates
                </div>
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block"> Add Guests </div>
                    <div className="p-2 bg-rose-500 rounded-full text-white">
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
}
