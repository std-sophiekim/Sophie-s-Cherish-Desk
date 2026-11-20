import { useEffect, useRef, useState } from 'react';

interface BigYellowCheckCursorProps {
  enabled: boolean;
}

export function BigYellowCheckCursor({ enabled }: BigYellowCheckCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDevice, setIsMouseDevice] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(pointer: coarse)').matches;
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  const active = enabled && isMouseDevice;

  useEffect(() => {
    if (active) {
      document.documentElement.classList.add('cherish-custom-cursor');
    } else {
      document.documentElement.classList.remove('cherish-custom-cursor');
    }
    return () => {
      document.documentElement.classList.remove('cherish-custom-cursor');
    };
  }, [active]);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        setIsMouseDevice(false);
        return;
      }
      if (!isMouseDevice) setIsMouseDevice(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const labeledEl = target.closest('[data-cursor-label]') as HTMLElement | null;
        const interactiveEl = target.closest(
          'button, a, input, textarea, select, [role="button"], [data-cursor-label]'
        );
        setIsHoveringInteractive(Boolean(interactiveEl));
        setHoverLabel(labeledEl?.getAttribute('data-cursor-label') || null);
      }
    };

    const handleMouseMoveFallback = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (!isVisible) setIsVisible(true);
    };

    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);
    const handlePointerLeave = () => {
      setIsVisible(false);
      setHoverLabel(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handleMouseMoveFallback, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handleMouseMoveFallback);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [enabled, isMouseDevice, isVisible]);

  if (!active || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none select-none will-change-transform"
      style={{ transform: 'translate3d(-120px, -120px, 0)' }}
    >
      <div
        className={`relative transition-transform duration-150 ease-out origin-top-left ${
          isPressed
            ? 'scale-90'
            : isHoveringInteractive
              ? 'scale-110'
              : 'scale-100'
        }`}
      >
        {/* Classic Mouse Pointer Arrow Shape Filled with Big Yellow Checkerboard */}
        <svg
          width="48"
          height="54"
          viewBox="0 0 46 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_10px_rgba(30,41,59,0.28)]"
        >
          <defs>
            <pattern
              id="big-yellow-checker-pattern"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="8" height="8" fill="#FACC15" />
              <rect x="8" y="0" width="8" height="8" fill="#FFFDF7" />
              <rect x="0" y="8" width="8" height="8" fill="#FFFDF7" />
              <rect x="8" y="8" width="8" height="8" fill="#FACC15" />
            </pattern>
          </defs>

          {/* Outer White Halo for crisp visibility on dark & light areas */}
          <path
            d="M3 2L3 40L13 31L20 47L26.5 44L19.5 28L34 28L3 2Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Main Arrow Body Filled with Big Yellow Checkerboard */}
          <path
            d="M3 2L3 40L13 31L20 47L26.5 44L19.5 28L34 28L3 2Z"
            fill="url(#big-yellow-checker-pattern)"
            stroke={isHoveringInteractive ? '#E11D48' : '#1E293B'}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* Handwritten hover guidance label */}
        {hoverLabel && (
          <div className="absolute left-9 top-8 whitespace-nowrap bg-[#FFFDF7] dark:bg-[#272420] text-[#1E293B] dark:text-[#F4F1EA] border border-[#1E293B]/25 dark:border-white/25 px-2.5 py-0.5 rounded-md shadow-md font-hand text-base leading-snug tracking-tight">
            {hoverLabel}
          </div>
        )}
      </div>
    </div>
  );
}
