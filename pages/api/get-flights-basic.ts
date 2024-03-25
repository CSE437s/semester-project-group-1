import { BasicFlightRequest, BasicFlightRequestStringified, FlightResponseData } from "@/lib/route-types";
import type { NextApiRequest, NextApiResponse } from "next";

import { basicFlightRequestToSeatsCachedSearchParams } from "@/lib/utils";
import { SeatsAero } from "@/lib/server/AeroClient";
import { SEAT_CLASS, SeatsCachedSearchParams } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightResponseData>
) {
  const body = req.body as BasicFlightRequestStringified
  const data = basicFlightRequestToSeatsCachedSearchParams(body)
  const seatsAero = new SeatsAero(process.env.SEATS_API!)
  const searchParams: SeatsCachedSearchParams = {
    origin_airport: data.origin_airport,
    destination_airport: data.destination_airport,
    cabin: SEAT_CLASS.ECONOMY,
    start_date: data.start_date,
    end_date: data.end_date // TODO: as of now, the end_date is not optional
  }
  try {
    const apiResponse = await seatsAero.find_route(searchParams)
    res.status(200).json(apiResponse)
  } catch (e) {
    console.error(e)
  }
}
