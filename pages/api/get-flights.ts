import { FlightRequestStringified, FlightResponseData } from "@/lib/route-types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightResponseData>
) {
    const body = req.body as FlightRequestStringified // TODO: convert to FlightRequest
    res.status(500)
}
