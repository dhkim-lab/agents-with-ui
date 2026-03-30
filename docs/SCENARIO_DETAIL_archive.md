# AI Marketing Team Office Demo — 시나리오 상세 명세

> `src/engine/scenarioData.ts` 기반 전체 시나리오 타임라인 정리
> 수정 시 이 문서를 기준으로 변경 사항을 반영합니다.

---

## 에이전트 정보

| 이름 | 역할 | 이모지 | 설명 |
|------|------|--------|------|
| **Alex** | Orchestrator (팀 리더) | 🧢 | 전체 프로젝트 총괄, 결과물 통합 및 배포 |
| **Kai** | Researcher (리서처) | 🔍 | 글로벌 시장 조사, 경쟁사 분석, 데이터 크롤링 |
| **Mia** | Writer (카피라이터) | ✍️ | 다국어 카피 작성, 현지화(Localization) 담당 |
| **Nova** | Planner (기획자) | 💡 | 마케팅 퍼널 설계, 캠페인 전략 기획 |
| **Rex** | Analyst (분석가) | 📊 | 데이터 분석, LTV/CAC 모델링, 예산 최적화 |

---

## 이벤트 타입 레퍼런스

| 타입 | 설명 | 주요 파라미터 |
|------|------|---------------|
| `chat` | 에이전트가 채팅 메시지 전송 | `agent`, `text` |
| `move` | 에이전트 위치 이동 | `agent` (개별 or `'all'`), `to` (`desk` / `meeting_room` / `Alex_desk`) |
| `status` | 에이전트 작업 상태 변경 | `agent`, `state` (`idle`/`working`/`waiting`/`done`), `progress` (0~100), `statusText` |
| `file_transfer` | 에이전트 간 파일 전달 애니메이션 | `from`, `to` |
| `result_ready` | 최종 결과물 팝업 트리거 | `resultType`, `content` |
| `publish_done` | SNS 배포 완료 팝업 트리거 | (없음) |

---

## Phase 0 — 인트로

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `intro` |
| **지속 시간** | 5초 (5,000ms) |
| **목적** | 사용자 토픽 입력 대기, Alex 인사 |

### 타임라인

| 시간 | 타입 | 에이전트 | 내용 |
|------|------|----------|------|
| 1.0s | `chat` | Alex | "안녕하세요. 오늘은 어떤 마케팅 캠페인을 진행할까요?" |

### 화면 상태
- 시작 화면 오버레이가 표시됨
- 사용자가 토픽을 입력하고 "데모 시작하기" 버튼 클릭
- 모든 에이전트는 `desk` 위치, `idle` 상태

---

## Phase 1 — 킥오프 회의

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `Phase 1 - 킥오프 회의` |
| **지속 시간** | 15초 (15,000ms) |
| **목적** | 미션 브리핑, 역할 분담, 에이전트 전원 회의실 이동 |

### 타임라인

| 시간 | 타입 | 에이전트 | 내용 |
|------|------|----------|------|
| 0.0s | `chat` | Alex | "자, 이번 미션은 '글로벌 B2B 엔터프라이즈 타겟 다국어 마케팅 캠페인 및 퍼널 최적화'야. 다들 집중해줘." |
| 3.0s | `chat` | Kai | "알겠습니다. 포춘 500대 기업 타겟의 링크드인 데이터 및 경쟁사 백서(Whitepaper) 전략을 스크래핑 하겠습니다 🔍" |
| 5.0s | `move` | **all** → `meeting_room` | 전원 회의실로 이동 |
| 6.0s | `chat` | Nova | "타겟이 C-레벨인 만큼, 도입 사례(Use-case)와 ROI 극대화를 강조하는 다국어 웹 세미나(Webinar) 퍼널로 기획할게요." |
| 7.0s | `status` | Kai | **working** (0%) — `[INIT] B2B 리드 제너레이션 스키마 가동` |
| 8.0s | `chat` | Rex | "기존 다국어 마케팅 캠페인의 글로벌 전환율(CVR) 데이터 추출 및 LTV 회귀 분석 돌립니다." |
| 9.0s | `chat` | Mia | "영문 및 현지화(Localization) 메세징 가이드라인 세팅 대기 중입니다." |
| 10.0s | `status` | Mia | **waiting** — `글로벌 코어 메시징 대기 중` |

