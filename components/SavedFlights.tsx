import {
  type User,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { type ReactElement, useEffect, useState } from 'react'

import FlightCard from './FlightCard'
import { type FlightOption } from '@/lib/availability-types'
import { grabAvailibilities } from '@/lib/requestHandler'
import { toast } from 'sonner'
import { type StoredFlightData } from '@/lib/route-types'

import React from 'react'

interface Props {
  device: string
}

export default function SavedFlights(props: Props): ReactElement {
  const sb = useSupabaseClient()
  const user: User | null = useUser()
  const [flights, setFlights] = useState<FlightOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // use grabAvailability to get the flight data for each flight id in flights
    // setFlights with the result

    const fetchFlights = async (): Promise<void> => {
      console.log('ping')
      if (flights.length !== 0) return

      setLoading(true)

      if (user === null) {
        setLoading(false)
        return
      }

      const { data, error } = await sb
        .from('saved_flights')
        .select('availability_id, flight_id, departure')
        .eq('user_id', user.id)

      if (error != null) {
        console.error('Error fetching saved flights', error)
        setLoading(false)
        return
      }

      if (data === null || data.length === 0) {
        setLoading(false)
        return
      }

      const flightData: Array<
        Omit<StoredFlightData, 'id' | 'created_at' | 'user_id'>
      > = data

      // Filter data to not include flights that have already departed
      const currentTime = new Date().getTime()
      const filteredData = flightData.filter(
        (d) => new Date(d.departure).getTime() > currentTime
      )

      const departedFlights = flightData.filter(
        (d) => new Date(d.departure).getTime() <= currentTime
      )

      if (departedFlights.length > 0) {
        const { error } = await sb
          .from('saved_flights')
          .delete()
          .eq('user_id', user.id)
          .in(
            'flight_id',
            departedFlights.map((d) => d.flight_id)
          )
        if (error != null) {
          console.error('Error deleting departed flights', error)
        }

        toast.warning(
          'Flights that have already departed have been removed from your profile'
        )
      }

      const uniqueAvailabilityIds = Array.from(
        new Set(filteredData.map((d) => d.availability_id))
      )

      const res = (await grabAvailibilities(uniqueAvailabilityIds)).flat()

      const filteredResults = res.filter((flight) =>
        data.some((d) => d.flight_id === flight.ID)
      )

      // Double check and only keep flights with unique IDs
      const uniqueFlights = new Map()
      for (const flight of filteredResults) {
        if (!uniqueFlights.has(flight.ID)) {
          uniqueFlights.set(flight.ID, flight)
        }
      }

      const uniqueResults = Array.from(uniqueFlights.values())

      setFlights(uniqueResults)
      setLoading(false)
    }

    void fetchFlights() // TODO: if the whole app breaks its maybe voiding this lol
  }, [])

  const deleteSavedFlight = async (flight: FlightOption): Promise<void> => {
    setFlights(flights.filter((f) => f.ID !== flight.ID))
    if (user !== null) {
      const { error } = await sb
        .from('saved_flights')
        .delete()
        .match({ flight_id: flight.ID, user_id: user.id })
      if (error != null) {
        console.error('Error deleting saved flight', error)
      } else {
        let completed = false
        toast.success('Deleted flight from profile', {
          action: {
            label: 'Undo',
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick: async (): Promise<void> => {
              if (!completed) {
                completed = true
                setFlights([...flights, flight])
                const { error } = await sb.from('saved_flights').insert([
                  {
                    user_id: user.id,
                    flight_id: flight.ID,
                    availability_id: flight.AvailabilityID,
                  },
                ])
                if (error != null) {
                  toast.error('Error saving flight: ' + error.message)
                }
              }
            },
          },
        })
      }
    }
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <div className='flex max-w-[900px] flex-col flex-nowrap items-center justify-center lg:flex-row lg:flex-wrap'>
        {loading && <p>Loading...</p>}
        {flights?.map((flight) => (
          <FlightCard
            key={flight.ID}
            item={flight}
            isSaved={true}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            handleRemove={deleteSavedFlight}
            device={props.device}
            isDraggable={false}
          />
        ))}
      </div>
    </div>
  )
}
