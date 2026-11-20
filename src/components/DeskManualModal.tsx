import { X } from 'lucide-react';

interface DeskManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeskManualModal({ isOpen, onClose }: DeskManualModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="소피 소개 및 Sophie's Cherish Desk 사용설명서"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[86vh] rounded-2xl bg-white dark:bg-[#1E1C19] border border-slate-200 dark:border-stone-700 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header echoing the Cherry Frame */}
        <div className="shrink-0 px-7 py-5 bg-white dark:bg-[#1B1916] border-b border-slate-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-14 rounded-md border-2 border-[#B88954] bg-[#FBF9F5] shadow-xs flex items-center justify-center shrink-0">
              <span className="text-2xl leading-none" aria-hidden="true">
                🍒
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B] dark:text-[#F4F1EA] truncate">
                Sophie&apos;s Cherish Desk 안내서
              </h2>
              <p className="text-sm text-slate-500 dark:text-stone-400">
                소피의 이야기와 책상 위 소품 사용법을 편하게 읽어보세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="안내서 닫기"
            className="p-2 rounded-lg text-slate-400 hover:text-[#1E293B] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large, Flowing Editorial Prose Body */}
        <div className="flex-1 min-h-0 overflow-y-auto desk-scroll px-7 py-7 sm:px-9 sm:py-8 space-y-8 text-[#1E293B] dark:text-[#F4F1EA]">
          {/* Section 1: About Sophie */}
          <section className="space-y-3 pb-7 border-b border-slate-200/80 dark:border-stone-800">
            <h3 className="text-2xl sm:text-[26px] font-bold tracking-tight leading-snug text-balance">
              안녕하세요, 컴퓨터교육과 디자인을 공부하는 소피(Sophie)입니다.
            </h3>
            <p className="text-base sm:text-[17px] leading-[1.85] text-slate-700 dark:text-stone-300">
              이 공간은 제가 좋아하는 배움과 취향을 한 책상 위에 소중히 모아둔{' '}
              <strong className="font-semibold text-[#1E293B] dark:text-white">
                Sophie&apos;s Cherish Desk
              </strong>
              예요. 컴퓨터공학의 알고리즘과 시스템, 교육학의 수업 설계, 그리고
              디자인의 작은 디테일까지—공부하면서 오래 간직하고 싶은 생각들을
              한 권의 책으로 엮어 책꽂이에 꽂아두었습니다. 책상 위 물건들에
              노란 체크 마우스를 올려보면 무엇을 할 수 있는지 손글씨 화살표가
              살짝 말을 걸어줄 거예요.
            </p>
          </section>

          {/* Section 2: Big Bold Intuitive Prose Guide */}
          <section className="space-y-7">
            <div className="space-y-2">
              <h4 className="text-xl font-bold tracking-tight text-[#E11D48]">
                01. 아크릴 책꽂이 &amp; 연필꽂이로 공부 기록하기
              </h4>
              <p className="text-base sm:text-[17px] leading-[1.8] text-slate-700 dark:text-stone-300">
                오른쪽 아크릴 책꽂이를 누르면 그동안 모아둔 전공 책들이 한 줄로
                나란히 나타납니다. 마음에 드는 책을 고르면 양면으로 책이
                활짝 펼쳐지는데, 왼쪽 페이지에서는 이 책의 목차와 같은 과목
                시리즈를 볼 수 있고 오른쪽 페이지에서는 개념 정리·코드·직접
                눌러보며 실험하는 인터랙티브 학습 도구를 바로 실행할 수 있어요.
                새로운 노트를 쓰고 싶을 때는 책꽂이 옆 연필꽂이를 클릭해
                작성해 보세요.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-[#FDE047]">
                02. 체리 접시로 아끼는 노트만 쏙 모아보기
              </h4>
              <p className="text-base sm:text-[17px] leading-[1.8] text-slate-700 dark:text-stone-300">
                책을 읽다가 특히 기억하고 싶은 페이지에는 체리(🍒) 버튼을 눌러
                표시해 둘 수 있습니다. 책꽂이 앞 노란 체리 접시나 화면 오른쪽 위
                체리 수집함 버튼을 누르면 아끼는 노트만 따로 꺼내 보고, 오늘
                복습할 노트를 랜덤으로 한 권 뽑아볼 수 있어요.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-[#FDE047]">
                03. 타공판 포스트잇, 다마고찌 &amp; 라즈베리파이
              </h4>
              <p className="text-base sm:text-[17px] leading-[1.8] text-slate-700 dark:text-stone-300">
                왼쪽 벽의 하얀 타공판을 누르면 오늘의 공부 목표를 적은
                포스트잇을 붙이고 완료 체크를 할 수 있습니다. 타공판에 걸려 있는
                노란 다마고찌를 누르면 소피의 스터디 펫에게 체리 간식을 주며
                기분을 띄울 수 있고, 초록색 라즈베리파이 보드를 누르면 GPIO LED
                핀을 직접 켜고 끄는 작은 하드웨어 실험도 해볼 수 있어요.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-[#FDE047]">
                04. 마샬 스피커, 탁상 시계, 버섯 스탠드 &amp; 서울 창문
              </h4>
              <p className="text-base sm:text-[17px] leading-[1.8] text-slate-700 dark:text-stone-300">
                왼쪽 책상의 마샬 스타일 스피커를 클릭하면 Lo-fi와 빗소리는
                물론, 유튜브 검색창에 원하는 음악을 검색해 공부 BGM으로 바로
                재생할 수 있습니다. 옆의 노란 시계는 25·10·5분 뽀모도로 집중
                타이머로 동작하고, 하얀 판텔라 버섯 스탠드를 누르면 밤 무드등이
                은은하게 켜져요. 왼쪽 창문은 지금 대한민국 서울의 낮·밤과 비
                날씨에 맞춰 자동으로 바뀌며, 창문을 클릭해 다른 날씨를 미리
                구경해 볼 수도 있습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold tracking-tight text-[#1E293B] dark:text-[#FDE047]">
                05. 아이맥 화면과 자동 저장 백업
              </h4>
              <p className="text-base sm:text-[17px] leading-[1.8] text-slate-700 dark:text-stone-300">
                가운데 화이트 아이맥 화면 위로 마우스를 움직이면 화면 속 투명한
                글라스 시계 위로 작은 노란 커서가 함께 따라 움직입니다. 작성한
                노트와 포스트잇은 브라우저에 자동으로 저장되며, 아래쪽 바의 백업
                내보내기·불러오기를 이용하면 언제든 파일로 안전하게 보관할 수
                있어요.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-7 py-3.5 bg-white dark:bg-[#1B1916] border-t border-slate-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 dark:text-stone-400">
            오른쪽 위 체리 액자를 누르면 언제든 다시 열 수 있어요.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-[#1E293B] dark:bg-[#FDE047] text-white dark:text-[#1E293B] rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            책상으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
