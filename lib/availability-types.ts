type BookingLink = {
    label: string;
    link: string;
    primary: boolean;
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
}

type FlightOption = {
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

type FlightOptionWIndex = FlightOption & { idx: number };

type CoordinateData = {
    Lat: number;
    Lon: number;
}

type AvailabilityResponseData = {
    data: FlightOption[];
    origin_coordinates: CoordinateData;
    destination_coordinates: CoordinateData;
    booking_links: BookingLink[];
}

export type { AvailabilityResponseData, CoordinateData, FlightOption, BookingLink, AvailabilitySegment, FlightOptionWIndex }