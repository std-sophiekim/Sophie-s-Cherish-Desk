import { useId } from 'react';
import { Shuffle, X } from 'lucide-react';
import { StudyNote, SUBJECT_LABELS } from '../types/desk';

interface CherishCollectionModalProps {
  isOpen: boolean;
  notes: StudyNote[];
  onClose: () => void;
  onOpenNote: (noteId: string) => void;
  onToggleCherish: (noteId: string) => void;
}

// Cozy organic positions for cherries nestled inside the yellow ceramic bowl
const CHERRY_CLUSTER_SPOTS = [
  { x: 50, y: 54, rot: -8 },
  { x: 37, y: 58, rot: 12 },
  { x: 63, y: 57, rot: -14 },
  { x: 43, y: 44, rot: 6 },
  { x: 57, y: 45, rot: -6 },
  { x: 26, y: 54, rot: 16 },
  { x: 74, y: 54, rot: -15 },
  { x: 50, y: 36, rot: 4 },
  { x: 32, y: 43, rot: -10 },
  { x: 68, y: 43, rot: 11 },
  { x: 42, y: 63, rot: 7 },
  { x: 58, y: 63, rot: -9 },
];

function CuteCherryGraphic({ size = 34 }: { size?: number }) {
  const gradId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_3px_4px_rgba(127,29,29,0.28)]"
    >
      {/* Curved green-brown stem */}
      <path
        d="M20 17C20.5 11 24 6 29.5 4"
        stroke="#5C4033"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      {/* Cute small leaf */}
      <path
        d="M25.5 7.5C29 6.5 32.5 8 33.5 11C30 11.8 27 10.6 25.5 7.5Z"
        fill="#65A30D"
      />
      {/* Plump glossy cherry body */}
      <circle cx="20" cy="25.5" r="11" fill="#D9163A" />
      <circle cx="20" cy="25.5" r="11" fill={`url(#${gradId})`} />
      {/* Glossy highlight */}
      <ellipse
        cx="16"
        cy="21.5"
        rx="3.2"
        ry="2"
        transform="rotate(-28 16 21.5)"
        fill="#FFF1F2"
        fillOpacity="0.82"
      />
      <circle cx="14.2" cy="25.2" r="1.1" fill="#FFF1F2" fillOpacity="0.65" />
      <defs>
        <radialGradient
          id={gradId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(17 22) rotate(50) scale(16)"
        >
          <stop stopColor="#FF6B81" stopOpacity="0.35" />
          <stop offset="0.65" stopColor="#BE123C" stopOpacity="0.1" />
          <stop offset="1" stopColor="#881337" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </svg>
  );
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
  const ratio =
    notes.length > 0 ? Math.round((cherished.length / notes.length) * 100) : 0;

  const badgeTitle =
    cherished.length >= 6
      ? '가득 찬 체리 그릇 컬렉터'
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
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      {/* Speckled Butter-Yellow Ceramic Dish Styled Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:
            'radial-gradient(rgba(161, 98, 7, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '20px 20px',
        }}
        className="w-full max-w-xl max-h-[86vh] rounded-[28px] bg-[#FEFCE8] dark:bg-[#242016] border-[3px] border-[#FACC15] dark:border-[#A18220] shadow-[0_24px_60px_rgba(161,98,7,0.22)] flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#FEF9C3]/85 dark:bg-[#2E2819]/90 border-b border-[#FDE047]/70 dark:border-[#5C4E22] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0">
              <CuteCherryGraphic size={32} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#1E293B] dark:text-[#FEF9C3]">
                소피의 노란 체리 접시
              </h2>
              <p className="text-xs text-amber-900/75 dark:text-amber-200/75 tabular-nums">
                {badgeTitle} · {notes.length}권 중 {cherished.length}알 수집 ({ratio}%)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="체리 수집함 닫기"
            className="p-1.5 rounded-full text-amber-900/60 hover:text-[#1E293B] dark:text-amber-200/70 dark:hover:text-white hover:bg-[#FDE047]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Butter-Yellow Ceramic Bowl Holding Cute Cherries */}
        <div className="px-6 pt-4 pb-3 bg-[#FFFDF5] dark:bg-[#1E1B13] border-b border-[#FDE68A]/70 dark:border-[#4B4121] flex flex-col items-center gap-3">
          <div className="relative w-full max-w-[360px] h-[142px] flex items-center justify-center select-none">
            {/* Speckled Butter-Yellow Ceramic Bowl SVG */}
            <svg
              viewBox="0 0 360 140"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full"
            >
              {/* Soft desk shadow beneath dish */}
              <ellipse cx="180" cy="122" rx="134" ry="13" fill="rgba(161, 98, 7, 0.14)" />
              {/* Outer butter-yellow ceramic bowl body */}
              <path
                d="M36 62C36 105 92 126 180 126C268 126 324 105 324 62Z"
                fill="#FDE047"
                stroke="#EAB308"
                strokeWidth="2.5"
              />
              {/* Warm ceramic rim top */}
              <ellipse
                cx="180"
                cy="62"
                rx="144"
                ry="30"
                fill="#FEF9C3"
                stroke="#EAB308"
                strokeWidth="2.5"
              />
              {/* Inner concave dish shadow */}
              <ellipse cx="180" cy="64" rx="126" ry="22" fill="#FEF08A" fillOpacity="0.65" />
              {/* Ceramic speckles matching the desk dish */}
              <circle cx="88" cy="95" r="1.8" fill="#A16207" fillOpacity="0.45" />
              <circle cx="118" cy="108" r="1.5" fill="#A16207" fillOpacity="0.4" />
              <circle cx="152" cy="113" r="2" fill="#A16207" fillOpacity="0.45" />
              <circle cx="204" cy="112" r="1.6" fill="#A16207" fillOpacity="0.4" />
              <circle cx="242" cy="106" r="2.1" fill="#A16207" fillOpacity="0.45" />
              <circle cx="272" cy="93" r="1.5" fill="#A16207" fillOpacity="0.4" />
              <circle cx="132" cy="94" r="1.4" fill="#A16207" fillOpacity="0.35" />
              <circle cx="222" cy="95" r="1.7" fill="#A16207" fillOpacity="0.35" />
            </svg>

            {/* Cute Interactive Cherries Piled Inside the Yellow Bowl */}
            {cherished.length === 0 ? (
              <p className="relative z-10 text-xs font-medium text-amber-900/70 dark:text-amber-200/80 pt-2">
                노란 그릇이 아직 비어 있어요
              </p>
            ) : (
              cherished.slice(0, CHERRY_CLUSTER_SPOTS.length).map((note, idx) => {
                const spot = CHERRY_CLUSTER_SPOTS[idx];
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      onOpenNote(note.id);
                      onClose();
                    }}
                    data-cursor-label={`↘ ${note.title}`}
                    aria-label={`${note.title} 책 펼치기`}
                    style={{
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                      transform: `translate(-50%, -50%) rotate(${spot.rot}deg)`,
                    }}
                    className="absolute z-10 transition-transform duration-150 hover:scale-125 hover:z-20 focus-visible:outline-2 focus-visible:outline-[#E11D48] rounded-full"
                  >
                    <CuteCherryGraphic size={36} />
                  </button>
                );
              })
            )}
          </div>

          {/* Progress Bar + Random Pick */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex-1 min-w-[160px] space-y-1">
              <div className="h-2 rounded-full bg-[#FEF08A] dark:bg-stone-800 overflow-hidden">
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
              data-cursor-label="↘ 랜덤 체리 뽑기"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg disabled:opacity-40 whitespace-nowrap shrink-0 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>체리 랜덤 꺼내보기</span>
            </button>
          </div>
        </div>

        {/* Collected Notes with Cherry Charm Attached */}
        <div className="p-5 overflow-y-auto desk-scroll space-y-2.5">
          {cherished.length === 0 ? (
            <div className="py-6 text-center space-y-1.5">
              <p className="text-sm font-medium text-[#1E293B] dark:text-stone-200">
                아직 수집한 체리 노트가 없어요.
              </p>
              <p className="text-xs text-slate-500 dark:text-stone-400">
                책꽂이에서 책을 펼친 뒤 &lsquo;체리 수집&rsquo; 버튼을 눌러 노란 그릇에 담아보세요.
              </p>
            </div>
          ) : (
            cherished.map((note) => (
              <div
                key={note.id}
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E1B16] border border-[#FDE68A] dark:border-[#5C4E22] shadow-xs hover:border-[#E11D48]/60 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenNote(note.id);
                    onClose();
                  }}
                  data-cursor-label={`↘ ${note.title} 열기`}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  {/* Cute Hanging Cherry Charm on Each Card */}
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-[#FEF9C3] dark:bg-[#3A3118] border border-[#FDE047]/80 dark:border-[#6B5B28] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CuteCherryGraphic size={26} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-500 dark:text-stone-400">
                      {note.indexNumber} · {SUBJECT_LABELS[note.subject]} · {note.topic}
                    </div>
                    <p className="text-sm font-semibold text-[#1E293B] dark:text-stone-100 truncate">
                      {note.title}
                    </p>
                  </div>
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
