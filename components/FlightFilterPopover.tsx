import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenuRadioGroupWithOptions } from "./ui/DropdownMenuRadioGroup";
import { SORT_METHODS } from "./FlightStore";

export type DropdownOptions = {
    value: SORT_METHODS
    label: string
}

type Props = {
    options: DropdownOptions[]
    selectedSort: SORT_METHODS
    setSelectedSort: (value: SORT_METHODS) => void
    results: number
    setResults: (value: number) => void
}

export function FlightFilterPopover(props: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="text-black ">Filters</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width"># Results (min 3)</Label>
                            <Input
                                id="width"
                                defaultValue={props.results}
                                className="col-span-2 h-8"
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 3) {
                                        props.setResults(value);
                                    }
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="sort">Sort</Label>
                            <DropdownMenuRadioGroupWithOptions
                                options={props.options}
                                selectedSort={props.selectedSort}
                                setSelectedSort={props.setSelectedSort} label={"Sort by"}                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}