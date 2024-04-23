import {
  AlignJustify,
  ArrowDownToLine,
  BookMarked,
  Grid2X2,
  X,
} from 'lucide-react'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import {
  type FlightOption,
  type FlightOptionWIndex,
} from '@/lib/availability-types'
import React, { type ReactElement, useEffect, useState } from 'react'
import {
  type User,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'

import { Button } from '@/components/ui/button'
import { type Device } from '@/lib/types'
import FadeIn from 'react-fade-in'
import FlightCard from './FlightCard'
import { FlightFilterPopover } from './FlightFilterPopover'
import { ItemTypes } from './Constants'
import { toast } from 'sonner'
import { useDrop } from 'react-dnd'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
  data: FlightOption[]
  device: Device
}

export const SORT_METHODS_LIST = ['PRICE', 'DURATION', 'STOPS'] as const
export type SORT_METHODS = 'PRICE' | 'DURATION' | 'STOPS'

function FlightStore(props: Props): ReactElement {
  const [board, setBoard] = useState<FlightOption[] | []>([])
  const sb = useSupabaseClient()
  const user: User | null = useUser()

  const [sortMethod, setSortMethod] = useState<SORT_METHODS>('PRICE')
  const [numFlightsToReturn, setNumFlightsToReturn] = useState(6) // TODO: enforce this number by screen size?
  // Could also implement a "show more" button

  const [dragging, setDragging] = useState<boolean>(false)

  const [showStore, setShowStore] = useState<boolean>(false)

  const [grid, setGrid] = useState<boolean>(true)

  useEffect(() => {
    async function getData(): Promise<void> {
      if (user != null) {
        const { data } = await sb
          .from('saved_flights')
          .select('flight_id')
          .eq('user_id', user.id)

        // Add all matching flight IDs to board
        if (data !== null) {
          const matchingFlights = props.data.filter((flight) =>
            data.some((item) => item.flight_id === flight.ID)
          )
          setBoard(matchingFlights)
        }
      }
    }

    void getData()
  }, [])

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: FlightOption) => {
      void saveFlight(item)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  const [notification, setNotification] = useState<boolean>(false)

  useEffect(() => {
    setDragging(false)
  }, [board.length])

  const FlightList: FlightOptionWIndex[] = props.data.map((item, idx) => ({
    ...item,
    idx,
  }))

  const saveFlight = async (flight: FlightOption): Promise<void> => {
    // Check if flight has already departed
    if (new Date(flight.DepartsAt).getTime() < new Date().getTime()) {
      toast.warning(
        'Sorry, this flight has already departed. Try searching availability on a different day!'
      )
      return
    }
    setBoard((board) => [...board, flight])
    setNotification(true)
    if (user !== null) {
      const { error } = await sb.from('saved_flights').insert({
        flight_id: flight.ID,
        availability_id: flight.AvailabilityID,
        user_id: user.id,
        departure: flight.DepartsAt,
      })
      if (error != null) {
        console.error('Error saving flight', error)
      } else {
        toast('Saved flight to profile', {})
        // console.log("Saved flight", flight.ID, flight.DepartsAt);
      }
    }
  }

  const deleteSavedFlight = async (flight: FlightOption): Promise<void> => {
    setBoard((board) => board.filter((item) => item.ID !== flight.ID))
    if (user !== null) {
      await sb
        .from('saved_flights')
        .delete()
        .match({ flight_id: flight.ID, user_id: user.id })
      toast('Deleted flight from profile')
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setNotification(false)
    }, 1000)
  }, [notification])

  // const cardGridLaptopClasses =
  //   'flex flex-row justify-center flex-wrap max-w-[850px] overflow-x-hidden min-w-[300px]'

  // const cardListLaptopClasses =
  //   'flex flex-col items-center flex-nowrap max-w-[850px] overflow-y-hidden min-w-[300px]'
  const cardGridMobileClasses = 'flex  items-center justify-center flex-col'

  const boardMobileClasses =
    'w-[80vw] no-scrollbar rounded-xl p-8 border-2 border-solid border-[#ee6c4d] flex flex-col flex-nowrap overflow-y-scroll   overflow-x-hidden h-auto justify-center bg-[#2c2c2c]'

  const notificationClasses =
    'absolute top-[-10px] right-[-10px] flex p-2  w-[28px] h-[28px] justify-center items-center rounded-full bg-[#ee6c4d] text-[#2c2c2c]'
  const notificationClassesPing =
    'animate-ping absolute top-[-10px] right-[-10px] flex p-2  w-[28px] h-[28px] justify-center items-center rounded-full bg-[#ee6c4d] text-[#2c2c2c]'

  return (
    <div className='mb-10 flex flex-col items-center justify-center overflow-x-hidden overscroll-contain'>
      {props.device === 'desktop' ? (
        <div className='relative'>
          <div
            onClick={() => {
              setShowStore(true)
            }}
            className='fixed left-0 top-[30%] flex h-[75px] w-[75px] cursor-pointer items-center justify-center rounded-r-lg border-y-2 border-r-2 border-solid border-[#ee6c4d] bg-[#2c2c2c]'
          >
            {board.length > 0 ? (
              <div>
                <div className={notificationClasses}>{board.length}</div>
                <div
                  className={
                    notification ? notificationClassesPing : notificationClasses
                  }
                >
                  {board.length}
                </div>
              </div>
            ) : (
              <></>
            )}
            <BookMarked size={32} color='#ee6c4d' strokeWidth={1} />
          </div>
        </div>
      ) : (
        <></>
      )}
      {props.device === 'desktop' && showStore ? (
        <div
          id='store'
          className='z-10000 fixed left-0 top-0 h-[100vh] w-[22vw] animate-slide border-r-2 border-solid border-[#ee6c4d] bg-[#2c2c2c] p-4 transition-all'
        >
          <div className='relative'>
            <X
              onClick={() => {
                setShowStore(false)
              }}
              className='absolute right-[-5px] top-[-15px] cursor-pointer rounded-full bg-[#2c2c2c] p-2 hover:bg-slate-600'
              size={32}
              strokeWidth={2}
            />
          </div>
          <div className='my-3 mt-[10px] text-center text-lg font-bold text-[#ee6c4d]'>
            Currently saved flights for this search
          </div>
          <div className='overflow-y-scoll no-scrollbar shadow-[0_10px_40px_-10px_rgba(0, 0, 0, 0.4)] flex  h-[82vh] flex-col flex-nowrap items-start overflow-x-hidden'>
            {board.map((flight) => {
              return (
                <FlightCard
                  key={flight.ID}
                  description={'description'}
                  title={'title'}
                  item={flight}
                  isSaved={true}
                  isDraggable={props.device === 'desktop'}
                  addToBoard={saveFlight}
                  handleRemove={deleteSavedFlight}
                  device={props.device === 'desktop' ? 'desktop' : 'mobile'}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <></>
      )}

      {dragging ? (
        <FadeIn transitionDuration={100}>
          <Drawer open={dragging}>
            {/* @ts-expect-error due to drawer things idk */}
            <DrawerContent ref={drop}>
              <div className='mx-auto flex h-[35vh] w-full max-w-sm items-center justify-center text-2xl font-bold text-[#ee6c4d]'>
                <div className='flex items-center justify-center text-center'>
                  <ArrowDownToLine
                    className='animate-bounce'
                    size={64}
                    color='#ee6c4d'
                    strokeWidth={2}
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </FadeIn>
      ) : (
        <></>
      )}
      <div className='mx-[10vw] mt-1 flex min-w-[50vw] max-w-[50vw] flex-row items-center justify-between overflow-x-hidden overflow-y-hidden'>
        <p className='my-3 mr-4 overflow-x-hidden overflow-y-hidden text-center text-lg font-bold text-[#ee6c4d]'>
          {props.data.length === 0
            ? 'No flight results for inputted options'
            : 'Flight results'}
        </p>
        {props.data.length === 0 ? (
          <></>
        ) : (
          <FlightFilterPopover
            selectedSort={sortMethod}
            setSelectedSort={setSortMethod}
            results={numFlightsToReturn}
            setResults={setNumFlightsToReturn}
          />
        )}
        {props.device === 'desktop' && props.data.length !== 0 ? (
          <ToggleGroup variant='outline' type='single' defaultValue={'grid'}>
            <ToggleGroupItem
              value='grid'
              defaultChecked
              onClick={() => {
                setGrid(true)
              }}
            >
              <Grid2X2 size={20} />
            </ToggleGroupItem>
            <ToggleGroupItem
              value='list'
              onClick={() => {
                setGrid(false)
              }}
            >
              <AlignJustify size={20} />
            </ToggleGroupItem>
          </ToggleGroup>
        ) : (
          <></>
        )}
      </div>

      <div
        className={
          props.device === 'desktop'
            ? `flex min-w-[50vw] max-w-[50vw] overflow-y-hidden ${grid ? 'flex-row flex-wrap justify-center' : 'flex-col flex-nowrap items-center'}`
            : cardGridMobileClasses
        }
      >
        {FlightList.sort((a, b) => {
          if (sortMethod === 'PRICE') {
            return a.MileageCost - b.MileageCost
          } else if (sortMethod === 'DURATION') {
            return a.TotalDuration - b.TotalDuration
          } else {
            return a.Stops - b.Stops
          }
        })
          .slice(0, numFlightsToReturn)
          .map((flight): ReactElement => {
            // Only show flights that are not already saved
            if (!board.some((savedFlight) => savedFlight.ID === flight.ID)) {
              return (
                <FlightCard
                  key={flight.idx}
                  description='description'
                  title='title'
                  item={flight}
                  grid={grid}
                  handleRemove={deleteSavedFlight}
                  addToBoard={saveFlight}
                  isSaved={false}
                  setCurrentlyDragging={setDragging}
                  isDraggable={props.device === 'desktop'}
                  device={props.device === 'desktop' ? 'desktop' : 'mobile'}
                />
              )
            }
            return <></>
          })}
      </div>
      {FlightList.length > numFlightsToReturn && (
        <div className='mt-5 flex flex-row justify-center'>
          <Button
            className='bg-white text-black hover:cursor-pointer hover:bg-black hover:text-white'
            onClick={() => {
              setNumFlightsToReturn(numFlightsToReturn + 6)
            }}
          >
            Show More
          </Button>
        </div>
      )}
      <div className='my-3 overflow-y-hidden text-center text-lg font-bold text-[#ee6c4d]'>
        {props.data.length >= 0 && props.device === 'mobile'
          ? 'Currently saved flights for this search'
          : ''}
      </div>
      <div
        className={
          props.data.length === 0
            ? 'hidden'
            : 'relative flex flex-row justify-center overflow-y-hidden'
        }
      >
        {props.device === 'mobile' ? (
          <div className={boardMobileClasses}>
            {board.map((flight) => {
              return (
                <FlightCard
                  key={flight.ID}
                  description={'description'}
                  title={'title'}
                  item={flight}
                  isSaved={true}
                  isDraggable={props.device === 'desktop'}
                  addToBoard={saveFlight}
                  handleRemove={deleteSavedFlight}
                  device={props.device === 'desktop' ? 'desktop' : 'mobile'}
                />
              )
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
export default FlightStore
