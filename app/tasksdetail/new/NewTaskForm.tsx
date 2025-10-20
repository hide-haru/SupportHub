"use strict";
"use client";

import { useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";
import { fetchCategory } from "@/lib/db/category";
import { fetchCutomers } from "@/lib/db/customer";
import { fetchInquirySource } from "@/lib/db/inquirySource";
import { fetchStatus } from "@/lib/db/status";
import { fetchUsers } from "@/lib/db/users";
import { unwatchFile } from "fs";




export function NewTaskForm() {

    const router = useRouter();

    const [customersies, setcustomersies] = useState<{ customer_id: string; customer_name: string }[]>([]);
    const [inquirySources, setinquirySources] = useState<{ employee_id: string; employee_name: string }[]>([]);
    const [statasies, setstatasies] = useState<{ status_id: string; status_name: string }[]>([]);
    const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
    const [users, setUsers] = useState<{ user_id: string; user_name: string , e_mail:string}[]>([]);

    const [uniqueid, setUniqueId] = useState("");
    const [customer, setCustomer] = useState("");
    const [inquirySource, setinquirySource] = useState("");
    const [callDate, setcallDate ] = useState<Date | undefined>(undefined);
    const [important, setImportant] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [inquiryTitle,setInquiryTitle] = useState("");
    const [inquiryDetail,setInquiryDetail] = useState("");
    const [remindDate, setRemindDate] = useState<Date | undefined>(undefined);
    const [assignUser, setAssignUser] = useState("");
    const [sendMail, setSendMail] = useState("");

    const newCreate = async() => {

        //requiredチェック
        if(!customer || !status || !category || !inquiryTitle || !inquiryDetail){
            alert("必須項目が入力されていません。")
            return;
        }
          const bodyData = {
                uniqueid,
                customer,
                inquirySource,
                callDate: callDate ? callDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo",year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false, }) : null,
                important,
                status,
                category,
                inquiryTitle,
                inquiryDetail,
                remindDate: remindDate ? remindDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo",year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false, }) : null,
                assignUser,
                sendMail,
            };

        try{
            const response = await fetch("http://localhost:3000/api/tasksdetail",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData),
            });
            const result = await response.json();
            console.log(result);
            router.push('/tasks');
        }catch(err){
            console.log("bbb")
            console.log(err);
            console.log("サーバとの通信に失敗しました。再度、新規登録をお願いします。")
        }
    }

    //マスタ類API（Status / Category / Customers）の呼び出し
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [customerRes, statusRes, categoryRes, usersRes] = await Promise.all([
                    fetchCutomers(),
                    fetchStatus(),
                    fetchCategory(),
                    fetchUsers(),
                    
                ]);
                const [customerJson, statusJson, categoryJson, usersResJson] = await Promise.all([
                    customerRes.json(),
                    statusRes.json(),
                    categoryRes.json(),
                    usersRes.json(),
                ]);
                if (customerJson.error || statusJson.error || categoryJson.error || usersResJson.error) {
                    console.error("API error:", customerJson.error, statusJson.error, categoryJson.error, usersResJson.error);
                    return;
                }
                setcustomersies(customerJson.data);
                setstatasies(statusJson.data);
                setCategories(categoryJson.data);
                setUsers(usersResJson.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);
    

    //顧客マスタが選択された時に、付随した従業員のみを表示する
    useEffect(() => {
            const fetchInquirySourceAPI = async () => {
                if (!customer) {
                // 顧客未選択時は問い合わせ元リストを空にリセットして終了
                setinquirySources([]);
                return;
                }

            try {
               const inquirySourceRes = await fetchInquirySource(customer);
               const inquirySourceJson = await inquirySourceRes.json();
               setinquirySources(inquirySourceJson.data);
            }catch (err) {
                console.error(err);
            }
        };
        
        fetchInquirySourceAPI();
    }, [customer]);


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-7xl h-[800px] bg-white border border-gray-300 rounded-2xl shadow-md p-6 space-y-6">
                <h1 className="text-xl text-center">新規問合せ 入力フォーム</h1>
                <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                    {/* 顧客名 */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium mr-2">顧客名</Label>
                        <Select value={customer} onValueChange={(value) => setCustomer(value)}>
                        <SelectTrigger className="w-64 border mr-6">
                            <SelectValue placeholder="顧客名 ※必須項目※" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
                            {customersies.map((option) => (
                                <SelectItem key={option.customer_id} value={option.customer_id}>
                                    {option.customer_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    {/* 問合せ元 */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium mr-2">問合せ元</Label>
                        <Select value={inquirySource} onValueChange={(value) => setinquirySource(value)}>
                        <SelectTrigger className="w-64 border mr-6">
                            <SelectValue placeholder="問合せ元" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
                            {inquirySources?.map((option) => (
                                <SelectItem key={option.employee_id} value={option.employee_id}>
                                    {option.employee_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    {/* 入電日時 */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium mr-2">入電日時</Label>
                        <DateTimePicker value={callDate} onChange={setcallDate} />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                    {/* 重要度 */}
                    <div className="flex items-center gap-2 ">
                        <Label className="text-sm font-medium mr-2">重要度</Label>
                        <Select value={important} onValueChange={setImportant}>
                        <SelectTrigger className="w-64 border mr-6">
                            <SelectValue placeholder="重要度" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
                            <SelectItem value="高">高</SelectItem>
                            <SelectItem value="中">中</SelectItem>
                            <SelectItem value="低">低</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    {/* ステータス */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium mr-2">ステータス</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value)}>
                        <SelectTrigger className="w-64 border mr-6">
                            <SelectValue placeholder="ステータス ※必須項目※" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
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
                        <Label className="text-sm font-medium mr-5">カテゴリ</Label>
                        <Select value={category} onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger className="w-64 border">
                            <SelectValue placeholder="カテゴリ ※必須項目※" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
                            {categories.map((option) => (
                                <SelectItem key={option.category_id} value={option.category_id}>
                                    {option.category_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                    {/* 問合せ概要 */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium mr-2">問合せ概要</Label>
                        <Input className="w-[950px]" type="text" placeholder="概要 ※必須項目※" value={inquiryTitle} onChange={(e) => setInquiryTitle(e.target.value)}/>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                    {/* 問合せ詳細 */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium min-w-[80px]">問合せ詳細</Label>
                        <Textarea className="w-[950px] h-[250px]" value={inquiryDetail} placeholder="詳細 ※必須項目※" onChange={(e) => setInquiryDetail(e.target.value)}/>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                    {/* 期日 */}
                    <div className="flex items-center gap-2 mr-6">
                        <Label className="text-sm font-medium mr-2">期日</Label>
                        <DateTimePicker value={remindDate} onChange={setRemindDate} />
                    </div>
                    {/* 担当者 */}
                    <div className="flex items-center gap-2 mr-6">
                        <Label className="text-sm font-medium mr-2">担当者</Label>
                        <Select value={assignUser} onValueChange={(value) => setAssignUser(value)}>
                        <SelectTrigger className="w-64 border">
                            <SelectValue placeholder="担当者 ※必須項目※" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
                            {users.map((option) => (
                                <SelectItem key={option.user_id} value={option.user_id}>
                                    {option.user_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    {/* メール送信先 */}
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium mr-2">メール送信先</Label>
                        <Select value={sendMail} onValueChange={(value) => setSendMail(value)}>
                        <SelectTrigger className="w-64 border">
                            <SelectValue placeholder="メール送信先" />
                        </SelectTrigger>
                        <SelectContent className="w-64">
                            {users.map((option) => (
                                <SelectItem key={option.e_mail} value={option.e_mail}>
                                    {option.user_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                    {/* ボタン類 */}
                    <div className="ml-auto flex gap-2">
                        <Button className="bg-gray-500 text-white w-32" onClick={newCreate}>作成</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}