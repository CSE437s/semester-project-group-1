import { AvailabilitySegment, FlightOption } from "@/lib/availability-types";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "./ui/button";
import Image from "next/image";
import { ItemTypes } from "./Constants";
import svg from "../public/drag-handle.svg";
import { useDrag } from "react-dnd";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Update props
type Props = {
  item: FlightOption;
  description?: string;
  title?: string;
  isSaved: boolean;
  handleRemove: (flight: FlightOption) => void;
  isDraggable: boolean;
  device: string;
  addToBoard?: (flight: FlightOption) => void;
  setCurrentlyDragging?: any; // use state function
};

const getOriginAirport = (segments: AvailabilitySegment[]) => {
  return segments[0].OriginAirport;
};

const getDestinationAirport = (segments: AvailabilitySegment[]) => {
  return segments[segments.length - 1].DestinationAirport;
};

const getFlightNumbers = (item: FlightOption) => {
  const parseFlightNumsFromString = (flightNums: string): string[] => {
    return flightNums.split(",").map((num) => num.trim());
  };
  const flightNums = parseFlightNumsFromString(item.FlightNumbers);
  return `Flight #${flightNums.length > 1 ? "s" : ""}: ${flightNums.join(
    ", "
  )}`;
};

const getStops = (segments: AvailabilitySegment[]) => {
  return segments.length - 1;
};

const getFlightDuration = (segments: AvailabilitySegment[]) => {
  const firstDeparture = new Date(segments[0].DepartsAt);
  const lastArrival = new Date(segments[segments.length - 1].ArrivesAt);
  return (lastArrival.getTime() - firstDeparture.getTime()) / 60000;
};

const displayDuration = (duration: number) => {
  // if under an hour, display in minutes. Otherwise, display in hours and minutes
  if (duration < 60) {
    return `${duration} minutes`;
  } else {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return `${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minutes`;
  }
};

function FlightCard(props: Props) {
  const [showModal, setModal] = useState(false);
  const ref = useRef<any>(null);
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleClick2 = () => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  };

  const [{ isDragging }, drag] = !props.isDraggable
    ? [{ isDragging: false }, null]
    : useDrag(() => ({
        type: ItemTypes.CARD,
        item: props.item,
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));

  // const [dragging, setDragging] = useState(isDragging);

  // setDragging(isDragging)

  useEffect(() => {
    if (props.setCurrentlyDragging !== undefined) {
      props.setCurrentlyDragging(isDragging);
    }
  }, [isDragging]);

  const displayModal = (
    props: Props,
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    item: FlightOption
  ) => {
    return (
      <div className="z-40 drop-shadow-lg text-black h-[100vh] absolute top-0 left-0 flex justify-center items-center w-screen bg-slate-600/80 overflow-y-hidden">
        <div className="w-[50vw] h-[50vh] p-8 pb-10 border-solid b-1 border-slate-200 bg-white relative rounded-lg overflow-y-hidden">
          <div
            onClick={() => {
              setModal(false);
              handleClick2();
            }}
            className=" text-3xl cursor-pointer absolute top-0 right-2 bg-white pt-[2px] pb-[5px] px-[10px] transition-all rounded-full hover:bg-slate-200 overflow-y-hidden"
          >
            <div className="flex justify-center items-center overflow-y-hidden">
              <div className="text-3xl">x</div>
            </div>
          </div>
          <div className="text-base text-center font-normal overflow-y-hidden">
            Date: {item.DepartsAt}{" "}
          </div>
          <div className="text-base text-center font-normal overflow-y-hidden">
            From: {getOriginAirport(item.AvailabilitySegments)} to{" "}
            {getDestinationAirport(item.AvailabilitySegments)}
          </div>
          <div className="text-lg font-normal text-center mb-2 overflow-y-hidden">
            Flight Options
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-4 overflow-y-hidden">
            <div className="w-auto border-slate-400 border text-sm h-auto p-2 rounded-md">
              <div className="text-sm font-semibold">
                Airline: {item.Carriers}
              </div>
              <div className="text-sm font-normal">
                Direct Flight: {item.Stops === 0 ? "Yes" : "No"}
              </div>
              <div className="text-sm font-normal">
                Remaining Seats: {item.RemainingSeats}
              </div>
              <div className="text-sm font-normal">
                Points: {item.MileageCost}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const cardInGridClasses =
    "z-0 relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg w-[250px] h-auto p-4 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-col justify-start text-black";
  const cardInBoardClasses =
    "z-0 relative bg-[#fafafa] overflow-y-hidden drop-shadow-md  transition-all  rounded-lg w-[250px] h-auto p-4 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-col justify-start text-black";

  return (
    <div
      ref={props.isDraggable ? drag : null}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: "bold",
        cursor: props.isDraggable ? "move" : "pointer",
      }}
    >
      {showModal == true ? displayModal(props, setModal, props.item) : <></>}
      <div
        ref={ref}
        className={props.isSaved ? cardInBoardClasses : cardInGridClasses}
      >
        {props.isSaved ? (
          <div
            onClick={() => props.handleRemove(props.item)}
            className="z-2 absolute top-0 right-0 text-sm p-2 rounded-full cursor-pointer hover:bg-slate-200"
          >
            x
          </div>
        ) : (
          <></>
        )}
        <div className="flex justify-center m-0 p-0 text-sm overflow-y-hidden">
          {props.isDraggable && props.isSaved == false && (
            <Image
              className="rotate-90"
              width={30}
              height={30}
              src={svg}
              alt="draggable"
            />
          )}
        </div>
        <div
          onClick={() => {
            // if (props.x == false) {
            // setModal(true);
            // handleClick();
            // }
          }}
          className="text-sm font-light flex flex-col pt-0"
        >
          <p>{getFlightNumbers(props.item)}</p>
          <p>{`Departs: ${new Date(props.item.DepartsAt).toLocaleString()}`}</p>
          <p>{`Arrives: ${new Date(props.item.ArrivesAt).toLocaleString()}`}</p>
          <p>{`${getOriginAirport(props.item.AvailabilitySegments)} -> 
              ${getDestinationAirport(props.item.AvailabilitySegments)}, 
              ${getStops(props.item.AvailabilitySegments)} 
              ${
                getStops(props.item.AvailabilitySegments) !== 1
                  ? "stops"
                  : "stop"
              }`}</p>
          {props.device == "desktop" && props.isSaved == false ? (
            <p>{`Duration: ${displayDuration(
              getFlightDuration(props.item.AvailabilitySegments)
            )}`}</p>
          ) : (
            <></>
          )}
          {props.device == "desktop" && props.isSaved == false ? (
            <p>{"Airline: " + props.item.Carriers}</p>
          ) : (
            <></>
          )}
          {props.device == "desktop" && props.isSaved == false ? (
            <p>{"Points: " + props.item.MileageCost}</p>
          ) : (
            <></>
          )}
        </div>
        <div className=" text-xs font-thin">Click for more flight details</div>
        <div className="flex justify-center">
          {!props.isSaved &&
          props.device === "mobile" &&
          props.isDraggable === false ? (
            <Button
              onClick={() => {
                if (!props.isSaved && props.addToBoard !== undefined) {
                  props.addToBoard(props.item);
                }
              }}
              className="z-4 text-xs font-thin w-[100px] mt-1"
            >
              Save Flight
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlightCard;