### 화면 상태
- 5초에 전원 회의실 이동 → OfficeScene에서 에이전트들이 회의 테이블로 모임
- Kai: working 시작 / Mia: waiting 상태 (리서치 결과 대기)
- Alex, Nova, Rex: 아직 idle

---

## Phase 2 — 병렬 작업

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `Phase 2 - 병렬 작업` |
| **지속 시간** | 30초 (30,000ms) |
| **목적** | 각자 데스크에서 병렬 작업 수행, 중간 이슈 발생 및 해결, 파일 전달 |

### 타임라인

| 시간 | 타입 | 에이전트 | 내용 |
|------|------|----------|------|
| 1.0s | `move` | **all** → `desk` | 전원 각자 데스크로 복귀 |
| 3.0s | `status` | Kai | **working** (30%) — `[FETCH] 글로벌 SaaS 경쟁사 인사이트 크롤링 중` |
| 3.0s | `status` | Nova | **working** (20%) — `엔터프라이즈 웹비나 퍼널 설계 중` |
| 3.0s | `status` | Rex | **working** (40%) — `국가별 LTV 베이스 리드(Lead) 스코어링` |
| 10.0s | `chat` | Kai | "⚠️ 유럽(GDPR) 지역 크롤링 중 API 차단 발생. 동적 프록시 할당 및 백오프 알고리즘 적용합니다." |
| 12.0s | `status` | Kai | **working** (50%) — `[WARN] EU 연결 풀 차단 -> IP 회전 및 백오프 재시도 전환` |
| 15.0s | `chat` | Kai | "해결했습니다. 북미/유럽 권역 엔터프라이즈 의사결정권자 핵심 페인포인트 추출 완료." |
| 16.0s | `status` | Kai | **working** (80%) — `[EXTRACT] B2B 권위자 리더십(Thought Leadership) 트렌드 분석` |
| 16.0s | `status` | Nova | **working** (50%) — `현지화 기반 메크로(Macro) 페르소나 설정` |
| 17.0s | `chat` | Rex | "아시아(APAC) 데이터 이상치 필터링 후 가중치 재조정 중. LTV 모델 적합 시뮬레이션 가동." |
| 18.0s | `status` | Rex | **working** (70%) — `초기 이탈률(Churn rate) 가중치 필터 연산 적용 중` |
| 22.0s | `status` | Kai | **done** (100%) — `[DONE] 글로벌 시장 페인트포인트 분석 완료` |
| 24.0s | `chat` | Kai | "분석 핵심: 'AI 도입에 따른 데이터 보안 우려'와 '인프라 마이그레이션 비용'. Mia에게 가이드 넘깁니다." |
| 25.0s | `file_transfer` | Kai → Mia | 📄 리서치 결과물 전달 |

### 화면 상태
- 1초에 전원 데스크 복귀 → 각자 자리에서 작업
- 3초에 Kai/Nova/Rex 동시 working 시작 (Mia는 여전히 waiting)
- **10초: 이슈 발생** — Kai의 GDPR 크롤링 API 차단 (⚠️ 경고 메시지)
- 15초: 이슈 해결
- 22초: Kai 작업 완료 (done)
- 25초: Kai → Mia 파일 전달 애니메이션 → Mia가 이제 작업 가능

### 드라마틱 포인트
- GDPR 이슈 발생 → 자체 해결 시나리오가 에이전트의 자율성을 보여주는 핵심 장면

---

## Phase 3 — 중간 싱크

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `Phase 3 - 중간 싱크` |
| **지속 시간** | 20초 (20,000ms) |
| **목적** | Mia 카피 작업 본격 수행, 나머지 에이전트 작업 완료, 중간 점검 |

### 타임라인

