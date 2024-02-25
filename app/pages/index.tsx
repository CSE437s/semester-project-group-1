import { DataItem, ResponseData } from "../../api/src/clients/Seats.Aero/types";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

import { FlightRequestForm } from "@/components/FlightRequestForm";
import Navbar from "@/components/Navbar";

export const dynamic = 'force-dynamic'

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date: Date;
};

export type NewTodo = {
  title: string;
  date: Date;
};


const getMinCost = (data: DataItem) => {
  const fields = [
    "J", "W", "Y", "F"
  ]
  let minCost = Infinity
  fields.forEach((field) => {
    const availField = `${field}Available`
    const costField = `${field}MileageCost`
    if (data[availField as keyof DataItem] && data[costField as keyof DataItem] < minCost) {
      minCost = data[costField as keyof DataItem]
    }
  })
  return minCost
}

export default function Home(
) {
  const sb = useSupabaseClient();
  const user: User | null = useUser()

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResponseData | undefined>()
  
  return (
    <div className="w-[100vw] max-h-[100vh] flex flex-col justify-center items-between">
      <Navbar />
      <div className="flex flex-row justify-center items-center h-[80vh]">
        <FlightRequestForm setData={setData} setLoading={setLoading} />
      </div>
      <div className="flex flex-row p-3 w-[80vw] items-center justify-center">
        {data !== undefined && data.data.map((item, idx) => { // TODO: type this better
          return (
            <div key={idx} className="flex flex-col p-3 m-3">
              <p>Flight: {idx + 1}</p>
              <p>{item.Date}</p>
              <p>{item.Route.OriginAirport} to {item.Route.DestinationAirport}</p>
              <p>{getMinCost(item)}</p>
            </div>
          )
        })}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
