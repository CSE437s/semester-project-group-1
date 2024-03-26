import { FlightOption, FlightOptionWIndex } from "@/lib/availability-types";
import React, { useEffect, useState } from "react";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Device } from "@/lib/types";
import { DropdownMenuRadioGroupWithOptions } from "./ui/DropdownMenuRadioGroup";
import FlightCard from "./FlightCard";
import { ItemTypes } from "./Constants";
import { useDrop } from "react-dnd";
import FadeIn from "react-fade-in";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FlightFilterPopover } from "./FlightFilterPopover";

type Props = {
  data: FlightOption[];
  device: Device;
};

enum SORT_METHODS {
  PRICE = "PRICE",
  DURATION = "DURATION",
  STOPS = "STOPS",
};

function FlightStore(props: Props) {

  const [board, setBoard] = useState<FlightOption[] | []>([]);
  const sb = useSupabaseClient();
  const user: User | null = useUser();

  const [sortMethod, setSortMethod] = useState(SORT_METHODS.PRICE);
  const [numFlightsToReturn, setNumFlightsToReturn] = useState(6); // TODO: enforce this number by screen size?
  // Could also implement a "show more" button

  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    async function getData() {
      if (user != null) {
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

  useEffect(() => {
    setDragging(false);
  }, [board.length]);

  const FlightList: FlightOptionWIndex[] = props.data.map((item, idx) => ({
    ...item,
    idx: idx,
  }));

  const saveFlight = async (flight: FlightOption) => {
    // Check if flight has already departed
    if (new Date(flight.DepartsAt).getTime() < new Date().getTime()) {
      toast.warning("Sorry, this flight has already departed. Try searching availability on a different day!");
      return;
    }
    setBoard((board) => [...board, flight]);
    if (user !== null) {

      const { error } = await sb.from("saved_flights").insert({
        flight_id: flight.ID,
        availability_id: flight.AvailabilityID,
        user_id: user.id,
        departure: flight.DepartsAt,
      });
      if (error) {
        console.error("Error saving flight", error);
      } else {
        toast("Saved flight to profile", {});
        console.log("Saved flight", flight.ID, flight.DepartsAt);
      }
    }
  };

  const deleteSavedFlight = async (flight: FlightOption) => {
    setBoard((board) => board.filter((item) => item.ID !== flight.ID));
    if (user !== null) {
      await sb
        .from("saved_flights")
        .delete()
        .match({ flight_id: flight.ID, user_id: user.id });
      toast("Deleted flight from profile");
    }
  };

  const cardGridLaptopClasses =
    "flex flex-row justify-center flex-wrap max-w-[900px]";
  const cardGridMobileClasses = "flex  items-center justify-center flex-col";

  const boardMobileClasses =
    "w-[80vw] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-col flex-nowrap overflow-y-scroll   overflow-x-hidden h-auto justify-center bg-[#2c2c2c]";
  const boardLaptopClasses =
    "max-w-[800px] min-h-[200px] cursor-pointer relative min-w-[800px] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-row flex-nowrap overflow-y-hidden overflow-x-scroll h-auto justify-start bg-[#2c2c2c]";

  return (
    <div className="flex flex-col mb-10 no-scrollbar overflow-y-hidden">
      {dragging ? (
        <FadeIn transitionDuration={100}>
          {/* <div
            ref={drop}
            className="hover:bg-black/100 z-20 rounded-t-[60px] fixed h-[45vh] w-[100vw] top-[55vh] right-0 bg-black/75 flex justify-center items-center text-[#ee6c4d] font-bold text-2xl"
          >
            Drop flight here to save it for later!
          </div> */}
          <Drawer open={dragging}>
            <DrawerContent ref={drop}>
              <div className="mx-auto w-full max-w-sm h-[35vh] flex justify-center items-center text-[#ee6c4d] font-bold text-2xl">
                <div className="text-center">Bookmark Flight</div>
              </div>
            </DrawerContent>
          </Drawer>
        </FadeIn>
      ) : (
        <></>
      )}
      <div className="flex flex-row justify-between mx-[10vw] mt-10 overflow-y-hidden">
        <p className="text-center text-lg my-3 font-bold text-[#ee6c4d] overflow-y-hidden">
          Flight Results
        </p>
        <FlightFilterPopover
          options={Object.values(SORT_METHODS).map((method) => ({
            value: method,
            label: method.slice(0, 1).toUpperCase() + method.slice(1).toLowerCase()
          }))}
          selectedSort={sortMethod}
          setSelectedSort={setSortMethod}
          results={numFlightsToReturn}
          setResults={setNumFlightsToReturn}
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
                  setCurrentlyDragging={setDragging}
                  isDraggable={props.device === "desktop"}
                  device={props.device == "desktop" ? "desktop" : "mobile"}
                />
              );
            }
          })}
      </div>
      {FlightList.length > numFlightsToReturn && (
        <div className="flex flex-row justify-center mt-5">
          <Button className="bg-white text-black hover:bg-black hover:text-white hover:cursor-pointer" 
          onClick={() => setNumFlightsToReturn(numFlightsToReturn + 6)}>Show More</Button>
        </div>
      )}
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d] overflow-y-hidden">
        Current saved flights for this search
      </div>
      <div className="flex flex-row justify-center overflow-y-hidden relative">
        {board.length > 2 && props.device == "desktop" ? (
          <div className="z-10 absolute top-[85px] right-20">
            <Button className="bg-black/75 rounded-full hover:cursor-default hover:bg-black/75">
              {">"}
            </Button>{" "}
          </div>
        ) : (
          <></>
        )}
        <div
          className={
            props.device == "desktop" ? boardLaptopClasses : boardMobileClasses
          }
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
export { SORT_METHODS }
export default FlightStore;
