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

export type DropdownOptions = {
    value: string
    label: string
}

type Props = {
    options: DropdownOptions[]
    label: string
    selected: string
    setSelected: (value: string) => void
}

export function DropdownMenuRadioGroupWithOptions(props: Props) {
    const options = props.options
//   const [position, setPosition] = React.useState(options[0].value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-black ">Filter By</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{props.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={props.selected} onValueChange={props.setSelected}>
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
