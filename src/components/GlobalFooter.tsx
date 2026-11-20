import { ChangeEvent, useRef } from 'react';

interface GlobalFooterProps {
  totalNotes: number;
  cherishedCount: number;
  isCustomCursorEnabled: boolean;
  onToggleCustomCursor: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onResetArchive: () => void;
}

export function GlobalFooter({
  totalNotes,
  cherishedCount,
  isCustomCursorEnabled,
  onToggleCustomCursor,
  onExportBackup,
  onImportBackup,
  onResetArchive,
}: GlobalFooterProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <footer className="shrink-0 w-full border-t border-slate-200/80 dark:border-stone-800 bg-white dark:bg-[#171614] transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-slate-500 dark:text-stone-400">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-[#1E293B] dark:text-[#F4F1EA]">
            Sophie&apos;s Cherish Desk
          </span>
          <span aria-hidden="true">·</span>
          <span>컴퓨터교육과 디자인을 한 권의 책상 위에 수집하는 소피의 아카이브</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">
            노트 {totalNotes}권 · 체리 {cherishedCount}개 수집
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onToggleCustomCursor}
            data-cursor-label="↘ 체크 커서 전환"
            className="hover:text-[#1E293B] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            노란 체크 커서: {isCustomCursorEnabled ? '켜짐' : '꺼짐'}
          </button>

          <span aria-hidden="true" className="text-slate-300 dark:text-stone-700">
            /
          </span>

          <button
            type="button"
            onClick={onExportBackup}
            data-cursor-label="↘ JSON 저장"
            className="hover:text-[#1E293B] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            백업 내보내기
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-cursor-label="↘ JSON 불러오기"
            className="hover:text-[#1E293B] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            백업 불러오기
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="백업 JSON 파일 선택"
          />

          <button
            type="button"
            onClick={onResetArchive}
            data-cursor-label="↘ 기본 노트 복원"
            className="hover:text-[#E11D48] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            초기화
          </button>

          <span aria-hidden="true" className="text-slate-300 dark:text-stone-700">
            ·
          </span>

          <span className="whitespace-nowrap shrink-0">© 2026 Sophie&apos;s Cherish Desk</span>
        </div>
      </div>
    </footer>
  );
}
