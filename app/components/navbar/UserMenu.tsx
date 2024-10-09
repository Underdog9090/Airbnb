"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModel from "../../hooks/useRegisterModel";
import useLogInModal from "../../hooks/userLogInModel";

export default function UserMenu() {
    const registerModal = useRegisterModel();
    const logInModal = useLogInModal();
    const [isOpen, setIsOpen] = useState(false);


    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);
    return (
        <div className="relative">
            <div className="
            flex
            flex-row
            items-center
            gap-3
            ">
                <div onClick={() => {}}
                    className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    cursor-pointer">
                        Hyr ut ditt boende
                </div>
                <div onClick={(toggleOpen)}
                    className="
                    p-4
                    md:py-1
                    md:py-2
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                    ">
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar/>

                    </div>
                </div>

            </div>
            {isOpen && (
                <div className="
                absolute
                rounded-xl
                w-[40vw]
                md:w-3/4
                bg-white
                overflow-hidden
                right-0
                top-12
                text-sm
                ">
                    <div 
                        className="
                        flex
                        flex-col
                        cursor-pointer
                        ">
                            <>
                            <MenuItem
                            onClick={(registerModal.onOpen)}
                            label="Bli medlem"
                            />
                                 <MenuItem
                            onClick={(logInModal.onOpen)}
                            label="Logga in"
                            />
                                 <MenuItem
                            onClick={() => {}}
                            label="Presentkort"
                            />
                                 <MenuItem
                            onClick={() => {}}
                            label="Hyr ut ditt boende"
                            />
                                 <MenuItem
                            onClick={() => {}}
                            label="Var värd fär en upplevelse"
                            />
                                 <MenuItem
                            onClick={() => {}}
                            label="Hjälp center"
                            />
                            </>
                          
                    </div>
                    
                   
                </div>
            )}
        </div>
    );
}