import { FlightOption, FlightOptionWIndex } from "@/lib/availability-types";
import React, { useEffect, useState } from "react";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { Device } from "@/lib/types";
import { DropdownMenuRadioGroupWithOptions } from "./ui/DropdownMenuRadioGroup";
import FlightCard from "./FlightCard";
import { ItemTypes } from "./Constants";
import { useDrop } from "react-dnd";

type Props = {
  data: FlightOption[];
  device: Device;
};

function FlightStore(props: Props) {
  const SORT_METHODS = {
    PRICE: "PRICE",
    DURATION: "DURATION",
    STOPS: "STOPS",
  };

  const [board, setBoard] = useState<FlightOption[] | []>([]);
  const sb = useSupabaseClient();
  const user: User | null = useUser();

  const [sortMethod, setSortMethod] = useState(SORT_METHODS.PRICE);
  const [numFlightsToReturn, setNumFlightsToReturn] = useState(8); // TODO: enforce this number by screen size?
  // Could also implement a "show more" button

  useEffect(() => {
    async function getData() {
      if (user != null) {
        console.log("ping sb");
        const { data } = await sb
          .from("saved_flights")
          .select("flight_id")
          .eq("user_id", user.id);

        // Add all matching flight IDs to board
        if (data !== null) {
          const matchingFlights = props.data.filter((flight) =>
            data.some((item) => item.flight_id === flight.ID)
          );
          setBoard(matchingFlights);
        }
      }
    }

    getData();
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: any) => {
      saveFlight(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const FlightList: FlightOptionWIndex[] = props.data.map((item, idx) => ({
    ...item,
    idx: idx,
  }));

  const saveFlight = async (flight: FlightOption) => {
    setBoard((board) => [...board, flight]);
    if (user !== null) {
      await sb.from("saved_flights").insert({
        flight_id: flight.ID,
        availability_id: flight.AvailabilityID,
        user_id: user.id,
      });
    }
  };

  const deleteSavedFlight = async (flight: FlightOption) => {
    setBoard((board) => board.filter((item) => item.ID !== flight.ID));
    if (user !== null) {
      await sb
        .from("saved_flights")
        .delete()
        .match({ flight_id: flight.ID, user_id: user.id });
    }
  };

  const cardGridLaptopClasses =
    "flex flex-row justify-center flex-wrap max-w-[900px]";
  const cardGridMobileClasses = "flex  items-center justify-center flex-col";

  const boardMobileClasses =
    "w-[80vw] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-col flex-nowrap overflow-y-scroll   overflow-x-hidden h-auto justify-center bg-[#2c2c2c]";
  const boardLaptopClasses =
    "max-w-[800px] min-h-[200px] min-w-[800px] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-row flex-nowrap overflow-y-hidden overflow-x-scroll h-auto justify-start bg-[#2c2c2c]";

  return (
    <div className="flex flex-col mb-10 no-scrollbar overflow-y-hidden">
      <div className="flex flex-row justify-between mx-[10vw] mt-10 overflow-y-hidden">
        <p className="text-center text-lg my-3 font-bold text-[#ee6c4d] overflow-y-hidden">
          Flight Results
        </p>
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

      <div
        className={
          props.device == "desktop"
            ? cardGridLaptopClasses
            : cardGridMobileClasses
        }
      >
        {FlightList.sort((a, b) => {
          if (sortMethod === SORT_METHODS.PRICE) {
            return a.MileageCost - b.MileageCost;
          } else if (sortMethod === SORT_METHODS.DURATION) {
            return a.TotalDuration - b.TotalDuration;
          } else {
            return a.Stops - b.Stops;
          }
        })
          .slice(0, numFlightsToReturn)
          .map((flight) => {
            // Only show flights that are not already saved
            if (!board.some((savedFlight) => savedFlight.ID === flight.ID)) {
              return (
                <FlightCard
                  key={flight.idx}
                  description="description"
                  title="title"
                  item={flight}
                  handleRemove={deleteSavedFlight}
                  addToBoard={saveFlight}
                  isSaved={false}
                  isDraggable={props.device === "desktop"}
                  device={props.device == "desktop" ? "desktop" : "mobile"}
                />
              );
            }
          })}
      </div>
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d] overflow-y-hidden">
        Drag any flights below to save them for later
      </div>
      <div className="flex flex-row justify-center overflow-y-hidden">
        <div
          className={
            props.device == "desktop" ? boardLaptopClasses : boardMobileClasses
          }
          ref={drop}
        >
          {board.map((flight) => {
            return (
              <FlightCard
                key={flight.ID}
                description={"description"}
                title={"title"}
                item={flight}
                isSaved={true}
                isDraggable={props.device === "desktop"}
                addToBoard={saveFlight}
                handleRemove={deleteSavedFlight}
                device={props.device == "desktop" ? "desktop" : "mobile"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlightStore;
