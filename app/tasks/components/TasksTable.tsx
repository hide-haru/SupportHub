"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getSortedRowModel } from "@tanstack/react-table";
import { TaskType } from "@/types/TasksTable";
import { useState } from "react";

export const TasksTable = ({ data }: { data: TaskType[] }) => {
  const router = useRouter();
  const [sorting, setSorting] = useState<any[]>([]);
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
    columnHelper.accessor("inquiry_detail", { header: "問合せ詳細" }),
    columnHelper.accessor("assign_user", { header: "担当者" }),
    columnHelper.accessor("remind_at", { header: "期限" }),
    columnHelper.accessor("created_at", { header: "作成日時" }),
    columnHelper.accessor("updated_at", { header: "更新日時" }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="p-2">
      <div className="overflow-x-auto rounded-md border border-gray-300">
        <Table className="border-collapse border border-gray-300 min-w-max">
          <TableHeader className="whitespace-nowrap bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none text-black border border-gray-300"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                  className={`cursor-pointer whitespace-nowrap ${
                    row.original.important === "高"
                      ? "bg-red-100 hover:bg-red-200"
                      : index % 2 === 0
                      ? "bg-white hover:bg-gray-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                onDoubleClick={() => router.push(`/tasksdetail/${row.original.uniqueid}`)}
              >
                {row.getVisibleCells().map((cell) => {
                const cellValue = cell.getValue();
                const isInquiryDetail = cell.column.id === "inquiry_detail";
                const isCallDateTime = cell.column.id === "call_datetime";
                const isRemindAt = cell.column.id === "remind_at";
                const isCreatedAt = cell.column.id === "created_at";
                const isUpdatedAt = cell.column.id === "updated_at";
                let displayValue = cellValue;

                // 日時の整形（入電日時/期日)
                if ((isCallDateTime && cellValue) || (isRemindAt && cellValue)) {
                  const dateValue = cellValue as string | number | Date; 
                  const date = new Date(dateValue);
                  if (!isNaN(date.getTime())) {
                    displayValue = date.toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                  }
                }
                // 日時の整形（作成日時/更新日時）
                if ((isCreatedAt && cellValue) || (isUpdatedAt && cellValue)) {
                  const dateValue = cellValue as string | number | Date; 
                  const date = new Date(dateValue);
                  if (!isNaN(date.getTime())) {
                    displayValue = date.toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    });
                  }
                }

                // inquiry_detail の省略処理
                if (isInquiryDetail && typeof cellValue === "string" && cellValue.length > 60) {
                  displayValue = cellValue.slice(0, 60) + "...";
                }

                return (
                  <TableCell
                    key={cell.id}
                    title={isInquiryDetail && typeof cellValue === "string" ? cellValue : ""}
                    className="border border-gray-300 whitespace-nowrap px-3 py-3"
                  >
                    {typeof displayValue === "string"
                      ? displayValue
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
