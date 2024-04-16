'use client'

import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type SORT_METHODS, SORT_METHODS_LIST } from '../FlightStore'

import { Button } from '@/components/ui/button'

export interface DropdownOptions {
  value: string
  label: string
}

interface Props {
  // options: SORT_METHODS
  label: string
  selectedSort: SORT_METHODS
  setSelectedSort: (value: SORT_METHODS) => void
}

const valueInOptions = (value: string) => {
  for (const option in SORT_METHODS_LIST) {
    if (option === value) {
      return true
    }
  }
  return false
}

export function DropdownMenuRadioGroupWithOptions(props: Props) {
  const handleValueChange = (value: string) => {
    if (value === 'PRICE' || value === 'DURATION' || value === 'STOPS') {
      props.setSelectedSort(value)
    } else {
      props.setSelectedSort('PRICE')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='text-black '>
          Filter By
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{props.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={props.selectedSort}
          onValueChange={handleValueChange}
        >
          {SORT_METHODS_LIST.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
