import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

import { FlightRequestForm } from "@/components/FlightRequestForm";
import Navbar from "@/components/Navbar";
import { ResponseData } from "@/lib/types";
import { getMinCost } from "@/lib/utils";

export const dynamic = 'force-dynamic' // TODO: this was here for a reason, figure out why

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
