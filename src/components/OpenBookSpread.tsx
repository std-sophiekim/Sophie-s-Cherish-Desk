import { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Pencil,
  Pin,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  LAB_LABELS,
  SPINE_COLOR_STYLES,
  StudyNote,
  SUBJECT_LABELS,
  SubjectFilter,
} from '../types/desk';
import { InteractiveLabBox } from './InteractiveLabBox';

interface BookRowShelfProps {
  notes: StudyNote[];
  activeFilter: SubjectFilter;
  onChangeFilter: (filter: SubjectFilter) => void;
  onOpenBook: (noteId: string) => void;
  onOpenNewNote: () => void;
  onClose: () => void;
}

export function BookRowShelf({
  notes,
  activeFilter,
  onChangeFilter,
  onOpenBook,
  onOpenNewNote,
  onClose,
}: BookRowShelfProps) {
  const visibleBooks =
    activeFilter === 'all'
      ? notes
      : notes.filter((n) => n.subject === activeFilter);

  const filters: { key: SubjectFilter; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'education', label: '교육학' },
    { key: 'computer', label: '컴퓨터' },
    { key: 'design', label: '디자인' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="전공 책꽂이"
      className="absolute inset-0 z-30 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl rounded-2xl bg-[#FAF9F6]/98 dark:bg-[#22201C]/98 border border-slate-200 dark:border-stone-700 shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Top Row: Title + Subject Filter Tabs + Close */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1E293B] dark:text-[#F4F1EA]">
              전공 책꽂이 ({visibleBooks.length}권)
            </h2>
            <p className="text-xs text-slate-500 dark:text-stone-400">
              원하는 책을 클릭하면 책이 펼쳐지며 목차와 노트가 열립니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EAE4D7]/60 dark:bg-stone-800">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => onChangeFilter(f.key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFilter === f.key
                      ? 'bg-white dark:bg-stone-700 text-[#1E293B] dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-stone-300 hover:text-[#1E293B] dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="책꽂이 닫기"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Physical Books Lined Up Side-by-Side (주루룩) */}
        <div className="relative rounded-xl bg-white dark:bg-[#191714] border border-slate-200/90 dark:border-stone-800 px-5 pt-7 pb-4 overflow-x-auto desk-scroll">
          {visibleBooks.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-slate-500 dark:text-stone-400">
                이 과목에 꽂힌 책이 아직 없어요.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewNote();
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-lg"
              >
                첫 번째 책 만들기
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-3.5 min-w-max pb-3">
              {visibleBooks.map((note, idx) => {
                const palette = SPINE_COLOR_STYLES[note.spineColor];
                const heights = [208, 224, 198, 218, 204, 228, 212];
                const h = heights[idx % heights.length];

                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => onOpenBook(note.id)}
                    data-cursor-label={`↘ ${note.title} 펼치기`}
                    style={{ height: `${h}px` }}
                    className="group relative w-24 rounded-r-lg rounded-l-xs border border-slate-300/90 dark:border-stone-600 shadow-[3px_6px_14px_rgba(30,41,59,0.09)] hover:-translate-y-3 transition-transform duration-200 ease-out flex flex-col justify-between p-2.5 text-left overflow-hidden focus-visible:outline-2 focus-visible:outline-[#E11D48]"
                  >
                    {/* Light & Dark Hardcover Fill */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 dark:hidden"
                      style={{ backgroundColor: palette.bg }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 hidden dark:block"
                      style={{ backgroundColor: palette.darkBg }}
                    />

                    {/* Book Binding Spine Groove on Left */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-2.5 bg-black/8 dark:bg-black/25 border-r border-black/10"
                    />

                    {/* Top White Page Edge Hint */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 inset-x-1 h-1 bg-white/75 rounded-t-xs"
                    />

                    {/* Cherry Bookmark Ribbon */}
                    {note.isCherished && (
                      <span
                        aria-label="체리 수집됨"
                        className="absolute top-1.5 right-2 z-10 text-sm leading-none drop-shadow-xs"
                      >
                        🍒
                      </span>
                    )}

                    {/* Index Label */}
                    <div className="relative z-10 pl-2">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-white/90 dark:bg-stone-900/80 text-[10px] font-mono-code font-semibold text-[#1E293B] dark:text-stone-100 tabular-nums">
                        No.{note.indexNumber}
                      </span>
                    </div>

                    {/* Cover Title */}
                    <div className="relative z-10 pl-2 my-auto">
                      <p className="text-xs font-bold text-[#1E293B] dark:text-white leading-snug line-clamp-3">
                        {note.title}
                      </p>
                    </div>

                    {/* Bottom Subject & Topic */}
                    <div className="relative z-10 pl-2 pt-1.5 border-t border-black/10 dark:border-white/15 text-[10px] font-medium text-slate-800/85 dark:text-stone-100/90 truncate">
                      {SUBJECT_LABELS[note.subject]} · {note.topic}
                    </div>
                  </button>
                );
              })}

              {/* Add New Book Card at End of Row */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewNote();
                }}
                data-cursor-label="↘ 새 책 추가하기"
                className="w-24 h-[204px] rounded-r-lg rounded-l-xs border-2 border-dashed border-slate-300 dark:border-stone-600 hover:border-[#E11D48] hover:-translate-y-2 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-stone-400 hover:text-[#E11D48] p-2 shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-semibold text-center leading-tight">
                  새 책 쓰기
                </span>
              </button>
            </div>
          )}

          {/* Acrylic Shelf Bottom Edge */}
          <div
            aria-hidden="true"
            className="w-full h-2.5 rounded-full bg-[#FAF9F6] dark:bg-stone-800 border border-slate-200 dark:border-stone-700"
          />
        </div>
      </div>
    </div>
  );
}

