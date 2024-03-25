import { BasicFlightRequest, FlightResponseData } from "./route-types";

/* This file contains a list of functions that should be called from the frontend */

async function fetchFlights(data: BasicFlightRequest) {
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

        const airlineOptions = await response.json() as FlightResponseData;

        const flightAvailability = await Promise.all(airlineOptions.data.map(async (item) => {
            const response = await fetch("/api/get-availability", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ flightId: item.ID }),
            });

            if (response.status === 500) {
                throw new Error("Internal server error");
            }

            const availability = await response.json();
            return availability.data;
        }))

        // TODO: This discards booking data, not sure if that's something we want
        return flightAvailability.flat;

    } catch (error) {
        // TODO: handle error
    }
}

export { fetchFlights }