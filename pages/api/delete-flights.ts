import type { NextApiRequest, NextApiResponse } from "next";

import { FlightIdRequest } from "@/lib/route-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as FlightIdRequest
  res.status(500)
}
