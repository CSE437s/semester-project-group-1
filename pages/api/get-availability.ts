import { FlightResponseData, FlightsByIdsRequest, TripResponseData } from "@/lib/route-types";
import type { NextApiRequest, NextApiResponse } from "next";

import { SeatsAero } from "@/lib/server/AeroClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TripResponseData | Error>
) {
    const body = req.body as FlightsByIdsRequest 
    const seatsAero = new SeatsAero(process.env.SEATS_API!)
    try {
        const apiResponse = await seatsAero.get_trips(body.flightId)
        res.status(200).json(apiResponse)
    } catch (e) {
        console.error(e)
        res.status(500).json(e as Error)
    }
}
