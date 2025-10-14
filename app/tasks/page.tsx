"use strict"
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getSortedRowModel } from "@tanstack/react-table";
import { supabase } from "@/lib/supabaseClient";
import { TaskType } from "../components/TasksTable";

export default function Tasks() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 状態管理
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<any[]>([]);

  const [tasksData, setTasksData] = useState<TaskType[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [statasies, setStatasies] = useState<{ status_id: string; status_name: string }[] | null>(null);
  const [categories, setCategories] = useState<{ category_id: string; category_name: string }[] | null>(null);
  const [customersies, setCustomersies] = useState<{ customer_id: string; customer_name: string }[] | null>(null);

  // フィルター状態
  const [searchDate, setSearchDate] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [important, setImportant] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [customer, setCustomer] = useState("");

  // フィルターリセット
  const resetFilters = () => {
    setSearchDate("");
    setDateFrom("");
    setDateTo("");
    setImportant("");
    setStatus("");
    setCategory("");
    setCustomer("");
  };

  //検索条件
  const searchFilters = async() => {
    try{
      const params = new URLSearchParams({
        searchDate: searchDate || "",
        dateFrom: dateFrom || "",
        dateTo: dateTo || "",
        important: important || "",
        status: status || "",
        category: category || "",
        customer: customer || "",
      });
      console.log("bodyData", params);
      const response = await fetch(`/api/searchfilter?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const result = await response.json();
       if (result && Array.isArray(result)) {
        console.log("if",result);
        setTasksData(result);
      } else {
        console.log("else",result);
        setTasksData([]);
      }

    }catch(err){
      console.log(err, "サーバとの通信に失敗しました。再度、タスク一覧から選択をお願いします。")
    }
  }

  // マスタ取得
  const fetchFilters = async () => {
    try {
      const [statusRes, categoryRes, customerRes] = await Promise.all([
        fetch("../components/filters/Status_search"),
        fetch("../components/filters/category_search"),
        fetch("../components/filters/customer_search"),
      ]);

      const [statusJson, categoryJson, customerJson] = await Promise.all([
        statusRes.json(),
        categoryRes.json(),
        customerRes.json(),
      ]);

      if (statusJson.error || categoryJson.error || customerJson.error) {
        console.error("API error:", statusJson.error, categoryJson.error, customerJson.error);
        return;
      }

      setStatasies(statusJson.data);
      setCategories(categoryJson.data);
      setCustomersies(customerJson.data);
    } catch (err) {
      console.error(err);
    }
  };

  // タスク取得
  const fetchData = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasksData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setTasksData([]);
    }
  };

  // 初回ロード・セッション確認
  useEffect(() => {
    const init = async () => {

      const { data: {user}, } = await supabase.auth.getUser();
      //console.log("aiueo",user?.id ?? null);
      setUserId(user?.id ?? null);

      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/login"); // ログインなしなら強制遷移
        return;
      }

      setSession(data.session);
      await Promise.all([fetchData(), fetchFilters()]);
      setIsLoading(false);
    };
    init();

    // セッション変更監視
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session) {
        router.replace("/login");
      } else {
        await Promise.all([fetchData(), fetchFilters()]);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // テーブル定義
  const columnHelper = createColumnHelper<TaskType>();
  const columns = [
    columnHelper.accessor("no", { header: "No" }),
    columnHelper.accessor("important", { header: "重要度" }),
    columnHelper.accessor("status", { header: "ステータス" }),
    columnHelper.accessor("category", { header: "カテゴリ" }),
    columnHelper.accessor("call_datetime", { header: "入電日時" }),
    columnHelper.accessor("customers", { header: "顧客名" }),
    columnHelper.accessor("inquiry_source", { header: "問合せ元" }),
    columnHelper.accessor("inquiry_title", { header: "問合せ概要" }),
    columnHelper.accessor("detail_display", { header: "問合せ詳細" }),
    columnHelper.accessor("assign_user", { header: "担当者" }),
    columnHelper.accessor("remind_at", { header: "対応期日" }),
    columnHelper.accessor("created_at", { header: "作成日時" }),
    columnHelper.accessor("updated_at", { header: "更新日時" }),
  ];

  const table = useReactTable({
    data: tasksData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {sorting},
    onSortingChange: setSorting,
  });

  // 行ダブルクリック
  const handleRowDoubleClick = (taskId: string) => {
    router.push(`/tasksdetail/${taskId}`);
  };

  // ローディング表示
  if (isLoading || !tasksData || !statasies || !categories || !customersies) {
    return <p className="p-6 text-gray-500">読み込み中...</p>;

  }

  return (
    <>
      <nav className="flex justify-end gap-2 p-4 text-sm text-blue-500">
        <Link className="hover:text-black" href="/tasksdetail/new">タスク新規作成</Link>
        <p>／</p>
        <Link className="hover:text-black" href="">統計</Link>
        <p>／</p>
        <Link className="hover:text-black" href="/deleteuser">退会</Link>
        <p>／</p>
        <Link className="hover:text-black" href={`/mypage/${userId}`}>マイページ</Link>
        <p>／</p>
        <Link className="hover:text-black" href="/logout">ログアウト</Link>
      </nav>

      {/* フィルターUI */}
      <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">

        {/* 対象日付 */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">対象日付</Label>
          <Select value={searchDate} onValueChange={setSearchDate}>
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

        {/* 日付 */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">期間</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
          <span>〜</span>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36" />
        </div>

        {/* 重要度 */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">重要度</Label>
          <Select value={important} onValueChange={setImportant}>
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
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36 border">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent className="w-36">
              {statasies.map((s) => (
                <SelectItem key={s.status_id} value={s.status_id}>{s.status_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* カテゴリ */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">カテゴリ</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36 border">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent className="w-36">
              {categories.map((c) => (
                <SelectItem key={c.category_id} value={c.category_id}>{c.category_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 顧客名 */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">顧客名</Label>
          <Select value={customer} onValueChange={setCustomer}>
            <SelectTrigger className="w-36 border">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent className="w-36">
              {customersies.map((c) => (
                <SelectItem key={c.customer_id} value={c.customer_id}>{c.customer_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ボタン */}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={resetFilters}>リセット</Button>
          <Button className="bg-blue-600 text-white" onClick={searchFilters}>検索</Button>
        </div>
      </div>

      {/* テーブル */}
      <div className="p-2">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="whitespace-nowrap bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onDoubleClick={() => handleRowDoubleClick(row.original.uniqueid)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
