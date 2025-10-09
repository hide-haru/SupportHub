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


export default function TasksNewdetail() {

    const router = useRouter();

    const [customersies, setcustomersies] = useState<{ customer_id: string; customer_name: string }[]>([]);
    const [inquirySources, setinquirySources] = useState<{ employee_id: string; employee_name: string }[]>([]);
    const [statasies, setstatasies] = useState<{ status_id: string; status_name: string }[]>([]);
    const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
    const [users, setUsers] = useState<{ user_id: string; user_name: string , e_mail:string}[]>([]);
    const [customer, setCustomer] = useState("");
    const [inquirySource, setinquirySource] = useState("");
    const [callDate, setcallDate ] = useState<Date | undefined>(new Date())
    const [important, setImportant] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [inquiryTitle,setInquiryTitle] = useState("");
    const [inquiryDetail,setInquiryDetail] = useState("");
    const [remindDate, setRemindDate] = useState<Date | undefined>();
    const [assignUser, setAssignUser] = useState("");
    const [sendMail, setSendMail] = useState("");

    const newCreate = async() => {
        try{            
            const response = await fetch("http://localhost:3000/api/tasksdetail",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({customer: customer, inquirySource: inquirySource, callDate: callDate,
                                        important: important, status: status, category:category, inquiryTitle: inquiryTitle,
                                        inquiryDetail: inquiryDetail, remindDate: remindDate, assignUser: assignUser, sendMail: sendMail
                })
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
                const [customerRes, inquirySourceRes, statusRes, categoryRes, usersRes] = await Promise.all([
                    fetch("../components/filters/customer_search"),
                    fetch("../components/filters/inquiry_source_search"),
                    fetch("../components/filters/Status_search"),
                    fetch("../components/filters/category_search"),
                    fetch("../components/filters/users_search"),
                    
                ]);
                const [customerJson, inquirySourceJson, statusJson, categoryJson, usersResJson] = await Promise.all([
                    customerRes.json(),
                    inquirySourceRes.json(),
                    statusRes.json(),
                    categoryRes.json(),
                    usersRes.json(),
                ]);
                if (customerJson.error || inquirySourceJson.error || statusJson.error || categoryJson.error || usersResJson.error) {
                    console.error("API error:", customerJson.error, inquirySourceJson.error, statusJson.error, categoryJson.error, usersResJson.error);
                    return;
                }
                setcustomersies(customerJson.data);
                setinquirySources(inquirySourceJson.data);
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
        const fetchInquirySource = async () => {
            try {
                const inquirySourceRes = await fetch("../../components/filters/inquiry_source_search")
                const inquirySourceJson = inquirySourceRes.json();
                console.log(inquirySourceJson);
            }catch (err) {
                console.error(err);
            }
        };
        
        fetchInquirySource();
    }, [customer]);


    return (
        <>
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
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

                {/* 問合せ元 */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">問合せ元</Label>
                    <Select value={inquirySource} onValueChange={(value) => setinquirySource(value)}>
                    <SelectTrigger className="w-36 border">
                        <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent className="w-36">
                        {inquirySources.map((option) => (
                            <SelectItem key={option.employee_id} value={option.employee_id}>
                                {option.employee_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>

                {/* 入電日時 */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">入電日時</Label>
                    <DateTimePicker value={callDate} onChange={setcallDate} />
                </div>
            </div>

            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
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
            </div>
            
            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                {/* 問合せ概要 */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium min-w-[80px]">問合せ概要</Label>
                    <Input className="w-256" type="text" value={inquiryTitle} onChange={(e) => setInquiryTitle(e.target.value)}/>
                </div>
            </div>

            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                {/* 問合せ詳細 */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium min-w-[80px]">問合せ詳細</Label>
                    <Textarea className="w-256" value={inquiryDetail} onChange={(e) => setInquiryDetail(e.target.value)}/>
                </div>
            </div>

            <div className="bg-white p-3 rounded-xl flex flex-wrap items-start gap-6">
                {/* 期日 */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">期日</Label>
                    <DateTimePicker value={remindDate} onChange={setRemindDate} />
                </div>
                {/* 担当者 */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">担当者</Label>
                    <Select value={assignUser} onValueChange={(value) => setAssignUser(value)}>
                    <SelectTrigger className="w-36 border">
                        <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent className="w-36">
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
                    <Label className="text-sm font-medium">メール送信先</Label>
                    <Select value={sendMail} onValueChange={(value) => setSendMail(value)}>
                    <SelectTrigger className="w-36 border">
                        <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent className="w-36">
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
                    <Button className="bg-gray-500 text-white" onClick={newCreate}>作成</Button>
                </div>
            </div>
        </>
    );
}