import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
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
    <Document.Title mb={3}>
      <BreakableCamelCase text="useDebounce" />
    </Document.Title>
    <Document.Description mb={10}>
      useDebounce는 마지막 호출 이후 지정된 시간 동안 추가 호출이 없을 때만 함수가 실행되도록 디바운싱하는 React 훅이에요. 검색어
      자동완성, 입력 값 저장, API 연속 호출 방지처럼 이벤트가 멈춘 뒤 한 번만 실행해야 하는 상황에서 유용하게 사용할 수 있어요.
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
