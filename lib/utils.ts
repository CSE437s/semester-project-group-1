import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DataItem, SeatsCachedSearchParams } from "./types"
import { BasicFlightRequestStringified } from "./route-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getMinCost = (data: DataItem) => {
  const fields = [
    "J", "W", "Y", "F"
  ]
  let minCost = Infinity
  fields.forEach((field) => {
    const availField = `${field}Available`
    const costField = `${field}MileageCost`
    if (data[availField as keyof DataItem] && data[costField as keyof DataItem] < minCost) {
      minCost = data[costField as keyof DataItem]
    }
  })
  return minCost
}

const validEmail = (email: string): boolean => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

const cropDateStr = (dateStr: string): string => {
  return dateStr.slice(0, 10)
}

const basicFlightRequestToSeatsCachedSearchParams = (data: BasicFlightRequestStringified): SeatsCachedSearchParams => {
  return {
    origin_airport: data.outboundAirportCode,
    destination_airport: data.inboundAirportCode,
    start_date: cropDateStr(data.beginRangeSearch),
    end_date: cropDateStr(data.endRangeSearch)
  }
}

export { getMinCost, validEmail, basicFlightRequestToSeatsCachedSearchParams }