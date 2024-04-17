import {
  type DataItem,
  type SearchClientInterface,
  type SeatsCachedSearchParams,
} from '@/lib/types'
import { type AvailabilityResponseData } from '@/lib/availability-types'

import { type FlightResponseData } from '@/lib/route-types'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require('api')('@seatsaero/v1.0#cqdn9uslsnn1wyf')

class SeatsAero implements SearchClientInterface {
  apiKey: string
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async cached_search(
    params: SeatsCachedSearchParams
  ): Promise<FlightResponseData> {
    try {
      await sdk.auth(this.apiKey)
      const { data } = await sdk.cachedSearch({
        origin_airport: params.origin_airport,
        destination_airport: params.destination_airport,
        cabin: params.cabin,
        start_date: params.start_date,
        end_date: params.end_date, // TODO: as of now, the end_date is not optional
      })
      console.log(data)

      const parsedResponse: FlightResponseData = {
        data: data.data.map((item: DataItem) => ({
          ...item,
          Route: {
            ...item.Route,
          },
        })),
        count: data.count,
        hasMore: data.hasMore,
        cursor: data.cursor,
      } satisfies FlightResponseData

      return parsedResponse
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async get_trips(id: string): Promise<AvailabilityResponseData> {
    try {
      await sdk.auth(this.apiKey)
      const { data } = await sdk.getTrips({ id })

      return data as AvailabilityResponseData
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { SeatsAero }
