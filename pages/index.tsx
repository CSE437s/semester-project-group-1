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
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic"; // TODO: this was here for a reason, figure out why

export default function Home() {
  const sb = useSupabaseClient();
  const user: User | null = useUser();
  const router = useRouter();

  const [expanded, setExpanded] = useState(true);
  const [queryExpanded, setQueryExpanded] = useState(true);

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

  type EmbeddingSearchResponse = {
    iata: string;
    id: number;
    similarity: number;
  }

  const getQueryEmbedding = async (query: string) => {
    // fetch to 'get-embedding' endpoint
    const res = await fetch('/api/get-embedding', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  }

  const trimEmbedding = (embedding: number[]) => {
    return embedding.slice(0, 512);
  }

  const handleSubmitQuery = async () => {
    setQueryLoading(true);

    const res: CreateEmbeddingResponse = await getQueryEmbedding(queryValue);
    if (!res.data || res.data.length === 0) {
      console.error('Error fetching embedding', res)
      setQueryLoading(false)
      return
    }
    const embedding = trimEmbedding(res.data[0].embedding)

    const { data: documents } = await sb.rpc('match_documents', {
      query_embedding: embedding, // Pass the embedding you want to compare
      match_threshold: 0.3, // Choose an appropriate threshold for your data
      match_count: 10, // Choose the number of matches
    }) as { data: EmbeddingSearchResponse[] }

    console.log(documents)

    // fetch flights for the top 3 matches
    const TOP = 7
    const fetchData: RequestFormData[] = documents.slice(0, TOP).map((doc) => {
      const today1am = new Date()
      const tomorrow11pm = new Date()
      tomorrow11pm.setDate(tomorrow11pm.getDate() + 1)
      today1am.setHours(0, 0, 0, 0)
      tomorrow11pm.setHours(23, 59, 59, 999)

      console.log(today1am, tomorrow11pm)

      return {
        outboundAirportCode: "ORD",
        inboundAirportCode: doc.iata,
        beginRangeSearch: today1am,
        endRangeSearch: tomorrow11pm,
      }
    })

    console.log(fetchData)

    const flightData = await Promise.all(fetchData.map(async (data) => {
      return fetchFlights(data)
    }))

    console.log(flightData)

    // squash down and set queryData
    setQueryData(flightData.flat())
    setQueryLoading(false)
    setQueryValue("")
  }

  function renderInput() {
    return (
      <>
        { expanded && (<>
          <div className="text-center text-2xl my-3 font-bold px-20 text-white overflow-y-hidden">
          Search for one-way flights
        </div>
        <div className="text-center text-md my-3 font-normal px-20 text-white overflow-y-hidden">
          Find one way flights to a destination within a date range. Save
          flights for later to your profile.
        </div>
        </>)}
        
        <div className="px-[50px] my-10">
          <div className="md:flex md:justify-center md:items-center">
            <FlightRequestForm
              setData={setData}
              setLoading={setLoading}
              reference={ref}
              expanded={expanded}
              setExpanded={setExpanded}
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
          {queryExpanded && (<>
            <div className="text-center font-bold text-[#fafafa] text-2xl w-[400px] my-5">
              Write a query to search up flights
            </div>
            <div className="text-center font-normal text-[#fafafa] w-[400px] my-5">
              If you don't know where to go, you can write any query to search for
              flights. Our query uses an AI language model to translate any valid
              request into a flight searching extravaganza. For the moment, we have this set to assume you are leaving O'Hare in Chicago
              mode -- it will search for flights from ORD to anywhere in the US, for today.
            </div>
          </>)}
          <Input
            className="max-w-[400px] bg-[#fafafa] text-black mb-2"
            type="text"
            placeholder="Write query here"
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitQuery();
                setQueryExpanded(false);
              }
            }}
          ></Input>
        </div>
      </>
    );
  }

  function renderSaved() {
    return (
      <>
        {/* TODO make api calls for all flights from db to get information with te flights in savedFlights */}

        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Saved Flights</h1>
          <div className="text-center font-normal text-[#fafafa] w-[400px] my-5">
            Due to the nature of airline points and flights, flight information
            changes all the time. Flight prices might be higher or lower
            depending on when you last viewed them. Thus, make sure to
            periodically check this page for the most up to date information
            regarding your saved flights.
          </div>
          <SavedFlights device={!isMobile ? "desktop" : "mobile"} />
        </div>
      </>
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
      <Toaster />
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
          <DropdownMenuContent className="w-56 bg-black rounded-md shadow-lg">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-sm text-white font-normal"
              disabled
            >
              {user !== null ? user.email : ""}
            </DropdownMenuItem>
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
        : renderSaved()}
    </div>
  );
}
