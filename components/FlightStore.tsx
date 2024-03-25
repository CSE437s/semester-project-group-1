import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FlightOption, FlightOptionWIndex } from "@/lib/availability-types";
import React, { useEffect, useState } from "react";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { DropdownMenuRadioGroupWithOptions } from "./ui/DropdownMenuRadioGroup";
import FlightCard from "./FlightCard";
import { ItemTypes } from "./Constants";
import { useDrop } from "react-dnd";

type Props = {
  data: FlightOption[];
};

function FlightStore(props: Props) {
  const [board, setBoard] = useState<any[] | []>([]);
  const sb = useSupabaseClient();
  const user: User | null = useUser();

  useEffect(() => {
    async function getData() {
      if (user != null) {
        const data = await sb
          .from("saved_flights")
          .select("flight_id")
          .eq("user_id", user.id);
      }
      // TODO
      // Potentially add flights to the board below, but need to make a request again for flights
    }

    getData();
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: any) => addCardToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const FlightList: FlightOptionWIndex[] = props.data.map((item, idx) => ({
    ...item,
    idx: idx,
  }));

  const handleRemove = async (id: number) => {
    const flightList: FlightOptionWIndex[] = FlightList.filter(
      (flight) => id === flight.idx
    );
    setBoard(board.filter((flight) => flight.idx !== id));
    if (user !== null) {
      await sb
        .from("saved_flights")
        .delete()
        .match({ flight_id: flightList[0].ID, user_id: user.id });
    }
  };

  const addCardToBoard = async (id: number) => {
    const flightList = FlightList.filter(
      (flight) => id === flight.idx
    );
    setBoard((board) => [...board, flightList[0]]);
    if (user !== null) {
      await sb
        .from("saved_flights")
        .insert({ flight_id: flightList[0].ID, user_id: user.id });
    }
  };

  const SORT_METHODS = {
    PRICE: "PRICE",
    DURATION: "DURATION",
    STOPS: "STOPS",
  };

  const [sortMethod, setSortMethod] = useState(SORT_METHODS.PRICE);
  const [numFlightsToReturn, setNumFlightsToReturn] = useState(8); // TODO: enforce this number by screen size?

  return (
    <div className="flex flex-col mb-10 no-scrollbar">
      <div className="flex flex-row justify-between mx-[10vw]">
        <p className="text-center text-lg my-3 font-bold text-[#ee6c4d]">Flight Results</p>
        <DropdownMenuRadioGroupWithOptions
        options={[
          { value: SORT_METHODS.PRICE, label: "Price" },
          { value: SORT_METHODS.DURATION, label: "Duration" },
          { value: SORT_METHODS.STOPS, label: "Stops" },
        ]}
        label="Sort by"
        selected={sortMethod}
        setSelected={setSortMethod}
      />
      </div>
      
      <div className="flex flex-row justify-center flex-wrap max-w-[90vw]">
        {FlightList.sort((a, b) => {
          if (sortMethod === SORT_METHODS.PRICE) {
            return a.MileageCost - b.MileageCost;
          } else if (sortMethod === SORT_METHODS.DURATION) {
            return a.TotalDuration - b.TotalDuration;
          } else {
            return a.Stops - b.Stops;
          }
        }).slice(0, numFlightsToReturn)
        .map((flight) => {
          return (
            <FlightCard
              key={flight.idx}
              description="description"
              title="title"
              id={flight.idx}
              item={flight}
              handleRemove={handleRemove}
              x={false}
            />
          );
        })}
      </div>
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d]">
        Drag any flights below to save them for later
      </div>
      <div className="flex flex-row justify-center">
        <div
          className="max-w-[800px] min-h-[200px] min-w-[800px] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-row flex-nowrap overflow-y-hidden   overflow-x-scroll h-auto justify-start bg-[#2c2c2c]"
          ref={drop}
        >
          {board.map((flight) => {
            return (
              <FlightCard
                key={flight.idx}
                description={"description"}
                title={"title"}
                item={flight}
                id={flight.idx}
                x={true}
                handleRemove={handleRemove}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlightStore;
