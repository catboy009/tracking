'use client'

import { cn } from '@/lib/utils'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import useSWR from 'swr'

interface Checkpoint {
  time: string
  status_raw: string
}

interface TrackingData {
  checkpoints: Checkpoint[]
}

interface ApiResponse {
  data: TrackingData
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization-Token': 'e1e9872ba84c0e91a99bf560f92bf60b572cb03074497d59021c3f5904494f6103cfd9b227c4ed9e',
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Request failed: ${response.status} - ${errorBody}`)
  }

  return response.json()
}

const Home: NextPage = () => {
  const [trackingNumber, setTrackingNumber] = useState<string>('AER008741799')
  const [provider, setProvider] = useState<string>('cainiao')

  const { data, error } = useSWR<ApiResponse>(
    trackingNumber && provider
      ? `https://corsanywhere-two.vercel.app/api/proxy?url=https://gdeposylka.ru/api/v4/tracker/${provider}/${trackingNumber}`
      : null,
    fetcher,
  )

  return (
    <section>
      <div>
        <div className='flex flex-col'>
          <input
            aria-label='Enter tracking number'
            placeholder='Enter tracking number'
            spellCheck={false}
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className={cn(
              'rounded-none border border-surface0 bg-base',
              'py-2 px-4 capitalize shadow-sm',
              'outline-none transition-colors duration-300',
              'placeholder:text-overlay0 hover:border-surface1',
              'focus:text-text focus:border-surface2',
            )}
          />
          <input
            aria-label='Enter provider e.g., cainiao'
            placeholder='Enter provider e.g., cainiao'
            spellCheck={false}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={cn(
              'rounded-none border border-surface0 bg-base',
              'py-2 px-4 capitalize shadow-sm',
              'outline-none transition-colors duration-300',
              'placeholder:text-overlay0 hover:border-surface1',
              'focus:text-text focus:border-surface2',
            )}
          />
        </div>

        <div className='mt-8'>
          {error
            ? <p className='text-red font-bold'>Try again :) Error: {error.message}</p>
            : !data
            ? <p className='italic text-overlay0'>loading...</p>
            : (
              <ul className='animated-list flex flex-col'>
                {data.data.checkpoints.map((checkpoint, index) => (
                  <li key={index} className='pb-8'>
                    <span className='font-bold mr-5'>
                      {checkpoint.status_raw === 'GTMS_SIGNED' ? 'Received' : checkpoint.status_raw}
                    </span>
                    <span className='italic text-overlay0'>{checkpoint.time}</span>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </section>
  )
}

export default Home
