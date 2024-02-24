import { User, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

import { FlightRequestForm } from "@/components/FlightRequestForm";
import Navbar from "@/components/Navbar";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date: Date;
};

export type NewTodo = {
  title: string;
  date: Date;
};


export default function Home() {
  const sb = useSupabaseClient();
  const user: User | null = useUser()

  const [loading, setLoading] = useState(false);

  return (
    <div className="w-[100vw] max-h-[100vh] flex flex-col justify-center items-between">
      <Navbar />
      {loading ? <p>Loading...</p> : 
      <div className="flex flex-row justify-center items-center h-[80vh]">
        <FlightRequestForm />
      </div>
      }
    </div>
  );
}
