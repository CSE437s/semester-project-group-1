import type { NextApiRequest, NextApiResponse } from "next";

import { API } from "../../../api/src";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { edenTreaty } from "@elysiajs/eden";

type Data = {
  data: string
};

const api = edenTreaty<API>('https://437-webapp.azurewebsites.net')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  console.log("pin ping")
  const data = await api.api.hello.get().then((res: any) => res.json())
  res.status(200).json({ data });
}