| 시간 | 타입 | 에이전트 | 내용 |
|------|------|----------|------|
| 2.0s | `chat` | Mia | "보안 이슈를 정면 돌파하죠. '국방급 암호화 기술이 적용된 유일한 SaaS' 톤앤매너 설정하여 영문 템플릿 생성합니다 ✍️" |
| 3.0s | `status` | Mia | **working** (20%) — `LLM 활용 로컬라이제이션 카피 베리에이션 200종 대량 병렬 생성` |
| 8.0s | `status` | Mia | **working** (80%) — `신경망 기계 번역(NMT) 이후 문화적 컨텍스트 컨펌 모델링` |
| 10.0s | `chat` | Alex | "순조롭네요. 다국어 카피 도출 시 CTA 퍼널 명확하게 조여주세요." |
| 12.0s | `chat` | Nova | "네, 웨비나 등록 페이지 이탈률 방어용 웰컴 이메일 시퀀스도 자동화 셋업했습니다." |
| 15.0s | `status` | Mia | **done** (100%) — `다국어 링크드인 Ad 카피 및 드립 이메일 본문 작성 완료` |
| 16.0s | `status` | Nova | **done** (100%) — `글로벌 B2B 웹 세미나 퍼널 아키텍처 완료` |
| 17.0s | `status` | Rex | **done** (100%) — `국가별 예상 예산 분배 비율 및 CAC/LTV 대시보드 스키마 완성` |

### 화면 상태
- Mia 본격 working 시작 (Kai로부터 리서치 결과 수령 후)
- Alex가 중간 점검 코멘트
- 15~17초에 걸쳐 Mia → Nova → Rex 순차적으로 done
- Phase 종료 시점: **Kai, Mia, Nova, Rex 모두 done** / Alex만 idle

---

## Phase 4 — 결과물 통합

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `Phase 4 - 결과물 통합` |
| **지속 시간** | 12초 (12,000ms) |
| **목적** | 모든 결과물을 Alex에게 전달, Alex가 최종 리포트 컴파일, 결과물 팝업 |

### 타임라인

| 시간 | 타입 | 에이전트 | 내용 |
|------|------|----------|------|
| 2.0s | `file_transfer` | Kai → Alex | 📄 리서치 리포트 전달 |
| 2.5s | `file_transfer` | Nova → Alex | 📄 퍼널 설계 전달 |
| 3.0s | `file_transfer` | Rex → Alex | 📄 분석 데이터 전달 |
| 3.5s | `file_transfer` | Mia → Alex | 📄 카피/현지화 전달 |
| 5.0s | `chat` | Alex | "좋습니다. 글로벌 엔터프라이즈 타겟 백서 및 전략 리포트로 최종 컴파일합니다." |
| 6.0s | `status` | Alex | **working** (50%) — `다국어 메타데이터 맵핑 및 PDF 리포트 렌더링 중` |
| 9.0s | `status` | Alex | **done** (100%) — `최종 마케팅 플랜 리포트 무결성 검증 창 팝업 완료` |
| 10.0s | `result_ready` | — | 🎉 **ResultPanel 팝업 트리거** (최종 마케팅 플랜 문서 표시) |

### 화면 상태
- 2~3.5초: 4명 → Alex 순차 파일 전달 애니메이션 (📄 이모지 이동)
- Alex가 working 시작 → 최종 통합
- 10초: **ResultPanel** 오버레이 등장 (confetti + 타이핑 애니메이션으로 마케팅 플랜 문서 표시)

---

## Phase 5 — 전략 컨펌 및 뷰어 팝업

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `Phase 5 - 전략 컨펌 및 뷰어 팝업` |
| **지속 시간** | 5초 (5,000ms) |
| **목적** | ResultPanel을 사용자가 확인하는 시간 (이벤트 없음) |

### 타임라인

> 이벤트 없음 — ResultPanel이 화면에 표시된 상태에서 사용자가 내용을 확인하는 구간

### 화면 상태
- ResultPanel 오버레이 유지
- 5초 후 자동으로 Phase 6으로 전환

---

## Phase 6 — 데이터베이스 및 SNS 자동 배포

| 항목 | 값 |
|------|-----|
| **Phase 이름** | `Phase 6 - 데이터베이스 및 SNS 자동 배포` |
| **지속 시간** | 10초 (10,000ms) |
| **목적** | CRM 연동 + SNS 배포 수행, 최종 완료 팝업 |

### 타임라인

| 시간 | 타입 | 에이전트 | 내용 |
|------|------|----------|------|
| 1.0s | `status` | Alex | **working** (20%) — `[DB] 글로벌 리드 캠페인 에셋 및 화이트페이퍼 클라우드 DB 인덱싱 중...` |
| 3.0s | `chat` | Alex | "사내 데이터베이스 및 영업팀 CRM 연동 자원 업로드 완료." |
| 4.0s | `status` | Alex | **working** (80%) — `[API] 다국어(영어, 일본어, 독어) B2B 타겟 광고 캠페인 매체 라이브 세팅 중...` |
| 6.0s | `chat` | Alex | "✅ 글로벌 리드 제너레이션 캠페인 전 채널(LinkedIn, Email, Webinar) 온에어 배포 수행 완료." |
| 8.0s | `publish_done` | — | 🎉 **FinalSnsPopup 트리거** (SNS 게시 완료 + 후속 액션 버튼) |

