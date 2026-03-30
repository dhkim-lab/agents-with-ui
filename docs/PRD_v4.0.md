# AI Marketing Team Office Demo — PRD v4.0

> 피드백을 반영하여 사무실 화면의 비중을 줄이고 실시간 마케팅 성과를 나타내는 대시보드를 추가합니다. 또한 시연 종료 후 반복 작업이나 새 미션을 부여할 수 있는 UX 뎁스를 확장합니다.

| 버전 | 작성일 | 목적 |
|------|--------|------|
| v4.0 | 2026.03.26 | 데이터 지표 대시보드 시각화 및 후속 반복 루프 트리거 추가 |

---

## 1. 개편 핵심 목표 (v4.0)

1. **상태창 전면 가시화 (Status Visibility)**: 우측 하단의 `StatusPanel`이 스크롤 없이도 핵심 에이전트 5명의 상태를 한눈에 볼 수 있도록 높이 제어 및 레이아웃 최적화.
2. **사무실 축소 & 대시보드 탑재 (Data Dashboard)**: 
   - 거대했던 `OfficeScene` 화면 분할.
   - 남은 영역에 **Marketing Dashboard** 영역 신설. 실시간 광고 예산(Budget) 소진율, 도달률(Reach), 리드(Leads) 생성 수치 등이 에이전트들의 작업 경과에 따라 함께 올라가는 연출 적용.
3. **피날레 이후 지속성 (Next Action Flow)**:
   - 마지막 `FinalSnsPopup` 모달 하단에 데모 종료가 아닌 **[새로운 미션 주기]** 및 **[A/B 테스트 무한 반복 스케일링]** 등 다음 액션 버튼을 배치시켜 데모의 리텐션 및 "끊임없는 AI 요원" 컨셉 어필.

---

## 2. 세부 기능 및 화면 설계

### 2.1 대시보드 패널 (DashboardPanel.tsx)
- 화면 중앙 좌측(또는 하단)에 위치.
- **주요 지표 (Metrics)**:
  - `Active Campaigns` (활성 캠페인 수)
  - `Global Reach` (글로벌 도달률) - 틱(tick)마다 증가.
  - `Live CPQA` / `Budget Spent` - 진행도에 비례해 숫자가 카운팅되는 게이지 UI.

### 2.2 메인 레이아웃 (App.tsx) 변경
- 기존 `flex-1` 영역을 반으로 쪼개어, `grid` 또는 `flex-col`로 묶어 상단은 `OfficeScene` (2D 그래픽), 하단은 `DashboardPanel`로 분할 렌더링.

### 2.3 StatusPanel 레이아웃 컴팩트화
- 에이전트 Status Bar가 5명 모두 표시되도록 폰트 사이즈 및 Padding/Margin 다이어트 적용.

### 2.4 FinalSnsPopup Next Action Buttons
- 팝업 본문/하단 영역에 액션 그룹 생성:
  1. `[새로운 고난도 미션 주기]` (Input 초기화 후 처음 단계로 리셋)
  2. `[현재 캠페인 국가별 반복 자동화 스케일링]` (가상의 스케일링 시작 - 사실상 리셋과 동일한 훅 호출하되 토스트 알림 연출)

---

## 3. 구현 마일스톤 (M11 ~ M13)

### [M11] 레이아웃 재구성 및 대시보드 추가
- [ ] DashboardPanel.tsx 데이터 시각화 컴포넌트 프레임워크 작성
- [ ] App.tsx 화면 분할 (Office + Dashboard)

### [M12] StatusPanel 최적화
- [ ] StatusPanel.tsx 높이 계산 및 overflow-y 방지, 컴팩트 UI 적용

### [M13] 피날레 후속 액션 (Next Action Loops)
- [ ] FinalSnsPopup.tsx 내 버튼 그룹 추가 및 App.tsx의 reset 연동
