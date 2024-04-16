import { type DataItem } from './types'
import { type Region } from './regions'

type Stringify<T> = {
  [P in keyof T]: string
}

interface BasicFlightRequest {
  outboundAirportCode: string
  inboundAirportCode: string
  beginRangeSearch: Date
  endRangeSearch: Date
}

type BasicFlightRequestStringified = Stringify<BasicFlightRequest>

interface FlightResponseData {
  data: DataItem[]
  count: number
  hasMore: boolean
  cursor: number
}

interface FlightRequest {
  outboundRegion: Region
  inboundRegion: Region
  outboundDate: Date
  inboundDate: Date
}

interface QueryFlightRequest {
  query: string
}

type FlightRequestStringified = Stringify<FlightRequest>

interface SaveFlightRequest {
  flightId: string
}

interface FlightsByIdsRequest {
  flightId: string
}

interface AvailabilitySegment {
  ID: string
  RouteID: string
  AvailabilityID: string
  AvailabilityTripID: string
  FlightNumber: string
  Distance: number
  FareClass: string
  AircraftName: string
  AircraftCode: string
  OriginAirport: string
  DestinationAirport: string
  DepartsAt: string
  ArrivesAt: string
  CreatedAt: string
  UpdatedAt: string
  Source: string
  Order: number
}

interface TripDataItem {
  ID: string
  RouteID: string
  AvailabilityID: string
  AvailabilitySegments: AvailabilitySegment[]
  TotalDuration: number
  Stops: number
  Carriers: string
  RemainingSeats: number
  MileageCost: number
  TotalTaxes: number
  TaxesCurrency: string
  TaxesCurrencySymbol: string
  AllianceCost: number
  TotalSegmentDistance: number
  FlightNumbers: string
  DepartsAt: string
  Cabin: string
  ArrivesAt: string
  CreatedAt: string
  UpdatedAt: string
  Source: string
}

interface BookingLink {
  label: string
  link: string
  primary: boolean
}

interface TripResponseData {
  data: TripDataItem[]
  origin_coordinates: {
    Lat: number
    Lon: number
  }
  destination_coordinates: {
    Lat: number
    Lon: number
  }
  booking_links: BookingLink[]
}

interface FlightIdRequest {
  flightId: string
}

interface StoredFlightData {
  id: number
  created_at: string
  user_id: string
  availability_id: string
  flight_id: string
}

interface StoredDataAvailabilityId {
  availability_id: string
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
