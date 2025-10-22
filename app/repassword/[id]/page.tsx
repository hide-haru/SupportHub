"use strict";
"use client";

import { useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import './layout.css';



export default function RepasswordPage() {
    const router = useRouter();

    const [password,setPassword] = useState("");

    const params = useParams();
    const id = params.id as string;
    console.log("id:",id);

    const handleclick = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        try{
            const response = await fetch(`/api/repassword/${id}`,{
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id, password}),
            });
            const result = await response.json();
            console.log(result.message);
            alert("更新しました。");
            router.push("/login");
        }catch(err){
            console.log("サーバとの通信に失敗しました。再度、パスワード変更をお願いします。")
        }
    };

    return (
        <div className="center-wrapper">
            <div className="mypage-container">
                <h1>パスワード変更</h1>
                <form onSubmit={handleclick}>
                    <dl>
                        <dt>パスワード</dt>
                        <dd><input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード（必須項目）" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9a-zA-Z]/g, "");}} required /></dd>
                        <button type="submit">変更する</button>
                    </dl>
                </form>
            </div>
        </div>
            
    );
}