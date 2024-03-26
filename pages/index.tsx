import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DndProvider } from "react-dnd";
import { FlightOption } from "@/lib/availability-types";
import { FlightRequestForm } from "@/components/FlightRequestForm";
import FlightStore from "@/components/FlightStore";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Input } from "@/components/ui/input";
import SavedFlights from "@/components/SavedFlights";
import { StoredFlightData } from "@/lib/route-types";
import { useIsMobile } from "@/lib/utils";
import { useRouter } from "next/router";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic"; // TODO: this was here for a reason, figure out why

export default function Home() {
  const sb = useSupabaseClient();
  const user: User | null = useUser();
  const router = useRouter();

  const [gotFlights, setGotFlights] = useState(false);
  const [savedFlights, setSavedFlights] = useState<StoredFlightData[]>([]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FlightOption[] | undefined>();

  // const [screen, setScreen] = useState(1001);
  const isMobile = useIsMobile(680);
  // useEffect(() => {
  //   window.addEventListener("resize", () => setScreen(window.innerWidth));
  //   setScreen(window.innerWidth);
  // }, []);

  const [page, setPage] = useState("input");

  const ref = useRef<any>(null);

  const handleLogout = async () => {
    await sb.auth.signOut();
    await router.push("/login");
  };

  const changePage = async (pageToChangeTo: string) => {
    await router.push("/" + pageToChangeTo);
  };

  // midnight today
  const date1 = new Date();
  date1.setHours(0, 0, 0, 0);
  const date2 = new Date();
  date2.setHours(23, 59, 59, 999);

  function renderInput() {
    return (
      <>
        <div className="text-center text-2xl my-3 font-bold px-20 text-white overflow-y-hidden">
          Search for one-way flights
        </div>
        <div className="text-center text-md my-3 font-normal px-20 text-white overflow-y-hidden">
          Find one way flights to a destination within a date range. Save
          flights for later to your profile.
        </div>
        <div className="px-[50px] my-10">
          <div className="lg:flex lg:justify-center lg:items-center">
            <FlightRequestForm
              setData={setData}
              setLoading={setLoading}
              reference={ref}
            />
          </div>
        </div>
        <div ref={ref}>
          <div className="flex justify-center text-[#ee6c4d] font-bold text-xl">
            {loading && <div>Loading...</div>}
          </div>
          {data !== undefined ? (
            !isMobile ? (
              renderDragCards(data)
            ) : (
              renderMobileCards(data)
            )
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }

  function renderQuery() {
    return (
      <>
        {/* TODO make querys work */}
        <div className="flex flex-col items-center">
          <div className="text-center font-bold text-[#fafafa] text-2xl w-[400px] my-5">
            Write a query to search up flights
          </div>
          <div className="text-center font-normal text-[#fafafa] w-[400px] my-5">
            If you don't know where to go, you can write any query to search for
            flights. Our query uses an AI language model to translate any valid
            request into a flight searching extravaganza.
          </div>
          <Input
            className="max-w-[400px] bg-[#fafafa] text-black "
            type="text"
            placeholder="Write query here"
          ></Input>
        </div>
      </>
    );
  }

  function renderSaved() {
    async function getSavedFlights() {
      if (user != null) {
        const flights = await sb
          .from("saved_flights")
          .select("availability_id, flight_id")
          .eq("user_id", user.id);
        console.log("FLIGHTS", flights);
        setSavedFlights(flights.data as StoredFlightData[]); // TODO: un jank this
        setGotFlights(true);
      }
    }
    if (!gotFlights) {
      getSavedFlights();
    }

    return (
      <>
        {/* TODO make api calls for all flights from db to get information with te flights in savedFlights */}

        <div className="flex flex-col items-center">
          <div className="text-center font-bold text-[#fafafa] text-2xl w-[400px] my-5">
            See your saved flights here
          </div>
          <div className="text-center font-normal text-[#fafafa] w-[400px] my-5">
            Due to the nature of airline points and flights, flight information
            changes all the time. Flight prices might be higher or lower
            depending on when you last viewed them. Thus, make sure to
            periodically check this page for the most up to date information
            regarding your saved flights.
          </div>
          <SavedFlights
            device={!isMobile ? "desktop" : "mobile"}
            flights={savedFlights}
            setSavedFlights={setSavedFlights}
          />
        </div>
      </>
    );
  }

  function renderProfile() {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row items-center justify-center w-[40vw] my-5">
          <Avatar>
            <AvatarFallback className="bg-cyan-200 transition-all rounded-full text-white">
              {user == null ? "" : user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-row  items-center w-[40vw] justify-center text-md my-5">
          {user == null ? "user@email.com" : user.email}
        </div>
        <div className="flex flex-row items-center w-[40vw] justify-center text-md my-5">
          <div>Your saved flights</div>
        </div>
        <div className="flex flex-row items-center w-[40vw] justify-center text-md my-5">
          <Button onClick={() => handleLogout()}>Log out</Button>
        </div>
      </div>
    );
  }

  function renderDragCards(data: FlightOption[]) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row justify-center h-auto -m-10">
          <FlightStore data={data} device="desktop" />
        </div>
      </DndProvider>
    );
  }

  function renderMobileCards(data: FlightOption[]) {
    return (
      <div>
        <DndProvider backend={HTML5Backend}>
          <FlightStore data={data} device="mobile" />
        </DndProvider>
      </div>
    );
  }

  return (
    <div className="bg-[#1f1b24] text-[#fafafa] overflow-x-hidden w-screen max-w-[100vw] min-h-[100vh] flex flex-col  relative">
      <div className="flex m-5 flex-col justify-center items-center min-[1000px]:space-x-14 w-full min-[1000px]:flex-row text-xs min-[1000px]:text-sm">
        <div className="text-white font-bold text-lg">
          Fli<span className="text-cyan-300">ghts</span>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem
              className={`hover:bg-slate-200 hover:text-black transition-all cursor-pointer p-2 rounded-md
                ${page == "input" ? "text-[#ee6c4d]" : "text-white"}
                `}
              onClick={() => setPage("input")}
            >
              Input Search
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`hover:bg-slate-200 hover:text-black transition-all cursor-pointer p-2 rounded-md
              ${page == "query" ? "text-[#ee6c4d]" : "text-white"}
              `}
              onClick={() => setPage("query")}
            >
              Query Search
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`hover:bg-slate-200 hover:text-black transition-all cursor-pointer p-2 rounded-md
              ${page == "saved" ? "text-[#ee6c4d]" : "text-white"}
              `}
              onClick={() => setPage("saved")}
            >
              Saved Flights
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback className="bg-[#ee6c4d] cursor-pointer p-1 rounded-full text-white hover:bg-black hover:text-white transition-all text-sm">
                {user === null ? "" : user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem className="text-sm text-white font-normal" disabled>
              {user !== null ? user.email : ""}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      {page == "input"
        ? renderInput()
        : page == "query"
          ? renderQuery()
          : page == "saved"
            ? renderSaved()
            : renderProfile()}
    </div>
  );
}
