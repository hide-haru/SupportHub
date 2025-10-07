"use client";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TaskType } from "../components/TasksTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {useReactTable,getCoreRowModel,flexRender,createColumnHelper,} from "@tanstack/react-table";
import Link from "next/link";

export default function Tasks() {
    const [statasies, setstatasies] = useState<{ status_id: string; status_name: string }[]>([]);
    const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
    const [customersies, setcustomersies] = useState<{ customer_id: string; customer_name: string }[]>([]);
    const [tasksData, setTasksData] = useState<TaskType[]>([]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [important, setImportant] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [customer, setCustomer] = useState("");


    //リセットボタン
    const restFilters = () => {
    setDateFrom("");
    setDateTo("");
    setImportant("");
    setStatus("");
    setCategory("");
    setCustomer("");
    }

    //マスタ類API（Status / Category / Customers）の呼び出し
    useEffect(() => {
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

                setstatasies(statusJson.data);
                setCategories(categoryJson.data);
                setcustomersies(customerJson.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchFilters();
    }, []);

    //タスク一覧の読み込み（初期）
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/tasks");
                const data = await response.json();
                setTasksData(data);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchData();
    }, []);

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
        data: tasksData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

  return (
    <>
      <nav className="flex justify-end gap-2 p-4 text-sm text-gray-600">
        <Link href="">タスク新規作成</Link>
        <p>／</p>
        <Link href="">統計</Link>
        <p>／</p>
        <Link href="">退会</Link>
        <p>／</p>
        <Link href="">マイページ</Link>
        <p>／</p>
        <Link href="">ログアウト</Link>
      </nav>

        <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
            {/* 日付範囲 */}
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
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="mid">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* ステータス */}
            <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">ステータス</Label>
                <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="w-36 border">
                    <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent className="w-36">
                    {statasies.map((option) => (
                        <SelectItem key={option.status_id} value={option.status_id}>
                            {option.status_name}
                        </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/* カテゴリ */}
            <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">カテゴリ</Label>
                <Select value={category} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-36 border">
                    <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent className="w-36">
                    {categories.map((option) => (
                        <SelectItem key={option.category_id} value={option.category_id}>
                            {option.category_name}
                        </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/* 顧客名 */}
            <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">顧客名</Label>
                <Select value={customer} onValueChange={(value) => setCustomer(value)}>
                <SelectTrigger className="w-36 border">
                    <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent className="w-36">
                    {customersies.map((option) => (
                        <SelectItem key={option.customer_id} value={option.customer_id}>
                            {option.customer_name}
                        </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/* ボタン類 */}
            <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={restFilters}>リセット</Button>
                <Button className="bg-blue-600 text-white">検索</Button>
            </div>
        </div>

      <div className="p-2">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="whitespace-nowrap bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
