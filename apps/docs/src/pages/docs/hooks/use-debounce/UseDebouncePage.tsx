import { Document } from "@src/components/ui/Document";
import { DebouncePageSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useDebounce Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseDebouncePage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useDebounce</Document.Title>
    <Document.Description mb={10}>
      함수 호출을 디바운싱하여 마지막 호출 이후 지정된 시간 동안 추가 호출이 없을 때만 실행되도록 하는 React 훅입니다. 검색어 자동완성,
      입력 값 저장, API 연속 호출 방지 등 이벤트가 멈춘 뒤 한 번만 실행해야 하는 상황의 성능 최적화에 유용합니다.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <DebouncePageSections.OverviewSection />
    <DebouncePageSections.InstallSection />
    <DebouncePageSections.UsageSection />
    <DebouncePageSections.ApiSection />
    <DebouncePageSections.SkillSection />
  </Document.Root>
);

export default UseDebouncePage;
