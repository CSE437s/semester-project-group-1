import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { DropdownMenuRadioGroupWithOptions } from './ui/DropdownMenuRadioGroup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type SORT_METHODS } from './FlightStore'
import React, { type ReactElement } from 'react'

interface Props {
  selectedSort: SORT_METHODS
  setSelectedSort: (value: SORT_METHODS) => void
  results: number
  setResults: (value: number) => void
}

export function FlightFilterPopover(props: Props): ReactElement {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='text-black '>
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='width'># Results (min 3)</Label>
              <Input
                id='width'
                defaultValue={props.results}
                className='col-span-2 h-8'
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value >= 3) {
                    props.setResults(value)
                  }
                }}
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label htmlFor='sort'>Sort</Label>
              <DropdownMenuRadioGroupWithOptions
                selectedSort={props.selectedSort}
                setSelectedSort={props.setSelectedSort}
                label={'Sort by'}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
