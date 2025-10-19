"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // コメント一覧取得
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setComments(data || []);
  };

  // 初回 + リアルタイム購読
  useEffect(() => {
    if (!postId) {
      console.warn("⚠️ postId が undefined のためコメントを取得しません。");
      return;
    }

    fetchComments();

    const channel = supabase
      .channel("comments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => fetchComments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  // コメント投稿
  const addComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        content: newComment,
      },
    ]);

    if (error) console.error(error);
    else setNewComment("");
  };

  return (
    <div className="p-4 border rounded-xl">
      <h3 className="text-lg font-semibold mb-3">コメント欄</h3>

      {/* コメント一覧 */}
      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="p-2 bg-gray-100 rounded">
            {/* ← 改行保持: whitespace-pre-wrap */}
            <p className="whitespace-pre-wrap break-words">{c.content}</p>
            <span className="text-xs text-gray-500">
              {new Date(c.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* 入力欄 */}
      <div className="flex flex-col gap-2">
        <textarea
          className="flex-1 border rounded px-2 py-3 resize-none h-24"
          placeholder="コメントを入力"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="bg-blue-500 text-white px-4 py-2 rounded self-end"
        >
          送信
        </button>
      </div>
    </div>
  );
}
