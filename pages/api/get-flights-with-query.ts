import { FlightResponseData, QueryFlightRequest } from "@/lib/route-types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightResponseData>
) {
  const body = req.body as QueryFlightRequest
  res.status(500)
}
