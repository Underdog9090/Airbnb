"use client";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";
import Categories from "./Categories";
import getCurrentUser from "@/app/actions/currentUser";
import { useSession } from "next-auth/react";

interface NavbarProps {
    currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
}) => {
    const session = useSession();
     console.log(session);
     const currentUser = session.data?.user;
    //  console.log(currentUser2);
    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className="py-4 border-b-[1px]"> 
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <UserMenu  currentUser = {currentUser}/>
                    </div>
                </Container>
            </div>
            <Categories/>
        </div>
    );
};

export default Navbar;
