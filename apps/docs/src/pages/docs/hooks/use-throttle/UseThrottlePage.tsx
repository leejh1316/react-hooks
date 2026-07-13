import { DocsPagination } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { ThrottlePageSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useThrottle Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseThrottlePage = () => (
  <Document.Root className="pb-20">
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useThrottle</Document.Title>
    <Document.Description mb={10}>
      함수 호출을 스로틀링하여 지정된 시간당 최대 한 번만 실행되도록 하는 React 훅입니다. 스크롤, 윈도우 리사이징, 빈번한 버튼 클릭 등 자주
      발생하는 이벤트의 성능 최적화에 유용합니다.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <ThrottlePageSections.OverviewSection />
    <ThrottlePageSections.InstallSection />
    <ThrottlePageSections.UsageSection />
    <ThrottlePageSections.ApiSection />
    <ThrottlePageSections.SkillSection />
    <DocsPagination />
  </Document.Root>
);

export default UseThrottlePage;
