import { DataItem } from "./types";
import { Region } from "./regions";

type Stringify<T> = {
    [P in keyof T]: string
}

type BasicFlightRequest = {
    outboundAirportCode: string,
    inboundAirportCode: string,
    beginRangeSearch: Date,
    endRangeSearch: Date,
}

type BasicFlightRequestStringified = Stringify<BasicFlightRequest>

type FlightResponseData = {
    data: DataItem[];
    count: number;
    hasMore: boolean;
    cursor: number;
}

type FlightRequest = {
    outboundRegion: Region,
    inboundRegion: Region,
    outboundDate: Date,
    inboundDate: Date,
}

type QueryFlightRequest = {
    query: string,
}

type FlightRequestStringified = Stringify<FlightRequest>

type SaveFlightRequest = {
    flightId: string,
}

type FlightsByIdsRequest = {
    flightId: string,
}

type AvailabilitySegment = {
    ID: string;
    RouteID: string;
    AvailabilityID: string;
    AvailabilityTripID: string;
    FlightNumber: string;
    Distance: number;
    FareClass: string;
    AircraftName: string;
    AircraftCode: string;
    OriginAirport: string;
    DestinationAirport: string;
    DepartsAt: string;
    ArrivesAt: string;
    CreatedAt: string;
    UpdatedAt: string;
    Source: string;
    Order: number;
  };
  
  type TripDataItem = {
    ID: string;
    RouteID: string;
    AvailabilityID: string;
    AvailabilitySegments: AvailabilitySegment[];
    TotalDuration: number;
    Stops: number;
    Carriers: string;
    RemainingSeats: number;
    MileageCost: number;
    TotalTaxes: number;
    TaxesCurrency: string;
    TaxesCurrencySymbol: string;
    AllianceCost: number;
    TotalSegmentDistance: number;
    FlightNumbers: string;
    DepartsAt: string;
    Cabin: string;
    ArrivesAt: string;
    CreatedAt: string;
    UpdatedAt: string;
    Source: string;
  };
  
  type BookingLink = {
    label: string;
    link: string;
    primary: boolean;
  };
  
  type TripResponseData = {
    data: TripDataItem[];
    origin_coordinates: {
      Lat: number;
      Lon: number;
    };
    destination_coordinates: {
      Lat: number;
      Lon: number;
    };
    booking_links: BookingLink[];
  };

type FlightIdRequest = {
    flightId: string;
}

type StoredFlightData = {
  id: number,
  created_at: string,
  user_id: string,
  availability_id: string,
  flight_id: string,
}

type StoredDataAvailabilityId = {
  availability_id: string,
}

export type {
    BasicFlightRequest,
    BasicFlightRequestStringified,
    FlightResponseData,
    FlightRequest,
    FlightRequestStringified,
    SaveFlightRequest,
    FlightsByIdsRequest,
    TripResponseData,
    QueryFlightRequest,
    FlightIdRequest,
    StoredFlightData,
    StoredDataAvailabilityId,
}