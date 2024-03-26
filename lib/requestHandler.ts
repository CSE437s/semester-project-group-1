import { AvailabilityResponseData, FlightOption } from "./availability-types";
import { BasicFlightRequest, FlightResponseData } from "./route-types";

/* This file contains a list of functions that should be called from the frontend */

async function fetchFlights(data: BasicFlightRequest) : Promise<FlightOption[]> {
    try {
        const response = await fetch("/api/get-flights-basic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 500) {
            throw new Error("Internal server error");
        }

        const airlineOptions = (await response.json()) as FlightResponseData;

        const flightAvailability = await Promise.all(airlineOptions.data.map(async (item) => {
            return (await grabAvailability(item.ID))
        }))

        // TODO: This discards booking data, not sure if that's something we want
        return flightAvailability.flat();

    } catch (error) {
        // TODO: handle error
        return []
    }
}

async function grabAvailability(flightId: string) {
    const response = await fetch("/api/get-availability", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ flightId: flightId }),
    });

    if (response.status === 500) {
        throw new Error("Internal server error");
    }

    const availability = (await response.json()) as AvailabilityResponseData;
    return availability.data.filter((flight) => flight.RemainingSeats > 0);
}

async function grabAvailibilities(flightIds: string[]) {
    return await Promise.all(flightIds.map(async (id) => {
        return (await grabAvailability(id));
    }));
}

export { fetchFlights, grabAvailability, grabAvailibilities }