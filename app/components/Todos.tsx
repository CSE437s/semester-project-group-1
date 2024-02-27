import { Card, CardContent } from "./ui/card";

import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Todo } from "@/pages";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type Props  = {
    todos: Todo[]
    setTodos: (todos: Todo[]) => void
}

const groupTodosByDay = (todos: Todo[]) => {
    const groups = todos.reduce((groups, todo) => {
        // console.log(todo.date)
        const date = todo.date.toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(todo);
        return groups;
    }, {} as Record<string, Todo[]>);
    return Object.keys(groups).map((date) => {
        return {
            date,
            todos: groups[date],
        };
    });
}

export default function Todos(props: Props) {
    const todosByDay = groupTodosByDay(props.todos);

    const sb = useSupabaseClient();

    // handeclick for event of clicking on card (todo)
    const handleClick = async (e: any) => {
        // get the id of the todo
        // console.log(e)
        // return
        const id = e.currentTarget.id;
        console.log(id)
        // get the todo from the todos array
        const todo = props.todos.find((todo) => todo.id.toString() === id);
        
        props.setTodos(
            props.todos.map((todo) => {
                if (todo.id.toString() === id) {
                    return {
                        ...todo,
                        completed: !todo.completed,
                    };
                }
                return todo;
            })
        );

        // update the todo in supabase
        const res = await sb.from("tasks").update({
            completed: !todo?.completed,
        }).eq("id", id).select();
        console.log(res)
    }  

    return (
        <div className="w-[100vw] h-[80vh] flex flex-col items-center justify-center overflow-auto py-[5vh]">
            {todosByDay.map((group) => (
                <div key={group.date} className='flex flex-col justify-center items-center'>
                    <Badge variant='secondary' className='m-8'>{group.date}</Badge>
                        {group.todos.map((todo) => (
                            <Card 
                            key={todo.id}
                            id={todo.id.toString()}
                            className={`rounded-md cursor-pointer hover:bg-gray-300 w-[80vw] my-2 h-[10vh]
                            ${todo.completed && "bg-gray-100 hover:bg-gray-100 cursor-auto"} 
                            `}
                            onClick={handleClick}
                        >
                            <CardContent className="flex items-center space-x-2 p-4 h-[10vh]">
                            <Checkbox id={`task-${todo.id}`} checked={todo.completed} />
                                <div 
                                    className={`mx-4 
                                    ${todo.completed && "line-through"}`} 
                                >
                                    {todo.title}
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                </div>
            ))}
        </div>
    );
}