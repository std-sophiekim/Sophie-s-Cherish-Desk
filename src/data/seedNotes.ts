import { DeskPreferences, PegboardGoal, StudyNote } from '../types/desk';

export const SEED_NOTES: StudyNote[] = [
  {
    id: 'note-edu-01',
    indexNumber: '01',
    subject: 'education',
    topic: '정보교육론',
    title: '파퍼트(Papert)의 구성주의와 블록 코딩 교육',
    summary:
      '지식은 교사가 일방적으로 전달하는 것이 아니라, 학습자가 의미 있는 인공물(Artifact)을 직접 설계하고 만들어가는 과정에서 구성된다. 스크래치나 엔트리 같은 블록 코딩 도구는 추상적인 알고리즘 개념을 만질 수 있는 사고의 재료(Objects-to-think-with)로 바꿔 준다.',
    takeaways: [
      'Low Floor, High Ceiling, Wide Walls — 진입 장벽은 낮고 확장성은 넓게 설계하기',
      '디버깅 과정을 실패가 아닌 가설 검증과 메타인지 성찰의 핵심 순간으로 다루기',
      '학생 각자의 취향과 관심사를 담은 미니 프로젝트로 내재적 동기 이끌어내기',
    ],
    codeSnippet: `// 구성주의 기반 정보 수업 4단계 루틴
const lessonFlow = [
  { step: 1, phase: 'Imagine', focus: '생활 속 작은 문제 발견하기' },
  { step: 2, phase: 'Create',  focus: '블록·프로토타입 직접 조립하기' },
  { step: 3, phase: 'Debug',   focus: '오류 원인 탐구하고 동료와 토의하기' },
  { step: 4, phase: 'Share',   focus: '작품 발표 및 성찰 저널 기록하기' },
];`,
    labType: 'pedagogy-rubric',
    spineColor: 'pink',
    isCherished: true,
    isPinnedToBoard: true,
    createdAt: '2026-11-10',
    updatedAt: '2026-11-18',
  },
  {
    id: 'note-cs-02',
    indexNumber: '02',
    subject: 'computer',
    topic: '자료구조',
    title: '스택(Stack)과 함수 호출 프레임의 연결',
    summary:
      '스택은 가장 나중에 들어간 데이터가 가장 먼저 나오는 후입선출(LIFO) 구조다. 책상 위에 책을 차곡차곡 쌓았다가 위에서부터 꺼내는 것과 똑같으며, 실행 취소(Undo), 괄호 짝 검사, 그리고 프로그램의 재귀 함수 호출 스택(Call Stack)을 이해하는 출발점이 된다.',
    takeaways: [
      'push()와 pop() 연산 모두 맨 위(Top)에서만 일어나므로 시간복잡도는 O(1)',
      '재귀 호출이 너무 깊어지면 스택 메모리가 넘쳐 Stack Overflow가 발생한다',
      '우측 실험실에서 직접 데이터를 쌓고(Push) 꺼내며(Pop) LIFO 흐름을 확인해 보기',
    ],
    codeSnippet: `class ArrayStack<T> {
  private items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}`,
    labType: 'stack',
    spineColor: 'sky',
    isCherished: true,
    isPinnedToBoard: false,
    createdAt: '2026-11-12',
    updatedAt: '2026-11-17',
  },
  {
    id: 'note-cs-03',
    indexNumber: '03',
    subject: 'computer',
    topic: '알고리즘',
    title: '이진 탐색(Binary Search)과 O(log N)의 직관',
    summary:
      '정렬된 배열에서 원하는 값을 찾을 때, 매 단계마다 탐색 범위를 정확히 절반씩 줄여 나가는 알고리즘이다. 1,000개의 데이터도 최대 10번 이내의 비교로 찾아낼 수 있어, 정보 교과 수업에서 "선형 탐색 vs 이진 탐색" 효율성을 비교할 때 가장 극적인 직관을 준다.',
    takeaways: [
      '전제 조건: 데이터가 반드시 오름차순(또는 내림차순)으로 정렬되어 있어야 한다',
      'mid 계산 시 오버플로를 피하려면 low + Math.floor((high - low) / 2) 습관화하기',
      '종료 조건(low <= high)과 경계값(+1, -1) 갱신 실수를 특히 주의하기',
    ],
    codeSnippet: `function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    labType: 'binary-search',
    spineColor: 'mint',
    isCherished: true,
    isPinnedToBoard: true,
    createdAt: '2026-11-14',
    updatedAt: '2026-11-18',
  },
  {
    id: 'note-design-04',
    indexNumber: '04',
    subject: 'design',
    topic: '컬러 & 타이포',
    title: '미니멀 화이트 컬러 시스템과 60-30-10 여백 설계',
    summary:
      '화이트 기반 인터페이스가 공허해 보이지 않으려면 미묘한 온도 차이와 명확한 면적 비율이 필요하다. 60%의 웜 화이트 배경, 30%의 크림·베이지 구조면, 그리고 10%의 선명한 포인트 컬러(체리 레드 & 버터 옐로우)가 만날 때 산뜻하면서도 집중되는 학습 공간이 완성된다.',
    takeaways: [
      '순백(#FFFFFF) 위 오브젝트에는 1px 헤어라인 보더나 은은한 단일 그림자 중 하나만 쓰기',
      '정적인 메타 정보는 캡슐 뱃지 대신 점(·) 구분 텍스트로 가볍게 정리하기',
      '코드와 숫자 타이포그래피에는 고정폭 폰트와 tabular-nums로 수직 정렬 맞추기',
    ],
    codeSnippet: `:root {
  /* 60% Dominant Warm White Canvas */
  --surface-wall: #FAF9F6;
  --surface-desk: #FFFFFF;

  /* 30% Structural Cream & Hairline */
  --surface-cream: #EAE4D7;
  --border-soft: rgba(30, 41, 59, 0.08);

  /* 10% Cherish Cherry & Butter Check Accent */
  --accent-cherry: #E11D48;
  --accent-butter: #FDE047;
}`,
    labType: 'none',
    spineColor: 'yellow',
    isCherished: true,
    isPinnedToBoard: false,
    createdAt: '2026-11-15',
    updatedAt: '2026-11-19',
  },
  {
    id: 'note-cs-05',
    indexNumber: '05',
    subject: 'computer',
    topic: '정렬 알고리즘',
    title: '버블 정렬(Bubble Sort) 시각화 원리',
    summary:
      '서로 인접한 두 원소를 비교해 순서가 잘못되어 있으면 자리를 바꾸는 과정을 반복한다. 매 패스마다 가장 큰 값이 거품처럼 배열 맨 끝으로 떠오르는 모습이 직관적이어서, 초보자가 알고리즘의 비교·교환(Swap) 개념과 이중 루프 구조를 시각화해 이해하기 좋다.',
    takeaways: [
      '평균 및 최악 시간복잡도는 O(N²)이지만, 이미 정렬된 배열은 조기 종료 최적화 가능',
      '같은 값의 상대적 순서가 유지되는 안정 정렬(Stable Sort)에 해당한다',
      '우측 실험실에서 단계별 비교·교환 카운터가 어떻게 올라가는지 직접 관찰해 보기',
    ],
    codeSnippet: `function bubbleSort(arr: number[]): number[] {
  const copy = [...arr];
  for (let i = 0; i < copy.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < copy.length - 1 - i; j++) {
      if (copy[j] > copy[j + 1]) {
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return copy;
}`,
    labType: 'bubble-sort',
    spineColor: 'cream',
    isCherished: false,
    isPinnedToBoard: false,
    createdAt: '2026-11-16',
    updatedAt: '2026-11-18',
  },
  {
    id: 'note-edu-06',
    indexNumber: '06',
    subject: 'education',
    topic: '수업 설계',
    title: '컴퓨팅 사고력(CT) 기반 언플러그드 활동 지도안',
    summary:
      '컴퓨터 없이도 종이 카드, 보드게임, 신체 활동만으로 핵심 정보과학 개념을 체득하게 하는 언플러그드 교수법이다. 추상화, 패턴 인식, 분해, 알고리즘 설계라는 CT의 4가지 핵심 요소를 학생 눈높이의 놀이 규칙으로 번역하는 설계력이 중요하다.',
    takeaways: [
      '활동 전 규칙 설명은 5분 이내로 압축하고, 손으로 먼저 만져보며 규칙을 익히기',
      '활동 후에는 반드시 "우리가 한 놀이가 컴퓨터의 어떤 원리와 닮았을까?" 토의하기',
      '관찰 루브릭에 협업 소통 태도와 오류 수정 전략을 함께 반영하기',
    ],
    codeSnippet: `// 언플러그드 수업 45분 타임테이블
00-07분 | 동기유발: 카드 마술로 이진수 비밀 맞추기
07-22분 | 탐구활동: 짝과 함께 5비트 점 카드 뒤집어 숫자 표현
22-35분 | 개념연결: 컴퓨터가 0과 1만으로 문자를 저장하는 원리 정리
35-45분 | 성찰정리: 내 이름 이니셜 이진수 팔찌 도안 완성하기`,
    labType: 'none',
    spineColor: 'mint',
    isCherished: false,
    isPinnedToBoard: false,
    createdAt: '2026-11-17',
    updatedAt: '2026-11-19',
  },
  {
    id: 'note-design-07',
    indexNumber: '07',
    subject: 'design',
    topic: '인터랙션 UX',
    title: '교육용 웹 인터페이스의 어포던스(Affordance)',
    summary:
      '사용자가 설명서를 읽지 않아도 "이 버튼을 누르면 책이 열리겠구나", "연필을 누르면 새 노트를 쓸 수 있겠구나"라고 직관적으로 알아차리게 만드는 시각적 단서다. 포인트 앤 클릭 데스크 UI에서는 호버 시 살짝 떠오르는 움직임과 손글씨 화살표 라벨이 훌륭한 시그니파이어가 된다.',
    takeaways: [
      '모든 클릭 가능한 소품은 40px 이상의 충분한 터치/클릭 영역 확보하기',
      '호버 피드백은 100~200ms 이내에 transform과 opacity 중심으로 가볍게 반응하기',
      '색상만으로 상태를 구분하지 말고 아이콘·텍스트 라벨을 반드시 함께 제공하기',
    ],
    codeSnippet: `/* 포인트 앤 클릭 데스크 소품 인터랙션 원칙 */
.desk-prop {
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.desk-prop:hover {
  transform: translateY(-4px);
}`,
    labType: 'none',
    spineColor: 'pink',
    isCherished: false,
    isPinnedToBoard: false,
    createdAt: '2026-11-18',
    updatedAt: '2026-11-19',
  },
];

export const SEED_GOALS: PegboardGoal[] = [
  {
    id: 'goal-01',
    text: '정보교육론 구성주의 모형 복습하고 루브릭 체크하기',
    noteColor: 'yellow',
    completed: false,
    linkedNoteId: 'note-edu-01',
  },
  {
    id: 'goal-02',
    text: '이진 탐색 경계값(low <= high) 손코딩으로 검증',
    noteColor: 'mint',
    completed: true,
    linkedNoteId: 'note-cs-03',
  },
  {
    id: 'goal-03',
    text: '25분 뽀모도로 2세션 채우고 체리 1개 더 수집하기',
    noteColor: 'pink',
    completed: false,
  },
];

export const DEFAULT_PREFERENCES: DeskPreferences = {
  isNightLamp: false,
  isCustomCursorEnabled: true,
  speakerMode: 'off',
  speakerVolume: 0.45,
};
