import {
  type AvailabilityResponseData,
  type FlightOption,
} from './availability-types'
import { type BasicFlightRequest, type FlightResponseData } from './route-types'

/* This file contains a list of functions that should be called from the frontend */

async function fetchFlights(data: BasicFlightRequest): Promise<FlightOption[]> {
  try {
    const response = await fetch('/api/get-flights-basic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status === 500) {
      throw new Error('Internal server error')
    }

    const airlineOptions = (await response.json()) as FlightResponseData

    // If not production, only do for first airline
    if (process.env.VERCEL_ENV !== 'production') {
      airlineOptions.data = airlineOptions.data.slice(0, 1)
    }

    const flightAvailability = await Promise.all(
      airlineOptions.data.map(async (item) => {
        return await grabAvailability(item.ID)
      })
    )

    // TODO: This discards booking data, not sure if that's something we want
    return flightAvailability.flat()
  } catch (error) {
    // TODO: handle error
    return []
  }
}

async function grabAvailability(flightId: string) {
  const response = await fetch('/api/get-availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flightId }),
  })

  if (response.status === 500) {
    throw new Error('Internal server error')
  }

  const availability = (await response.json()) as AvailabilityResponseData
  if (process.env.VERCEL_ENV !== 'production') {
    return availability.data.filter(
      (flight) => new Date(flight.DepartsAt) > new Date()
    )
  }
  return availability.data.filter((flight) => flight.RemainingSeats > 0) // && new Date(flight.DepartsAt) > new Date());
}

async function grabAvailibilities(flightIds: string[]) {
  return await Promise.all(
    flightIds.map(async (id) => {
      return await grabAvailability(id)
    })
  )
}

export { fetchFlights, grabAvailability, grabAvailibilities }
