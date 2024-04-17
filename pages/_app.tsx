import React, { useState } from 'react'
import '../../../../../styles/globals.css'
import {
  type Session,
  createPagesBrowserClient,
} from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { type AppProps } from 'next/app'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default MyApp
