import { useEffect, useState } from 'react';
import {
  Check,
  Pause,
  Pin,
  Play,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  PegboardGoal,
  SpeakerMode,
  StudyNote,
  SUBJECT_LABELS,
  SubjectFilter,
} from '../types/desk';
import { deskAudio } from '../utils/audioEngine';
import { BookRowShelf, OpenBookSpread } from './OpenBookSpread';
import { RaspberryPiPopover, TamagotchiPopover } from './PegboardToys';
import { SpeakerBgmWidget } from './SpeakerBgmWidget';

interface PhotorealisticDeskStageProps {
  notes: StudyNote[];
  goals: PegboardGoal[];
  activeFilter: SubjectFilter;
  onChangeFilter: (filter: SubjectFilter) => void;
  selectedNote: StudyNote | null;
  isNightLamp: boolean;
  speakerMode: SpeakerMode;
  speakerVolume: number;
  cherishedCount: number;
  onSelectNote: (noteId: string | null) => void;
  onToggleCherish: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onEditNote: (note: StudyNote) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenNewNote: () => void;
  onOpenCollection: () => void;
  onOpenManual: () => void;
  onToggleNightLamp: () => void;
  onChangeSpeakerMode: (mode: SpeakerMode) => void;
  onChangeSpeakerVolume: (vol: number) => void;
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (text: string, color: PegboardGoal['noteColor']) => void;
  onDeleteGoal: (goalId: string) => void;
}

type ActivePopover =
  | 'pegboard'
  | 'bookshelf'
  | 'speaker'
  | 'clock'
  | 'tamagotchi'
  | 'raspi'
  | null;

type WindowWeatherOverride = 'auto' | 'rain-day' | 'night' | 'rain-night';

interface SeoulWeatherState {
  condition: 'clear' | 'rain';
  isDay: boolean;
  temperatureC: number | null;
}

const WINDOW_RAIN_DROPS = [
  { left: '8%', delay: '0s', duration: '0.85s', height: '18px' },
  { left: '16%', delay: '0.32s', duration: '0.78s', height: '22px' },
  { left: '24%', delay: '0.61s', duration: '0.92s', height: '16px' },
  { left: '33%', delay: '0.14s', duration: '0.82s', height: '20px' },
  { left: '41%', delay: '0.49s', duration: '0.88s', height: '19px' },
  { left: '49%', delay: '0.73s', duration: '0.76s', height: '24px' },
  { left: '58%', delay: '0.21s', duration: '0.95s', height: '17px' },
  { left: '66%', delay: '0.55s', duration: '0.80s', height: '21px' },
  { left: '74%', delay: '0.08s', duration: '0.89s', height: '18px' },
  { left: '82%', delay: '0.41s', duration: '0.77s', height: '23px' },
  { left: '90%', delay: '0.67s', duration: '0.91s', height: '16px' },
  { left: '12%', delay: '0.44s', duration: '0.83s', height: '20px' },
  { left: '29%', delay: '0.79s', duration: '0.87s', height: '17px' },
  { left: '45%', delay: '0.18s', duration: '0.79s', height: '22px' },
  { left: '62%', delay: '0.64s', duration: '0.93s', height: '19px' },
  { left: '79%', delay: '0.28s', duration: '0.84s', height: '21px' },
  { left: '94%', delay: '0.52s', duration: '0.86s', height: '18px' },
];

const WINDOW_STARS = [
  { left: '18%', top: '10%', size: '2px', opacity: 0.85 },
  { left: '42%', top: '7%', size: '2.5px', opacity: 0.9 },
  { left: '68%', top: '14%', size: '2px', opacity: 0.75 },
  { left: '82%', top: '22%', size: '1.5px', opacity: 0.7 },
  { left: '28%', top: '25%', size: '2px', opacity: 0.8 },
  { left: '55%', top: '31%', size: '1.5px', opacity: 0.65 },
  { left: '14%', top: '38%', size: '2px', opacity: 0.75 },
  { left: '74%', top: '42%', size: '2px', opacity: 0.85 },
  { left: '36%', top: '48%', size: '1.5px', opacity: 0.6 },
];

