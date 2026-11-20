import { DEFAULT_PREFERENCES, SEED_GOALS, SEED_NOTES } from '../data/seedNotes';
import {
  CherishBackupPayload,
  DeskPreferences,
  PegboardGoal,
  StudyNote,
} from '../types/desk';

const STORAGE_KEYS = {
  notes: 'cherish_desk_notes_v1',
  goals: 'cherish_desk_goals_v1',
  prefs: 'cherish_desk_prefs_v1',
};

export function loadNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.notes);
    if (!raw) return SEED_NOTES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SEED_NOTES;
  } catch {
    return SEED_NOTES;
  }
}

export function saveNotes(notes: StudyNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadGoals(): PegboardGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.goals);
    if (!raw) return SEED_GOALS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SEED_GOALS;
  } catch {
    return SEED_GOALS;
  }
}

export function saveGoals(goals: PegboardGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadPreferences(): DeskPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.prefs);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      // Always start audio muted on fresh page load to respect browser autoplay rules
      speakerMode: 'off',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: DeskPreferences): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.prefs,
      JSON.stringify({
        isNightLamp: prefs.isNightLamp,
        isCustomCursorEnabled: prefs.isCustomCursorEnabled,
        speakerVolume: prefs.speakerVolume,
      })
    );
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function exportBackupJson(
  notes: StudyNote[],
  goals: PegboardGoal[],
  preferences: DeskPreferences
): void {
  const payload: CherishBackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    notes,
    goals,
    preferences: {
      isNightLamp: preferences.isNightLamp,
      isCustomCursorEnabled: preferences.isCustomCursorEnabled,
      speakerVolume: preferences.speakerVolume,
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `cherish-desk-backup-${dateStamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseBackupJson(rawText: string): CherishBackupPayload | null {
  try {
    const parsed = JSON.parse(rawText);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.notes)) return null;

    const validNotes: StudyNote[] = parsed.notes.filter(
      (n: unknown): n is StudyNote =>
        Boolean(n) &&
        typeof n === 'object' &&
        typeof (n as StudyNote).id === 'string' &&
        typeof (n as StudyNote).title === 'string' &&
        ['education', 'computer', 'design'].includes((n as StudyNote).subject)
    );

    if (validNotes.length === 0) return null;

    const validGoals: PegboardGoal[] = Array.isArray(parsed.goals)
      ? parsed.goals.filter(
          (g: unknown): g is PegboardGoal =>
            Boolean(g) &&
            typeof g === 'object' &&
            typeof (g as PegboardGoal).id === 'string' &&
            typeof (g as PegboardGoal).text === 'string'
        )
      : SEED_GOALS;

    return {
      version: 1,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
      notes: validNotes,
      goals: validGoals,
      preferences:
        parsed.preferences && typeof parsed.preferences === 'object'
          ? parsed.preferences
          : undefined,
    };
  } catch {
    return null;
  }
}

export function resetAllStorage(): {
  notes: StudyNote[];
  goals: PegboardGoal[];
  preferences: DeskPreferences;
} {
  saveNotes(SEED_NOTES);
  saveGoals(SEED_GOALS);
  savePreferences(DEFAULT_PREFERENCES);
  return {
    notes: SEED_NOTES,
    goals: SEED_GOALS,
    preferences: DEFAULT_PREFERENCES,
  };
}
