"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { SORT_METHODS } from "../FlightStore"

export type DropdownOptions = {
    value: SORT_METHODS
    label: string
}

type Props = {
    options: DropdownOptions[]
    label: string
    selectedSort: SORT_METHODS
    setSelectedSort: (value: SORT_METHODS) => void
}

export function DropdownMenuRadioGroupWithOptions(props: Props) {
    const options = props.options

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-black ">Filter By</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{props.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={props.selectedSort} onValueChange={props.setSelectedSort}>
            {options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
                </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