const STICKY_BG: Record<PegboardGoal['noteColor'], string> = {
  yellow: 'bg-[#FEF3C7] dark:bg-[#4B4121] border-[#FDE68A] dark:border-[#6B5B28]',
  pink: 'bg-[#FCE7F3] dark:bg-[#4A2535] border-[#FBCFE8] dark:border-[#6D364E]',
  mint: 'bg-[#DCFCE7] dark:bg-[#1F3F2E] border-[#BBF7D0] dark:border-[#2E5C44]',
  cream: 'bg-[#F5F2EB] dark:bg-[#35322C] border-[#E6E0D3] dark:border-[#4D483F]',
};

export function PhotorealisticDeskStage({
  notes,
  goals,
  activeFilter,
  onChangeFilter,
  selectedNote,
  isNightLamp,
  speakerMode,
  speakerVolume,
  cherishedCount,
  onSelectNote,
  onToggleCherish,
  onTogglePin,
  onEditNote,
  onDeleteNote,
  onOpenNewNote,
  onOpenCollection,
  onOpenManual,
  onToggleNightLamp,
  onChangeSpeakerMode,
  onChangeSpeakerVolume,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
}: PhotorealisticDeskStageProps) {
  const [imgError, setImgError] = useState(false);
  const [activePopover, setActivePopover] = useState<ActivePopover>(null);

  // Interactive cursor inside the photo's iMac monitor
  const [monitorCursor, setMonitorCursor] = useState<{ x: number; y: number } | null>(
    null
  );

  // Pegboard quick-add state
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [draftGoalText, setDraftGoalText] = useState('');
  const [draftGoalColor, setDraftGoalColor] =
    useState<PegboardGoal['noteColor']>('yellow');

  // Clock & Pomodoro state
  const [now, setNow] = useState(() => new Date());
  const [durationSec, setDurationSec] = useState(25 * 60);
  const [remainingSec, setRemainingSec] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  // Seoul live weather & day/night state for left window
  const [seoulWeather, setSeoulWeather] = useState<SeoulWeatherState>(() => {
    const seoulHourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      hour: 'numeric',
      hour12: false,
    }).format(new Date());
    const seoulHour = Number.parseInt(seoulHourStr, 10) || 12;
    return {
      condition: 'clear',
      isDay: seoulHour >= 6 && seoulHour < 18,
      temperatureC: null,
    };
  });
  const [weatherOverride, setWeatherOverride] =
    useState<WindowWeatherOverride>('auto');

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadSeoulWeather = async () => {
      try {
        const res = await fetch('/api/weather/seoul');
        if (!res.ok) return;
        const data = (await res.json()) as {
          condition?: 'clear' | 'rain';
          isDay?: boolean;
          temperatureC?: number | null;
        };
        if (!cancelled) {
          setSeoulWeather({
            condition: data.condition === 'rain' ? 'rain' : 'clear',
            isDay: typeof data.isDay === 'boolean' ? data.isDay : true,
            temperatureC:
              typeof data.temperatureC === 'number' ? data.temperatureC : null,
          });
        }
      } catch {
        // Keep Seoul local clock fallback silently
      }
    };

    void loadSeoulWeather();
    const id = window.setInterval(() => void loadSeoulWeather(), 10 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;
    const id = window.setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setTimerFinished(true);
          deskAudio.playPomodoroChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isTimerRunning]);

  // Open the physical book row shelf when user picks a subject filter from header
  useEffect(() => {
    if (activeFilter !== 'all' && !selectedNote) {
      setActivePopover('bookshelf');
    }
  }, [activeFilter, selectedNote]);

  const visibleBooks =
    activeFilter === 'all'
      ? notes
      : notes.filter((note) => note.subject === activeFilter);
  const pinnedNotes = notes.filter((n) => n.isPinnedToBoard);

  const formattedTime = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const formattedDate = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftGoalText.trim();
    if (!trimmed) return;
    onAddGoal(trimmed, draftGoalColor);
    setDraftGoalText('');
    setIsAddingGoal(false);
  };

  const togglePopover = (target: ActivePopover) => {
    setActivePopover((prev) => (prev === target ? null : target));
  };

  const handleMonitorPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(4, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));
    setMonitorCursor({ x, y });
  };

  const effectiveWindowNight =
    weatherOverride === 'night' || weatherOverride === 'rain-night'
      ? true
      : weatherOverride === 'rain-day'
        ? false
        : !seoulWeather.isDay || isNightLamp;

  const effectiveWindowRain =
    weatherOverride === 'rain-day' || weatherOverride === 'rain-night'
      ? true
      : seoulWeather.condition === 'rain';

  const windowHoverLabel = (() => {
    const timeText = effectiveWindowNight ? '밤' : '낮';
    const skyText = effectiveWindowRain ? '비' : '맑음';
    const tempText =
      weatherOverride === 'auto' && seoulWeather.temperatureC !== null
        ? ` ${seoulWeather.temperatureC}°C`
        : '';
    const modeTag = weatherOverride === 'auto' ? '실시간' : '미리보기';
    return `↘ 서울 ${timeText} · ${skyText}${tempText} (${modeTag})`;
  })();

  const cycleWindowWeatherPreview = () => {
    setWeatherOverride((prev) => {
      if (prev === 'auto') return 'rain-day';
      if (prev === 'rain-day') return 'night';
      if (prev === 'night') return 'rain-night';
      return 'auto';
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Mathematically locked 1376:768 Photorealistic Clean White Desk Stage */}
      <div
        style={{ width: 'min(1440px, 100%, calc((100vh - 7.5rem) * 1376 / 768))' }}
        className="relative aspect-[1376/768] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-stone-700/90 shadow-[0_20px_50px_rgba(30,41,59,0.08)] bg-white dark:bg-[#1E1C19]"
      >
        {/* Base Clean White Desk Photograph (Panthella Lamp + Marshall Speaker + White-Bezel iMac) */}
        {!imgError ? (
          <img
            src="/src/assets/images/sophie_desk_no_chair_1795156273477.jpg"
            alt="의자 없이 깔끔한 화이트 책상 앞모습과 화이트 베젤 아이맥, 왼쪽 창문, 타공판(포스트잇·다마고찌·라즈베리파이), 오른쪽 체리 액자, 판텔라 버섯 스탠드, 마샬 스타일 스피커, 노란 시계, 연필꽂이, 아크릴 책꽂이, 체리 접시가 놓인 소피의 1인칭 데스크 사진"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-fill select-none pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-white flex items-center justify-center text-xs text-slate-500">
            Sophie&apos;s Cherish Desk
          </div>
        )}

        {/* ============================================================
            0. LEFT WINDOW SEOUL WEATHER & DAY/NIGHT ATMOSPHERE OVERLAY
            (Clear Day stays 100% original sunlit window)
            ============================================================ */}
        <button
          type="button"
          onClick={cycleWindowWeatherPreview}
          data-cursor-label={windowHoverLabel}
          aria-label="서울 실시간 창밖 날씨 및 낮밤 보기 전환"
          style={{ left: '0%', top: '0%', width: '11.59%', height: '83.66%' }}
          className="absolute z-10 overflow-hidden transition-all duration-500 focus-visible:outline-2 focus-visible:outline-[#E11D48]"
        >
          {/* Night sky atmosphere inside window glass */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              effectiveWindowNight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background:
                'linear-gradient(180deg, rgba(11, 20, 44, 0.84) 0%, rgba(18, 32, 66, 0.72) 55%, rgba(28, 43, 76, 0.62) 100%)',
              mixBlendMode: 'multiply',
            }}
          />

          {/* Soft indigo night tint + twinkling stars */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              effectiveWindowNight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background:
                'radial-gradient(circle at 65% 18%, rgba(254, 249, 195, 0.24) 0%, rgba(15, 23, 42, 0.42) 55%, rgba(15, 23, 42, 0.52) 100%)',
            }}
          >
            {/* Crescent moon glow */}
            <div
              className="absolute rounded-full bg-[#FEF9C3]/85 shadow-[0_0_16px_rgba(254,249,195,0.65)]"
              style={{ right: '18%', top: '10%', width: '16px', height: '16px' }}
            />
            <div
              className="absolute rounded-full bg-[#162344]"
              style={{ right: '13%', top: '9%', width: '13px', height: '13px' }}
            />
            {WINDOW_STARS.map((star, idx) => (
              <span
                key={idx}
                className="absolute rounded-full bg-white"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}
              />
            ))}
          </div>

          {/* Rainy Seoul overcast sky + animated falling raindrops */}
          {effectiveWindowRain && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                background: effectiveWindowNight
                  ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.35) 0%, rgba(51, 65, 85, 0.42) 100%)'
                  : 'linear-gradient(180deg, rgba(71, 85, 105, 0.42) 0%, rgba(100, 116, 139, 0.28) 60%, rgba(148, 163, 184, 0.24) 100%)',
              }}
            >
              {WINDOW_RAIN_DROPS.map((drop, idx) => (
                <span
                  key={idx}
                  className="window-raindrop absolute top-0 w-[1.5px] rounded-full bg-white/75"
                  style={{
                    left: drop.left,
                    height: drop.height,
                    animationDelay: drop.delay,
                    animationDuration: drop.duration,
                  }}
                />
              ))}
            </div>
          )}
        </button>

        {/* Night Lamp Mood Lighting Overlay on Photo (centered on Panthella lamp) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isNightLamp ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at 19.6% 58%, rgba(253, 224, 71, 0.38) 0%, rgba(245, 158, 11, 0.16) 22%, rgba(18, 16, 14, 0.56) 62%, rgba(15, 14, 12, 0.72) 100%)',
          }}
        />

        {/* ============================================================
            1. WALL PEGBOARD HOTSPOT (Upper-left wall sticky notes)
            ============================================================ */}
        <button
          type="button"
          onClick={() => togglePopover('pegboard')}
          data-cursor-label="↘ 타공판 메모 보드"
          aria-label="화이트 타공판 메모 보드 열기"
          style={{ left: '21.8%', top: '13.2%', width: '18.2%', height: '38.8%' }}
          className={`absolute z-10 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
            activePopover === 'pegboard'
              ? 'ring-2 ring-[#E11D48]/70 bg-white/10'
              : 'hover:ring-2 hover:ring-[#FDE047]/90 hover:bg-[#FEF08A]/10'
          }`}
        />

        {/* 1-A. TAMAGOTCHI KEYCHAIN HOTSPOT */}
        <button
          type="button"
          onClick={() => togglePopover('tamagotchi')}
          data-cursor-label="↘ 다마고찌 펫 돌보기"
          aria-label="타공판 다마고찌 스터디 펫 열기"
          style={{ left: '24.4%', top: '37.6%', width: '4.0%', height: '12.8%' }}
          className={`absolute z-20 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
            activePopover === 'tamagotchi'
              ? 'ring-2 ring-[#E11D48]/80 bg-[#FEF08A]/15'
              : 'hover:ring-2 hover:ring-[#FDE047]/95 hover:bg-[#FEF08A]/15'
          }`}
        />

        {/* 1-B. RASPBERRY PI BOARD HOTSPOT */}
        <button
          type="button"
          onClick={() => togglePopover('raspi')}
          data-cursor-label="↘ 라즈베리파이 GPIO"
          aria-label="타공판 라즈베리파이 GPIO 미니 실험 열기"
          style={{ left: '30.0%', top: '36.7%', width: '5.5%', height: '12.4%' }}
          className={`absolute z-20 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
            activePopover === 'raspi'
              ? 'ring-2 ring-[#E11D48]/80 bg-emerald-400/15'
              : 'hover:ring-2 hover:ring-[#FDE047]/95 hover:bg-[#FEF08A]/15'
          }`}
        />

        {/* 1-C. UPPER-RIGHT CHERRY ART FRAME HOTSPOT (사용설명서) */}
        <button
          type="button"
          onClick={() => {
            setActivePopover(null);
            onOpenManual();
          }}
          data-cursor-label="↘ 홈페이지 사용설명서"
          aria-label="체리 액자 홈페이지 사용설명서 열기"
          style={{ left: '66.1%', top: '15.7%', width: '16.7%', height: '33.6%' }}
          className="absolute z-10 rounded-lg transition-all duration-200 hover:ring-2 hover:ring-[#E11D48]/85 hover:bg-[#FFE4E6]/10 focus-visible:outline-2 focus-visible:outline-[#E11D48]"
        />

        {/* ============================================================
            2. PANTHELLA MUSHROOM LAMP HOTSPOT (Left opal lamp)
            ============================================================ */}
        <button
          type="button"
          onClick={onToggleNightLamp}
          data-cursor-label={isNightLamp ? '↘ 낮 모드로 켜기' : '↘ 무드등 켜기'}
          aria-label={isNightLamp ? '주간 조명으로 전환' : '야간 무드등 켜기'}
          style={{ left: '15.5%', top: '52.1%', width: '8.3%', height: '29.3%' }}
          className="absolute z-10 rounded-2xl transition-all duration-200 hover:ring-2 hover:ring-[#FDE047]/90 hover:bg-[#FEF08A]/15 focus-visible:outline-2 focus-visible:outline-[#E11D48]"
        />

        {/* ============================================================
            3. ANALOG CLOCK HOTSPOT (Left desk yellow clock)
            ============================================================ */}
        <button
          type="button"
          onClick={() => togglePopover('clock')}
          data-cursor-label={
            isTimerRunning
              ? `↘ 집중 중 ${formatTimer(remainingSec)}`
              : '↘ 25분 뽀모도로'
          }
          aria-label="탁상 아날로그 시계 뽀모도로 타이머 열기"
          style={{ left: '31.9%', top: '71.5%', width: '5.4%', height: '10.3%' }}
          className={`absolute z-20 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
            activePopover === 'clock' || isTimerRunning
              ? 'ring-2 ring-[#E11D48]/80 bg-[#E11D48]/10'
              : 'hover:ring-2 hover:ring-[#FDE047]/90 hover:bg-[#FEF08A]/15'
          }`}
        />

        {/* ============================================================
            4. MARSHALL RETRO SPEAKER HOTSPOT (Between lamp and clock)
            ============================================================ */}
        <button
          type="button"
          onClick={() => togglePopover('speaker')}
          data-cursor-label={
            speakerMode === 'off'
              ? '↘ 공부 BGM · 유튜브'
              : `↘ 재생 중 (${
                  speakerMode === 'youtube'
                    ? 'YouTube'
                    : speakerMode === 'lofi'
                      ? 'Lo-fi'
                      : '빗소리'
                })`
          }
          aria-label="마샬 스타일 스피커 공부 사운드 설정"
          style={{ left: '25.0%', top: '70.0%', width: '7.4%', height: '11.2%' }}
          className={`absolute z-10 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
            activePopover === 'speaker' || speakerMode !== 'off'
              ? 'ring-2 ring-[#E11D48]/80 bg-[#E11D48]/10'
              : 'hover:ring-2 hover:ring-[#FDE047]/90 hover:bg-[#FEF08A]/15'
          }`}
        />

        {/* ============================================================
            5. CHERRY TRAY HOTSPOT (Right-front speckled cherry dish)
            ============================================================ */}
        <button
          type="button"
          onClick={() => {
            setActivePopover(null);
            onOpenCollection();
          }}
          data-cursor-label={`↘ 체리 수집함 (${cherishedCount}개)`}
          aria-label="체리 수집함 열기"
          style={{ left: '68.4%', top: '74.5%', width: '11.4%', height: '10.0%' }}
          className="absolute z-20 rounded-full transition-all duration-200 hover:ring-2 hover:ring-[#E11D48]/85 hover:bg-[#E11D48]/10 focus-visible:outline-2 focus-visible:outline-[#E11D48]"
        />

        {/* ============================================================
            6. RIGHT ACRYLIC BOOKSHELF HOTSPOT
            ============================================================ */}
        <button
          type="button"
          onClick={() => togglePopover('bookshelf')}
          data-cursor-label={`↘ 전공 책 보기 (${visibleBooks.length}권)`}
          aria-label="전공 책꽂이 열기"
          style={{ left: '72.6%', top: '57.2%', width: '12.2%', height: '24.2%' }}
          className={`absolute z-10 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
            activePopover === 'bookshelf'
              ? 'ring-2 ring-[#E11D48]/75 bg-white/10'
              : 'hover:ring-2 hover:ring-[#FDE047]/90 hover:bg-[#FEF08A]/10'
          }`}
        />

        {/* ============================================================
            7. PENCIL CUP HOTSPOT (Right desk ceramic cup)
            ============================================================ */}
        <button
          type="button"
          onClick={() => {
            setActivePopover(null);
            onOpenNewNote();
          }}
          data-cursor-label="↘ 새 공부 노트 쓰기"
          aria-label="새 공부 노트 작성하기"
          style={{ left: '66.2%', top: '66.0%', width: '5.6%', height: '15.0%' }}
          className="absolute z-10 rounded-2xl transition-all duration-200 hover:ring-2 hover:ring-[#E11D48]/85 hover:bg-[#FEF08A]/15 focus-visible:outline-2 focus-visible:outline-[#E11D48]"
        />

        {/* ============================================================
            8. EMBEDDED iMAC SCREEN (White-bezel exact match + Liquid Glass Clock)
            ============================================================ */}
        <div
          aria-label="아이맥 모니터 화면"
          onPointerMove={handleMonitorPointerMove}
          onPointerLeave={() => setMonitorCursor(null)}
          style={{ left: '37.50%', top: '38.67%', width: '26.53%', height: '27.60%' }}
          className="absolute z-20 rounded-[2px] overflow-hidden imac-glass-wallpaper flex flex-col items-center justify-center select-none"
        >
          {/* Soft ambient cursor spotlight inside the iMac screen */}
          {monitorCursor && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none transition-opacity duration-150"
              style={{
                background: isNightLamp
                  ? `radial-gradient(circle 110px at ${monitorCursor.x}% ${monitorCursor.y}%, rgba(255, 255, 255, 0.34), transparent 72%)`
                  : `radial-gradient(circle 110px at ${monitorCursor.x}% ${monitorCursor.y}%, rgba(250, 204, 21, 0.16), transparent 72%)`,
              }}
            />
          )}

          {/* Pale Grey Clock: Small Pretendard Date + Big Rounded Time + Small Pretendard Brand */}
          <div className="relative z-10 text-center space-y-1 px-3">
            <p className="font-pretendard text-[10px] sm:text-xs font-medium tracking-tight text-[#BFC5CE] dark:text-stone-400">
              {formattedDate}
            </p>
            <div>
              <span className="imac-rounded-clock text-5xl sm:text-6xl font-extrabold leading-none">
                {formattedTime}
              </span>
            </div>
            <p className="font-pretendard text-[10px] sm:text-[11px] font-medium tracking-wide text-[#C4C9D2] dark:text-stone-400">
              Sophie&apos;s Cherish Desk
            </p>
          </div>

          {/* Interactive Miniature Screen Pointer Moving Inside iMac */}
          {monitorCursor && (
            <div
              aria-hidden="true"
              className="absolute z-20 pointer-events-none transition-transform duration-75 ease-out"
              style={{
                left: `${monitorCursor.x}%`,
                top: `${monitorCursor.y}%`,
                transform: 'translate(-2px, -2px)',
              }}
            >
              <svg width="18" height="22" viewBox="0 0 24 28" fill="none">
                <path
                  d="M2 1L2 21L7.5 16L11.5 24.5L15 23L11 14.5L18.5 14.5L2 1Z"
                  fill="#FACC15"
                  stroke="#1E293B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* ============================================================
            STAGE POPOVERS (Anchored cleanly inside the 16:9 stage)
            ============================================================ */}

        {/* A. Pegboard Popover */}
        {activePopover === 'pegboard' && (
          <div
            role="dialog"
            aria-label="화이트 타공판 메모 보드"
            style={{ left: '3%', top: '8%' }}
            className="absolute z-30 w-72 sm:w-80 max-h-[82%] rounded-2xl bg-white/95 dark:bg-[#23201C]/95 backdrop-blur-md border border-slate-200 dark:border-stone-700 shadow-2xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-[#1E293B] dark:text-[#F4F1EA]">
                  화이트 타공판 메모 보드
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-stone-400 tabular-nums">
                  목표 {goals.filter((g) => g.completed).length}/{goals.length} 완료
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal((p) => !p)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-[#FEF3C7] dark:bg-[#4B4121] text-[#1E293B] dark:text-[#FEF08A] rounded-md"
                >
                  <Plus className="w-3 h-3" />
                  <span>추가</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePopover(null)}
                  aria-label="타공판 닫기"
                  className="p-1 text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isAddingGoal && (
              <form
                onSubmit={handleAddGoalSubmit}
                className="space-y-2 p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-stone-800 border border-slate-200 dark:border-stone-700"
              >
                <input
                  type="text"
                  value={draftGoalText}
                  onChange={(e) => setDraftGoalText(e.target.value)}
                  placeholder="오늘의 공부 목표 적기"
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-700"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {(['yellow', 'pink', 'mint', 'cream'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDraftGoalColor(c)}
                        aria-label={`${c} 색상`}
                        className={`w-4 h-4 rounded-full border ${
                          c === 'yellow'
                            ? 'bg-[#FDE047]'
                            : c === 'pink'
                              ? 'bg-[#F7C5CC]'
                              : c === 'mint'
                                ? 'bg-[#CFE6D9]'
                                : 'bg-[#EAE4D7]'
                        } ${draftGoalColor === c ? 'ring-2 ring-[#1E293B] dark:ring-white' : ''}`}
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-[11px] font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded"
                  >
                    붙이기
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-y-auto desk-scroll space-y-2 pr-0.5">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`group flex items-start gap-2 p-2.5 rounded-xl border ${STICKY_BG[goal.noteColor]}`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleGoal(goal.id)}
                    aria-label="목표 완료 전환"
                    className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border ${
                      goal.completed
                        ? 'bg-[#1E293B] dark:bg-[#FDE047] border-[#1E293B] text-white dark:text-[#1E293B]'
                        : 'bg-white/80 border-slate-400'
                    }`}
                  >
                    {goal.completed && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs leading-snug ${
                        goal.completed
                          ? 'line-through text-slate-500 dark:text-stone-400'
                          : 'text-[#1E293B] dark:text-stone-100 font-medium'
                      }`}
                    >
                      {goal.text}
                    </p>
                    {goal.linkedNoteId && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectNote(goal.linkedNoteId!);
                          setActivePopover(null);
                        }}
                        className="mt-1 text-[11px] font-semibold text-[#E11D48] hover:underline"
                      >
                        연결된 책 펼치기 →
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteGoal(goal.id)}
                    aria-label="목표 삭제"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-[#E11D48]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {pinnedNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    onSelectNote(note.id);
                    setActivePopover(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-stone-800/80 border border-slate-200 dark:border-stone-700 hover:border-[#E11D48]/60"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1">
                      <Pin className="w-3 h-3 text-[#E11D48]" />
                      {SUBJECT_LABELS[note.subject]} · {note.topic}
                    </span>
                    {note.isCherished && <span>🍒</span>}
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-[#1E293B] dark:text-stone-100 truncate">
                    {note.indexNumber}. {note.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* B. Physical Book Row Shelf Showcase (진짜 책들이 주루룩) */}
        {activePopover === 'bookshelf' && !selectedNote && (
          <BookRowShelf
            notes={notes}
            activeFilter={activeFilter}
            onChangeFilter={onChangeFilter}
            onOpenBook={(noteId) => {
              onSelectNote(noteId);
              setActivePopover(null);
            }}
            onOpenNewNote={onOpenNewNote}
            onClose={() => setActivePopover(null)}
          />
        )}

        {/* C. Cream Speaker Audio & YouTube Search Player */}
        <SpeakerBgmWidget
          isOpen={activePopover === 'speaker'}
          speakerMode={speakerMode}
          speakerVolume={speakerVolume}
          onChangeSpeakerMode={onChangeSpeakerMode}
          onChangeSpeakerVolume={onChangeSpeakerVolume}
          onOpen={() => setActivePopover('speaker')}
          onClose={() => setActivePopover(null)}
        />

        {/* D. Analog Clock Pomodoro Popover */}
        {activePopover === 'clock' && (
          <div
            role="dialog"
            aria-label="탁상 시계 뽀모도로 타이머"
            style={{ left: '5%', bottom: '28%' }}
            className="absolute z-30 w-60 rounded-2xl bg-white/95 dark:bg-[#23201C]/95 backdrop-blur-md border border-slate-200 dark:border-stone-700 shadow-2xl p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E293B] dark:text-[#F4F1EA]">
                뽀모도로 집중 타이머
              </span>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                aria-label="타이머 닫기"
                className="text-xs text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
              >
                닫기
              </button>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold font-mono-code tabular-nums text-[#1E293B] dark:text-[#F4F1EA]">
                {formatTimer(remainingSec)}
              </p>
              {timerFinished && (
                <p className="mt-0.5 text-[11px] font-semibold text-[#E11D48]">
                  집중 세션을 완료했습니다!
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[25, 10, 5].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerFinished(false);
                    setDurationSec(mins * 60);
                    setRemainingSec(mins * 60);
                  }}
                  className={`py-1 text-xs font-mono-code rounded border ${
                    durationSec === mins * 60
                      ? 'bg-[#FEF3C7] dark:bg-[#4B4121] border-[#EAB308] text-[#1E293B] dark:text-[#FEF08A] font-semibold'
                      : 'bg-[#FAF9F6] dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-600 dark:text-stone-300'
                  }`}
                >
                  {mins}분
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTimerFinished(false);
                  setIsTimerRunning((r) => !r);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>일시정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>시작</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerFinished(false);
                  setRemainingSec(durationSec);
                }}
                aria-label="타이머 초기화"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-stone-700 text-slate-500 hover:text-[#1E293B] dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* D-2. Tamagotchi & Raspberry Pi Pegboard Interactive Popovers */}
        {activePopover === 'tamagotchi' && (
          <TamagotchiPopover
            cherishedCount={cherishedCount}
            onClose={() => setActivePopover(null)}
          />
        )}

        {activePopover === 'raspi' && (
          <RaspberryPiPopover onClose={() => setActivePopover(null)} />
        )}

        {/* ============================================================
            E. REALISTIC OPEN BOOK SPREAD (< 책이 펼쳐지고 목차/내용 보임)
            ============================================================ */}
        {selectedNote && (
          <OpenBookSpread
            note={selectedNote}
            allNotes={notes}
            onCloseBook={() => onSelectNote(null)}
            onSwitchBook={(noteId) => onSelectNote(noteId)}
            onToggleCherish={onToggleCherish}
            onTogglePin={onTogglePin}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
          />
        )}
      </div>
    </div>
  );
}
