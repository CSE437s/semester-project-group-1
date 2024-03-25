import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useState, useEffect, useRef } from "react";
import FlightCardMobile from "./FlightCardMobile";
import { FlightResponseData } from "@/lib/route-types";
import { FlightOption } from "@/lib/availability-types";

// TODO
// These cards are flight cards and should be pulled from the flights that the user searches for
const CardList = [
  {
    id: 1,
    title: "Card 1",
    description: "Description of card 1",
  },
  {
    id: 2,
    title: "Card 2",
    description: "Description of card 2",
  },
  {
    id: 3,
    title: "Card 3",
    description: "Description of card 3",
  },
];

// cards added to board should be removed from card list.
// don't need to keep trakc of cards added, but if you press x they should be removed from saved

type Props = {
  data: FlightOption[];
};

function FlightStoreMobile(props: Props) {
  const [board, setBoard] = useState<any[] | []>([]);
  const sb = useSupabaseClient();
  const user: User | null = useUser();

  const ref = useRef<any>(null);

  useEffect(() => {
    async function getData() {
      if (user != null) {
        let data = await sb
          .from("saved_flights")
          .select("flight_id")
          .eq("user_id", user.id);
        // console.log(data);
      }
      // TODO
      // Potentially add flights to the board below, but need to make a request again for flights
    }

    getData();
    // console.log(user);
    // console.log(props.data.data);
  }, []);

  const FlightList = props.data.map((item, idx) => ({
    ...item,
    idx: idx,
  }));

  const handleRemove = async (id: any) => {
    const flightList: any = FlightList.filter(
      (flight: any) => id === flight.idx
    );
    setBoard(board.filter((flight) => flight.idx !== id));
    if (user !== null) {
      await sb
        .from("saved_flights")
        .delete()
        .match({ flight_id: flightList[0].ID, user_id: user.id });
    }
  };

  const addCardToBoard = async (id: any) => {
    const flightList: any = FlightList.filter(
      (flight: any) => id === flight.idx
    );
    setBoard((board) => [...board, flightList[0]]);
    if (user !== null) {
      await sb
        .from("saved_flights")
        .insert({ flight_id: flightList[0].ID, user_id: user.id });
    }
  };

  return (
    <div className="flex flex-col mb-10">
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d]">
        Flight Results
      </div>
      <div className="flex  items-center justify-center flex-col">
        {FlightList.map((flight) => {
          return (
            <FlightCardMobile
              description="description"
              title="title"
              id={flight.idx}
              item={flight}
              addCardToBoard={addCardToBoard}
              handleRemove={handleRemove}
              x={false}
              reference={ref}
            />
          );
        })}
      </div>
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d]">
        Flights currently saved for later
      </div>
      <div ref={ref} className="flex flex-row justify-center">
        <div className="w-[80vw] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-col flex-nowrap overflow-y-scroll   overflow-x-hidden h-auto justify-center bg-[#2c2c2c]">
          {board.map((flight) => {
            return (
              <FlightCardMobile
                description="description"
                title="title"
                id={flight.idx}
                item={flight}
                x={true}
                addCardToBoard={addCardToBoard}
                handleRemove={handleRemove}
                reference={ref}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlightStoreMobile;
