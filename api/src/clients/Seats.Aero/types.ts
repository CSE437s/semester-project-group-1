import { PROGRAMS, REGION, SEAT_CLASS, SearchParams } from '../client_interface';

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


export { SEAT_CLASS, PROGRAMS, REGION, type SeatsCachedSearchParams, type BulkAvailabilityParams, type ResponseData, type DataItem }