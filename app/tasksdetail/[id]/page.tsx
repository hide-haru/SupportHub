"use strict";
"use client";

import { useState,useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Comments from "@/components/ui/comments";

//表示時の日付フォーマット
const formatDateTime1 = (date?: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${
    String(d.getMonth() + 1).padStart(2, "0")
  }/${String(d.getDate()).padStart(2, "0")} ${
    String(d.getHours()).padStart(2, "0")
  }:${String(d.getMinutes()).padStart(2, "0")}:${String(
    d.getSeconds()
  ).padStart(2, "0")}`;
};
const formatDateTime2 = (date?: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${
    String(d.getMonth() + 1).padStart(2, "0")
  }/${String(d.getDate()).padStart(2, "0")} ${
    String(d.getHours()).padStart(2, "0")
  }:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function ReferenceTaskPage() {

    const router = useRouter();

    const [uniquId, setUniqueId] = useState("");
    const [no, setNo] = useState("");
    const [assignUser, setAssignUser] = useState<{ assign_user_id: string; assign_user_name: string } | null>(null);
    const [customer, setCustomer] = useState<{ customer_id: string; customer_name: string } | null>(null);
    const [inquirySource, setinquirySource] = useState<{ inquiry_source_id: string; inquiry_source_name: string } | null>(null);
    const [callDate, setcallDate ] = useState<Date | undefined>()
    const [category, setCategory] = useState<{ category_id: string; category_name: string } | null>(null);
    const [createdDate, setcreatedDate ] = useState<Date | undefined>()
    const [updatedDate, setupdatedDate ] = useState<Date | undefined>()
    const [important, setImportant] = useState("");
    const [inquiryTitle,setInquiryTitle] = useState("");
    const [inquiryDetail,setInquiryDetail] = useState("");
    const [remindDate, setRemindDate ] = useState<Date | undefined>()
    const [status, setStatus] = useState<{ status_id: string; status_name: string } | null>(null);
    const [sendMail, setSendMail] = useState<{send_mail_user_name: string} | null>(null);

    const params = useParams();
    const { id } = params;

    const editButton = () => {
        try {
            router.push(`/tasksdetail/${id}/edit`)
        }catch(err){
            console.log(err);
            console.log("サーバとの通信に失敗しました。")
        }
    }

    const DeleteButton = async () => {
        try{
            const confirmed = window.confirm('タスクを削除しますか？');

            if(confirmed){
                const response = await fetch(`/api/tasksdetail/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                const resullt = response.json();
                router.push("/tasks");  
            }else{
                return;
            }
            
        }catch(err){
            console.log(err);
            console.log("サーバとの通信に失敗しました。")
        }
    }

    useEffect(() => {
        const fetchFilters = async () => {
            try{            
                const response = await fetch(`http://localhost:3000/api/tasksdetail/${id}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                const result = await response.json();
                console.log(result);
                setUniqueId(result.uniqueid);
                setNo(result.no);
                setAssignUser({assign_user_id:result.assign_user_id, assign_user_name:result.assign_user});
                setCustomer({customer_id:result.customer_id, customer_name:result.customer_name});
                setinquirySource({inquiry_source_id:result.inquiry_source_id, inquiry_source_name:result.inquiry_source});
                setcallDate(result.call_datetime ? new Date(result.call_datetime) : undefined);
                setCategory({category_id:result.category, category_name:result.category});
                setcreatedDate(result.created_at ? new Date(result.created_at) : undefined);
                setupdatedDate(result.updated_at ? new Date(result.updated_at) : undefined);
                setImportant(result.important);
                setInquiryTitle(result.inquiry_title);
                setInquiryDetail(result.inquiry_detail);
                setRemindDate(result.remind_at ? new Date(result.remind_at) : undefined);
                setStatus({status_id:result.status_id, status_name:result.status});
                setSendMail({send_mail_user_name:result.send_mail_user_name})
                
            }catch(err){
                console.log(err);
                alert("サーバとの通信に失敗しました。再度、タスク一覧から選択をお願いします。")
            }
        };
        if (id) fetchFilters();
    }, [id]);

    useEffect(() => {
        if (customer) {
            console.log("Uniqueid:", uniquId );
            console.log("No:", no );
            console.log("担当者:", assignUser?.assign_user_id, assignUser?.assign_user_name);
            console.log("顧客ID:", customer.customer_id, customer.customer_name);
            console.log("担当者:", inquirySource?.inquiry_source_id, inquirySource?.inquiry_source_name );
            console.log("入電日時", callDate);
            console.log("カテゴリー:", category?.category_id, category?.category_name);
            console.log("作成日時", createdDate);
            console.log("更新日時", updatedDate);
            console.log("重要度", important);
            console.log("問合せ概要", inquiryTitle);
            console.log("問合せ詳細", inquiryDetail);
            console.log("期日", remindDate);
            console.log("ステータス", status?.status_id, status?.status_name);
            console.log("メール送信先", sendMail?.send_mail_user_name)
        }
    }, [customer]);
    


    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-7xl h-[800px] bg-white border border-gray-300 rounded-2xl shadow-md p-6 space-y-6">
                    {/* <h1>タスク参照</h1> */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">タスクNo</p>
                            <p className="w-64 h-10 border mr-10 rounded-md flex items-center pl-3"> {no}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">作成日時</p>
                            <p className="w-64 h-10 border mr-10 rounded-md flex items-center pl-3">{formatDateTime1(createdDate)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">更新日時</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{formatDateTime1(updatedDate)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">顧客名</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{customer?.customer_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">問合せ元</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{inquirySource?.inquiry_source_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">入電日時</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{formatDateTime2(callDate)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">重要度</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{important}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">ステータス</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{status?.status_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-6">カテゴリ</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{category?.category_name}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">問合せ概要</p>
                            <p className="w-[950px] h-10 border mr-6 rounded-md flex items-center pl-3">{inquiryTitle}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">問合せ詳細</p>
                            <p className="w-[950px] h-[250px] border mr-6 rounded-md pl-3 whitespace-pre-wrap overflow-y-auto">{inquiryDetail}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">期日</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{formatDateTime2(remindDate)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">担当者</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{assignUser?.assign_user_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium mr-2">メール送信先</p>
                            <p className="w-64 h-10 border mr-6 rounded-md flex items-center pl-3">{sendMail?.send_mail_user_name}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6 ml-auto flex gap-2 justify-end">
                        <Button className="bg-gray-500 text-white w-32" onClick={editButton}>修正</Button>
                        <Button className="bg-gray-500 text-white w-32" onClick={DeleteButton}>削除</Button>
                    </div>
                </div>
            </div>
            <div>
                {/* 💬 コメント機能をここに表示 */}
                <Comments postId={uniquId} />
            </div>
        </>
    );
}