import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { BasicFlightRequest } from "@/lib/route-types";
import { Button } from "@/components/ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FlightOption } from "@/lib/availability-types";
import { ReducedFlightRequestForm } from "./ReducedFlightRequestForm";
import airports from "@/lib/airports";
import { cn } from "@/lib/utils";
import { fetchFlights } from "@/lib/requestHandler";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  outboundAirportCode: z
    .string()
    .min(3, {
      message: "Enter an airport code.",
    })
    .max(3, {
      message: "Enter an airport code.",
    }),
  inboundAirportCode: z
    .string()
    .min(3, {
      message: "Enter an airport code.",
    })
    .max(3, {
      message: "Enter an airport code.",
    }),
  beginRangeSearch: z.date(),
  endRangeSearch: z.date(),
});

export type RequestFormData = z.infer<typeof FormSchema>;

type Props = {
  setData: (data: FlightOption[]) => void;
  setLoading: (loading: boolean) => void;
  reference: any;
};

export function FlightRequestForm(props: Props) {
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState<RequestFormData>();
  const handleClick = () => {
    props.reference.current?.scrollIntoView({ behavior: "smooth" });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      outboundAirportCode: "",
      inboundAirportCode: "",
      beginRangeSearch: new Date(),
      endRangeSearch: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    props.setLoading(true);
    setData(data);
    const res: FlightOption[] = await fetchFlights(data)
    props.setData(res);
    props.setLoading(false);
    setExpanded(false);
    handleClick();
    window.scrollTo({ top: 700, behavior: "smooth" });
  };

  return (
    <div>
      {!expanded ? (
        <ReducedFlightRequestForm data={data} setExpanded={setExpanded} />
      ) : (
        <div className="flex flex-row items-center">
          {airports.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6 h-auto"
              >
                <div className="flex flex-row justify-between items-center w-[35vw]">
                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="outboundAirportCode"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pb-2">
                          <FormLabel>Outbound Airport</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between text-black",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? airports.find(
                                        (airport) =>
                                          `${airport.iata}` === field.value
                                      )?.name
                                    : "Select Airport"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[200px] p-0 items-start">
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
                                        form.setValue(
                                          "outboundAirportCode",
                                          airport.iata
                                        );
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
                                    "min-w-[400px] justify-between text-black",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? airports.find(
                                        (airport) =>
                                          `${airport.iata}` === field.value
                                      )?.name
                                    : "Select Airport"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[200px] p-0 items-start">
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
                                        form.setValue(
                                          "inboundAirportCode",
                                          airport.iata
                                        );
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
                </div>
                <div className="flex flex-row lg:flex-nowrap flex-wrap justify-between items-center w-[35vw]">

                  <FormField
                    control={form.control}
                    name="beginRangeSearch"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date Range Start</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[175px] pl-3 text-left font-normal text-black",

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
                              disabled={(date) => date < new Date()}
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
                    name="endRangeSearch"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date Range End</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(

                                  "w-[175px] pl-3 text-left font-normal text-black",

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
                                date < new Date() ||
                                date < form.getValues("beginRangeSearch")
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
                <div className="flex flex-row justify-between w-full">
                  <Button className="bg-[#ee6c4d]" type="submit">
                    Submit
                  </Button>
                  {data && (
                    <Button

                      className="bg-white text-black hover:bg-white"

                      onClick={() => setExpanded(false)}
                    >
                      Compress
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}
