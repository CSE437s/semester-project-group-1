import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type DataItem, type SeatsCachedSearchParams } from './types'
import { type BasicFlightRequestStringified } from './route-types'
import { useEffect, useState } from 'react'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const getMinCost = (data: DataItem): number => {
  const fields = ['J', 'W', 'Y', 'F']
  let minCost = Infinity
  fields.forEach((field) => {
    const availField = `${field}Available`
    const costField = `${field}MileageCost`
    if (
      Boolean(data[availField as keyof DataItem]) &&
      data[costField as keyof DataItem] < minCost
    ) {
      minCost = data[costField as keyof DataItem]
    }
  })
  return minCost
}

const validEmail = (email: string): boolean => {
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

const cropDateStr = (dateStr: string): string => {
  return dateStr.slice(0, 10)
}

const basicFlightRequestToSeatsCachedSearchParams = (
  data: BasicFlightRequestStringified
): SeatsCachedSearchParams => {
  return {
    origin_airport: data.outboundAirportCode,
    destination_airport: data.inboundAirportCode,
    start_date: cropDateStr(data.beginRangeSearch),
    end_date: cropDateStr(data.endRangeSearch),
  }
}

export const getIsMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
}

const useIsMobile = (pxWidth: number): boolean => {
  const [width, setWidth] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)
  function handleWindowSizeChange(): void {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    setWidth(window.innerWidth)
    setIsMobile(width <= 768)
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [width])

  useEffect(() => {
    setIsMobile(width <= pxWidth)
  }, [pxWidth, width])

  if (isMobile === null) {
    return false
  }

  return isMobile
}

export {
  getMinCost,
  validEmail,
  basicFlightRequestToSeatsCachedSearchParams,
  useIsMobile,
}
