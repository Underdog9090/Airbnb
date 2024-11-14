// Search.tsx
"use client";

import useSearchModal from "@/app/hooks/useSearchModel"; // Corrected hook import
import Modal from "./Modal"; // Ensure this path is correct

const Search: React.FC = () => {
  const searchModal = useSearchModal(); // Hook inside the functional component

  return (
    <>
      <div className="flex items-center justify-between">
        <Modal
          isOpen={searchModal.isOpen}
          onClose={searchModal.onClose}
          onSubmit={() => {}} // Add an empty function or your desired action
          title="Filters"
          actionLabel="Search"
        />
      </div>
    </>
  );
};

export default Search;
