import { SubjectFilter, ViewMode } from '../types/desk';

interface GlobalHeaderProps {
  activeFilter: SubjectFilter;
  onFilterChange: (filter: SubjectFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  cherishedCount: number;
  onOpenCollection: () => void;
  onResetToIdleDesk: () => void;
}

export function GlobalHeader({
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  cherishedCount,
  onOpenCollection,
  onResetToIdleDesk,
}: GlobalHeaderProps) {
  const filterItems: { key: SubjectFilter; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'education', label: '교육학' },
    { key: 'computer', label: '컴퓨터' },
    { key: 'design', label: '디자인' },
  ];

  const handleSubjectClick = (key: SubjectFilter) => {
    onFilterChange(key);
  };

  return (
    <header className="shrink-0 z-40 w-full bg-white/95 dark:bg-[#171614]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            onViewModeChange('desk');
            onResetToIdleDesk();
          }}
          data-cursor-label="↘ 데스크 홈"
          className="text-base sm:text-lg font-semibold tracking-tight text-[#1E293B] dark:text-[#F4F1EA] whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D48]"
        >
          Sophie&apos;s Cherish Desk
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="전공 과목 및 보기 탐색"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-stone-300"
        >
          {filterItems.map((item) => {
            const isActive = activeFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSubjectClick(item.key)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D48] ${
                  isActive
                    ? 'text-[#1E293B] dark:text-white font-semibold'
                    : 'hover:text-[#1E293B] dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#E11D48] rounded-full"
                  />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              onViewModeChange(viewMode === 'desk' ? 'list' : 'desk')
            }
            data-cursor-label={viewMode === 'desk' ? '↘ 목록으로 보기' : '↘ 책상으로 돌아가기'}
            className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D48] ${
              viewMode === 'list'
                ? 'text-[#1E293B] dark:text-white font-semibold'
                : 'hover:text-[#1E293B] dark:hover:text-white'
            }`}
          >
            {viewMode === 'desk' ? '목록 보기' : '데스크 보기'}
            {viewMode === 'list' && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#FACC15] rounded-full"
              />
            )}
          </button>
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCollection}
            data-cursor-label="↘ 체리 수집함 열기"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48] tabular-nums"
          >
            체리 수집함 · {cherishedCount}
          </button>
        </div>
      </div>

      {/* Compact mobile filter bar (visible only < md, keeps sticky height compact) */}
      <div className="flex md:hidden items-center justify-between gap-2 px-4 py-2 border-t border-slate-200/70 dark:border-stone-800 overflow-x-auto text-xs font-medium">
        <div className="flex items-center gap-3 shrink-0">
          {filterItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSubjectClick(item.key)}
              className={`whitespace-nowrap shrink-0 px-2 py-1 rounded ${
                activeFilter === item.key
                  ? 'text-[#E11D48] font-semibold'
                  : 'text-slate-600 dark:text-stone-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onViewModeChange(viewMode === 'desk' ? 'list' : 'desk')
          }
          className="whitespace-nowrap shrink-0 text-slate-700 dark:text-stone-200 underline underline-offset-4"
        >
          {viewMode === 'desk' ? '목록 보기' : '데스크 보기'}
        </button>
      </div>
    </header>
  );
}
