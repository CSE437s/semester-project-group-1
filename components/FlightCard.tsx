import { AvailabilitySegment, FlightOption } from "@/lib/availability-types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import { ExternalLinkIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { TbCoins } from "react-icons/tb";
import { Button } from "./ui/button";
import Image from "next/image";
import { ItemTypes } from "./Constants";
import airlines from "@/lib/airlines";
import svg from "../public/drag-handle.svg";
import { useDrag } from "react-dnd";
import { FaPlaneDeparture, FaRegMap } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import {
  Clock,
  Coins,
  CoinsIcon,
  Hash,
  Map,
  Octagon,
  OctagonIcon,
  Plane,
  PlaneIcon,
  PlaneTakeoff,
  RockingChair,
  RockingChairIcon,
  X,
} from "lucide-react";

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
  return `${flightNums.join(", ")}`;
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

    return `${hours}hr${hours > 1 ? "s" : ""}, ${minutes}m`;
  }
};

const displayDollarAmount = (cents: number) => {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
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

  function getCarrier(carrier: string): string {
    let carriers: string[] = carrier.split(",");
    for (let i = 0; i < carriers.length; i++) {
      carriers[i] = carriers[i].trim();
    }
    function removeDuplicates(arr: string[]) {
      return new Set<string>(arr);
    }
    let noDupes = removeDuplicates(carriers);
    let airlineString = "";
    noDupes.forEach((element) => {
      let temp = airlines.find((item) => {
        return item.code == element;
      });
      airlineString += temp?.airline;
    });
    // console.log(airlineString);
    return airlineString;
  }

  const displayModal = (
    props: Props,
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    item: FlightOption
  ) => {
    return (
      <Dialog open={showModal} onOpenChange={() => setModal(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Flight Details</DialogTitle>
          </DialogHeader>
          <div className="">
            <div className="text-left">
              <div>{new Date(item.DepartsAt).toLocaleString()} </div>
              <div className="font-bold">
                {getOriginAirport(item.AvailabilitySegments)} to{" "}
                {getDestinationAirport(item.AvailabilitySegments)}
              </div>
            </div>
            <div className="grid grid-rows-2 grid-cols-2 mt-5">
              <div className="flex justify-center flex-col items-center mb-2">
                <PlaneIcon size={30} strokeWidth={1} className="mb-[2px]" />
                <div className="w-[150px] border-slate-400 border text-sm h-[100px] p-2 rounded-md flex justify-center items-center flex-col">
                  <div>{getFlightNumbers(props.item)}</div>
                  <div>{getCarrier(item.Carriers)}</div>
                </div>
              </div>
              <div className="flex justify-center flex-col items-center mb-2">
                <RockingChairIcon
                  size={30}
                  strokeWidth={1}
                  className="mb-[2px]"
                />
                <div className="w-[150px] border-slate-400 border text-sm h-[100px] p-2 rounded-md flex justify-center items-center flex-col">
                  <div>{item.Cabin[0].toUpperCase() + item.Cabin.slice(1)}</div>
                  <div>{item.RemainingSeats + " seats left"}</div>
                </div>
              </div>
              <div className="flex justify-center flex-col items-center">
                <Octagon size={30} strokeWidth={1} className="mb-[2px]" />
                <div className="w-[150px] border-slate-400 border text-sm h-[100px] p-2 rounded-md flex justify-center items-center flex-col">
                  <div>
                    {item.Stops === 0
                      ? "Direct Flight"
                      : item.Stops >= 2
                      ? "" + item.Stops + " stops"
                      : "" + item.Stops + " stop"}
                  </div>
                </div>
              </div>
              <div className="flex justify-center flex-col items-center">
                <Coins size={30} strokeWidth={1} className="mb-[2px]" />
                <div className="w-[150px] border-slate-400 border text-sm h-[100px] p-2 rounded-md flex justify-center items-center flex-col">
                  <div>{item.MileageCost + " points"} </div>
                  <div>{"Fees: " + displayDollarAmount(item.TotalTaxes)}</div>
                </div>
              </div>
              {/* <div className="w-auto border-slate-400 border text-sm h-auto p-2 rounded-md">
                <div className="text-md flex justify-start space-x-0 items-center">
                  <Plane strokeWidth={2} size={16} className="mr-[5px]" />
                  {getCarrier(item.Carriers)}
                </div>
                <div className="text-md flex justify-start space-x-0 items-center mb-[20px]">
                  <RockingChair
                    strokeWidth={2}
                    size={16}
                    className="mr-[5px]"
                  />
                  {item.Cabin[0].toUpperCase() + item.Cabin.slice(1)}
                </div>

                <div className="text-sm font-normal">
                  Direct Flight:{" "}
                  {item.Stops === 0
                    ? "Yes"
                    : item.Stops >= 2
                    ? "" + item.Stops + " stops"
                    : "" + item.Stops + " stop"}
                </div>
                <div className="text-sm font-normal mb-[20px]">
                  Remaining Seats: {item.RemainingSeats}
                </div>
                <div className="text-md font-normal flex justify-start items-center">
                  <TbCoins className="mr-[5px]" />{" "}
                  {item.MileageCost + " points"}
                </div>
                <div className="text-sm font-normal">
                  Taxes & Fees: {displayDollarAmount(item.TotalTaxes)}
                </div>
              </div> */}
            </div>
          </div>
          <DialogFooter>
            <a
              target="_blank"
              href="https://www.nerdwallet.com/article/travel/how-do-airline-miles-work#:~:text=Airline%20miles%20or%20points%20%E2%80%94%20the,and%20shopping%20with%20specific%20partners."
            >
              <div className="text-xs no-underline flex space-x-2 justify-between hover:text-slate-400 transition">
                Airline miles <ExternalLinkIcon className="ml-[3px]" />{" "}
              </div>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const cardInGridClasses =
    "z-0 relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg w-[220px] h-auto p-4 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-col justify-start text-black";
  const cardInBoardClasses =
    "z-0 relative bg-[#fafafa] overflow-y-hidden drop-shadow-md  transition-all  rounded-lg w-[250px] h-auto p-4 pt-8 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-col justify-start text-black";

  return (
    <div
      // @ts-ignore
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
          <X
            onClick={() => props.handleRemove(props.item)}
            className="cursor-pointer absolute top-[0px] right-[0px] bg-[#ffffff] p-2 rounded-full hover:bg-slate-200"
            size={32}
            strokeWidth={2}
          />
        ) : (
          <></>
        )}
        <div className="flex justify-center -mt-4 p-0 text-sm overflow-y-hidden">
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

            setModal(true);
            handleClick();
            // }
          }}
          className="text-sm font-light flex flex-col pt-0"
        >
          {props.isSaved && (
            <div className="flex justify-start items-center">
              <Hash strokeWidth={2} size={16} className="mr-[5px]" />
              {getFlightNumbers(props.item)}
            </div>
          )}
          {/* <p>{getFlightNumbers(props.item)}</p> */}
          <div className="flex justify-start items-center">
            <PlaneTakeoff strokeWidth={2} size={16} className="mr-[5px]" />
            {`${new Date(props.item.DepartsAt).toLocaleString()}`}
          </div>
          {/* <p>{`Arrives: ${new Date(props.item.ArrivesAt).toLocaleString()}`}</p> */}
          <div className="flex justify-start items-center">
            <Map strokeWidth={2} size={16} className="mr-[5px]" />
            {`${getOriginAirport(props.item.AvailabilitySegments)} -> 
              ${getDestinationAirport(props.item.AvailabilitySegments)}
              `}
          </div>
          {props.device == "desktop" && props.isSaved == false ? (
            <div className="flex justify-start items-center">
              <Clock strokeWidth={2} size={16} className="mr-[5px]" />
              {`${displayDuration(
                getFlightDuration(props.item.AvailabilitySegments)
              )}`}
            </div>
          ) : (
            <></>
          )}

          {/* {props.device == "desktop" && props.isSaved == false ? (
            <p>{"Airline: " + props.item.Carriers}</p>
          ) : (
            <></>
          )} */}
          {props.device == "desktop" && props.isSaved == false ? (
            <div className="flex justify-start items-center">
              <Coins strokeWidth={2} size={16} className="mr-[5px]" />
              {props.item.MileageCost +
                "pts + " +
                displayDollarAmount(props.item.TotalTaxes)}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className=" text-xs font-thin text-right">
          Click for more flight details
        </div>
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
