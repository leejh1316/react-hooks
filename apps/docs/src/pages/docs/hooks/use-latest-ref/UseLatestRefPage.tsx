import { Document } from "@src/components/ui/Document";
import { LatestRefPageSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useLatestRef Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫 + 활용 패턴)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseLatestRefPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useLatestRef</Document.Title>
    <Document.Description mb={10}>
      useLatestRef는 전달된 값의 최신 상태를 항상 담고 있는 ref 객체를 반환하는 React 훅이에요. useEffect나 useCallback의 의존성 배열에
      값을 넣지 않고도 콜백 안에서 항상 최신 값에 접근하고 싶을 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <LatestRefPageSections.OverviewSection />
    <LatestRefPageSections.InstallSection />
    <LatestRefPageSections.UsageSection />
    <LatestRefPageSections.ApiSection />
    <LatestRefPageSections.SkillSection />
  </Document.Root>
);

export default UseLatestRefPage;
