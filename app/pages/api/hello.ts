import type { NextApiRequest, NextApiResponse } from "next";

// import { API } from "../../../api/src";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { edenTreaty } from "@elysiajs/eden";

type Data = {
  data: string
};

const ENDPOINT = process.env.NODE_ENV === "development" ? "http://localhost:4000" : process.env.NEXT_API_URL

// const api = edenTreaty<API>(ENDPOINT)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  console.log("pin ping")
  res.status(200).json({ data: "Hello"});
}
