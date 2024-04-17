import { Button } from './ui/button'
import { type RequestFormData } from './FlightRequestForm'

import React, { type ReactElement } from 'react'

interface Props {
  data: RequestFormData | undefined
  setExpanded: (expanded: boolean) => void
}

const cropISOString = (date: string): string => {
  return date.slice(0, 10)
}

export function ReducedFlightRequestForm(props: Props): ReactElement {
  // implements a UI reduced form of the flight request, after the user already clicks through the main one
  // should now be on one line showing the input data, with a button to expand the form
  return (
    <div className='flex flex-row items-center'>
      {props.data === undefined ? (
        <>test</>
      ) : (
        <>
          <div className='flex w-auto max-w-[600px] flex-row items-center justify-between rounded-lg bg-white px-4 py-2 shadow-md'>
            <div className='flex flex-row items-center text-sm font-light text-black'>
              <p className=''>From: {props.data.outboundAirportCode}</p>
              <p className='mx-2'>To: {props.data.inboundAirportCode}</p>
              <p className=''>
                Start Date:{' '}
                {cropISOString(props.data.beginRangeSearch.toISOString())}
              </p>
              <p className='mx-2'>
                End Date:{' '}
                {cropISOString(props.data.endRangeSearch.toISOString())}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              props.setExpanded(true)
            }}
            className='mx-2 h-8 bg-white px-2 text-sm font-semibold text-black'
          >
            Expand
          </Button>
        </>
      )}
    </div>
  )
}
