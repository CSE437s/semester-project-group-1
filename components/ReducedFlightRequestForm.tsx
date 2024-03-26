import { Button } from "./ui/button";
import { RequestFormData } from "./FlightRequestForm";

type Props = {
  data: RequestFormData | undefined;
  setExpanded: (expanded: boolean) => void;
};

const cropISOString = (date: string) => {
  return date.slice(0, 10);
};

export function ReducedFlightRequestForm(props: Props) {
  // implements a UI reduced form of the flight request, after the user already clicks through the main one
  // should now be on one line showing the input data, with a button to expand the form
  return (
    <div className="flex flex-row items-center  m-10">
      {props.data === undefined ? (
        <></>
      ) : (
        <>
          <div className="flex flex-row justify-between max-w-[600px] items-center w-auto bg-white rounded-lg shadow-md px-4 py-2">
            <div className="flex flex-row items-center text-black font-light text-sm">
              <p className="">From: {props.data.outboundAirportCode}</p>
              <p className="mx-2">To: {props.data.inboundAirportCode}</p>
              <p className="">
                Date Range Start:{" "}
                {cropISOString(props.data.beginRangeSearch.toISOString())}
              </p>
              <p className="mx-2">
                Date Range End:{" "}
                {cropISOString(props.data.endRangeSearch.toISOString())}
              </p>
            </div>
          </div>
          <Button
            onClick={() => props.setExpanded(true)}
            className="mx-2 px-2 text-sm font-semibold h-12 bg-white text-black"
          >
            Expand
          </Button>
        </>
      )}
    </div>
  );
}
