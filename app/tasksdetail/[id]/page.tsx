"use strict";
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Comments from "@/components/ui/comments";

//---------------------------
// 日付フォーマット関数
//---------------------------
const formatDateTime1 = (date?: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const formatDateTime2 = (date?: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

//---------------------------
// メインコンポーネント
//---------------------------
export default function ReferenceTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // 各state
  const [uniquId, setUniqueId] = useState("");
  const [no, setNo] = useState("");
  const [assignUser, setAssignUser] = useState<{ assign_user_id: string; assign_user_name: string } | null>(null);
  const [customer, setCustomer] = useState<{ customer_id: string; customer_name: string } | null>(null);
  const [inquirySource, setInquirySource] = useState<{ inquiry_source_id: string; inquiry_source_name: string } | null>(null);
  const [callDate, setCallDate] = useState<Date | undefined>();
  const [category, setCategory] = useState<{ category_id: string; category_name: string } | null>(null);
  const [createdDate, setCreatedDate] = useState<Date | undefined>();
  const [updatedDate, setUpdatedDate] = useState<Date | undefined>();
  const [important, setImportant] = useState("");
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryDetail, setInquiryDetail] = useState("");
  const [remindDate, setRemindDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<{ status_id: string; status_name: string } | null>(null);
  const [sendMail, setSendMail] = useState<{ send_mail_user_name: string } | null>(null);

  //---------------------------
  // イベント：修正ボタン
  //---------------------------
  const editButton = () => {
    try {
      router.push(`/tasksdetail/${id}/edit`);
    } catch (err) {
      console.error(err);
      alert("サーバとの通信に失敗しました。");
    }
  };

  //---------------------------
  // イベント：削除ボタン
  //---------------------------
  const DeleteButton = async () => {
    try {
      const confirmed = window.confirm("タスクを削除しますか？");
      if (!confirmed) return;

      const response = await fetch(`/api/tasksdetail/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("削除に失敗しました");
      await response.json();
      router.push("/tasks");
    } catch (err) {
      console.error(err);
      alert("サーバとの通信に失敗しました。");
    }
  };

  //---------------------------
  // データ取得
  //---------------------------
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasksdetail/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        setUniqueId(result.uniqueid);
        setNo(result.no);
        setAssignUser({ assign_user_id: result.assign_user_id, assign_user_name: result.assign_user });
        setCustomer({ customer_id: result.customer_id, customer_name: result.customer_name });
        setInquirySource({ inquiry_source_id: result.inquiry_source_id, inquiry_source_name: result.inquiry_source });
        setCallDate(result.call_datetime ? new Date(result.call_datetime) : undefined);
        setCategory({ category_id: result.category, category_name: result.category });
        setCreatedDate(result.created_at ? new Date(result.created_at) : undefined);
        setUpdatedDate(result.updated_at ? new Date(result.updated_at) : undefined);
        setImportant(result.important);
        setInquiryTitle(result.inquiry_title);
        setInquiryDetail(result.inquiry_detail);
        setRemindDate(result.remind_at ? new Date(result.remind_at) : undefined);
        setStatus({ status_id: result.status_id, status_name: result.status });
        setSendMail({ send_mail_user_name: result.send_mail_user_name });
      } catch (err) {
        console.error(err);
        alert("サーバとの通信に失敗しました。再度、タスク一覧から選択をお願いします。");
      }
    };
    if (id) fetchTask();
  }, [id]);

  //---------------------------
  // レンダリング
  //---------------------------
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-6">
      <div className="flex w-full max-w-7xl gap-6">
        {/* ---------------- 左カラム：タスク詳細 ---------------- */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">タスク詳細</h2>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={editButton}>修正</Button>
              <Button variant="destructive" onClick={DeleteButton}>削除</Button>
            </div>
          </div>

          {/* Scrollable content */}
          <ScrollArea className="h-[700px] pr-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="タスクNo" value={no} />
              <InfoItem label="作成日時" value={formatDateTime1(createdDate)} />
              <InfoItem label="更新日時" value={formatDateTime1(updatedDate)} />
            </div>

            <Separator className="m-2" />

            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="顧客名" value={customer?.customer_name} />
              <InfoItem label="問合せ元" value={inquirySource?.inquiry_source_name} />
              <InfoItem label="入電日時" value={formatDateTime2(callDate)} />
            </div>

            <Separator className="m-2" />

            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="重要度" value={important} />
              <InfoItem label="ステータス" value={status?.status_name} />
              <InfoItem label="カテゴリ" value={category?.category_name} />
            </div>

            <Separator className="m-2" />

            <InfoItem label="問合せ概要" value={inquiryTitle} full />
            <InfoItem label="問合せ詳細" value={inquiryDetail} full multiline />

            <Separator className="m-2" />

            <div className="grid grid-cols-2 gap-4  mb-6">
              <InfoItem label="期日" value={formatDateTime2(remindDate)} />
              <InfoItem label="担当者" value={assignUser?.assign_user_name} />
              <InfoItem label="メール送信先" value={sendMail?.send_mail_user_name} />
            </div>
          </ScrollArea>
        </div>

        {/* ---------------- 右カラム：コメント ---------------- */}
        <div className="w-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">コメント</h3>
          <Separator className="mb-3" />
          <ScrollArea className="flex-1 h-[700px] pr-2">
            <Comments postId={uniquId} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

//---------------------------
// サブコンポーネント
//---------------------------
function InfoItem({
  label,
  value,
  full = false,
  multiline = false,
}: {
  label: string;
  value?: string;
  full?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className={`${full ? "col-span-2" : ""}`}>
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <div
        className={`border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-gray-50 ${
          multiline ? "h-[200px] overflow-y-auto whitespace-pre-wrap" : "h-10 flex items-center"
        }`}
      >
        {value || "-"}
      </div>
    </div>
  );
}
