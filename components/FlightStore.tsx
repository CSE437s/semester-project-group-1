import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useState, useEffect } from "react";
import FlightCard from "./FlightCard";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./Constants";
import { FlightResponseData } from "@/lib/route-types";

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
  {
    id: 4,
    title: "Card 4",
    description: "Description of card 4",
  },
  {
    id: 5,
    title: "Card 5",
    description: "Description of card 5",
  },
  {
    id: 6,
    title: "Card 5",
    description: "Description of card 5",
  },
  {
    id: 7,
    title: "Card 5",
    description: "Description of card 5",
  },
];

// cards added to board should be removed from card list.
// don't need to keep trakc of cards added, but if you press x they should be removed from saved

type Props = {
  data: FlightResponseData;
};

function FlightStore(props: Props) {
  const [board, setBoard] = useState<any[] | []>([]);
  const sb = useSupabaseClient();
  const user: User | null = useUser();

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

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: any) => addCardToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const FlightList = props.data.data.map((item, idx) => ({
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
    <div className="flex flex-col mb-10 no-scrollbar">
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d]">
        Flight Results
      </div>
      <div className="flex flex-row justify-center flex-wrap max-w-[800px]">
        {/* {CardList.map((card) => {
          console.log(props.data.data);
          console.log(Flightlist);
          return (
            <FlightCard
              description={card.description}
              title={card.title}
              id={card.id}
              handleRemove={handleRemove}
              x={false}
            />
          );
        })} */}
        {FlightList.map((flight) => {
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
