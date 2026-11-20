import { useEffect, useState } from 'react';
import { Cpu, Heart, Sparkles, X } from 'lucide-react';

interface TamagotchiPopoverProps {
  cherishedCount: number;
  onClose: () => void;
}

export function TamagotchiPopover({
  cherishedCount,
  onClose,
}: TamagotchiPopoverProps) {
  const [mood, setMood] = useState<'happy' | 'eating' | 'studying'>('happy');
  const [affection, setAffection] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sophie_tama_affection');
      return saved ? Number(saved) : 78;
    } catch {
      return 78;
    }
  });
  const [statusText, setStatusText] = useState('오늘도 같이 공부해서 기분이 좋아요!');

  useEffect(() => {
    try {
      localStorage.setItem('sophie_tama_affection', String(affection));
    } catch {
      // Ignore storage error
    }
  }, [affection]);

  const feedCherry = () => {
    setMood('eating');
    setAffection((a) => Math.min(100, a + 8));
    setStatusText('달콤한 체리 간식 냠냠! 에너지 충전 완료');
    window.setTimeout(() => setMood('happy'), 1400);
  };

  const cheerStudy = () => {
    setMood('studying');
    setAffection((a) => Math.min(100, a + 5));
    setStatusText('소피님 오늘 집중력 최고예요!');
    window.setTimeout(() => setMood('happy'), 1600);
  };

  return (
    <div
      role="dialog"
      aria-label="다마고찌 스터디 펫"
      style={{ left: '16%', top: '12%' }}
      className="absolute z-30 w-64 rounded-2xl bg-[#FFFDF7]/95 dark:bg-[#23201C]/95 backdrop-blur-md border border-slate-200 dark:border-stone-700 shadow-2xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#1E293B] dark:text-[#F4F1EA]">
          소피의 다마고찌
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="다마고찌 닫기"
          className="p-1 text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tamagotchi Pixel LCD Screen */}
      <div className="rounded-xl bg-[#E7F0DC] dark:bg-[#2C3627] border-2 border-[#1E293B]/20 p-3 flex flex-col items-center gap-2">
        <div className="w-full flex items-center justify-between text-[10px] font-mono-code tabular-nums text-[#2E3B28] dark:text-[#D9E8C8]">
          <span>LOVE {affection}%</span>
          <span>🍒 x{cherishedCount}</span>
        </div>

        {/* Cute Pixel Pet SVG */}
        <svg width="68" height="56" viewBox="0 0 68 56" fill="none" aria-hidden="true">
          {/* Pixel Character Body */}
          <rect x="20" y="14" width="28" height="24" rx="8" fill="#1E293B" />
          <rect x="23" y="17" width="22" height="18" rx="6" fill="#FDE047" />
          {/* Ears */}
          <rect x="22" y="9" width="6" height="6" rx="2" fill="#1E293B" />
          <rect x="40" y="9" width="6" height="6" rx="2" fill="#1E293B" />
          {/* Eyes */}
          {mood === 'happy' ? (
            <>
              <rect x="28" y="23" width="3" height="4" rx="1" fill="#1E293B" />
              <rect x="37" y="23" width="3" height="4" rx="1" fill="#1E293B" />
            </>
          ) : mood === 'eating' ? (
            <>
              <path d="M27 25L31 23" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M41 25L37 23" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="29.5" cy="25" r="2" fill="#E11D48" />
              <circle cx="38.5" cy="25" r="2" fill="#E11D48" />
            </>
          )}
          {/* Blush */}
          <rect x="25" y="28" width="4" height="2" rx="1" fill="#FB7185" />
          <rect x="39" y="28" width="4" height="2" rx="1" fill="#FB7185" />
          {/* Mouth */}
          <path
            d={mood === 'eating' ? 'M32 29H36V32H32Z' : 'M31 29Q34 32 37 29'}
            stroke="#1E293B"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill={mood === 'eating' ? '#E11D48' : 'none'}
          />
          {/* Floating Heart or Cherry */}
          {mood !== 'happy' && (
            <circle cx="54" cy="14" r="4" fill="#E11D48" />
          )}
        </svg>

        <p className="text-[11px] font-medium text-[#2E3B28] dark:text-[#E5F2D6] text-center">
          {statusText}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={feedCherry}
          className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg"
        >
          <span>🍒</span>
          <span>체리 간식</span>
        </button>
        <button
          type="button"
          onClick={cheerStudy}
          className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-[#FEF3C7] dark:bg-[#4B4121] text-[#1E293B] dark:text-[#FEF08A] border border-[#EAB308]/40 rounded-lg"
        >
          <Heart className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>응원받기</span>
        </button>
      </div>
    </div>
  );
}

interface RaspberryPiPopoverProps {
  onClose: () => void;
}

export function RaspberryPiPopover({ onClose }: RaspberryPiPopoverProps) {
  const [leds, setLeds] = useState({
    gpio17: true,
    gpio27: false,
    gpio22: true,
  });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!isBlinking) return;
    let step = 0;
    const id = window.setInterval(() => {
      step = (step + 1) % 3;
      setLeds({
        gpio17: step === 0,
        gpio27: step === 1,
        gpio22: step === 2,
      });
    }, 350);
    return () => window.clearInterval(id);
  }, [isBlinking]);

  return (
    <div
      role="dialog"
      aria-label="라즈베리파이 GPIO 실험실"
      style={{ left: '23%', top: '14%' }}
      className="absolute z-30 w-72 rounded-2xl bg-white/95 dark:bg-[#23201C]/95 backdrop-blur-md border border-slate-200 dark:border-stone-700 shadow-2xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-[#1E293B] dark:text-[#F4F1EA]">
            라즈베리파이 GPIO 미니 실험
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="라즈베리파이 닫기"
          className="p-1 text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* PCB Preview Card */}
      <div className="rounded-xl bg-[#1E5E3A] text-white p-3 space-y-2.5 border border-emerald-900/50">
        <div className="flex items-center justify-between text-[10px] font-mono-code opacity-85">
          <span>Raspberry Pi 5 · GPIO Header</span>
          <span>3.3V READY</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { key: 'gpio17', pin: 'GPIO 17', name: '체리 LED', color: '#FB7185' },
              { key: 'gpio27', pin: 'GPIO 27', name: '버터 LED', color: '#FDE047' },
              { key: 'gpio22', pin: 'GPIO 22', name: '민트 LED', color: '#6EE7B7' },
            ] as const
          ).map((item) => {
            const on = leds[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setIsBlinking(false);
                  setLeds((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-black/25 hover:bg-black/35 transition-colors"
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/60 transition-all"
                  style={{
                    backgroundColor: on ? item.color : '#1F2937',
                    boxShadow: on ? `0 0 12px ${item.color}` : 'none',
                  }}
                />
                <span className="text-[10px] font-mono-code">{item.pin}</span>
                <span className="text-[9px] opacity-85">{on ? 'HIGH' : 'LOW'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsBlinking((b) => !b)}
        className={`w-full py-1.5 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
          isBlinking
            ? 'bg-[#E11D48] border-[#E11D48] text-white'
            : 'bg-[#FAF9F6] dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{isBlinking ? '순차 점멸 중지' : 'LED 순차 깜빡임 실행'}</span>
      </button>
    </div>
  );
}
