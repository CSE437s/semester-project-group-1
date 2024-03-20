import { FlightResponseData, FlightsByIdsRequest, TripResponseData } from "@/lib/route-types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TripResponseData>
) {
    const body = req.body as FlightsByIdsRequest 
    res.status(500)
}
