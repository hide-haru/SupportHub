"use strict";
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTasks } from "../hooks/useTasks";

export const TasksFilter = ({ filters, setFilters, masterData, onSearch }: any) => {

  const resetFilters = () => {
      setFilters({
      searchDate: "",
      dateFrom: "",
      dateTo: "",
      important: "",
      status: "",
      category: "",
      customer: "",
      });
  }

  return (
    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
      {/* 対象日付 */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">対象日付</Label>
        <Select value={filters.searchDate} onValueChange={(v) => setFilters((f:any)=>({...f, searchDate:v}))}>
          <SelectTrigger className="w-36 border">
            <SelectValue placeholder="対象選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">入電日時</SelectItem>
            <SelectItem value="2">対応期日</SelectItem>
            <SelectItem value="3">作成日時</SelectItem>
            <SelectItem value="4">更新日時</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 期間 */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">期間</Label>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters((f:any)=>({...f, dateFrom:e.target.value}))}
          className="w-36"
        />
        <span>〜</span>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters((f:any)=>({...f, dateTo:e.target.value}))}
          className="w-36"
        />
      </div>

      {/* 重要度 */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">重要度</Label>
        <Select value={filters.important} onValueChange={(v) => setFilters((f:any)=>({...f, important:v}))}>
          <SelectTrigger className="w-36 border">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="高">高</SelectItem>
            <SelectItem value="中">中</SelectItem>
            <SelectItem value="低">低</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ステータス */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">ステータス</Label>
        <Select value={filters.status} onValueChange={(v) => setFilters((f:any)=>({...f, status:v}))}>
          <SelectTrigger className="w-36 border">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            {masterData.statuses.map((s:any) => (
              <SelectItem key={s.status_id} value={s.status_id}>{s.status_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* カテゴリ */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">カテゴリ</Label>
        <Select value={filters.category} onValueChange={(v) => setFilters((f:any)=>({...f, category:v}))}>
          <SelectTrigger className="w-36 border">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            {masterData.categories.map((c:any) => (
              <SelectItem key={c.category_id} value={c.category_id}>{c.category_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 顧客名 */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">顧客名</Label>
        <Select value={filters.customer} onValueChange={(v) => setFilters((f:any)=>({...f, customer:v}))}>
          <SelectTrigger className="w-36 border">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            {masterData.customers.map((c:any) => (
              <SelectItem key={c.customer_id} value={c.customer_id}>{c.customer_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ボタン */}
      <div className="ml-auto flex gap-2">
        <Button variant="outline" onClick={resetFilters}>リセット</Button>
        <Button className="bg-blue-600 text-white" onClick={onSearch}>検索</Button>
      </div>
    </div>
  );
};
