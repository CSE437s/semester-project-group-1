/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kJ64eUSTL3p
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FlightOption } from "@/lib/availability-types";
import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function Saved() {
  const [savedFlights, setSavedFlights] = useState<FlightOption[] | []>([]);
  const sb = useSupabaseClient();
  const user: User | null = useUser()

  useEffect(() => {
    async function getData() {
      if (user != null) {
        console.log("ping sb")
        const { data } = await sb
          .from("saved_flights")
          .select("flight_id")
          .eq("user_id", user.id);

        // Re-fetch flight data using grabAvailability
        if (data !== null) {
          const flightData = await Promise.all(data.map(async (item) => {
            return (await grabAvailability(item.flight_id))
          }))
          setSavedFlights(flightData.flat())
        }
      }
    }

    getData();
  }, [])

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="container grid max-w-3xl flex-1 px-4 py-6 gap-6 lg:gap-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold tracking-tighter text-purple-600">Saved Flights</h1>
          <Button className="bg-purple-600 text-white hover:bg-purple-700" size="sm" variant="outline">
            New Search
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Input className="bg-purple-100" id="departure" placeholder="Departure" />
          <Input className="bg-purple-100" id="destination" placeholder="Destination" />
          <Button className="bg-purple-600 hover:bg-purple-700">Search</Button>
        </div>
        <div className="w-full border border-purple-200 border-dashed" />
        <div className="w-full overflow-auto">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="border-t border-purple-200">
                <th className="px-4 py-2 text-xs font-medium tracking-wider text-purple-500 uppercase dark:text-purple-400">
                  Departure
                </th>
                <th className="px-4 py-2 text-xs font-medium tracking-wider text-purple-500 uppercase dark:text-purple-400">
                  Destination
                </th>
                <th className="px-4 py-2 text-xs font-medium tracking-wider text-purple-500 uppercase dark:text-purple-400">
                  Date
                </th>
                <th className="px-4 py-2 text-xs font-medium tracking-wider text-purple-500 uppercase dark:text-purple-400">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-200 dark:divide-purple-800">
              <tr className="hover:bg-purple-50 dark:hover:bg-purple-800">
                <td className="px-4 py-3 text-sm">LHR</td>
                <td className="px-4 py-3 text-sm">SFO</td>
                <td className="px-4 py-3 text-sm">2023-08-01</td>
                <td className="px-4 py-3 text-sm">1200</td>
              </tr>
              <tr className="hover:bg-purple-50 dark:hover:bg-purple-800">
                <td className="px-4 py-3 text-sm">SFO</td>
                <td className="px-4 py-3 text-sm">LHR</td>
                <td className="px-4 py-3 text-sm">2023-08-15</td>
                <td className="px-4 py-3 text-sm">1100</td>
              </tr>
              <tr className="hover:bg-purple-50 dark:hover:bg-purple-800">
                <td className="px-4 py-3 text-sm">JFK</td>
                <td className="px-4 py-3 text-sm">LAX</td>
                <td className="px-4 py-3 text-sm">2023-09-10</td>
                <td className="px-4 py-3 text-sm">900</td>
              </tr>
              <tr className="hover:bg-purple-50 dark:hover:bg-purple-800">
                <td className="px-4 py-3 text-sm">LAX</td>
                <td className="px-4 py-3 text-sm">JFK</td>
                <td className="px-4 py-3 text-sm">2023-09-25</td>
                <td className="px-4 py-3 text-sm">1000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function grabAvailability(flight_id: any): any {
  throw new Error("Function not implemented.");
}

