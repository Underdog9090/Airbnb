"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
}) => {
  return (
    <div className="w-full relative mb-6">
      {formatPrice && (
        <BiDollar
          size={18} // Smaller icon size
          className="text-neutral-700 absolute top-3 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" "
        type={type}
        className={`
          peer
          w-full
          px-3
          py-4
          pt-6
          font-light
          bg-gray-50
          border-2
          rounded-lg
          outline-none
          transition-all
          duration-300
          shadow-sm
          disabled:opacity-70
          disabled:cursor-not-allowed
          focus:ring-2
          focus:ring-indigo-500
          hover:shadow-md
          ${formatPrice ? "pl-12" : "pl-4"}
          ${errors[id] ? "border-red-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-red-500" : "focus:border-indigo-500"}
        `}
      />
      <label
        className={`
          absolute
          text-md
          transition-all
          duration-150
          transform
          -translate-y-3
          top-5
          z-10
          origin-[0]
          ${formatPrice ? "left-12" : "left-4"}
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-red-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
      {errors[id] && (
        <p className="text-red-500 text-sm mt-1 animate-pulse">
          {(errors[id] as any)?.message || "This field is required"}
        </p>
      )}
    </div>
  );
};

export default Input;
