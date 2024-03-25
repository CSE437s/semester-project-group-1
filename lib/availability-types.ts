interface BookingLink {
    label: string;
    link: string;
    primary: boolean;
}

interface AvailabilitySegment {
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
}

interface FlightOptions {
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
}

interface CoordinateData {
    Lat: number;
    Lon: number;
}

interface AvailabilityResponseData {
    data: FlightOptions[];
    origin_coordinates: CoordinateData;
    destination_coordinates: CoordinateData;
    booking_links: BookingLink[];
}

export type { AvailabilityResponseData, CoordinateData, FlightOptions as Datum, BookingLink, AvailabilitySegment }