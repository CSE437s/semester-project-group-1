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

const airports: Airport[] = [
    {
        "icao": "KATL",
        "iata": "ATL",
        "name": "Hartsfield-Jackson Atlanta International Airport",
        "city": "Atlanta",
        "state": "Georgia",
        "country": "United States",
        "elevation": 1026,
        "lat": 33.6367,
        "lon": -84.4279,
        "tz": "America/New_York"
    },
    {
        "icao": "KORD",
        "iata": "ORD",
        "name": "Chicago O'Hare International Airport",
        "city": "Chicago",
        "state": "Illinois",
        "country": "United States",
        "elevation": 672,
        "lat": 41.9786,
        "lon": -87.9048,
        "tz": "America/Chicago"
    },
    {
        "icao": "KLAX",
        "iata": "LAX",
        "name": "Los Angeles International Airport",
        "city": "Los Angeles",
        "state": "California",
        "country": "United States",
        "elevation": 126,
        "lat": 33.9425,
        "lon": -118.4072,
        "tz": "America/Los_Angeles"
    },
    {
        "icao": "KDFW",
        "iata": "DFW",
        "name": "Dallas/Fort Worth International Airport",
        "city": "Dallas",
        "state": "Texas",
        "country": "United States",
        "elevation": 607,
        "lat": 32.8968,
        "lon": -97.038,
        "tz": "America/Chicago"
    },
    {
        "icao": "KDEN",
        "iata": "DEN",
        "name": "Denver International Airport",
        "city": "Denver",
        "state": "Colorado",
        "country": "United States",
        "elevation": 5431,
        "lat": 39.8617,
        "lon": -104.6731,
        "tz": "America/Denver"
    },
]

export default airports