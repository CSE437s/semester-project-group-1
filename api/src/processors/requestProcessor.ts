import { SEAT_CLASS, SeatsCachedSearchParams } from "../clients/Seats.Aero/types";

import { SearchParams } from "../clients/client_interface";
import { SeatsAero } from "../clients/Seats.Aero/client"

const handleRequest = async (body: SearchParams) => {
    console.log(body)
    const seatsAero = new SeatsAero(process.env.SEATS_API!)
    const searchParams: SeatsCachedSearchParams = {
        origin_airport: body.origin_airport,
        destination_airport: body.destination_airport,
        cabin: SEAT_CLASS.ECONOMY,
        start_date: body.start_date,
        end_date: body.end_date // TODO: as of now, the end_date is not optional
    }
    return await seatsAero.find_route(searchParams)
}

export { handleRequest };