### 화면 상태
- Alex가 DB 업로드 및 SNS 배포 수행
- 8초: **FinalSnsPopup** 등장 — confetti + SNS 카드 목업
- 사용자에게 2가지 후속 액션 제공:
  - 🔄 "현재 캠페인 국가별 반복 자동화 스케일링" → 데모 반복
  - ✏️ "새로운 고난도 미션 주기" → 토픽 초기화 후 재시작

---

## 전체 타임라인 요약

| Phase | 이름 | 지속 시간 | 누적 시간 | 핵심 이벤트 |
|-------|------|-----------|-----------|-------------|
| 0 | 인트로 | 5s | 0:05 | Alex 인사, 토픽 입력 대기 |
| 1 | 킥오프 회의 | 15s | 0:20 | 미션 브리핑, 전원 회의실 이동, 역할 분담 |
| 2 | 병렬 작업 | 30s | 0:50 | 각자 데스크 작업, GDPR 이슈 발생/해결, Kai→Mia 파일 전달 |
| 3 | 중간 싱크 | 20s | 1:10 | Mia 카피 작업, 중간 점검, 전원 done |
| 4 | 결과물 통합 | 12s | 1:22 | 4명→Alex 파일 전달, 최종 컴파일, ResultPanel 팝업 |
| 5 | 전략 컨펌 | 5s | 1:27 | 결과물 확인 시간 (이벤트 없음) |
| 6 | DB/SNS 배포 | 10s | 1:37 | CRM 연동, SNS 배포, FinalSnsPopup 완료 |

**총 데모 소요 시간: 약 1분 37초**

---

## 에이전트별 상태 흐름

### Alex (Orchestrator)
```
Phase 0: idle
Phase 1: idle (브리핑만 수행)
Phase 2: idle
Phase 3: idle (중간 점검 코멘트)
Phase 4: idle → working(50%) → done(100%)
Phase 5: (대기)
Phase 6: working(20%) → working(80%) → publish_done
```

### Kai (Researcher)
```
Phase 1: idle → working(0%)
Phase 2: working(30%) → working(50%) [⚠️ GDPR 이슈] → working(80%) → done(100%) → Mia에게 파일 전달
Phase 3: done (대기)
Phase 4: Alex에게 파일 전달
```

### Mia (Writer)
```
Phase 1: idle → waiting (리서치 결과 대기)
Phase 2: waiting (Kai 결과 수령 후)
Phase 3: working(20%) → working(80%) → done(100%)
Phase 4: Alex에게 파일 전달
```

### Nova (Planner)
```
Phase 1: idle
Phase 2: working(20%) → working(50%)
Phase 3: done(100%)
Phase 4: Alex에게 파일 전달
```

### Rex (Analyst)
```
Phase 1: idle
Phase 2: working(40%) → working(70%)
Phase 3: done(100%)
Phase 4: Alex에게 파일 전달
```

---

## 수정 가이드

### 이벤트 추가/수정 시 참고사항
1. `t` 값은 **해당 Phase 시작 시점 기준** 밀리초 (Phase 전체 기준이 아님)
2. `t` 값이 `duration`을 초과하면 해당 이벤트는 실행되지 않고 다음 Phase로 넘어감
3. 같은 `t` 값에 여러 이벤트를 배치할 수 있음 (동시 실행)
4. `move` 이벤트의 `agent: 'all'`은 5명 전원 이동
5. `status` 이벤트에서 `progress`를 생략하면 이전 값 유지
6. `file_transfer`는 OfficeScene에서 📄 이모지 애니메이션으로 표시됨

### 새 Phase 추가 시
- `id`는 순차적으로 부여 (기존 Phase 사이에 삽입 시 모든 id 재정렬 필요)
- `duration`은 밀리초 단위
- `useDemoEngine.ts`에서 Phase 전환 로직 확인 필요 (특히 Phase 5의 ResultPanel, Phase 6의 publish_done 트리거)
