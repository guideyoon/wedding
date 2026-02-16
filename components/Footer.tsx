export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--line)] bg-white">
      <div className="mx-auto grid w-full max-w-[1320px] gap-3 px-4 py-6 text-xs text-[var(--ink-faint)] md:px-6">
        <p>광고 및 제휴 문의: partnership@weddingevee.example</p>
        <p>개인정보 처리방침 | 이용약관</p>
        <p>
          일정 데이터 출처: replyalba 웨딩 일정 페이지 (
          <a
            className="underline-offset-2 hover:underline"
            href="https://replyalba.com/intros/weddingA/"
            target="_blank"
            rel="noopener noreferrer"
          >
            replyalba.com
          </a>
          )
        </p>
      </div>
    </footer>
  );
}

