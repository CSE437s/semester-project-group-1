import fromJson from './merged.json'

interface Airport {
  icao: string
  iata: string
  name: string
  city: string
  state: string
  country: string
  elevation: number
  lat: number
  lon: number
  tz: string
}
const airports: Airport[] = fromJson

export default airports
