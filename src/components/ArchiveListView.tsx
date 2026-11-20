import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  LAB_LABELS,
  SPINE_COLOR_STYLES,
  StudyNote,
  SUBJECT_LABELS,
  SubjectFilter,
} from '../types/desk';

interface ArchiveListViewProps {
  notes: StudyNote[];
  activeFilter: SubjectFilter;
  onOpenInDesk: (noteId: string) => void;
  onToggleCherish: (noteId: string) => void;
  onOpenNewNote: () => void;
}

export function ArchiveListView({
  notes,
  activeFilter,
  onOpenInDesk,
  onToggleCherish,
  onOpenNewNote,
}: ArchiveListViewProps) {
  const [query, setQuery] = useState('');

  const filtered = notes.filter((note) => {
    const matchesSubject = activeFilter === 'all' || note.subject === activeFilter;
    const q = query.trim().toLowerCase();
    if (!q) return matchesSubject;
    const hay = `${note.title} ${note.topic} ${note.summary} ${note.takeaways.join(' ')}`.toLowerCase();
    return matchesSubject && hay.includes(q);
  });

  return (
    <section
      aria-label="전체 공부 노트 목록 보기"
      className="h-full overflow-y-auto desk-scroll"
    >
      <div className="max-w-[1160px] mx-auto px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] dark:text-[#F4F1EA] text-balance">
            전공 공부 &amp; 수집 아카이브 목록
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">
            카드를 클릭하면 중앙 아이맥 양면 노트로 바로 펼쳐집니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="키워드 검색..."
              aria-label="아카이브 검색"
              className="pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-[#23201C] border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100 w-52 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <button
            type="button"
            onClick={onOpenNewNote}
            data-cursor-label="↘ 새 노트 쓰기"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-lg whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 노트</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#23201C] border border-slate-200 dark:border-stone-700 p-12 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-stone-400">
            검색 조건에 맞는 공부 노트가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="px-4 py-2 text-xs font-semibold text-[#E11D48] hover:underline"
          >
            검색어 지우기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => {
            const spine = SPINE_COLOR_STYLES[note.spineColor];
            return (
              <article
                key={note.id}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-[#23201C] border border-slate-200/90 dark:border-stone-700/80 p-5 shadow-[0_6px_20px_rgba(30,41,59,0.04)] hover:-translate-y-0.5 transition-transform"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-stone-600"
                        style={{ backgroundColor: spine.bg }}
                      />
                      <span className="font-mono-code tabular-nums">{note.indexNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{SUBJECT_LABELS[note.subject]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{note.topic}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleCherish(note.id)}
                      data-cursor-label={note.isCherished ? '↘ 체리 해제' : '↘ 체리 수집'}
                      aria-label={note.isCherished ? '체리 수집 해제' : '체리 수집'}
                      className={`text-sm transition-transform hover:scale-110 ${
                        note.isCherished ? 'opacity-100' : 'opacity-35 hover:opacity-80'
                      }`}
                    >
                      🍒
                    </button>
                  </div>

                  <h2 className="text-base font-bold text-[#1E293B] dark:text-[#F4F1EA] leading-snug text-balance">
                    {note.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                    {note.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 dark:text-stone-500 truncate">
                    {note.labType !== 'none' ? LAB_LABELS[note.labType] : note.updatedAt}
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenInDesk(note.id)}
                    data-cursor-label="↘ 책상에서 열기"
                    className="font-semibold text-[#E11D48] dark:text-[#FDA4AF] hover:underline whitespace-nowrap shrink-0"
                  >
                    책상에서 열기 →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
}
