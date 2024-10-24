"use client";
import { IconType } from "react-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string"; 

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean; 
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ label, selected, icon: Icon }) => {
  const router = useRouter(); 
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    const currentQuery = params ? qs.parse(params.toString()) : {};

    // Update query with selected category
    const updatedQuery: { [key: string]: string | undefined } = {
      ...currentQuery,
      category: label.toLowerCase(),
    };

    // If the category is already selected, remove it from the query
    if (params?.get('category') === label.toLowerCase()) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl({
      url: "/",
      query: updatedQuery,
    }, {
      skipEmptyString: true,
      skipNull: true,
    });

    router.push(url);
  }, [label, router, params]);

  return (
    <div
      onClick={handleClick} // Only one onClick handler here
      className={`
        flex
        flex-col
        items-center
        justify-center
        gap-2
        p-3
        border-2
        cursor-pointer
        transition
        ${selected ? 'border-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
      `}
    >
      <Icon size={26} />
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
};

export default CategoryBox;

