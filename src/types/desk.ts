export type SubjectCategory = 'education' | 'computer' | 'design';
export type SubjectFilter = 'all' | SubjectCategory;
export type SpineColor = 'pink' | 'mint' | 'yellow' | 'cream' | 'sky';
export type LabType = 'none' | 'stack' | 'binary-search' | 'bubble-sort' | 'pedagogy-rubric';
export type SpeakerMode = 'off' | 'lofi' | 'rain' | 'youtube';
export type ViewMode = 'desk' | 'list';

export interface YouTubeTrack {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

export interface StudyNote {
  id: string;
  indexNumber: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface PegboardGoal {
  id: string;
  text: string;
  noteColor: 'yellow' | 'pink' | 'mint' | 'cream';
  completed: boolean;
  linkedNoteId?: string;
}

export interface DeskPreferences {
  isNightLamp: boolean;
  isCustomCursorEnabled: boolean;
  speakerMode: SpeakerMode;
  speakerVolume: number;
}

export interface CherishBackupPayload {
  version: 1;
  exportedAt: string;
  notes: StudyNote[];
  goals: PegboardGoal[];
  preferences?: Partial<DeskPreferences>;
}

export const SUBJECT_LABELS: Record<SubjectCategory, string> = {
  education: '교육학',
  computer: '컴퓨터',
  design: '디자인',
};

export const LAB_LABELS: Record<LabType, string> = {
  none: '코드 / 메모 뷰',
  stack: '스택(Stack) LIFO 시뮬레이터',
  'binary-search': '이진 탐색(Binary Search) 스텝 실험실',
  'bubble-sort': '버블 정렬(Bubble Sort) 비교 시각화',
  'pedagogy-rubric': '정보 수업 설계 체크리스트',
};

export const SPINE_COLOR_STYLES: Record<
  SpineColor,
  {
    bg: string;
    darkBg: string;
    band: string;
    text: string;
    label: string;
  }
> = {
  pink: {
    bg: '#F7C5CC',
    darkBg: '#8B4A55',
    band: '#FFF5F6',
    text: '#1E293B',
    label: '파스텔 핑크',
  },
  mint: {
    bg: '#CFE6D9',
    darkBg: '#3D6B56',
    band: '#F4FBF7',
    text: '#1E293B',
    label: '세이지 민트',
  },
  yellow: {
    bg: '#F6E08B',
    darkBg: '#8D7626',
    band: '#FFFDF2',
    text: '#1E293B',
    label: '버터 옐로우',
  },
  cream: {
    bg: '#EAE4D7',
    darkBg: '#635C4F',
    band: '#FAF9F6',
    text: '#1E293B',
    label: '베이지 크림',
  },
  sky: {
    bg: '#D4E4F7',
    darkBg: '#3F5D80',
    band: '#F5F9FF',
    text: '#1E293B',
    label: '소프트 스카이',
  },
};
