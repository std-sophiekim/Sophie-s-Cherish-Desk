import { Shuffle, X } from 'lucide-react';
import { StudyNote, SUBJECT_LABELS } from '../types/desk';

interface CherishCollectionModalProps {
  isOpen: boolean;
  notes: StudyNote[];
  onClose: () => void;
  onOpenNote: (noteId: string) => void;
  onToggleCherish: (noteId: string) => void;
}

export function CherishCollectionModal({
  isOpen,
  notes,
  onClose,
  onOpenNote,
  onToggleCherish,
}: CherishCollectionModalProps) {
  if (!isOpen) return null;

  const cherished = notes.filter((n) => n.isCherished);
  const ratio = notes.length > 0 ? Math.round((cherished.length / notes.length) * 100) : 0;

  const badgeTitle =
    cherished.length >= 6
      ? '가득 찬 체리 바구니 컬렉터'
      : cherished.length >= 3
        ? '아늑한 데스크 수집가'
        : '첫 체리 새싹 수집가';

  const handleRandomPick = () => {
    if (cherished.length === 0) return;
    const picked = cherished[Math.floor(Math.random() * cherished.length)];
    onOpenNote(picked.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="체리 수집함"
      className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl max-h-[85vh] rounded-2xl bg-white dark:bg-[#23201C] border border-slate-200 dark:border-stone-700 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#1E293B] dark:text-[#F4F1EA]">
              🍒 체리 수집함
            </h2>
            <p className="text-xs text-slate-500 dark:text-stone-400">
              {badgeTitle} · 전체 {notes.length}권 중 {cherished.length}권 수집 ({ratio}%)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Progress Bar + Random Pick */}
        <div className="px-6 py-3.5 bg-[#FAF9F6] dark:bg-[#1A1815] border-b border-slate-200/70 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[180px] space-y-1.5">
            <div className="h-2 rounded-full bg-slate-200 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-[#E11D48] rounded-full transition-all duration-300"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomPick}
            disabled={cherished.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-lg disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>랜덤 꺼내보기</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto desk-scroll space-y-2.5">
          {cherished.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm text-slate-500 dark:text-stone-400">
                아직 수집한 체리 노트가 없어요.
              </p>
              <p className="text-xs text-slate-400 dark:text-stone-500">
                아이맥에서 책을 펼친 뒤 &lsquo;체리 수집&rsquo; 버튼을 눌러 모아보세요.
              </p>
            </div>
          ) : (
            cherished.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-stone-800/70 border border-slate-200/80 dark:border-stone-700"
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenNote(note.id);
                    onClose();
                  }}
                  className="flex-1 min-w-0 text-left hover:opacity-80"
                >
                  <div className="text-[11px] text-slate-500 dark:text-stone-400">
                    {note.indexNumber} · {SUBJECT_LABELS[note.subject]} · {note.topic}
                  </div>
                  <p className="text-sm font-semibold text-[#1E293B] dark:text-stone-100 truncate">
                    {note.title}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleCherish(note.id)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-[#E11D48] dark:text-stone-400 whitespace-nowrap shrink-0"
                >
                  수집 해제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
