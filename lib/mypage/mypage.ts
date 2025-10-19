export async function fetchMyPage(id: string) {
  const res = await fetch(`/api/mypage/${id}`);
  if (!res.ok) throw new Error("ユーザーデータ取得に失敗しました");
  return res.json();
}

export async function updateMyPage(id: string, data: any) {
  const res = await fetch(`/api/mypage/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("更新に失敗しました");
  return res.json();
}
