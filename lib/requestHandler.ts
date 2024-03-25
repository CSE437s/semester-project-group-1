import { BasicFlightRequest } from "./route-types";

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

        const res = await response.json();
        return res
    } catch (error) {
        // TODO: handle error
    }
}

export { fetchFlights }