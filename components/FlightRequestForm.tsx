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

import { Button } from "@/components/ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FlightResponseData } from "@/lib/route-types";
import airports from "@/lib/airports";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  outboundAirportCode: z
    .string()
    .min(3, {
      message: "Code must be at least 3 characters.",
    })
    .max(3, {
      message: "Code must be at most 3 characters.",
    }),
  inboundAirportCode: z
    .string()
    .min(3, {
      message: "Code must be at least 3 characters.",
    })
    .max(3, {
      message: "Code must be at most 3 characters.",
    }),
  startOutDate: z.date(),
  endOutDate: z.date(),
});

type Props = {
  setData: (data: FlightResponseData) => void;
  setLoading: (loading: boolean) => void;
  reference: any;
};

export function FlightRequestForm(props: Props) {
  const handleClick = () => {
    props.reference.current?.scrollIntoView({ behavior: "smooth" });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      outboundAirportCode: "",
      inboundAirportCode: "",
      startOutDate: new Date(),
      endOutDate: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    props.setLoading(true);

    fetch("/api/get-flights-basic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        outboundAirportCode: data.outboundAirportCode,
        inboundAirportCode: data.inboundAirportCode,
        outboundDate: data.startOutDate,
        inboundDate: data.endOutDate,
      }),
    })
      .then((res) => {
        if (res.status === 500) {
          throw new Error("Internal server error");
        }
        console.log(res);
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        props.setData(res as FlightResponseData);
        props.setLoading(false);
        handleClick();
        window.scrollTo({ top: 700, behavior: "smooth" });
      }); // TODO: add error catching
  };

  return (
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
                              "max-w-[200px] justify-between",
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
                              "max-w-[200px] justify-between",
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
            <div className="flex flex-row justify-between items-center w-[35vw]">
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
                            date < new Date() ||
                            date < form.getValues("startOutDate")
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
      )}
    </div>
  );
}
