import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

import type { API } from "../../api/src/index";
import { Button } from "@/components/ui/button"
import { Calendar } from "./ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ResponseData } from "../../api/src/clients/Seats.Aero/types"
import airports from "../lib/airports"
import { cn } from "@/lib/utils"
import { edenTreaty } from "@elysiajs/eden"
import { format } from "date-fns"
import { promises as fs } from 'fs';
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type Airport = {
    "icao": string,
    "iata": string,
    "name": string,
    "city": string,
    "state": string,
    "country": string,
    "elevation": number,
    "lat": number,
    "lon":  number,
    "tz": string
}

type AirportMap = {
    [key: string]: Airport
}

const FormSchema = z.object({
    outboundAirportCode: z.string().min(3, {
        message: "Code must be at least 3 characters.",
        }).max(3, {
        message: "Code must be at most 3 characters.",
    }),
    inboundAirportCode: z.string().min(3, {
        message: "Code must be at least 3 characters.",
        }).max(3, {
        message: "Code must be at most 3 characters.",
    }),
    startOutDate: z.date(),
    endOutDate: z.date(),
})

const api = edenTreaty<API>('http://localhost:4000')

type Props = {
    setData: (data: ResponseData) => void,
    setLoading: (loading: boolean) => void
}

export function FlightRequestForm(props: Props) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            outboundAirportCode: "",
            inboundAirportCode: "",
            startOutDate: new Date(),
            endOutDate: new Date(),
        },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    props.setLoading(true)
    api.api.request.post({
      origin_airport: data.outboundAirportCode, // TODO: make these names align
      destination_airport: data.inboundAirportCode,
      start_date: data.startOutDate.toISOString().split('T')[0],
      end_date: data.endOutDate.toISOString().split('T')[0]
    }).then((res: any) => {
      console.log(res.data)
      props.setData(res.data as ResponseData)
      props.setLoading(false)
    })
  }
  
  return (
    <div className="flex flex-row items-center">
        {airports.length === 0 ? <p>Loading...</p> : 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="flex flex-row justify-between items-center w-[40vw]">
        <FormField
          control={form.control}
          name="outboundAirportCode"
          render={({ field }) => (
            <FormItem className="flex flex-col px-2">
              <FormLabel>Outbound Airport</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "min-w-[320px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? airports.find(
                            (airport) => `${airport.iata}` === field.value
                          )?.name
                        : "Select Airport"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[320px] p-0 items-start">
                  <Command>
                    <CommandInput
                      placeholder="Search airports..."
                      className="h-9"
                    />
                    <CommandEmpty>No airport found.</CommandEmpty>
                    <CommandGroup>
                      {airports.map((airport) => (
                        <CommandItem
                          value={`${airport.name} (${airport.iata})`}
                          key={airport.iata}
                          onSelect={() => {
                            form.setValue("outboundAirportCode", airport.iata)
                          }}
                        >
                          {`${airport.name} (${airport.iata})`}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              airport.iata === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The airport you are flying from.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inboundAirportCode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Inbound Airport</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "min-w-[320px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? airports.find(
                            (airport) => `${airport.iata}` === field.value
                          )?.name
                        : "Select Airport"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-[320px] p-0 items-start">
                  <Command>
                    <CommandInput
                      placeholder="Search airports..."
                      className="h-9"
                    />
                    <CommandEmpty>No airport found.</CommandEmpty>
                    <CommandGroup>
                      {airports.map((airport) => (
                        <CommandItem
                          value={`${airport.name} (${airport.iata})`}
                          key={airport.iata}
                          onSelect={() => {
                            form.setValue("inboundAirportCode", airport.iata)
                          }}
                        >
                          {`${airport.name} (${airport.iata})`}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              airport.iata === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The airport you are flying to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <div className="flex flex-row justify-between items-center w-[40vw]">
            <FormField
                control={form.control}
                name="startOutDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date Range Start</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date < new Date()
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        The start of the date range you are flying.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="endOutDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date Range End</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date < new Date() || date < form.getValues("startOutDate")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        The end of the date range you are flying.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    }
    </div>
  )
}
