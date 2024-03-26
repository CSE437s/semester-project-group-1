import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { FlightRequestForm } from "@/components/FlightRequestForm";
import { FlightResponseData } from "@/lib/route-types";
import Navbar from "@/components/Navbar";
import { getMinCost } from "@/lib/utils";
import { useRouter } from "next/router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic"; // TODO: this was here for a reason, figure out why

export default function Home() {
  const sb = useSupabaseClient();
  const user: User | null = useUser();
  const router = useRouter();
  const [logOut, setLogOut] = useState(false);

  if (user == null) {
    router.push("/login");
  }

  const handleLogout = async () => {
    setLogOut(true);
    await router.push("/login");
    await sb.auth.signOut();
  };

  const changePage = async (pageToChangeTo: string) => {
    await router.push("/" + pageToChangeTo);
  };

  return (
    <div className="bg-[#1f1b24] text-[#fafafa] h-screen">
      <div className=" flex flex-col justify-center items-center">
        <div className="flex flex-row items-center justify-between space-x-2.5 w-[30vw] my-5 text-lg">
          <Button
            className="bg-white rounded-full hover:bg-slate-400 transition-all"
            onClick={() => changePage("")}
          >
            &#8592;
          </Button>
          <div>Profile</div>
          <Avatar>
            <AvatarFallback className="bg-[#ee6c4d] transition-all rounded-full text-white">
              {user == null ? "JD" : user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-row  items-center w-[40vw] justify-center text-md my-5">
          {user == null ? "user@email.com" : user.email}
        </div>
        <div className="flex flex-row items-center w-[40vw] justify-center text-md my-5">
          <Button onClick={() => handleLogout()}>Log out</Button>
        </div>
        <div className="flex flex-row items-center w-[40vw] justify-center text-md my-5">
          {logOut ? <div>Logging out...</div> : <></>}
        </div>
      </div>
    </div>
  );
}
