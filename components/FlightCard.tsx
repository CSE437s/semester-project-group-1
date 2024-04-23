import {
  type AvailabilitySegment,
  type FlightOption,
} from '@/lib/availability-types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React, { type ReactElement, useEffect, useRef, useState } from 'react'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import Image from 'next/image'
import { ItemTypes } from './Constants'
import airlines from '@/lib/airlines'
import svg from '../public/drag-handle.svg'
import { useDrag } from 'react-dnd'
import {
  Clock,
  Coins,
  Hash,
  Map,
  Octagon,
  PlaneIcon,
  PlaneTakeoff,
  RockingChair,
  X,
} from 'lucide-react'

// Update props
interface Props {
  item: FlightOption
  description?: string
  title?: string
  isSaved: boolean
  handleRemove: (flight: FlightOption) => Promise<void>
  grid?: boolean
  isDraggable: boolean
  device: string
  addToBoard?: (flight: FlightOption) => Promise<void>
  setCurrentlyDragging?: any // use state function
}

const getOriginAirport = (segments: AvailabilitySegment[]): string => {
  if (segments[0] == null) {
    throw new Error('Invalid segment')
  }
  return segments[0].OriginAirport
}

const getDestinationAirport = (segments: AvailabilitySegment[]): string => {
  if (segments.length === 0) {
    throw new Error('Invalid segment')
  }
  return segments[getStops(segments)]?.DestinationAirport ?? ''
}

const getFlightNumbers = (item: FlightOption): string => {
  const parseFlightNumsFromString = (flightNums: string): string[] => {
    return flightNums.split(',').map((num) => num.trim())
  }
  const flightNums = parseFlightNumsFromString(item.FlightNumbers)
  return `${flightNums.join(', ')}`
}

const getStops = (segments: AvailabilitySegment[]): number => {
  return segments.length - 1
}

const getFlightDuration = (segments: AvailabilitySegment[]): number => {
  if (segments.length === 0) {
    throw new Error('Invalid segment')
  }
  const firstDeparture = new Date(segments[0]?.DepartsAt ?? '')
  const lastArrival = new Date(segments[getStops(segments)]?.ArrivesAt ?? '')
  return (lastArrival.getTime() - firstDeparture.getTime()) / 60000
}

const displayDuration = (duration: number): string => {
  // if under an hour, display in minutes. Otherwise, display in hours and minutes
  if (duration < 60) {
    return `${duration} minutes`
  } else {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    return `${hours}hr${hours > 1 ? 's' : ''}, ${minutes}m`
  }
}

const displayDollarAmount = (cents: number): string => {
  const dollars = cents / 100
  return `$${dollars.toFixed(2)}`
}

