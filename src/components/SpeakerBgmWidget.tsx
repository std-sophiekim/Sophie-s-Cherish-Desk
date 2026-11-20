import { useState } from 'react';
import {
  Loader2,
  Music,
  Search,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { SpeakerMode, YouTubeTrack } from '../types/desk';

interface SpeakerBgmWidgetProps {
  isOpen: boolean;
  speakerMode: SpeakerMode;
  speakerVolume: number;
  onChangeSpeakerMode: (mode: SpeakerMode) => void;
  onChangeSpeakerVolume: (vol: number) => void;
  onOpen: () => void;
  onClose: () => void;
}

function extractClientYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live');
      if (idx !== -1 && parts[idx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[idx + 1])) {
        return parts[idx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function SpeakerBgmWidget({
  isOpen,
  speakerMode,
  speakerVolume,
  onChangeSpeakerMode,
  onChangeSpeakerVolume,
  onOpen,
  onClose,
}: SpeakerBgmWidgetProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<YouTubeTrack | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const runSearch = async (searchText: string) => {
    const trimmed = searchText.trim();
    if (!trimmed) return;

    onChangeSpeakerMode('youtube');
    setSearchError(null);

    const directId = extractClientYoutubeId(trimmed);
    if (directId) {
      const directTrack: YouTubeTrack = {
        id: directId,
        title: '직접 입력한 유튜브 영상',
        channel: 'YouTube',
        duration: '',
        thumbnail: `https://i.ytimg.com/vi/${directId}/mqdefault.jpg`,
      };
      setActiveTrack(directTrack);
      setResults([directTrack]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as { items?: YouTubeTrack[]; error?: string };
      if (!res.ok) {
        setSearchError(data.error || '검색 중 오류가 발생했습니다.');
        setResults([]);
      } else {
        const items = data.items ?? [];
        setResults(items);
        if (items.length === 0) {
          setSearchError('검색 결과가 없습니다. 다른 키워드로 찾아보세요.');
        }
      }
    } catch {
      setSearchError('서버와 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(query);
  };

  const handleSelectTrack = (track: YouTubeTrack) => {
    onChangeSpeakerMode('youtube');
    setActiveTrack(track);
  };

  const handleStopYoutube = () => {
    setActiveTrack(null);
    if (speakerMode === 'youtube') {
      onChangeSpeakerMode('off');
    }
  };

  const isYoutubePlaying = speakerMode === 'youtube' && activeTrack !== null;

  return (
    <>
      {/* Compact Now-Playing Mini Pill/Button when popover is closed while YouTube plays */}
      {!isOpen && isYoutubePlaying && activeTrack && (
        <div
          style={{ left: '16%', bottom: '28%' }}
          className="absolute z-30 flex items-center gap-2 max-w-[230px] px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#23201C]/95 backdrop-blur-md border border-slate-200 dark:border-stone-700 shadow-lg"
        >
          <button
            type="button"
            onClick={onOpen}
            data-cursor-label="↘ 영상 창 열기"
            className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
          >
            <Music className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            <span className="text-[11px] font-semibold text-[#1E293B] dark:text-stone-100 truncate">
              {activeTrack.title}
            </span>
          </button>
          <button
            type="button"
            onClick={handleStopYoutube}
            aria-label="유튜브 음악 정지"
            className="p-1 text-slate-400 hover:text-[#E11D48] shrink-0"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      )}

      {/* Main Speaker Popover — Kept mounted when YouTube plays so closing doesn't kill audio */}
      {(isOpen || isYoutubePlaying) && (
        <div
          role="dialog"
          aria-label="마샬 스타일 스피커 BGM 및 유튜브 음악 검색"
          aria-hidden={!isOpen}
          style={{ left: '4%', bottom: '28%' }}
          className={
            isOpen
              ? 'absolute z-30 w-[330px] sm:w-[390px] max-h-[66%] rounded-2xl bg-white/95 dark:bg-[#23201C]/95 backdrop-blur-md border border-slate-200 dark:border-stone-700 shadow-2xl p-4 flex flex-col gap-3'
              : 'absolute w-px h-px overflow-hidden opacity-0 pointer-events-none'
          }
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#1E293B] dark:text-[#F4F1EA]">
              마샬 스피커 BGM
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="스피커 창 닫기"
              className="p-1 text-slate-400 hover:text-[#1E293B] dark:hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Audio Mode Tabs */}
          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { key: 'off', label: '끄기' },
                { key: 'lofi', label: 'Lo-fi' },
                { key: 'rain', label: '빗소리' },
                { key: 'youtube', label: 'YouTube' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onChangeSpeakerMode(item.key)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                  speakerMode === item.key
                    ? 'bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] border-transparent'
                    : 'bg-[#FAF9F6] dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-200 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Built-in Synthesizer Volume Control */}
          {(speakerMode === 'lofi' || speakerMode === 'rain') && (
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-300 pt-1">
              {speakerVolume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
              )}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={speakerVolume}
                onChange={(e) => onChangeSpeakerVolume(Number(e.target.value))}
                aria-label="음량 조절"
                className="w-full accent-[#E11D48]"
              />
              <span className="font-mono-code tabular-nums w-8 text-right">
                {Math.round(speakerVolume * 100)}%
              </span>
            </label>
          )}

          {/* YouTube Search & Embedded Player */}
          {speakerMode === 'youtube' && (
            <div className="flex flex-col gap-2.5 min-h-0 overflow-hidden">
              <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="유튜브 검색 또는 링크 붙여넣기"
                    aria-label="유튜브 음악 검색"
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '검색'}
                </button>
              </form>

              {/* Quick Keyword Shortcuts */}
              {!activeTrack && results.length === 0 && !isSearching && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {['lofi study music', '지브리 피아노 공부', '카페 재즈 bgm'].map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setQuery(preset);
                          void runSearch(preset);
                        }}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-[#FAF9F6] dark:bg-stone-800 border border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-300 hover:border-[#E11D48]/60"
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* Embedded Video Player */}
              {activeTrack && (
                <div className="space-y-1.5 shrink-0">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-stone-700">
                    <iframe
                      key={activeTrack.id}
                      src={`https://www.youtube.com/embed/${activeTrack.id}?autoplay=1&rel=0`}
                      title={activeTrack.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full h-full border-0"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-[#1E293B] dark:text-stone-100 truncate">
                      {activeTrack.title}
                    </span>
                    <button
                      type="button"
                      onClick={handleStopYoutube}
                      className="text-slate-400 hover:text-[#E11D48] whitespace-nowrap shrink-0"
                    >
                      재생 멈춤
                    </button>
                  </div>
                </div>
              )}

              {searchError && (
                <p className="text-[11px] text-[#E11D48] bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 rounded-lg">
                  {searchError}
                </p>
              )}

              {/* Search Results List */}
              {results.length > 0 && (
                <div className="overflow-y-auto desk-scroll max-h-40 space-y-1.5 pr-0.5">
                  {results.map((item) => {
                    const isSelected = activeTrack?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTrack(item)}
                        className={`w-full text-left flex items-center gap-2.5 p-1.5 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-[#FEF3C7]/70 dark:bg-[#4B4121]/60 border-[#EAB308]/70'
                            : 'bg-[#FAF9F6] dark:bg-stone-800/70 border-slate-200/70 dark:border-stone-700 hover:border-[#E11D48]/50'
                        }`}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-9 object-cover rounded shrink-0 bg-slate-200 dark:bg-stone-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-[#1E293B] dark:text-stone-100 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-stone-400 truncate font-mono-code tabular-nums">
                            {item.channel}
                            {item.duration ? ` · ${item.duration}` : ''}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
