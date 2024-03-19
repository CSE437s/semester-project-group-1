type SeatsParams = {
    cursor: string,
    take: number,
    order_by: string,
    skip: number,
}

type SeatsCachedSearchParams = SearchParams // | SeatsParams

interface BulkAvailabilityParams {
    source: PROGRAMS,
    cabin: SEAT_CLASS,
    start_date: Date,
    end_date: Date,
    origin_region: REGION,
    destination_region: REGION
    //take
    //cursor
}

type Route = {
    ID: string;
    OriginAirport: string;
    OriginRegion: string;
    DestinationAirport: string;
    DestinationRegion: string;
    NumDaysOut: number;
    Distance: number;
    Source: string;
  }

type DataItem = {
    ID: string;
    RouteID: string;
    Route: Route;
    Date: string;
    ParsedDate: string;
    YAvailable: boolean;
    WAvailable: boolean;
    JAvailable: boolean;
    FAvailable: boolean;
    YMileageCost: string;
    WMileageCost: string;
    JMileageCost: string;
    FMileageCost: string;
    YDirectMileageCost: number;
    WDirectMileageCost: number;
    JDirectMileageCost: number;
    FDirectMileageCost: number;
    YRemainingSeats: number;
    WRemainingSeats: number;
    JRemainingSeats: number;
    FRemainingSeats: number;
    YDirectRemainingSeats: number;
    WDirectRemainingSeats: number;
    JDirectRemainingSeats: number;
    FDirectRemainingSeats: number;
    YAirlines: string;
    WAirlines: string;
    JAirlines: string;
    FAirlines: string;
    YDirectAirlines: string;
    WDirectAirlines: string;
    JDirectAirlines: string;
    FDirectAirlines: string;
    YDirect: boolean;
    WDirect: boolean;
    JDirect: boolean;
    FDirect: boolean;
    Source: string;
    CreatedAt: string;
    UpdatedAt: string;
    AvailabilityTrips: null | any; // Adjust type accordingly if possible
}

type ResponseData = {
    data: DataItem[];
    count: number;
    hasMore: boolean;
    cursor: number;
}

// At minimum, we need to be able to take in parameters for a specific route, and return whether or not it's available
interface SearchClientInterface {
    find_route: (params: SearchParams) => Promise<ResponseData>
}

type SearchParams = {
    origin_airport: string | REGION,
    destination_airport: string | REGION,
    cabin?: SEAT_CLASS,
    start_date: string,
    end_date?: string | undefined,
}

enum SEAT_CLASS {
    ECONOMY = 'economy',
    BUSINESS = 'business',
    FIRST = 'first',
}

enum PROGRAMS {
    aeromexico = 'aeromexico',
    aeroplan = 'aeroplan',
    flyingblue = 'flyingblue',
    alaska = 'alaska',
    american = 'american',
    delta = 'delta',
    emirates = 'emirates',
    ethiad = 'ethiad',
    jetblue = 'jetblue',
    quantas = 'quantas',
    eurobonus = 'eurobonus',
    united = 'united',
    virginatlantic = 'virginatlantic',
    velocity = 'velocity'
}

enum REGION {
    NA = 'North America',
    SA = 'South America',
    AF = 'Africa',
    AS = 'Asia',
    EU = 'Europe',
    OC = 'Oceania'
}

type BasicFlightRequest = {
    outboundAirportCode: string,
    inboundAirportCode: string,
    outboundDate: Date,
    inboundDate: Date,
}

type BasicFlightRequestStringified = {
    outboundAirportCode: string,
    inboundAirportCode: string,
    outboundDate: string,
    inboundDate: string,
}

type Airport = {
    "icao": string,
    "iata": string,
    "name": string,
    "city": string,
    "state": string,
    "country": string,
    "elevation": number,
    "lat": number,
    "lon":  number,
    "tz": string
}

type AirportMap = {
    [key: string]: Airport
}

export { SEAT_CLASS,
    PROGRAMS,
    REGION,
    type SearchClientInterface,
    type SeatsCachedSearchParams,
    type BulkAvailabilityParams,
    type ResponseData,
    type DataItem,
    type Route,
    type SeatsParams,
    type BasicFlightRequest,
    type Airport,
    type AirportMap,
    type BasicFlightRequestStringified,
}