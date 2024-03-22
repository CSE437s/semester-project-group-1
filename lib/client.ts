import { SearchClientInterface, SeatsCachedSearchParams } from "./types";

import { FlightResponseData } from "./route-types";

const sdk = require('api')('@seatsaero/v1.0#cqdn9uslsnn1wyf');

class SeatsAero implements SearchClientInterface {
  api_key: string;
  constructor(api_key: string) {
    this.api_key = api_key
  }

  find_route(params: SeatsCachedSearchParams): Promise<FlightResponseData> {
    return new Promise((resolve, reject) => {
      sdk.auth(this.api_key)
      sdk.cachedSearch({
        origin_airport: params.origin_airport,
        destination_airport: params.destination_airport,
        cabin: params.cabin,
        start_date: params.start_date,
        end_date: params.end_date // TODO: as of now, the end_date is not optional
    })
        .then(({ data }: { data: any }) => {
          const parsedResponse: FlightResponseData = {
            data: data.data.map((item: any) => ({
              ...item,
              Route: {
                ...item.Route,
              },
            })),
            count: data.count,
            hasMore: data.hasMore,
            cursor: data.cursor
          } as FlightResponseData;
          return resolve(parsedResponse)
        })
        .catch(console.error)
    })
  }
}

export { SeatsAero }