import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { NewTodo } from "@/pages";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type Props = {
    handleSubmit: (todo: NewTodo) => void;

}

export default function MakeTodo(props: Props) {
    const [value, setValue] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);

    // const sb = useSupabaseClient();
    
    const handleSelect = (day: Date | undefined) => {
        if (!day) return;
        setDate(day);
        setOpen(false);
    }
    
    return (
        <div className="w-[100vw] flex flex-row items-center justify-center my-5">
            <Input 
                placeholder="Add a todo"
                className="w-[70vw]"
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        props.handleSubmit({
                            title: value,
                            date: date || new Date(),
                        });
                        setValue("");
                        setDate(new Date());
                    }
                }}
            />
            <Popover open={open}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className='mx-1' onClick={() => setOpen(true)}>
                        <CalendarIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    className="rounded-md border shadow"
                />
                </PopoverContent>
            </Popover>
        </div>
    );
}