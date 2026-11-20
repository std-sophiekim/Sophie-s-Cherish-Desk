import { useEffect, useState } from 'react';
import { ArchiveListView } from './components/ArchiveListView';
import { BigYellowCheckCursor } from './components/BigYellowCheckCursor';
import { CherishCollectionModal } from './components/CherishCollectionModal';
import { DeskManualModal } from './components/DeskManualModal';
import { GlobalFooter } from './components/GlobalFooter';
import { GlobalHeader } from './components/GlobalHeader';
import { NoteEditorModal } from './components/NoteEditorModal';
import { PhotorealisticDeskStage } from './components/PhotorealisticDeskStage';
import {
  DeskPreferences,
  LabType,
  PegboardGoal,
  SpeakerMode,
  SpineColor,
  StudyNote,
  SubjectCategory,
  SubjectFilter,
  ViewMode,
} from './types/desk';
import { deskAudio } from './utils/audioEngine';
import {
  exportBackupJson,
  loadGoals,
  loadNotes,
  loadPreferences,
  parseBackupJson,
  resetAllStorage,
  saveGoals,
  saveNotes,
  savePreferences,
} from './utils/storage';

export default function App() {
  const [notes, setNotes] = useState<StudyNote[]>(() => loadNotes());
  const [goals, setGoals] = useState<PegboardGoal[]>(() => loadGoals());
  const [preferences, setPreferences] = useState<DeskPreferences>(() =>
    loadPreferences()
  );

  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('desk');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const id = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(id);
  }, [toastMessage]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.isNightLamp);
  }, [preferences.isNightLamp]);

  useEffect(() => {
    deskAudio.setVolume(preferences.speakerVolume);
    deskAudio.setMode(preferences.speakerMode);
  }, [preferences.speakerMode, preferences.speakerVolume]);

  useEffect(() => {
    return () => {
      deskAudio.dispose();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCollectionOpen(false);
        setIsManualOpen(false);
        setIsEditorOpen(false);
        setIsResetDialogOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? null;
  const cherishedCount = notes.filter((note) => note.isCherished).length;

  const handleToggleCherish = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id !== noteId) return note;
        const nextCherished = !note.isCherished;
        showToast(
          nextCherished
            ? `"${note.title}" 노트에 체리(🍒)를 달았습니다.`
            : `"${note.title}" 체리 수집을 해제했습니다.`
        );
        return { ...note, isCherished: nextCherished };
      })
    );
  };

  const handleTogglePin = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id !== noteId) return note;
        const nextPinned = !note.isPinnedToBoard;
        showToast(
          nextPinned
            ? '벽면 화이트 타공판에 카드를 고정했습니다.'
            : '타공판에서 카드를 내렸습니다.'
        );
        return { ...note, isPinnedToBoard: nextPinned };
      })
    );
  };

  const handleSaveNote = (draft: {
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
  }) => {
    const today = new Date().toISOString().slice(0, 10);

    if (draft.id) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === draft.id
            ? {
                ...note,
                ...draft,
                updatedAt: today,
              }
            : note
        )
      );
      setSelectedNoteId(draft.id);
      showToast('노트 내용을 수정해 책꽂이에 다시 꽂았습니다.');
    } else {
      const nextIndex = String(notes.length + 1).padStart(2, '0');
      const newNote: StudyNote = {
        id: `note-${Date.now()}`,
        indexNumber: nextIndex,
        subject: draft.subject,
        topic: draft.topic,
        title: draft.title,
        summary: draft.summary,
        takeaways: draft.takeaways,
        codeSnippet: draft.codeSnippet,
        labType: draft.labType,
        spineColor: draft.spineColor,
        isCherished: draft.isCherished,
        isPinnedToBoard: draft.isPinnedToBoard,
        createdAt: today,
        updatedAt: today,
      };
      setNotes((prev) => [...prev, newNote]);
      setSelectedNoteId(newNote.id);
      setViewMode('desk');
      showToast('새 공부 노트를 수집해 책꽂이에 꽂았습니다.');
    }

    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
    showToast('선택한 노트를 책꽂이에서 정리했습니다.');
  };

  const handleToggleGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (text: string, noteColor: PegboardGoal['noteColor']) => {
    const newGoal: PegboardGoal = {
      id: `goal-${Date.now()}`,
      text,
      noteColor,
      completed: false,
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast('타공판에 새 포스트잇을 붙였습니다.');
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleExportBackup = () => {
    exportBackupJson(notes, goals, preferences);
    showToast('JSON 백업 파일을 다운로드했습니다.');
  };

  const handleImportBackup = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseBackupJson(text);
      if (!parsed) {
        showToast('올바른 CHERISH DESK 백업 JSON 파일이 아닙니다.');
        return;
      }
      setNotes(parsed.notes);
      setGoals(parsed.goals);
      if (parsed.preferences) {
        setPreferences((prev) => ({
          ...prev,
          ...parsed.preferences,
          speakerMode: 'off',
        }));
      }
      setSelectedNoteId(parsed.notes[0]?.id ?? null);
      showToast(`백업 파일에서 ${parsed.notes.length}권의 노트를 불러왔습니다.`);
    } catch {
      showToast('백업 파일을 읽는 중 오류가 발생했습니다.');
    }
  };

  const handleConfirmReset = () => {
    const fresh = resetAllStorage();
    setNotes(fresh.notes);
    setGoals(fresh.goals);
    setPreferences(fresh.preferences);
    setSelectedNoteId(null);
    setActiveFilter('all');
    setIsResetDialogOpen(false);
    showToast('기본 전공 노트 아카이브로 초기화했습니다.');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-white dark:bg-[#171614] text-[#1E293B] dark:text-[#F4F1EA] transition-colors">
      <BigYellowCheckCursor enabled={preferences.isCustomCursorEnabled} />

      <GlobalHeader
        activeFilter={activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          setSelectedNoteId(null);
          if (viewMode !== 'desk') setViewMode('desk');
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        cherishedCount={cherishedCount}
        onOpenCollection={() => setIsCollectionOpen(true)}
        onResetToIdleDesk={() => setSelectedNoteId(null)}
      />

      <main className="flex-1 min-h-0 w-full overflow-hidden">
        {viewMode === 'desk' ? (
          <PhotorealisticDeskStage
            notes={notes}
            goals={goals}
            activeFilter={activeFilter}
            onChangeFilter={(filter) => setActiveFilter(filter)}
            selectedNote={selectedNote}
            isNightLamp={preferences.isNightLamp}
            speakerMode={preferences.speakerMode}
            speakerVolume={preferences.speakerVolume}
            cherishedCount={cherishedCount}
            onSelectNote={(noteId) => setSelectedNoteId(noteId)}
            onToggleCherish={handleToggleCherish}
            onTogglePin={handleTogglePin}
            onEditNote={(note) => {
              setEditingNote(note);
              setIsEditorOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onOpenNewNote={() => {
              setEditingNote(null);
              setIsEditorOpen(true);
            }}
            onOpenCollection={() => setIsCollectionOpen(true)}
            onOpenManual={() => setIsManualOpen(true)}
            onToggleNightLamp={() =>
              setPreferences((prev) => ({
                ...prev,
                isNightLamp: !prev.isNightLamp,
              }))
            }
            onChangeSpeakerMode={(mode: SpeakerMode) =>
              setPreferences((prev) => ({ ...prev, speakerMode: mode }))
            }
            onChangeSpeakerVolume={(vol: number) =>
              setPreferences((prev) => ({ ...prev, speakerVolume: vol }))
            }
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        ) : (
          <ArchiveListView
            notes={notes}
            activeFilter={activeFilter}
            onOpenInDesk={(noteId) => {
              setSelectedNoteId(noteId);
              setViewMode('desk');
            }}
            onToggleCherish={handleToggleCherish}
            onOpenNewNote={() => {
              setEditingNote(null);
              setIsEditorOpen(true);
            }}
          />
        )}
      </main>

      <GlobalFooter
        totalNotes={notes.length}
        cherishedCount={cherishedCount}
        isCustomCursorEnabled={preferences.isCustomCursorEnabled}
        onToggleCustomCursor={() =>
          setPreferences((prev) => ({
            ...prev,
            isCustomCursorEnabled: !prev.isCustomCursorEnabled,
          }))
        }
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onResetArchive={() => setIsResetDialogOpen(true)}
      />

      {/* Modals */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        editingNote={editingNote}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
      />

      <CherishCollectionModal
        isOpen={isCollectionOpen}
        notes={notes}
        onClose={() => setIsCollectionOpen(false)}
        onOpenNote={(noteId) => {
          setSelectedNoteId(noteId);
          setViewMode('desk');
        }}
        onToggleCherish={handleToggleCherish}
      />

      <DeskManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      {isResetDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="아카이브 초기화 확인"
          className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#23201C] border border-slate-200 dark:border-stone-700 shadow-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-[#1E293B] dark:text-[#F4F1EA]">
              아카이브를 초기화할까요?
            </h2>
            <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed">
              직접 작성한 노트와 포스트잇이 기본 스타터 노트 7권으로 되돌아갑니다. 필요하다면 먼저 백업 내보내기로 저장해 주세요.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetDialogOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-stone-300 rounded-lg"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg"
              >
                초기화 실행
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-14 right-6 z-50 px-4 py-2 rounded-xl bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] text-xs font-semibold shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
