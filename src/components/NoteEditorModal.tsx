import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  LAB_LABELS,
  LabType,
  SPINE_COLOR_STYLES,
  SpineColor,
  StudyNote,
  SUBJECT_LABELS,
  SubjectCategory,
} from '../types/desk';

interface NoteEditorModalProps {
  isOpen: boolean;
  editingNote: StudyNote | null;
  onClose: () => void;
  onSave: (draft: {
    id?: string;
    subject: SubjectCategory;
    topic: string;
    title: string;
    summary: string;
    takeaways: string[];
    codeSnippet: string;
    labType: LabType;
    spineColor: SpineColor;
    isCherished: boolean;
    isPinnedToBoard: boolean;
  }) => void;
}

export function NoteEditorModal({
  isOpen,
  editingNote,
  onClose,
  onSave,
}: NoteEditorModalProps) {
  const [subject, setSubject] = useState<SubjectCategory>('computer');
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [takeawaysText, setTakeawaysText] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [labType, setLabType] = useState<LabType>('none');
  const [spineColor, setSpineColor] = useState<SpineColor>('yellow');
  const [isCherished, setIsCherished] = useState(true);
  const [isPinnedToBoard, setIsPinnedToBoard] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    if (editingNote) {
      setSubject(editingNote.subject);
      setTopic(editingNote.topic);
      setTitle(editingNote.title);
      setSummary(editingNote.summary);
      setTakeawaysText(editingNote.takeaways.join('\n'));
      setCodeSnippet(editingNote.codeSnippet);
      setLabType(editingNote.labType);
      setSpineColor(editingNote.spineColor);
      setIsCherished(editingNote.isCherished);
      setIsPinnedToBoard(editingNote.isPinnedToBoard);
    } else {
      setSubject('computer');
      setTopic('');
      setTitle('');
      setSummary('');
      setTakeawaysText('');
      setCodeSnippet('');
      setLabType('none');
      setSpineColor('yellow');
      setIsCherished(true);
      setIsPinnedToBoard(false);
    }
  }, [isOpen, editingNote]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setErrorMsg('제목과 개념 요약은 꼭 입력해 주세요.');
      return;
    }

    const takeaways = takeawaysText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    onSave({
      id: editingNote?.id,
      subject,
      topic: topic.trim() || SUBJECT_LABELS[subject],
      title: title.trim(),
      summary: summary.trim(),
      takeaways,
      codeSnippet,
      labType,
      spineColor,
      isCherished,
      isPinnedToBoard,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={editingNote ? '공부 노트 수정' : '새 공부 노트 수집'}
      className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#23201C] border border-slate-200 dark:border-stone-700 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1E293B] dark:text-[#F4F1EA]">
              {editingNote ? '책 내용 다듬기' : '새 공부 노트 책꽂이에 꽂기'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-stone-400">
              저장하면 브라우저에 안전하게 보관되고 책꽂이에 바로 꽂힙니다.
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto desk-scroll">
          {errorMsg && (
            <p className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-[#E11D48]">
              {errorMsg}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
                전공 과목
              </span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
              >
                <option value="education">교육학 (정보교육론 · 교수법)</option>
                <option value="computer">컴퓨터 (자료구조 · 알고리즘 · CS)</option>
                <option value="design">디자인 (UI/UX · 인터랙션)</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
                세부 주제
              </span>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 트리 순회, 교수매체, 타이포그래피"
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
              책 제목
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 큐(Queue)와 너비 우선 탐색(BFS)의 연결"
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700 dark:text-stone-200">
                책등 색상
              </span>
              <div className="flex items-center gap-2 pt-1">
                {(Object.keys(SPINE_COLOR_STYLES) as SpineColor[]).map((colorKey) => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setSpineColor(colorKey)}
                    aria-label={SPINE_COLOR_STYLES[colorKey].label}
                    className={`w-7 h-7 rounded-lg border transition-transform ${
                      spineColor === colorKey
                        ? 'ring-2 ring-[#1E293B] dark:ring-white scale-110 border-white'
                        : 'border-slate-300 dark:border-stone-600'
                    }`}
                    style={{ backgroundColor: SPINE_COLOR_STYLES[colorKey].bg }}
                  />
                ))}
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
                우측 페이지 인터랙티브 실험실
              </span>
              <select
                value={labType}
                onChange={(e) => setLabType(e.target.value as LabType)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
              >
                {(Object.keys(LAB_LABELS) as LabType[]).map((key) => (
                  <option key={key} value={key}>
                    {LAB_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
              개념 정리 (왼쪽 페이지)
            </span>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="핵심 개념과 나만의 언어로 이해한 내용을 적어주세요."
              className="w-full px-3 py-2 text-xs leading-relaxed rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
              핵심 포인트 (줄바꿈으로 구분)
            </span>
            <textarea
              rows={2}
              value={takeawaysText}
              onChange={(e) => setTakeawaysText(e.target.value)}
              placeholder="한 줄에 하나씩 중요한 포인트를 적어보세요."
              className="w-full px-3 py-2 text-xs leading-relaxed rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-stone-200">
              코드 또는 수업 타임라인 (오른쪽 페이지)
            </span>
            <textarea
              rows={3}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="// TypeScript 코드나 디자인 토큰, 수업 흐름을 자유롭게 기록하세요"
              className="w-full px-3 py-2 text-xs font-mono-code leading-relaxed rounded-lg bg-[#FAF9F6] dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-[#1E293B] dark:text-stone-100"
            />
          </label>

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1E293B] dark:text-stone-200">
              <input
                type="checkbox"
                checked={isCherished}
                onChange={(e) => setIsCherished(e.target.checked)}
                className="accent-[#E11D48] w-4 h-4 rounded"
              />
              <span>🍒 체리 수집함에 소중히 담기</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1E293B] dark:text-stone-200">
              <input
                type="checkbox"
                checked={isPinnedToBoard}
                onChange={(e) => setIsPinnedToBoard(e.target.checked)}
                className="accent-[#EAB308] w-4 h-4 rounded"
              />
              <span>벽면 화이트 타공판에 핀으로 고정하기</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-stone-300 hover:text-[#1E293B] dark:hover:text-white rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg"
            >
              {editingNote ? '수정 저장' : '책꽂이에 꽂기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
