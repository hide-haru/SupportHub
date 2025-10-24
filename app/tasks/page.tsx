"use client";
"use strict";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTasks } from "./hooks/useTasks";
import { TasksNav } from "./components/TasksNav";
import { TasksFilter } from "./components/TasksFilter";
import { TasksTable } from "./components/TasksTable";

export default function TasksPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { isLoading, tasksData, fetchAllData, filters, setFilters, masterData } = useTasks();

  //------------------------------------------
  // ✅ 初回表示：ログイン確認 & 全件取得
  //------------------------------------------
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace("/login");
        return;
      }
      setSession(data.session);

      // 初期ロード時に全件取得
      await fetchAllData();
    };

    init();

    // ✅ 認証状態監視（ログアウト時など）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session) router.replace("/login");
      else await fetchAllData();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  //------------------------------------------
  // ✅ リサイズ時も再取得
  //------------------------------------------
  useEffect(() => {
    const handleResize = () => fetchAllData();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchAllData]);

  //------------------------------------------
  // ✅ ローディング中表示
  //------------------------------------------
  if (isLoading) return <p className="p-6 text-gray-500">読み込み中...</p>;

  return (
    <>
      <TasksNav userId={userId} />
      <TasksFilter
        filters={filters}
        setFilters={setFilters}
        masterData={masterData}
        onSearch={fetchAllData} // ←検索ボタン押下時のみfetch実行
      />
      <TasksTable data={tasksData} />
    </>
  );
}
