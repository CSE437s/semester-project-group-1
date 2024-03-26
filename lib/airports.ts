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

import fromJson from './merged.json'
const airports: Airport[] = fromJson

export default airports