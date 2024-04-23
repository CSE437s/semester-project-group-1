import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FlightRequestForm,
  type RequestFormData,
} from '@/components/FlightRequestForm'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  type User,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import React, { type ReactElement, useRef, useState } from 'react'

import { type CreateEmbeddingResponse } from 'openai/resources/index.mjs'
import { DndProvider } from 'react-dnd'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import { type FlightOption } from '@/lib/availability-types'
import FlightStore from '@/components/FlightStore'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Input } from '@/components/ui/input'
import { LogOut } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import SavedFlights from '@/components/SavedFlights'
import { Toaster } from 'sonner'
import { fetchFlights } from '@/lib/requestHandler'
import { useIsMobile } from '@/lib/utils'
import { useRouter } from 'next/router'

export const dynamic = 'force-dynamic' // TODO: this was here for a reason, figure out why

type QueryLoadingStatus =
  | 'done'
  | 'calling_openai'
  | 'calling_supabase'
  | 'loading_flights'

export default function Home(): ReactElement {
  const sb = useSupabaseClient()
  const user: User | null = useUser()
  const router = useRouter()

  const [expanded, setExpanded] = useState(true)
  const [queryExpanded, setQueryExpanded] = useState(true)

  const [loading, setLoading] = useState(false)
  const [queryLoading, setQueryLoading] = useState<QueryLoadingStatus>('done')
  const [data, setData] = useState<FlightOption[] | undefined>()
  const [queryData, setQueryData] = useState<FlightOption[] | undefined>()
  const [queryValue, setQueryValue] = useState('')
  const [flightCallingStatus, setFlightCallingStatus] = useState(0)

  const isMobile = useIsMobile(680)

  const [page, setPage] = useState('input')

  const handleSetPage = (page: string): void => {
    setPage(page)
    setExpanded(true)
    setQueryExpanded(true)
    setQueryValue('')
    setData(undefined)
    setQueryData(undefined)
  }

  const ref = useRef<any>(null)

  const handleLogout = async (): Promise<void> => {
    await sb.auth.signOut()
    await router.push('/login')
  }

  interface EmbeddingSearchResponse {
    iata: string
    id: number
    similarity: number
  }

  const getQueryEmbedding = async (
    query: string
  ): Promise<CreateEmbeddingResponse> => {
    // fetch to 'get-embedding' endpoint
    const res = await fetch('/api/get-embedding', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await res.json()
  }

  const statusToProgress = (
    status: QueryLoadingStatus,
    flightCallingStatus: number
  ): number => {
    switch (status) {
      case 'done':
        return 100
      case 'calling_openai':
        return 20
      case 'calling_supabase':
        return 40
      case 'loading_flights':
        return 60 + flightCallingStatus * 0.4
    }
  }

  const statusToMessage = (
    status: QueryLoadingStatus,
    flightCallingStatus: number
  ): string => {
    switch (status) {
      case 'done':
        return 'Done'
      case 'calling_openai':
        return 'Preparing your query...'
      case 'calling_supabase':
        return 'In the oven...'
      case 'loading_flights':
        return `Grabbing flights -- ${flightCallingStatus}%`
    }
  }

  const trimEmbedding = (embedding: number[]): number[] => {
    return embedding.slice(0, 512)
  }

  const handleSubmitQuery = async (): Promise<void> => {
    setQueryLoading('calling_openai')

    const res: CreateEmbeddingResponse = await getQueryEmbedding(queryValue)
    if (res.data.length === 0) {
      console.error('Error fetching embedding', res)
      setQueryLoading('done')
      return
    }
    const embedding = trimEmbedding(res.data[0]?.embedding ?? [])

    setQueryLoading('calling_supabase')

    const { data: documents } = (await sb.rpc('match_documents', {
      query_embedding: embedding, // Pass the embedding you want to compare
      match_threshold: 0.3, // Choose an appropriate threshold for your data
      match_count: 10, // Choose the number of matches
    })) as { data: EmbeddingSearchResponse[] }

    console.log(documents)

    // fetch flights for the top 3 matches
    const TOP = 7
    const fetchData: RequestFormData[] = documents.slice(0, TOP).map((doc) => {
      const today1am = new Date()
      today1am.setDate(today1am.getDate() + 1)
      const tomorrow11pm = new Date()
      tomorrow11pm.setDate(tomorrow11pm.getDate() + 2)
      today1am.setHours(0, 0, 0, 0)
      tomorrow11pm.setHours(23, 59, 59, 999)

      return {
        outboundAirportCode: 'ORD',
        inboundAirportCode: doc.iata,
        beginRangeSearch: today1am,
        endRangeSearch: tomorrow11pm,
      }
    })

    setQueryLoading('loading_flights')

    const numFlightsToFetch = fetchData.length

    function updateFlightCallingStatus(
      completedFetches: number,
      totalFetches: number,
      setFlightCallingStatus: (status: number) => void
    ): void {
      const percentageComplete = Math.floor(
        (100 * completedFetches) / totalFetches
      )
      setFlightCallingStatus(percentageComplete)
    }

    const flightDataPromises = fetchData.map(
      async (data, idx) =>
        await fetchFlights(data).then((result) => {
          // After each fetch, increment the count of completed fetches and update the status
          completionTracker[idx] = true
          const completedFetches = completionTracker.filter(Boolean).length
          updateFlightCallingStatus(
            completedFetches,
            numFlightsToFetch,
            setFlightCallingStatus
          )
          return result
        })
    )

    // Initialize an array to keep track of which fetches have completed
    const completionTracker = new Array(numFlightsToFetch).fill(false)

    const flightData = await Promise.all(flightDataPromises)

    // squash down and set queryData
    setQueryData(flightData.flat())
    setQueryLoading('done')
    setFlightCallingStatus(0)
    setQueryValue('')
  }

  function renderInput(): ReactElement {
    return (
      <>
        {expanded && (
          <>
            <div className='my-3 overflow-y-hidden px-20 text-center text-2xl font-bold text-white'>
              Search for one-way flights
            </div>
            <div className='text-md my-3 overflow-y-hidden px-20 text-center font-normal text-white'>
              Find one way flights to a destination within a date range. Save
              flights for later to your profile.
            </div>
          </>
        )}

        <div className='my-10 px-[50px]'>
          <div className='md:flex md:items-center md:justify-center'>
            <FlightRequestForm
              setData={setData}
              setLoading={setLoading}
              reference={ref}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </div>
        </div>
        <div ref={ref}>
          <div className='flex justify-center text-xl font-bold text-[#ee6c4d]'>
            {loading && <div>Loading...</div>}
          </div>
          {data !== undefined ? (
            !isMobile ? (
              renderDragCards(data)
            ) : (
              renderMobileCards(data)
            )
          ) : (
            <></>
          )}
        </div>
      </>
    )
  }

  function renderQuery(): ReactElement {
    return (
      <>
        {/* TODO make querys work */}
        <div className='flex flex-col items-center'>
          {queryExpanded && (
            <>
              <div className='my-5 w-[400px] px-5 text-center text-2xl font-bold text-[#fafafa]'>
                Write a query to search up flights
              </div>
              <div className='my-5 w-[400px] px-5 text-center font-normal text-[#fafafa]'>
                If you don&apos;t know where to go, you can write any query to
                search for flights. Our query uses an AI language model to
                translate any valid request into a flight searching
                extravaganza. For the moment, we have this set to assume you are
                leaving O&apos;Hare in Chicago mode -- it will search for
                flights from ORD to anywhere in the US, for today.
              </div>
            </>
          )}
          <Input
            className='mb-2 h-12 max-w-[350px] bg-[#fafafa] text-black'
            type='text'
            placeholder='Write query here'
            value={queryValue}
            onChange={(e) => {
              // check if the change was an enter key press, if not update the query value. remember that e is a ChangeEvent<HTMLInputElement>
              if (e.target.value !== '\n') {
                setQueryValue(e.target.value)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleSubmitQuery()
                setQueryExpanded(false)
              }
            }}
          ></Input>
        </div>
        <div ref={ref}>
          <div className='flex justify-center text-xl font-bold text-[#ee6c4d]'>
            {queryLoading !== 'done' && (
              <div className='flex flex-col'>
                <p className='text-base font-light text-[#fafafa]'>
                  {statusToMessage(queryLoading, flightCallingStatus)}
                </p>
                <Progress
                  value={statusToProgress(queryLoading, flightCallingStatus)}
                  className='w-[40vw]'
                />
              </div>
            )}
          </div>
          {queryData !== undefined ? (
            !isMobile ? (
              renderDragCards(queryData)
            ) : (
              renderMobileCards(queryData)
            )
          ) : (
            <></>
          )}
        </div>
      </>
    )
  }

  function renderSaved(): ReactElement {
    return (
      <>
        {/* TODO make api calls for all flights from db to get information with te flights in savedFlights */}

        <div className='flex flex-col items-center'>
          <h1 className='text-2xl font-bold'>Saved Flights</h1>
          <div className='my-5 w-[400px] text-center font-normal text-[#fafafa]'>
            Due to the nature of airline points and flights, flight information
            changes all the time. Flight prices might be higher or lower
            depending on when you last viewed them. Thus, make sure to
            periodically check this page for the most up to date information
            regarding your saved flights.
          </div>
          <SavedFlights device={!isMobile ? 'desktop' : 'mobile'} />
        </div>
      </>
    )
  }

  function renderDragCards(data: FlightOption[]): ReactElement {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className='flex h-auto flex-row justify-center'>
          <FlightStore data={data} device='desktop' />
        </div>
      </DndProvider>
    )
  }

  function renderMobileCards(data: FlightOption[]): ReactElement {
    return (
      <div>
        <DndProvider backend={HTML5Backend}>
          <FlightStore data={data} device='mobile' />
        </DndProvider>
      </div>
    )
  }

  return (
    <div className='relative flex min-h-[100vh] w-screen max-w-[100vw] flex-col overflow-x-hidden bg-[#1f1b24]  text-[#fafafa]'>
      <Toaster />
      <div className='m-5 flex w-full flex-col items-center justify-center text-xs min-[1000px]:flex-row min-[1000px]:space-x-14 min-[1000px]:text-sm'>
        <div className='text-lg font-bold text-white'>
          Fli<span className='text-cyan-300'>ghts</span>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem
              className={`cursor-pointer rounded-md p-2 transition-all hover:bg-slate-200 hover:text-black
                ${page === 'input' ? 'text-[#ee6c4d]' : 'text-white'}
                `}
              onClick={() => {
                handleSetPage('input')
              }}
            >
              Input Search
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`cursor-pointer rounded-md p-2 transition-all hover:bg-slate-200 hover:text-black
              ${page === 'query' ? 'text-[#ee6c4d]' : 'text-white'}
              `}
              onClick={() => {
                handleSetPage('query')
              }}
            >
              Query Search
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`cursor-pointer rounded-md p-2 transition-all hover:bg-slate-200 hover:text-black
              ${page === 'saved' ? 'text-[#ee6c4d]' : 'text-white'}
              `}
              onClick={() => {
                handleSetPage('saved')
              }}
            >
              Saved Flights
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback className='cursor-pointer rounded-full bg-[#ee6c4d] p-1 text-sm text-white transition-all hover:bg-black hover:text-white'>
                {user === null ? '' : user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 rounded-md bg-black shadow-lg'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem
              className='text-sm font-normal text-white'
              disabled
            >
              {user !== null ? user.email : ''}
            </DropdownMenuItem>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {page === 'input'
        ? renderInput()
        : page === 'query'
          ? renderQuery()
          : renderSaved()}
    </div>
  )
}
