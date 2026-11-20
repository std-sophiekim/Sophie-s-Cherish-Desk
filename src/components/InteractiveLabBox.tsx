import { useEffect, useState } from 'react';
import { Check, Pause, Play, RotateCcw, Shuffle, StepForward } from 'lucide-react';
import { LabType } from '../types/desk';

interface InteractiveLabBoxProps {
  labType: LabType;
}

export function InteractiveLabBox({ labType }: InteractiveLabBoxProps) {
  if (labType === 'stack') return <StackLab />;
  if (labType === 'binary-search') return <BinarySearchLab />;
  if (labType === 'bubble-sort') return <BubbleSortLab />;
  if (labType === 'pedagogy-rubric') return <PedagogyRubricLab />;
  return null;
}

function StackLab() {
  const [stack, setStack] = useState<string[]>(['main()', 'drawDesk()']);
  const [inputValue, setInputValue] = useState('openBook()');
  const [lastAction, setLastAction] = useState('초기 호출 프레임 2개가 쌓여 있습니다.');

  const handlePush = () => {
    const val = inputValue.trim();
    if (!val) return;
    if (stack.length >= 5) {
      setLastAction('스택 용량(최대 5프레임)에 도달했습니다. 먼저 pop() 해보세요.');
      return;
    }
    setStack((prev) => [...prev, val]);
    setLastAction(`push("${val}") → Top 위치에 새 프레임 추가`);
    const presets = ['renderNote()', 'cherish()', 'checkStep()', 'paintUI()'];
    setInputValue(presets[stack.length % presets.length]);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setLastAction('스택이 비어 있습니다 (Stack Underflow).');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, -1));
    setLastAction(`pop() → 가장 위의 "${popped}" 제거 (LIFO)`);
  };

  const handleReset = () => {
    setStack(['main()', 'drawDesk()']);
    setInputValue('openBook()');
    setLastAction('스택을 초기 상태로 되돌렸습니다.');
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-stone-700 bg-[#FAF9F6] dark:bg-[#1E1C19] p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#1E293B] dark:text-stone-100">
          스택(Stack) LIFO 실험실
        </span>
        <span className="text-[11px] font-mono-code tabular-nums text-slate-500 dark:text-stone-400">
          size: {stack.length}/5
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="값 입력"
          aria-label="스택에 넣을 값"
          className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-mono-code rounded-md bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
        />
        <button
          type="button"
          onClick={handlePush}
          className="px-2.5 py-1.5 text-xs font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-md whitespace-nowrap shrink-0"
        >
          Push
        </button>
        <button
          type="button"
          onClick={handlePop}
          className="px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-600 text-[#1E293B] dark:text-stone-100 rounded-md whitespace-nowrap shrink-0"
        >
          Pop
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="스택 초기화"
          className="p-1.5 text-slate-500 hover:text-[#1E293B] dark:text-stone-400 dark:hover:text-white rounded-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Vertical Stack Container */}
      <div className="min-h-[124px] flex flex-col-reverse justify-start gap-1.5 p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-dashed border-slate-300 dark:border-stone-700">
        {stack.length === 0 ? (
          <p className="m-auto text-xs text-slate-400 dark:text-stone-500">
            비어 있는 스택 (Empty)
          </p>
        ) : (
          stack.map((item, idx) => {
            const isTop = idx === stack.length - 1;
            return (
              <div
                key={`${item}-${idx}`}
                className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-mono-code transition-colors ${
                  isTop
                    ? 'bg-[#FEF08A] dark:bg-[#8D7626] text-[#1E293B] dark:text-white font-semibold border border-[#EAB308]/50'
                    : 'bg-[#F3F1EC] dark:bg-stone-800 text-slate-700 dark:text-stone-300'
                }`}
              >
                <span>{item}</span>
                {isTop && (
                  <span className="text-[10px] font-sans font-semibold text-[#B45309] dark:text-[#FEF08A]">
                    ← TOP
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-[11px] text-slate-600 dark:text-stone-300">{lastAction}</p>
    </div>
  );
}

const BS_ARRAY = [4, 11, 17, 23, 31, 42, 56, 68, 79, 91];

function BinarySearchLab() {
  const [target, setTarget] = useState(56);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(BS_ARRAY.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState<'ready' | 'searching' | 'found' | 'missing'>('ready');
  const [message, setMessage] = useState('목표 숫자를 고르고 [한 단계씩]을 눌러보세요.');

  const resetSearch = (nextTarget = target) => {
    setTarget(nextTarget);
    setLow(0);
    setHigh(BS_ARRAY.length - 1);
    setMid(null);
    setSteps(0);
    setStatus('ready');
    setMessage(`목표값 ${nextTarget} 탐색 준비 완료 (범위: 0 ~ ${BS_ARRAY.length - 1})`);
  };

  const stepSearch = () => {
    if (status === 'found' || status === 'missing') return;
    if (low > high) {
      setStatus('missing');
      setMessage(`low(${low}) > high(${high}) — 배열에 ${target}이(가) 없습니다.`);
      return;
    }

    const nextMid = low + Math.floor((high - low) / 2);
    const val = BS_ARRAY[nextMid];
    const nextSteps = steps + 1;
    setMid(nextMid);
    setSteps(nextSteps);

    if (val === target) {
      setStatus('found');
      setMessage(`${nextSteps}번 만에 인덱스 ${nextMid}에서 ${target}을(를) 찾았습니다!`);
    } else if (val < target) {
      const nextLow = nextMid + 1;
      setLow(nextLow);
      setStatus(nextLow > high ? 'missing' : 'searching');
      setMessage(`arr[${nextMid}]=${val} < ${target} → 왼쪽 버리고 low = ${nextLow}`);
    } else {
      const nextHigh = nextMid - 1;
      setHigh(nextHigh);
      setStatus(low > nextHigh ? 'missing' : 'searching');
      setMessage(`arr[${nextMid}]=${val} > ${target} → 오른쪽 버리고 high = ${nextHigh}`);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-stone-700 bg-[#FAF9F6] dark:bg-[#1E1C19] p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#1E293B] dark:text-stone-100">
          이진 탐색 스텝 실험실
        </span>
        <span className="text-[11px] font-mono-code tabular-nums text-slate-500 dark:text-stone-400">
          비교 {steps}회
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-stone-300">
          <span>목표값</span>
          <select
            value={target}
            onChange={(e) => resetSearch(Number(e.target.value))}
            className="px-2 py-1 text-xs font-mono-code rounded bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
          >
            {BS_ARRAY.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
            <option value={50}>50 (없는 값)</option>
          </select>
        </label>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={stepSearch}
            disabled={status === 'found' || status === 'missing'}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-md disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>한 단계씩</span>
          </button>
          <button
            type="button"
            onClick={() => resetSearch(target)}
            aria-label="탐색 초기화"
            className="p-1.5 text-slate-500 hover:text-[#1E293B] dark:text-stone-400 dark:hover:text-white rounded-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {BS_ARRAY.map((num, idx) => {
          const inRange = idx >= low && idx <= high;
          const isMid = mid === idx;
          const isMatch = status === 'found' && isMid;

          return (
            <div
              key={num}
              className={`rounded-md py-1.5 text-center border transition-colors ${
                isMatch
                  ? 'bg-[#E11D48] text-white border-[#E11D48] font-semibold'
                  : isMid
                    ? 'bg-[#FEF08A] dark:bg-[#8D7626] text-[#1E293B] dark:text-white border-[#EAB308] font-semibold'
                    : inRange
                      ? 'bg-white dark:bg-stone-900 text-[#1E293B] dark:text-stone-100 border-slate-200 dark:border-stone-700'
                      : 'bg-slate-100/70 dark:bg-stone-800/40 text-slate-400 dark:text-stone-600 border-transparent opacity-55'
              }`}
            >
              <div className="text-xs font-mono-code tabular-nums">{num}</div>
              <div className="text-[9px] font-mono-code opacity-80">
                {isMid ? 'mid' : idx === low ? 'low' : idx === high ? 'high' : `[${idx}]`}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-600 dark:text-stone-300">{message}</p>
    </div>
  );
}

function BubbleSortLab() {
  const [arr, setArr] = useState<number[]>([42, 18, 65, 29, 54, 12, 37]);
  const [iIdx, setIIdx] = useState(0);
  const [jIdx, setJIdx] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);

  const stepBubble = () => {
    if (done) {
      setIsPlaying(false);
      return;
    }

    const nextArr = [...arr];
    let currI = iIdx;
    let currJ = jIdx;

    if (currI >= nextArr.length - 1) {
      setDone(true);
      setIsPlaying(false);
      return;
    }

    setComparisons((c) => c + 1);
    if (nextArr[currJ] > nextArr[currJ + 1]) {
      [nextArr[currJ], nextArr[currJ + 1]] = [nextArr[currJ + 1], nextArr[currJ]];
      setArr(nextArr);
      setSwaps((s) => s + 1);
    }

    currJ += 1;
    if (currJ >= nextArr.length - 1 - currI) {
      currI += 1;
      currJ = 0;
    }

    if (currI >= nextArr.length - 1) {
      setDone(true);
      setIsPlaying(false);
    }
    setIIdx(currI);
    setJIdx(currJ);
  };

  useEffect(() => {
    if (!isPlaying || done) return;
    const timer = window.setTimeout(stepBubble, 320);
    return () => window.clearTimeout(timer);
  });

  const handleShuffle = () => {
    const fresh = [42, 18, 65, 29, 54, 12, 37].sort(() => Math.random() - 0.5);
    setArr(fresh);
    setIIdx(0);
    setJIdx(0);
    setComparisons(0);
    setSwaps(0);
    setDone(false);
    setIsPlaying(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-stone-700 bg-[#FAF9F6] dark:bg-[#1E1C19] p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#1E293B] dark:text-stone-100">
          버블 정렬 비교 시각화
        </span>
        <span className="text-[11px] font-mono-code tabular-nums text-slate-500 dark:text-stone-400">
          비교 {comparisons} · 교환 {swaps}
        </span>
      </div>

      <div className="h-24 flex items-end gap-2 px-2 pt-3 pb-1 rounded-lg bg-white dark:bg-stone-900 border border-slate-200/80 dark:border-stone-700">
        {arr.map((val, idx) => {
          const isSortedTail = done || idx >= arr.length - iIdx;
          const isComparing = !done && (idx === jIdx || idx === jIdx + 1);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md transition-all duration-150 ${
                  isSortedTail
                    ? 'bg-[#34D399] dark:bg-[#059669]'
                    : isComparing
                      ? 'bg-[#E11D48]'
                      : 'bg-[#FDE047] dark:bg-[#CA8A04]'
                }`}
                style={{ height: `${Math.max(16, Math.round((val / 70) * 60))}px` }}
              />
              <span className="text-[10px] font-mono-code tabular-nums text-slate-600 dark:text-stone-300">
                {val}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            disabled={done}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-md disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? '일시정지' : done ? '정렬 완료' : '자동 재생'}</span>
          </button>
          <button
            type="button"
            onClick={stepBubble}
            disabled={done || isPlaying}
            className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-600 text-[#1E293B] dark:text-stone-200 rounded-md disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            1스텝
          </button>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-[#1E293B] dark:text-stone-400 dark:hover:text-white"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>섞기</span>
        </button>
      </div>
    </div>
  );
}

const RUBRIC_ITEMS = [
  { id: 'r1', label: '도입 5분 안에 실생활 문제 맥락을 제시했는가?' },
  { id: 'r2', label: '학생이 직접 조작·수정할 수 있는 산출물 과제가 있는가?' },
  { id: 'r3', label: '오류/디버깅 순간을 공유하고 토의할 시간을 확보했는가?' },
  { id: 'r4', label: '수준별 확장(Low Floor / High Ceiling) 선택지가 있는가?' },
];

function PedagogyRubricLab() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['r1', 'r2']);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-stone-700 bg-[#FAF9F6] dark:bg-[#1E1C19] p-3.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#1E293B] dark:text-stone-100">
          정보 수업 설계 셀프 루브릭
        </span>
        <span className="text-[11px] font-mono-code tabular-nums text-[#E11D48] dark:text-[#FDA4AF] font-semibold">
          {checkedIds.length}/{RUBRIC_ITEMS.length} 충족
        </span>
      </div>

      <div className="space-y-1.5">
        {RUBRIC_ITEMS.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full text-left flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-stone-900 border border-slate-200/80 dark:border-stone-700 hover:border-[#E11D48]/50 transition-colors"
            >
              <span
                className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border ${
                  isChecked
                    ? 'bg-[#E11D48] border-[#E11D48] text-white'
                    : 'border-slate-300 dark:border-stone-600'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
              </span>
              <span className="text-xs text-[#1E293B] dark:text-stone-200 leading-snug">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
