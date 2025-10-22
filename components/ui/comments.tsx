"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // コメント一覧取得
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, username")
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

  // 最新コメントへスクロール
  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  // コメント新規投稿
  const addComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("profiles")
      .select("user_name")
      .eq("auth_id", user?.id)
      .single();

    const userName = data?.user_name;
    if (!newComment.trim()) return;

    const { data: insertedData, error } = await supabase
      .from("comments")
      .insert([{ username: userName, post_id: postId, content: newComment }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (insertedData) {
      setComments((prev) => [...prev, insertedData]);
      setNewComment("");
      scrollToBottom();
    } else {
      console.error("コメント追加に失敗しました");
    }
  };

  // コメント削除
  const deleteComment = async (id: string) => {
    if (!confirm("このコメントを削除しますか？")) return;

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) console.error(error);
    else setComments((prev) => prev.filter((c) => c && c.id !== id));
  };

  // コメント編集開始
  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // コメント更新
  const updateComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("profiles")
      .select("user_name")
      .eq("auth_id", user?.id)
      .single();

    const userName = data?.user_name;
    if (!editContent.trim() || !editingId) return;

    const { data: updatedData, error } = await supabase
      .from("comments")
      .update({ username: userName, content: editContent })
      .eq("id", editingId)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (updatedData) {
      setComments((prev) =>
        prev.map((c) => (c && c.id === editingId ? updatedData : c))
      );
      setEditingId(null);
      setEditContent("");
      scrollToBottom();
    } else {
      console.error("コメント更新に失敗しました");
    }
  };

  return (
    <div className="p-4 border rounded-xl flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-3">コメント欄</h3>

      {/* コメント一覧 */}
      <div
        ref={scrollRef}
        className="space-y-3 mb-4 overflow-y-auto flex-1"
      >
        {comments.map(
          (c) =>
            c && (
              <div key={c.id} className="p-3 bg-gray-100 rounded relative">
                {editingId === c.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="border rounded p-2 resize-none"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm text-gray-600 border rounded"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={updateComment}
                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap break-words">{c.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{c.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => startEdit(c.id, c.content)}
                          className="text-blue-600 hover:underline"
                        >
                          修正
                        </button>
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
        )}
      </div>

      {/* 入力欄 */}
      <div className="flex flex-col gap-2 mt-auto">
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
