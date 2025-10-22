import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">読み込み中…</div>}>
      <VerifyContent />
    </Suspense>
  );
}
