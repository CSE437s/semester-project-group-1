import {
  type User,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import React, { useState, useEffect, useRef } from 'react'
import FlightCardMobile from './FlightCardMobile'
import { FlightResponseData } from '@/lib/route-types'
import { type FlightOption } from '@/lib/availability-types'

// TODO
// These cards are flight cards and should be pulled from the flights that the user searches for
const CardList = [
  {
    id: 1,
    title: 'Card 1',
    description: 'Description of card 1',
  },
  {
    id: 2,
    title: 'Card 2',
    description: 'Description of card 2',
  },
  {
    id: 3,
    title: 'Card 3',
    description: 'Description of card 3',
  },
]

// cards added to board should be removed from card list.
// don't need to keep trakc of cards added, but if you press x they should be removed from saved

interface Props {
  data: FlightOption[]
}

function FlightStoreMobile(props: Props) {
  const [board, setBoard] = useState<any[] | []>([])
  const sb = useSupabaseClient()
  const user: User | null = useUser()

  const ref = useRef<any>(null)

  useEffect(() => {
    async function getData() {
      if (user != null) {
        const data = await sb
          .from('saved_flights')
          .select('flight_id')
          .eq('user_id', user.id)
        // console.log(data);
      }
      // TODO
      // Potentially add flights to the board below, but need to make a request again for flights
    }

    getData()
    // console.log(user);
    // console.log(props.data.data);
  }, [])

  const FlightList = props.data.map((item, idx) => ({
    ...item,
    idx,
  }))

  const handleRemove = async (id: any) => {
    const flightList: any = FlightList.filter(
      (flight: any) => id === flight.idx
    )
    setBoard(board.filter((flight) => flight.idx !== id))
    if (user !== null) {
      await sb
        .from('saved_flights')
        .delete()
        .match({ flight_id: flightList[0].ID, user_id: user.id })
    }
  }

  const addCardToBoard = async (id: any) => {
    const flightList: any = FlightList.filter(
      (flight: any) => id === flight.idx
    )
    setBoard((board) => [...board, flightList[0]])
    if (user !== null) {
      await sb
        .from('saved_flights')
        .insert({ flight_id: flightList[0].ID, user_id: user.id })
    }
  }

  return (
    <div className='mb-10 flex flex-col'>
      <div className='my-3 text-center text-lg font-bold text-[#ee6c4d]'>
        Flight Results
      </div>
      <div className='flex  flex-col items-center justify-center'>
        {FlightList.map((flight) => {
          return (
            <FlightCardMobile
              description='description'
              title='title'
              id={flight.idx}
              item={flight}
              addCardToBoard={addCardToBoard}
              handleRemove={handleRemove}
              x={false}
              reference={ref}
            />
          )
        })}
      </div>
      <div className='my-3 text-center text-lg font-bold text-[#ee6c4d]'>
        Flights currently saved for later
      </div>
      <div ref={ref} className='flex flex-row justify-center'>
        <div className='no-scrollbar flex h-auto w-[80vw] flex-col flex-nowrap justify-center overflow-x-hidden overflow-y-scroll rounded-xl border-2   border-solid border-[#ee6c4d] bg-[#2c2c2c] p-8'>
          {board.map((flight) => {
            return (
              <FlightCardMobile
                description='description'
                title='title'
                id={flight.idx}
                item={flight}
                x={true}
                addCardToBoard={addCardToBoard}
                handleRemove={handleRemove}
                reference={ref}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FlightStoreMobile
