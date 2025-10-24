"use client";
import { useState, useCallback, useEffect } from "react";
import { TaskType } from "@/types/TasksTable";
import { fetchCategory } from "@/lib/db/category";
import { fetchCutomers } from "@/lib/db/customer";
import { fetchStatus } from "@/lib/db/status";

export const useTasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksData, setTasksData] = useState<TaskType[]>([]);
  const [filters, setFilters] = useState({
    searchDate: "",
    dateFrom: "",
    dateTo: "",
    important: "",
    status: "",
    category: "",
    customer: "",
  });
  const [masterData, setMasterData] = useState({
    statuses: [] as any[],
    categories: [] as any[],
    customers: [] as any[],
  });

  //------------------------------------------
  //初回のみマスタデータを取得
  //------------------------------------------
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statusRes, categoryRes, customerRes] = await Promise.all([
          fetchStatus(),
          fetchCategory(),
          fetchCutomers(),
        ]);
        const [statusJson, categoryJson, customerJson] = await Promise.all([
          statusRes.json(),
          categoryRes.json(),
          customerRes.json(),
        ]);

        setMasterData({
          statuses: statusJson.data || [],
          categories: categoryJson.data || [],
          customers: customerJson.data || [],
        });
      } catch (err) {
        console.error("Master fetch error:", err);
      }
    };
    fetchMasterData();
  }, []);

  //------------------------------------------
  //タスクデータ取得（filters指定可能）
  //------------------------------------------
  const fetchAllData = useCallback(async (targetFilters?: typeof filters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams((targetFilters ?? filters) as any);
      const response = await fetch(`/api/tasks?${params.toString()}`);
      const result = await response.json();
      setTasksData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Tasks fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← filters依存なし（引数で渡す）

  return { isLoading, tasksData, fetchAllData, filters, setFilters, masterData };
};
