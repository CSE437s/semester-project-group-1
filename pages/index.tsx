import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DndProvider } from "react-dnd";
import { Input } from "@/components/ui/input";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import FlightStore from "@/components/FlightStore";
import FlightStoreMobile from "@/components/FlightStoreMobile";

import { FlightRequestForm } from "@/components/FlightRequestForm";
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
import { FlightOption } from "@/lib/availability-types";

export const dynamic = "force-dynamic"; // TODO: this was here for a reason, figure out why

export default function Home() {
  const sb = useSupabaseClient();
  const user: User | null = useUser();
  const router = useRouter();

  const [gotFlights, setGotFlights] = useState(false);
  const [savedFlights, setSavedFlights] = useState<any>();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FlightOption[] | undefined>();

  const [screen, setScreen] = useState(1001);
  useEffect(() => {
    window.addEventListener("resize", () => setScreen(window.innerWidth));
    setScreen(window.innerWidth);
  }, []);

  const [page, setPage] = useState("input");

  const ref = useRef<any>(null);

  const handleLogout = async () => {
    await sb.auth.signOut();
    await router.push("/login");
  };

  const changePage = async (pageToChangeTo: string) => {
    await router.push("/" + pageToChangeTo);
  };

  function renderInput() {
    return (
      <>
        <div className="flex flex-row justify-center items-center h-[80vh] -m-10">
          <FlightRequestForm
            setData={setData}
            setLoading={setLoading}
            reference={ref}
          />
        </div>
        {/* <div className="flex flex-row p-3 w-[80vw] items-center justify-center">
          {data !== undefined &&
            data.data.map((item, idx) => {
              return (
                <div key={idx} className="flex flex-col p-3 m-3">
                  <p>Flight: {idx + 1}</p>
                  <p>{item.Date}</p>
                  <p>
                    {item.Route.OriginAirport} to{" "}
                    {item.Route.DestinationAirport}
                  </p>
                  <p>{getMinCost(item)}</p>
                </div>
              );
            })}
          {loading && <p>Loading...</p>}
        </div> */}
        {/* TODO make the cards consume the data from search */}
        <div ref={ref}>
          <div className="flex justify-center text-[#ee6c4d] font-bold text-xl">
            {loading && <div>Loading...</div>}
          </div>
          {data !== undefined ? (
            screen >= 1000 ? (
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
        let flights = await sb
          .from("saved_flights")
          .select("flight_id")
          .eq("user_id", user.id);
        console.log(flights);
        setSavedFlights(flights);
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
              {user == null ? "JD" : user.email?.substring(0, 2).toUpperCase()}
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

  function renderDragCards(data: FlightOptions) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row justify-center h-auto -m-10">
          <FlightStore data={data} />
        </div>
      </DndProvider>
    );
  }

  function renderMobileCards(data: FlightOptions) {
    return (
      <div>
        <FlightStoreMobile data={data} />
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
        <Avatar onClick={() => changePage("profile")}>
          <AvatarFallback className="bg-[#ee6c4d] cursor-pointer p-1 rounded-full text-white hover:bg-black hover:text-white transition-all text-sm">
            {user == null ? "JD" : user.email?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      {page == "input"
        ? renderInput()
        : page == "query"
        ? renderQuery()
        : page == "saved"
        ? renderSaved()
        : renderProfile()}

      {/* <div className="flex flex-row justify-center items-center h-[80vh] -m-10">
        <FlightRequestForm setData={setData} setLoading={setLoading} />
      </div>
      <div className="flex flex-row p-3 w-[80vw] items-center justify-center">
        {data !== undefined &&
          data.data.map((item, idx) => {
            return (
              <div key={idx} className="flex flex-col p-3 m-3">
                <p>Flight: {idx + 1}</p>
                <p>{item.Date}</p>
                <p>
                  {item.Route.OriginAirport} to {item.Route.DestinationAirport}
                </p>
                <p>{getMinCost(item)}</p>
              </div>
            );
          })}
        {loading && <p>Loading...</p>}
        </div> */}
    </div>
  );
}
