import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { PrevRefSections } from "./components/sections";

/* ──────────────────────────────────────────────
   usePrevRef Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 읽는 시점 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection (시그니처 / Parameters / Returns / 옵션 / 주의사항)
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UsePrevRefPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="usePrevRef" />
    </Document.Title>
    <Document.Description mb={10}>
      usePrevRef는 직전 렌더링 사이클의 값을 ref에 담아 두는 React 훅이에요. 값이 어떻게 바뀌었는지 알아야 하는 로직에서 현재 값과 이전 값을
      비교할 때 유용하며, 이벤트 핸들러나 useEffect처럼 커밋 이후에 읽으면 정확한 1단계 이전 값을 얻을 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <PrevRefSections.OverviewSection />
    <PrevRefSections.InstallSection />
    <PrevRefSections.UsageSection />
    <PrevRefSections.ApiSection />
    <PrevRefSections.SkillSection />
  </Document.Root>
);

export default UsePrevRefPage;
