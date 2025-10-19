"use client";
"use strict";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { TaskType } from "@/types/TasksTable";
import { useTasks } from "./hooks/useTasks";
import { TasksNav } from "./components/TasksNav";
import { TasksFilter } from "./components/TasksFilter";
import { TasksTable } from "./components/TasksTable";


export default function TasksPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { isLoading, tasksData, fetchAllData, filters, setFilters, masterData } = useTasks();

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      router.replace("/login");
      return;
    }
    setSession(data.session);
    await fetchAllData();
  };
  init();

  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    setSession(session);
    if (!session) router.replace("/login");
    else await fetchAllData();
  });

  return () => listener.subscription.unsubscribe();
  }, []);




  //if (isLoading) return <p className="p-6 text-gray-500">読み込み中...</p>;

  return (
    <>
      <TasksNav userId={userId} />
      <TasksFilter filters={filters} setFilters={setFilters} masterData={masterData} onSearch={fetchAllData} />
      <TasksTable data={tasksData} />
    </>
  );
}
