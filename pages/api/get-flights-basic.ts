import { BasicFlightRequest, BasicFlightRequestStringified, FlightResponseData } from "@/lib/route-types";
import type { NextApiRequest, NextApiResponse } from "next";

import { basicFlightRequestToSeatsCachedSearchParams } from "@/lib/utils";
import { handleRequest } from "@/lib/requestProcessor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightResponseData>
) {
  const body = req.body as BasicFlightRequestStringified
  const data = basicFlightRequestToSeatsCachedSearchParams(body)
  const reqRes = await handleRequest(data)
  res.status(200).json(reqRes)
}
