import { AvailabilitySegment, FlightOptionWIndex } from "@/lib/availability-types";
import React, { useRef, useState } from "react";

import Image from "next/image";
import { ItemTypes } from "./Constants";
import svg from "../public/drag-handle.svg";
import { useDrag } from "react-dnd";

// Update props
type Props = {
  item: FlightOptionWIndex;
  description?: string;
  title?: string;
  id: number;
  x: boolean;
  handleRemove: (id: number) => void;
};

const getOriginAirport = (segments: AvailabilitySegment[]) => {
  return segments[0].OriginAirport;
}

const getDestinationAirport = (segments: AvailabilitySegment[]) => {
  return segments[segments.length - 1].DestinationAirport;
}

function FlightCard(props: Props) {
  const [showModal, setModal] = useState(false);
  const ref = useRef<any>(null);
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleClick2 = () => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  };
  const displayModal = (props: Props, setModal: React.Dispatch<React.SetStateAction<boolean>>, item: FlightOptionWIndex) => {
    return (
      <div className="z-40 drop-shadow-lg text-black h-[100vh] absolute top-0 left-0 flex justify-center items-center w-screen bg-slate-600/80">
        <div className="w-[50vw] h-[50vh] p-8 pb-10 border-solid b-1 border-slate-200 bg-white relative rounded-lg">
          <div
            onClick={() => {
              setModal(false);
              handleClick2();
            }}
            className=" text-3xl cursor-pointer absolute top-0 right-2 bg-white pt-[2px] pb-[5px] px-[10px] transition-all rounded-full hover:bg-slate-200"
          >
            <div className="flex justify-center items-center">
              <div className="text-3xl">x</div>
            </div>
          </div>
          <div className="text-xl font-bold text-center text-cyan-300">
            {"Flight: " + (item.idx + 1)}
          </div>
          <div className="text-base text-center font-normal">
            Date: {item.DepartsAt}  {/*  TODO: may not be what we want to display */}
          </div>
          <div className="text-base text-center font-normal">
            From: {getOriginAirport(item.AvailabilitySegments)} to {getDestinationAirport(item.AvailabilitySegments)}
          </div>
          <div className="text-lg font-normal text-center mb-2">
            Flight Options
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-4">
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
                  <div className="text-sm font-normal">Points: {item.MileageCost}</div>
                </div>
          </div>
        </div>
      </div>
    );
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: props.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: "bold",
        cursor: "move",
      }}
    >
      {showModal == true ? displayModal(props, setModal, props.item) : <></>}
      <div
        ref={ref}
        onClick={() => {
          if (props.x == false) {
            setModal(true);
            handleClick();
          }
        }}
        className="z-0 relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg min-w-[200px] w-auto p-4 mx-2 my-2 h-auto border border-solid border-[#ee6c4d] flex flex-col justify-start text-black"
      >
        {props.x == true ? (
          <div
            onClick={() => props.handleRemove(props.id)}
            className="z-2 absolute top-0 right-0 text-sm p-2 rounded-full cursor-pointer hover:bg-slate-200"
          >
            x
          </div>
        ) : (
          <></>
        )}
        <div className="flex justify-center m-0 p-0 text-sm">
          <Image
            className="rotate-90 -mt-3"
            width={30}
            height={30}
            src={svg}
            alt="draggable"
          />
          {/* <img width="50px" src="drag-handle.svg" alt="draggable"></img> */}
        </div>
        <div className="text-lg">{"Flight: " + (props.item.idx + 1)}</div>
        <div className="text-sm font-light">
          {"Points: " + props.item.MileageCost }
        </div>
        {props.x == false ? (
          <div className=" text-xs font-thin">Click for details</div>
        ) : (
          <></>
        )}
      </div>
      {/* {props.x == false ? (
        <div className="flex justify-center">
          <div
            onClick={() => setModal(true)}
            className="text-xs bg-slate-200 p-2 cursor-pointer text-black rounded-md hover:bg-slate-100"
          >
            Details
          </div>
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
}

export default FlightCard;
