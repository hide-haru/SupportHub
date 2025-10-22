"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchMyPage, updateMyPage } from "@/lib/mypage/mypage"
import "./layout.css"

export function MyPageForm() {
  const router = useRouter()

  const [userName, setUserName] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [eMail, setEMail] = useState<string>("")
  const [password, setPassword] = useState("")
  const [originalEmail, setOriginalEmail] = useState<string>("")

  const params = useParams()
  const id = params.id as string
  console.log(id)

  useEffect(() => {
    if (!id) return
    fetchMyPage(id as string).then((data) => {
      setUserName(data.user_name)
      setUserId(data.user_id)
      setEMail(data.email)
      setOriginalEmail(data.email)
    })
  }, [id])

  const handleclick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const userName = formData.get("userName") as string
    const userId = formData.get("userId") as string
    const eMail = formData.get("eMail") as string

    try {
      const bodyData: any = { id, userName, userId, eMail }

      // Only include email if it changed
      if (eMail !== originalEmail) {
        bodyData.emailChanged = true
      }

      const result = await updateMyPage(id as string, bodyData);

      alert(result.message)
      
      router.push("/tasks")
    } catch (err) {
      alert("サーバとの通信に失敗しました。再度、変更をお願いします。")
    }
  }

  return (
    <>
      <form onSubmit={handleclick}>
        <dl>
          <dt>名前</dt>
          <dd>
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="名前"
              required
            />
          </dd>
          <dt>ユーザID</dt>
          <dd>
            <input
              type="text"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="半角数字"
              onInput={(e) => {
                const target = e.target as HTMLInputElement
                target.value = target.value.replace(/[^0-9]/g, "")
              }}
              required
            />
          </dd>
          <dt>メールアドレス</dt>
          <dd>
            <input
              type="email"
              name="eMail"
              value={eMail}
              onChange={(e) => setEMail(e.target.value)}
              placeholder="メールアドレス"
              required
            />
          </dd>
          <button type="submit">変更する</button>
        </dl>
      </form>
    </>
  )
}