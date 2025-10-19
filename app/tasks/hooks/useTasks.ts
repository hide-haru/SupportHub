"use client";
import { useState, useCallback } from "react";
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

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // マスタ取得
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

      // タスク検索
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`/api/tasks?${params.toString()}`);
      const result = await response.json();
      setTasksData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, tasksData, fetchAllData, filters, setFilters, masterData };
};
