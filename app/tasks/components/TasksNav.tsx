"use strict";
"use client";

import Link from "next/link";

export const TasksNav = ({ userId }: { userId: string | null }) => (
  <nav className="flex justify-end gap-2 p-4 text-sm text-blue-500">
    <Link href="/tasksdetail/new" className="hover:text-black">タスク新規作成</Link>
    {/* <p>／</p>
    <Link href="">統計</Link> */}
    <p>／</p>
    <Link href="/deleteuser">退会</Link>
    <p>／</p>
    <Link href={`/mypage/${userId}`}>マイページ</Link>
    <p>／</p>
    <Link href="/logout">ログアウト</Link>
  </nav>
);
