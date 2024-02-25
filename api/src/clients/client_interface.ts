// The interface that all route-finding clients must adhere to (in our case, just seats.aero)

import { ResponseData } from "./Seats.Aero/types"

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

export { SEAT_CLASS, PROGRAMS, REGION, type SearchClientInterface, type SearchParams }