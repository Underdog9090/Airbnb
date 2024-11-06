"use client";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModel from "../../hooks/useRegisterModel";
import useLogInModal from "../../hooks/userLogInModel"; // Fixed import typo
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import useRentModal from "../../hooks/useRentModal";
import { useRouter } from "next/navigation";



interface UserMenuProps {
  currentUser?: any | null;
}

export default function UserMenu({ currentUser }: UserMenuProps) {
  const registerModal = useRegisterModel();
  const logInModal = useLogInModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onRent = useCallback(() => {
    if(!currentUser) {
      return logInModal.onOpen();
    }
    rentModal.onOpen();
  }, [currentUser, logInModal, rentModal]);
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Hyr ut ditt boende
        </div>
        <div
          onClick={toggleOpen} // Fixed unnecessary parentheses
          className="p-4 md:py-1 md:py-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem onClick={() => router.push("/trips")} label="My trips" />
                <MenuItem onClick={() => {}} label="Mina favoriter" />
                <MenuItem onClick={() => {}} label="My reservations" />
                <MenuItem onClick={() => {}} label="My properties" />
                <MenuItem onClick={rentModal.onOpen} label="My home" />
                <hr />
                <MenuItem onClick={() => signOut()} label="Log out" />
              </>
            ) : (
              <>
                <MenuItem onClick={registerModal.onOpen} label="Bli medlem" />
                <MenuItem onClick={logInModal.onOpen} label="Logga in" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
