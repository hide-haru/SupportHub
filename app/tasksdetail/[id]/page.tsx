"use strict";
"use client";

import { useState,useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";


export default function TasksReferencedetail() {

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

    //const [sendMail, setSendMail] = useState("");

    const params = useParams();
    const { id } = params;

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
            setUniqueId(result.uniqueid);
            setNo(result.no);
            setAssignUser({assign_user_id:result.assign_user_id, assign_user_name:result.assign_user});
            setCustomer({customer_id:result.customer_id, customer_name:result.customers});
            setinquirySource({inquiry_source_id:result.inquiry_source_id, inquiry_source_name:result.inquiry_source});
            setcallDate(result.call_datetime);
            setCategory({category_id:result.category, category_name:result.category});
            setcreatedDate(result.created_at);
            setupdatedDate(result.updated_at);
            setImportant(result.important);
            setInquiryTitle(result.inquiry_title);
            setInquiryDetail(result.inquiry_detail);
            setRemindDate(result.remind_at);
            setStatus({status_id:result.status_id, status_name:result.status});
            
            console.log(result);
        }catch(err){
            console.log(err);
            console.log("サーバとの通信に失敗しました。再度、タスク一覧から選択をお願いします。")
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
        }
    }, [customer]);
    


    return (
        <>
            <h1>参照用ページ tasksdetail/[id]</h1>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                <div className="flex items-center gap-2">
                    <p>No： {no}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>作成日時： {createdDate ? createdDate.toLocaleString() : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>更新日時： {updatedDate ? updatedDate.toLocaleString() : ""}</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                <div className="flex items-center gap-2">
                    <p>顧客名： {customer?.customer_name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>問合せ元： {inquirySource?.inquiry_source_name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>入電時間： {callDate ? callDate.toLocaleString() : ""}</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                <div className="flex items-center gap-2">
                    <p>重要度： {important}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>ステータス： {status?.status_name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>カテゴリ： {category?.category_name}</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                <div className="flex items-center gap-2">
                    <p>問合せ概要： {inquiryTitle}</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                <div className="flex items-center gap-2">
                    <p>問合せ詳細： {inquiryDetail}</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                <div className="flex items-center gap-2">
                    <p>期日： {remindDate ? remindDate.toLocaleString() : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>担当者： {assignUser?.assign_user_name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>メール送信先： dummy@gmail.com</p>
                </div>
            </div>

        </>
    );
}