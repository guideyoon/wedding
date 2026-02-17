"use client";

import { useState } from "react";

interface ResultShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

function fallbackCopy(textToCopy: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

export function ResultShareButton({ title, text, className }: ResultShareButtonProps) {
  const [notice, setNotice] = useState<string | null>(null);

  const handleShare = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const shareUrl = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text, url: shareUrl });
        setNotice("공유 창을 열었어요.");
        return;
      }

      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(shareUrl);
        setNotice("링크를 복사했어요.");
        return;
      }

      setNotice(fallbackCopy(shareUrl) ? "링크를 복사했어요." : "공유를 지원하지 않는 환경입니다.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setNotice(fallbackCopy(shareUrl) ? "링크를 복사했어요." : "공유에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className={className ?? ""}>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-[var(--soft-accent)]"
      >
        공유하기
      </button>
      {notice ? <p className="mt-2 text-xs text-[var(--ink-faint)]">{notice}</p> : null}
    </div>
  );
}
