import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { FlightResponseData } from "@/lib/route-types";
import { getMinCost } from "@/lib/utils";

// Update props
type Props = {
  data?: FlightResponseData;
  item?: any;
  description?: string;
  title?: string;
  id: number;
  addCardToBoard: (id: number) => void;
  x: boolean;
  handleRemove: (id: number) => void;
  reference: any;
};

function FlightCardMobile(props: Props) {
  const [showModal, setModal] = useState(false);
  const ref = useRef<any>(null);
  const ref2 = props.reference;
  // const [card, setCard] = useState<any | null>();
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleClick3 = () => {
    ref2.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick2 = () => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  };

  function displayModal(card: any, setModal: any, item: any) {
    let flightOptions = ["F", "J", "W", "Y"];
    return (
      <div className="z-40 drop-shadow-lg text-black h-[100vh] absolute top-0 left-0 flex justify-center items-center w-screen bg-slate-600/80">
        <div className="w-[80vw] h-[60vh] p-8 border-solid b-1 border-slate-200 bg-white relative rounded-lg">
          <div
            onClick={() => {
              setModal(false);
              handleClick2();
            }}
            className=" text-3xl cursor-pointer absolute top-0 right-2 bg-white pt-[2px] pb-[5px] px-[10px] transition rounded-full hover:bg-slate-200"
          >
            <div className="flex justify-center items-center">
              <div className="text-3xl">x</div>
            </div>
          </div>
          <div className="text-xl text-center font-bold text-cyan-300">
            {"Flight: " + (item.idx + 1)}
          </div>
          <div className="text-base text-center font-normal">
            Date: {item.Date}
          </div>
          <div className="text-base text-center font-normal">
            From: {item.Route.OriginAirport} to {item.Route.DestinationAirport}
          </div>
          <div className="text-lg font-normal text-center mb-2">
            Flight Options
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-4">
            {flightOptions.map((element) => {
              const airline =
                element == "F"
                  ? item.FAirlines
                  : element == "J"
                  ? item.JAirlines
                  : element == "W"
                  ? item.WAirlines
                  : item.YAirlines;
              const direct =
                element == "F"
                  ? item.FDirect
                  : element == "J"
                  ? item.JDirect
                  : element == "W"
                  ? item.WDirect
                  : item.YDirect;
              const seats =
                element == "F"
                  ? item.FRemainingSeats
                  : element == "J"
                  ? item.JRemainingSeats
                  : element == "W"
                  ? item.WRemainingSeats
                  : item.YRemainingSeats;
              const points =
                element == "F"
                  ? item.FMileageCost
                  : element == "J"
                  ? item.JMileageCost
                  : element == "W"
                  ? item.WMileageCost
                  : item.YMileageCost;
              if (airline == "") {
                return <div className="hidden"></div>;
              }
              return (
                <div className="w-auto border-slate-400 border text-sm h-auto p-2 rounded-md">
                  <div className="text-sm font-semibold">
                    Airline: {airline}
                  </div>
                  <div className="text-sm font-normal">
                    Direct Flight: {direct}
                  </div>
                  <div className="text-sm font-normal">
                    Remaining Seats: {seats}
                  </div>
                  <div className="text-sm font-normal">Points: {points}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showModal == true ? displayModal(props, setModal, props.item) : <></>}
      <div
        onClick={() => {}}
        ref={ref}
        className="relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition hover:rounded-tr-none hover:rounded-bl-none rounded-lg min-w-[70vw] w-auto p-4 my-2 h-auto border border-solid border-[#ee6c4d] flex flex-col justify-start text-black"
      >
        {props.x == true ? (
          <div
            onClick={() => props.handleRemove(props.id)}
            className="absolute top-0 right-0 text-sm p-2 rounded-full hover:bg-slate-200"
          >
            x
          </div>
        ) : (
          <></>
        )}
        <div className="text-lg">{"Flight: " + (props.item.idx + 1)}</div>
        <div className="text-sm font-light">
          {"Points: " + getMinCost(props.item)}
        </div>
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => {
              setModal(true);
              handleClick();
            }}
            className="z-2 text-xs font-thin w-[100px]"
          >
            Details
          </Button>
          {props.x == false ? (
            <Button
              onClick={() => {
                if (props.x == false) {
                  props.addCardToBoard(props.id);
                  handleClick3();
                }
              }}
              className="z-2 text-xs font-thin w-[100px]"
            >
              Save Flight
            </Button>
          ) : (
            <></>
          )}
        </div>
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

export default FlightCardMobile;
