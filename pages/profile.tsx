import React, { type ReactElement, useState } from 'react'
import {
  type User,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { Button } from '@/components/ui/button'

import { useRouter } from 'next/router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const dynamic = 'force-dynamic' // TODO: this was here for a reason, figure out why

export default function Home(): ReactElement {
  const sb = useSupabaseClient()
  const user: User | null = useUser()
  const router = useRouter()
  const [logOut, setLogOut] = useState(false)

  const sendBack = async (): Promise<void> => {
    await router.push('/login')
  }

  if (user == null) {
    void sendBack()
  }

  const handleLogout = async (): Promise<void> => {
    setLogOut(true)
    await router.push('/login')
    await sb.auth.signOut()
  }

  const changePage = async (pageToChangeTo: string): Promise<void> => {
    await router.push('/' + pageToChangeTo)
  }

  return (
    <div className='h-screen bg-[#1f1b24] text-[#fafafa]'>
      <div className=' flex flex-col items-center justify-center'>
        <div className='my-5 flex w-[30vw] flex-row items-center justify-between space-x-2.5 text-lg'>
          <Button
            className='rounded-full bg-black transition-all hover:bg-slate-400'
            onClick={() => {
              void (async () => {
                await changePage('')
              })
            }}
          >
            &#8592;
          </Button>
          <div>Profile</div>
          <Avatar>
            <AvatarFallback className='rounded-full bg-[#ee6c4d] text-white transition-all'>
              {user == null ? 'JD' : user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='text-md my-5  flex w-[40vw] flex-row items-center justify-center'>
          {user == null ? 'user@email.com' : user.email}
        </div>
        <div className='text-md my-5 flex w-[40vw] flex-row items-center justify-center'>
          <Button
            onClick={() => {
              void (async () => {
                await handleLogout()
              })
            }}
          >
            Log out
          </Button>
        </div>
        <div className='text-md my-5 flex w-[40vw] flex-row items-center justify-center'>
          {logOut ? <div>Logging out...</div> : <></>}
        </div>
      </div>
    </div>
  )
}
