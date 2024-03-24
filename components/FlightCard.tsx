import React, { useState, useRef } from "react";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import { Button } from "./ui/button";
import { FlightResponseData } from "@/lib/route-types";
import { getMinCost } from "@/lib/utils";
import Image from "next/image";

// Update props
type Props = {
  item?: any;
  data?: FlightResponseData;
  description?: string;
  title?: string;
  id: number;
  x: boolean;
  handleRemove: (id: number) => void;
};

function FlightCard(props: Props) {
  const [showModal, setModal] = useState(false);
  const ref = useRef<any>(null);
  // const [card, setCard] = useState<any | null>();
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleClick2 = () => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  };

  function displayModal(card: any, setModal: any, item: any) {
    return (
      <div className="z-40 text-black h-[100vh] absolute top-0 left-0 flex justify-center items-center w-screen bg-slate-600/80">
        <div className="w-[50vw] h-[50vh] p-8 border-solid b-1 border-slate-200 bg-white relative rounded-lg">
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
          <div className="text-xl">{"Flight: " + (item.idx + 1)}</div>
          <div className="text-sm">{item.Date}</div>
          <div className="text-sm">
            {" "}
            {item.Route.OriginAirport} to {item.Route.DestinationAirport}
          </div>
          <div className="text-sm">{getMinCost(item)}</div>
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
        className="z-0 relative bg-[#fafafa] hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg min-w-[200px] w-auto p-4 mx-2 my-2 h-auto border border-solid border-[#ee6c4d] flex flex-col justify-start text-black"
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
            width={50}
            height={50}
            src="../public/drag-handle.svg"
            alt="draggable"
          />
          {/* <img width="50px" src="drag-handle.svg" alt="draggable"></img> */}
        </div>
        <div className="text-lg">{"Flight: " + (props.item.idx + 1)}</div>
        <div className="text-sm font-light">
          {"Points: " + getMinCost(props.item)}
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
