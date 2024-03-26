import { useEffect, useState } from "react";

import FlightCard from "./FlightCard";
import { FlightOption } from "@/lib/availability-types";
import { StoredDataAvailabilityId } from "@/lib/route-types";
import { grabAvailibilities } from "@/lib/requestHandler";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

type Props = {
  device: string;
  flights: StoredDataAvailabilityId[];
  setSavedFlights: (flights: StoredDataAvailabilityId[]) => void;
};

export default function SavedFlights(props: Props) {
  const sb = useSupabaseClient();
  const user: User | null = useUser();
  const [flights, setFlights] = useState<FlightOption[] | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // use grabAvailability to get the flight data for each flight id in flights
    // setFlights with the result
    const fetchFlights = async () => {
      setLoading(true);
      const res = await grabAvailibilities(
        props.flights.map((flight) => flight.availability_id)
      );
      setFlights(res.flat());
      setLoading(false);
    };
    fetchFlights();
  }, [props.flights]);

  const deleteSavedFlight = async (flight: FlightOption) => {
    props.setSavedFlights(
      props.flights.filter((f) => f.availability_id !== flight.ID)
    );
    if (user !== null) {
      await sb
        .from("saved_flights")
        .delete()
        .match({ flight_id: flight.ID, user_id: user.id });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Saved Flights</h1>
        <div className="w-full flex flex-col items-center justify-center">
          {loading && <p>Loading...</p>}
          {flights &&
            flights.map((flight) => (
              <FlightCard
                key={flight.ID}
                item={flight}
                x={false}
                handleRemove={deleteSavedFlight}
                device={props.device}
                isDraggable={false}
              />
            ))}
        </div>
      </div>
    </>
  );
}

function grabAvailabilities(arg0: string[]) {
  throw new Error("Function not implemented.");
}
