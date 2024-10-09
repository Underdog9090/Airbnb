"use client";
import { IconType } from "react-icons"; 

interface ButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    label: string;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;  // Use IconType instead of React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    label,
    disabled,
    outline,
    small,
    icon: Icon, // This is now of type IconType
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
            ${outline ? "bg-white" : "bg-rose-500"}
            ${outline ? "border-black" : "border-rose-500"}
            ${outline ? "text-black" : "text-white"}
            ${small ? "py-1" : "py-3"}
            ${small ? "text-sm" : "text-md"}
            ${small ? "font-light" : "font-semibold"}
            ${small ? "border-[1px]" : "border-[2px]"}
            rounded-lg
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            hover:opacity-80
            transition
            w-full
            `}
        >
            {Icon && (
                <Icon
                    className="
                    absolute
                    left-4
                    top-3
                    "
                    size={24} // size prop is now valid because IconType guarantees it's a valid component
                />
            )}
            {label}
        </button>
    );
};

export default Button;