function FlightCard(props: Props): ReactElement {
  const [showModal, setModal] = useState(false)
  const ref = useRef<any>(null)
  const handleClick = (): void => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const [{ isDragging }, drag] = !props.isDraggable
    ? [{ isDragging: false }, null]
    : useDrag(() => ({
        type: ItemTypes.CARD,
        item: props.item,
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }))

  useEffect(() => {
    if (props.setCurrentlyDragging !== undefined) {
      props.setCurrentlyDragging(isDragging)
    }
  }, [isDragging])

  function getCarrier(carrier: string): string {
    const carriers: string[] = carrier.split(',').map((item) => {
      return item.trim()
    })
    function removeDuplicates(arr: string[]): Set<string> {
      return new Set<string>(arr)
    }
    const noDupes = removeDuplicates(carriers)
    let airlineString = ''
    noDupes.forEach((element) => {
      const temp = airlines.find((item) => {
        return item.code === element
      })
      if (temp === undefined) {
        return
      }
      airlineString += temp.airline
    })
    return airlineString
  }

  const displayModal = (
    props: Props,
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    item: FlightOption
  ): ReactElement => {
    return (
      <Dialog
        open={showModal}
        onOpenChange={() => {
          setModal(false)
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Flight Details</DialogTitle>
          </DialogHeader>
          <div className=''>
            <div className='text-left'>
              <div>{new Date(item.DepartsAt).toLocaleString()} </div>
              <div className='font-bold'>
                {getOriginAirport(item.AvailabilitySegments)} to{' '}
                {getDestinationAirport(item.AvailabilitySegments)}
              </div>
            </div>
            <div className='mt-5 grid grid-cols-2 grid-rows-2'>
              <div className='mb-2 flex flex-col items-center justify-center'>
                <PlaneIcon size={30} strokeWidth={1} className='mb-[2px]' />
                <div className='flex h-[100px] w-[150px] flex-col items-center justify-center rounded-md border border-slate-400 p-2 text-sm'>
                  <div>{getFlightNumbers(props.item)}</div>
                  <div>{getCarrier(item.Carriers)}</div>
                </div>
              </div>
              <div className='mb-2 flex flex-col items-center justify-center'>
                <RockingChair size={30} strokeWidth={1} className='mb-[2px]' />
                <div className='flex h-[100px] w-[150px] flex-col items-center justify-center rounded-md border border-slate-400 p-2 text-sm'>
                  {item.Cabin.length > 0
                    ? item.Cabin[0]?.toUpperCase() + item.Cabin.slice(1)
                    : ''}
                </div>
              </div>

              <div className='flex flex-col items-center justify-center'>
                <Octagon size={30} strokeWidth={1} className='mb-[2px]' />
                <div className='flex h-[100px] w-[150px] flex-col items-center justify-center rounded-md border border-slate-400 p-2 text-sm'>
                  <div>
                    {item.Stops === 0
                      ? 'Direct Flight'
                      : item.Stops >= 2
                        ? '' + item.Stops + ' stops'
                        : '' + item.Stops + ' stop'}
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-center'>
                <Coins size={30} strokeWidth={1} className='mb-[2px]' />
                <div className='flex h-[100px] w-[150px] flex-col items-center justify-center rounded-md border border-slate-400 p-2 text-sm'>
                  <div>{item.MileageCost + ' points'} </div>
                  <div>{'Fees: ' + displayDollarAmount(item.TotalTaxes)}</div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <a
              target='_blank'
              href='https://www.nerdwallet.com/article/travel/how-do-airline-miles-work#:~:text=Airline%20miles%20or%20points%20%E2%80%94%20the,and%20shopping%20with%20specific%20partners.'
              rel='noreferrer'
            >
              <div className='flex justify-between space-x-2 text-xs no-underline transition hover:text-slate-400'>
                Airline miles <ExternalLinkIcon className='ml-[3px]' />{' '}
              </div>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const cardInListClasses =
    'z-0 relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg w-[700px] h-auto p-4 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-row justify-center text-black font-thin text-xs overflow-x-none overflow-y-none'
  const cardInGridClasses =
    'z-0 relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg w-[220px] h-auto p-4 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-col justify-start text-black'
  const cardInBoardClasses =
    'z-0 relative bg-[#fafafa] overflow-y-hidden drop-shadow-md  transition-all  rounded-lg w-[250px] h-auto p-4 pt-8 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-col justify-start text-black'

  const cardListClass =
    'ml-3 flex flex-row flex-wrap space-x-3 pt-0 text-sm font-light'
  const cardGridClass = 'flex flex-col pt-0 text-sm font-light'

  const cardInBoardListClasses =
    'z-0 relative bg-[#fafafa] drop-shadow-md hover:bg-slate-200 transition-all hover:rounded-tr-none hover:rounded-bl-none rounded-lg w-[700px] h-auto p-4 mx-2 my-2 border border-solid border-[#ee6c4d] flex flex-row justify-center text-black font-thin text-xs overflow-x-none overflow-y-none'

  return (
    <div
      // @ts-expect-error drag and drop shit
      ref={props.isDraggable ? drag : null}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: props.isDraggable ? 'move' : 'pointer',
      }}
    >
      {showModal ? displayModal(props, setModal, props.item) : <></>}
      <div
        onClick={() => {
          setModal(true)
          handleClick()
        }}
        ref={ref}
        className={
          props.isSaved
            ? props.grid !== null && props.grid === false
              ? cardInBoardListClasses
              : cardInBoardClasses
            : props.grid !== null && props.grid === false
              ? cardInListClasses
              : cardInGridClasses
        }
      >
        {props.isSaved ? (
          <X
            onClick={() => {
              void props.handleRemove(props.item)
            }}
            className='absolute right-[0px] top-[0px] cursor-pointer rounded-full bg-[#ffffff] p-2 hover:bg-slate-200'
            size={32}
            strokeWidth={2}
          />
        ) : (
          <></>
        )}
        <div className='-mt-4 flex justify-center overflow-x-hidden overflow-y-hidden p-0 text-sm'>
          {props.isDraggable && !props.isSaved && (
            <Image
              className='rotate-90'
              width={30}
              height={30}
              src={svg}
              alt='draggable'
            />
          )}
        </div>
        <div
          className={
            props.grid !== null && props.grid === false
              ? cardListClass
              : cardGridClass
          }
        >
          {props.isSaved && (
            <div className='flex items-center justify-center'>
              <Hash strokeWidth={2} size={16} className='mr-[5px]' />
              {getFlightNumbers(props.item)}
            </div>
          )}
          <div className='flex items-center justify-start'>
            <PlaneTakeoff strokeWidth={2} size={16} className='mr-[5px]' />
            {`${new Date(props.item.DepartsAt).toLocaleString()}`}
          </div>
          <div className='flex items-center justify-start'>
            <Map strokeWidth={2} size={16} className='mr-[5px]' />
            {`${getOriginAirport(props.item.AvailabilitySegments)} -> 
              ${getDestinationAirport(props.item.AvailabilitySegments)}
              `}
          </div>
          {props.device === 'desktop' && !props.isSaved ? (
            <div className='flex items-center justify-start'>
              <PlaneIcon strokeWidth={2} size={16} className='mr-[5px]' />
              {getCarrier(props.item.Carriers)}
            </div>
          ) : (
            <></>
          )}
          {props.device === 'desktop' && !props.isSaved ? (
            <div className='flex items-center justify-start'>
              <Clock strokeWidth={2} size={16} className='mr-[5px]' />
              {`${displayDuration(
                getFlightDuration(props.item.AvailabilitySegments)
              )}`}
            </div>
          ) : (
            <></>
          )}
          {props.device === 'desktop' && !props.isSaved ? (
            <div className='flex items-center justify-start'>
              <Coins strokeWidth={2} size={16} className='mr-[5px]' />
              {props.item.MileageCost +
                'pts + ' +
                displayDollarAmount(props.item.TotalTaxes)}
            </div>
          ) : (
            <></>
          )}
        </div>
        {!props.isSaved && (
          <div className=' text-center text-xs font-thin'>
            Click for more flight details
          </div>
        )}
        <div className='flex justify-center'>
          {!props.isSaved && props.device === 'mobile' && !props.isDraggable ? (
            <Button
              onClick={() => {
                if (!props.isSaved && props.addToBoard !== undefined) {
                  void props.addToBoard(props.item)
                }
              }}
              className='z-4 mt-1 w-[100px] text-xs font-thin'
            >
              Save Flight
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlightCard
