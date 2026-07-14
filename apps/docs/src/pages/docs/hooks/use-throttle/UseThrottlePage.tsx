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
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useThrottle</Document.Title>
    <Document.Description mb={10}>
      useThrottle은 지정된 시간당 최대 한 번만 함수가 실행되도록 스로틀링하는 React 훅이에요. 스크롤, 윈도우 리사이징, 빈번한 버튼
      클릭처럼 자주 발생하는 이벤트의 성능을 최적화할 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <ThrottlePageSections.OverviewSection />
    <ThrottlePageSections.InstallSection />
    <ThrottlePageSections.UsageSection />
    <ThrottlePageSections.ApiSection />
    <ThrottlePageSections.SkillSection />
  </Document.Root>
);

export default UseThrottlePage;
