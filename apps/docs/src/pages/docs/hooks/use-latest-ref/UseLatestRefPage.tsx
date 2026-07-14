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
      전달된 최신 값을 항상 담고 있는 ref 객체를 반환하는 React 훅입니다. useEffect나 useCallback의 의존성 배열에 값을 넣지 않고도 콜백
      안에서 항상 최신 값에 접근할 수 있어, stale closure와 불필요한 재실행·재생성을 함께 방지합니다.
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
