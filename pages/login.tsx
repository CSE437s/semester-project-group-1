/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XNlTLb7
 */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/router'
import React, { type ReactElement, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { validEmail } from '@/lib/utils'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

export default function Login(): ReactElement {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const handleCodeSubmit = async (): Promise<void> => {
    console.log(code)
    if (code === '' || code == null) {
      alert('Please enter a code.')
      return
    }
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error != null) {
      alert('Incorrect OTP. Please try again.') // TODO: make better
      setLoading(false)
      setSent(true)
      return
    }
    setLoading(false)
    if (session != null) {
      setLoading(true)
      await supabaseClient.auth.setSession(session)
      await router.push('/')
    }
  }

  const handleClick = async (): Promise<void> => {
    try {
      if (email === '') {
        alert('Please enter an email.')
        return
      }
      if (!validEmail(email)) {
        alert('Please enter a valid email.')
        return
      }
      setLoading(true)
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
      })
      if (error != null) {
        console.log(error.message)
        switch (error.message) {
          case 'Signups not allowed for otp':
            alert('No account exists. Please sign up') // FIXME:
            break
          case 'Email rate limit exceeded':
            alert(
              'Email rate limit exceeded due to Supabase free tier limitations. Please try again later.'
            )
            break
          case 'For security purposes, you can only request this once every 60 seconds':
            alert('60 second rate limit hit, please try again in a minute')
            break
          default:
            alert('There was an error. Please try again.') // TODO: make better
            break
        }
        setLoading(false)
        setEmail('')
        return
      }
      setLoading(false)
      setSent(true)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <div className='relative flex min-h-screen flex-col items-center overflow-x-hidden overflow-y-hidden bg-white'>
      <div className='absolute -left-[12.5vw] top-0 z-0 min-h-[80vh] w-[125vw]  rounded-b-full bg-gradient-to-r from-[#3d5a80] to-blue-300'></div>
      <div className='z-10 my-10 flex h-auto w-[350px] flex-col items-center justify-center space-y-6 overflow-x-hidden overflow-y-hidden rounded-lg border border-gray-200 bg-[#e0fbfc] p-4 py-8 shadow-lg dark:border-gray-700'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>Log In</h1>
          <p className='px-5 text-zinc-500 dark:text-zinc-400'>
            {sent
              ? 'Enter the one-time code sent to your email'
              : 'Enter your email to log in'}
          </p>
        </div>
        <div className='space-y-4'>
          <div className='space-y-2'>
            {loading ? (
              <p className='text-center'>Loading...</p>
            ) : (
              <>
                <Label className='text-center' htmlFor='email'>
                  {sent ? 'One-Time Code' : 'Email'}
                </Label>
                <div className='flex flex-row'>
                  {sent ? (
                    <>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        id='otp'
                        required
                        onChange={(e) => {
                          setCode(e)
                        }}
                        onSubmit={handleCodeSubmit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            void handleCodeSubmit()
                          }
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button
                        className='mx-2'
                        onClick={handleCodeSubmit}
                        onKeyDown={(e: { key: string }) => {
                          if (e.key === 'Enter') {
                            void handleCodeSubmit()
                          }
                        }}
                      >
                        Go
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        id='email'
                        placeholder={'m@example.com'}
                        required
                        type='email'
                        value={email}
                        onChange={handleChange}
                        onSubmit={handleClick}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            void handleClick()
                          }
                        }}
                      />
                      <Button
                        className='mx-2'
                        onClick={handleClick}
                        onKeyDown={(e: { key: string }) => {
                          if (e.key === 'Enter') {
                            void handleClick()
                          }
                        }}
                      >
                        Go
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
