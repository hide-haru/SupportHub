"use strict";
"use client";

import { useState,useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";


export default function Tasksdetail() {

    const [customersies, setcustomersies] = useState<{ customer_id: string; customer_name: string }[]>([]);
    const [inquirySources, setinquirySources] = useState<{ employee_id: string; employee_name: string }[]>([]);
    const [statasies, setstatasies] = useState<{ status_id: string; status_name: string }[]>([]);
    const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
    const [customer, setCustomer] = useState("");
    const [inquirySource, setinquirySource] = useState("");
    const [important, setImportant] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");

    //マスタ類API（Status / Category / Customers）の呼び出し
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [customerRes, inquirySourceRes, statusRes, categoryRes] = await Promise.all([
                    fetch("../components/filters/customer_search"),
                    fetch("../components/filters/inquiry_source_search"),
                    fetch("../components/filters/Status_search"),
                    fetch("../components/filters/category_search"),
                    
                ]);
                const [customerJson, inquirySourceJson, statusJson, categoryJson] = await Promise.all([
                    customerRes.json(),
                    inquirySourceRes.json(),
                    statusRes.json(),
                    categoryRes.json(),
                    
                ]);
                if (customerJson.error || inquirySourceJson.error || statusJson.error || categoryJson.error) {
                    console.error("API error:", customerJson.error, inquirySourceJson.error, statusJson.error, categoryJson.error);
                    return;
                }
                setcustomersies(customerJson.data);
                setinquirySources(inquirySourceJson.data);
                setstatasies(statusJson.data);
                setCategories(categoryJson.data);
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

    const DefaultDate = new Date();


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
                    <Label className="text-sm font-medium">問合せ元</Label>
                    <DateTimePicker>
                        defaultPopupValue={DefaultDate}
                    </DateTimePicker>
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
            </div>
        </>
    );
}