interface OpenBookSpreadProps {
  note: StudyNote;
  allNotes: StudyNote[];
  onCloseBook: () => void;
  onSwitchBook: (noteId: string) => void;
  onToggleCherish: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onEditNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
}

type BookSectionKey = 'overview' | 'code' | 'lab';

export function OpenBookSpread({
  note,
  allNotes,
  onCloseBook,
  onSwitchBook,
  onToggleCherish,
  onTogglePin,
  onEditNote,
  onDeleteNote,
}: OpenBookSpreadProps) {
  const [activeSection, setActiveSection] = useState<BookSectionKey>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setActiveSection('overview');
    setConfirmDelete(false);
  }, [note.id]);

  const spine = SPINE_COLOR_STYLES[note.spineColor];
  const relatedNotes = allNotes.filter((n) => n.subject === note.subject);

  const tocSections: { key: BookSectionKey; num: string; label: string; sub: string }[] = [
    {
      key: 'overview',
      num: '01',
      label: '개념 정리 & 핵심 포인트',
      sub: `${note.takeaways.length}개 핵심 요약`,
    },
    ...(note.codeSnippet.trim()
      ? [
          {
            key: 'code' as const,
            num: '02',
            label: '코드 & 구조 메모',
            sub: '구현 예시 및 타임라인',
          },
        ]
      : []),
    ...(note.labType !== 'none'
      ? [
          {
            key: 'lab' as const,
            num: note.codeSnippet.trim() ? '03' : '02',
            label: LAB_LABELS[note.labType],
            sub: '직접 조작하며 익히기',
          },
        ]
      : []),
  ];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(note.codeSnippet);
      setCopiedId(note.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard ignored cleanly
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${note.title} 펼쳐진 책`}
      className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseBook();
      }}
    >
      {/* Physical Hardcover Outer Frame */}
      <div
        className="relative w-full max-w-5xl h-[92%] max-h-[600px] rounded-2xl p-2 sm:p-2.5 shadow-[0_24px_60px_rgba(15,23,42,0.32)] flex flex-col border border-slate-400/50 dark:border-stone-600"
        style={{ backgroundColor: spine.bg }}
      >
        {/* Inner Open Book Paper Spread */}
        <div className="relative flex-1 min-h-0 rounded-xl bg-[#FFFDF7] dark:bg-[#1E1C19] border border-slate-300/80 dark:border-stone-700 grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-inner">
          {/* Realistic Center Book Binding Shadow */}
          <div
            aria-hidden="true"
            className="hidden md:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 z-10 bg-gradient-to-r from-transparent via-slate-900/10 dark:via-black/45 to-transparent"
          />

          {/* LEFT PAGE: Book Title, Table of Contents (목차), & Subject Book List */}
          <div className="flex flex-col min-h-0 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-stone-800 overflow-y-auto desk-scroll space-y-5">
            {/* Top Page Header */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#E11D48]" />
                <span className="font-mono-code font-semibold text-[#E11D48]">
                  No.{note.indexNumber}
                </span>
                <span>·</span>
                <span>{SUBJECT_LABELS[note.subject]}</span>
                <span>·</span>
                <span>{note.topic}</span>
              </div>

              <span className="font-mono-code tabular-nums text-[11px]">
                {note.updatedAt}
              </span>
            </div>

            {/* Book Title & Action Controls */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#F4F1EA] leading-snug text-balance">
                {note.title}
              </h2>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleCherish(note.id)}
                  data-cursor-label={note.isCherished ? '↘ 체리 해제' : '↘ 체리 수집'}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                    note.isCherished
                      ? 'bg-[#E11D48] border-[#E11D48] text-white'
                      : 'bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-200'
                  }`}
                >
                  <span>🍒</span>
                  <span>{note.isCherished ? '수집됨' : '체리 수집'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTogglePin(note.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border ${
                    note.isPinnedToBoard
                      ? 'bg-[#FEF3C7] dark:bg-[#4B4121] border-[#FDE047] text-[#1E293B] dark:text-[#FEF08A]'
                      : 'bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-300'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  <span>{note.isPinnedToBoard ? '타공판 고정됨' : '타공판 핀'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  aria-label="노트 수정"
                  className="p-1.5 text-slate-500 hover:text-[#1E293B] dark:text-stone-400 dark:hover:text-white rounded-md"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteNote(note.id);
                      onCloseBook();
                    }}
                    className="px-2 py-1 text-xs font-semibold bg-[#E11D48] text-white rounded-md"
                  >
                    삭제 확인
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    aria-label="노트 삭제"
                    className="p-1.5 text-slate-400 hover:text-[#E11D48] rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Table of Contents (이 책의 목차) */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-stone-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                목차 (Contents)
              </h3>
              <div className="space-y-1.5">
                {tocSections.map((sec) => {
                  const active = activeSection === sec.key;
                  return (
                    <button
                      key={sec.key}
                      type="button"
                      onClick={() => setActiveSection(sec.key)}
                      className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        active
                          ? 'bg-[#FEF3C7]/70 dark:bg-[#4B4121]/60 border-[#EAB308]/60 text-[#1E293B] dark:text-white'
                          : 'bg-[#FAF9F6] dark:bg-stone-800/50 border-slate-200/70 dark:border-stone-800 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono-code text-xs font-semibold text-[#E11D48]">
                          {sec.num}
                        </span>
                        <span className="text-xs font-semibold truncate">
                          {sec.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-stone-400 shrink-0">
                        {sec.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Chapter Index (같은 과목 책 리스트) */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-stone-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                {SUBJECT_LABELS[note.subject]} 시리즈 목록 ({relatedNotes.length})
              </h3>
              <div className="space-y-1">
                {relatedNotes.map((item) => {
                  const isCurrent = item.id === note.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSwitchBook(item.id)}
                      className={`w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        isCurrent
                          ? 'font-semibold text-[#E11D48] bg-rose-50/70 dark:bg-rose-950/30'
                          : 'text-slate-600 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono-code mr-1.5">{item.indexNumber}.</span>
                        {item.title}
                      </span>
                      {item.isCherished && <span className="shrink-0">🍒</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PAGE: Active Chapter Content / Code / Interactive Lab */}
          <div className="flex flex-col min-h-0 p-5 sm:p-6 bg-[#FAF9F6]/65 dark:bg-[#171512]/70 overflow-y-auto desk-scroll space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-stone-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                {activeSection === 'overview'
                  ? '01. 개념 정리 & 핵심 포인트'
                  : activeSection === 'code'
                    ? '02. 코드 & 구조 메모'
                    : LAB_LABELS[note.labType]}
              </span>

              <button
                type="button"
                onClick={onCloseBook}
                data-cursor-label="↘ 책 덮기"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-stone-300 hover:text-[#1E293B] dark:hover:text-white rounded-md bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-700"
              >
                <X className="w-3.5 h-3.5" />
                <span>책 덮기</span>
              </button>
            </div>

            {activeSection === 'overview' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-700 dark:text-stone-200 leading-relaxed">
                  {note.summary}
                </p>

                {note.takeaways.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-200/70 dark:border-stone-800">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                      꼭 기억할 핵심 리스트
                    </h4>
                    <ol className="space-y-2">
                      {note.takeaways.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#23201C] border border-slate-200/80 dark:border-stone-800 text-xs sm:text-[13px] text-[#1E293B] dark:text-stone-200 leading-relaxed"
                        >
                          <span className="font-mono-code text-xs font-semibold text-[#E11D48] mt-0.5 shrink-0">
                            0{idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {note.labType !== 'none' && (
                  <button
                    type="button"
                    onClick={() => setActiveSection('lab')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FEF3C7] dark:bg-[#4B4121] border border-[#EAB308]/60 text-xs font-semibold text-[#1E293B] dark:text-[#FEF08A] flex items-center justify-center gap-1.5 hover:opacity-90"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{LAB_LABELS[note.labType]} 바로 실행하기 →</span>
                  </button>
                )}
              </div>
            )}

            {activeSection === 'code' && note.codeSnippet.trim() && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-stone-400">
                    예제 코드 / 아키텍처
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1E293B] dark:text-stone-400 dark:hover:text-white"
                  >
                    {copiedId === note.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#1E293B] dark:bg-[#11100E] text-slate-100 text-xs font-mono-code leading-relaxed overflow-x-auto border border-slate-800">
                  <code>{note.codeSnippet}</code>
                </pre>
              </div>
            )}

            {activeSection === 'lab' && note.labType !== 'none' && (
              <InteractiveLabBox labType={note.labType} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
