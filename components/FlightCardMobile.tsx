import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { FlightResponseData } from '@/lib/route-types'
import { getMinCost } from '@/lib/utils'
import { type FlightOption } from '@/lib/availability-types'

// Update props
interface Props {
  data?: FlightOption
  item?: any
  description?: string
  title?: string
  id: number
  addCardToBoard: (id: number) => void
  x: boolean
  handleRemove: (id: number) => void
  reference: any
}

function FlightCardMobile(props: Props) {
  const [showModal, setModal] = useState(false)
  const ref = useRef<any>(null)
  const ref2 = props.reference
  // const [card, setCard] = useState<any | null>();
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleClick3 = () => {
    ref2.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleClick2 = () => {
    ref.current?.scrollIntoView({ behavior: 'auto' })
  }

  function displayModal(card: any, setModal: any, item: any) {
    const flightOptions = ['F', 'J', 'W', 'Y']
    return (
      <div className='absolute left-0 top-0 z-40 flex h-[100vh] w-screen items-center justify-center bg-slate-600/80 text-black drop-shadow-lg'>
        <div className='b-1 relative h-[60vh] w-[80vw] rounded-lg border-solid border-slate-200 bg-white p-8'>
          <div
            onClick={() => {
              setModal(false)
              handleClick2()
            }}
            className=' absolute right-2 top-0 cursor-pointer rounded-full bg-white px-[10px] pb-[5px] pt-[2px] text-3xl transition hover:bg-slate-200'
          >
            <div className='flex items-center justify-center'>
              <div className='text-3xl'>x</div>
            </div>
          </div>
          <div className='text-center text-xl font-bold text-cyan-300'>
            {'Flight: ' + (item.idx + 1)}
          </div>
          <div className='text-center text-base font-normal'>
            Date: {item.Date}
          </div>
          <div className='text-center text-base font-normal'>
            From: {item.Route.OriginAirport} to {item.Route.DestinationAirport}
          </div>
          <div className='mb-2 text-center text-lg font-normal'>
            Flight Options
          </div>
          <div className='grid grid-cols-2 grid-rows-2 gap-4'>
            {flightOptions.map((element) => {
              const airline =
                element == 'F'
                  ? item.FAirlines
                  : element == 'J'
                    ? item.JAirlines
                    : element == 'W'
                      ? item.WAirlines
                      : item.YAirlines
              const direct =
                element == 'F'
                  ? item.FDirect
                  : element == 'J'
                    ? item.JDirect
                    : element == 'W'
                      ? item.WDirect
                      : item.YDirect
              const seats =
                element == 'F'
                  ? item.FRemainingSeats
                  : element == 'J'
                    ? item.JRemainingSeats
                    : element == 'W'
                      ? item.WRemainingSeats
                      : item.YRemainingSeats
              const points =
                element == 'F'
                  ? item.FMileageCost
                  : element == 'J'
                    ? item.JMileageCost
                    : element == 'W'
                      ? item.WMileageCost
                      : item.YMileageCost
              if (airline == '') {
                return <div className='hidden'></div>
              }
              return (
                <div className='h-auto w-auto rounded-md border border-slate-400 p-2 text-sm'>
                  <div className='text-sm font-semibold'>
                    Airline: {airline}
                  </div>
                  <div className='text-sm font-normal'>
                    Direct Flight: {direct ? 'Yes' : 'No'}
                  </div>
                  <div className='text-sm font-normal'>
                    Remaining Seats: {seats}
                  </div>
                  <div className='text-sm font-normal'>Points: {points}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {showModal ? displayModal(props, setModal, props.item) : <></>}
      <div
        onClick={() => {}}
        ref={ref}
        className='relative my-2 flex h-auto w-auto min-w-[70vw] flex-col justify-start rounded-lg border border-solid border-[#ee6c4d] bg-[#fafafa] p-4 text-black drop-shadow-md transition hover:rounded-bl-none hover:rounded-tr-none hover:bg-slate-200'
      >
        {props.x ? (
          <div
            onClick={() => {
              props.handleRemove(props.id)
            }}
            className='absolute right-0 top-0 rounded-full p-2 text-sm hover:bg-slate-200'
          >
            x
          </div>
        ) : (
          <></>
        )}
        <div className='text-lg'>{'Flight: ' + (props.item.idx + 1)}</div>
        <div className='text-sm font-light'>
          {'Points: ' + getMinCost(props.item)}
        </div>
        <div className='flex justify-center space-x-2'>
          <Button
            onClick={() => {
              setModal(true)
              handleClick()
            }}
            className='z-2 w-[100px] text-xs font-thin'
          >
            Details
          </Button>
          {!props.x ? (
            <Button
              onClick={() => {
                if (!props.x) {
                  props.addCardToBoard(props.id)
                  handleClick3()
                }
              }}
              className='z-2 w-[100px] text-xs font-thin'
            >
              Save Flight
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* {props.x == false ? (
        <div className="flex justify-center">
          <div
            onClick={() => setModal(true)}
            className="text-xs bg-slate-200 p-2 cursor-pointer text-black rounded-md hover:bg-slate-100"
          >
            Details
          </div>
        </div>
      ) : (
        <></>
      )} */}
    </div>
  )
}

export default FlightCardMobile
