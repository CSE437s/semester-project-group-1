import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

import FlightCard from "./FlightCard";
import { FlightOption } from "@/lib/availability-types";
import { StoredFlightData } from "@/lib/route-types";
import { grabAvailibilities } from "@/lib/requestHandler";
import { toast } from "sonner";

type Props = {
  device: string;
};

export default function SavedFlights(props: Props) {
  const sb = useSupabaseClient();
  const user: User | null = useUser();
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // use grabAvailability to get the flight data for each flight id in flights
    // setFlights with the result

    const fetchFlights = async () => {
      if (flights.length != 0) return;

      setLoading(true);

      if (user === null) {
        setLoading(false);
        return;
      }

      const { data, error } = await sb
        .from("saved_flights")
        .select("availability_id, flight_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching saved flights", error);
        setLoading(false);
        return;
      }

      if (data === null || data.length === 0) {
        setLoading(false);
        return;
      }

      const uniqueAvailabilityIds = Array.from(
        new Set(data.map((d) => d.availability_id))
      );

      const res = (
        await grabAvailibilities(uniqueAvailabilityIds)
      ).flat();

      const filteredResults = res.filter((flight) =>
        data.some((d) => d.flight_id === flight.ID)
      );

      // Double check and only keep flights with unique IDs
      const uniqueFlights = new Map();
      for (const flight of filteredResults) {
        if (!uniqueFlights.has(flight.ID)) {
          uniqueFlights.set(flight.ID, flight);
        }
      }

      const uniqueResults = Array.from(uniqueFlights.values());

      setFlights(uniqueResults);
      setLoading(false);
    };

    fetchFlights();
  }, []);

  const deleteSavedFlight = async (flight: FlightOption) => {
    setFlights(flights.filter((f) => f.ID !== flight.ID));
    if (user !== null) {
      const { error } = await sb
        .from("saved_flights")
        .delete()
        .match({ flight_id: flight.ID, user_id: user.id });
      if (error) {
        console.error("Error deleting saved flight", error);
      } else {
        // toast("Deleted flight from profile");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="max-w-[900px] flex lg:flex-row lg:flex-wrap flex-col flex-nowrap items-center justify-center">
        {loading && <p>Loading...</p>}
        {flights &&
          flights.map((flight) => (
            <FlightCard
              key={flight.ID}
              item={flight}
              isSaved={true}
              handleRemove={deleteSavedFlight}
              device={props.device}
              isDraggable={false}
            />
          ))}
      </div>
    </div>
  );
}
