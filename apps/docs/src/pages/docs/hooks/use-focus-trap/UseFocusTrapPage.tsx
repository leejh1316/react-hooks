import { DocsPagination } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import ApiSection from "./components/sections/ApiSection";
import InstallSection from "./components/sections/InstallSection";
import OverviewSection from "./components/sections/OverviewSection";
import SkillSection from "./components/sections/SkillSection";
import UsageSection from "./components/sections/UsageSection";

/* ──────────────────────────────────────────────
   useFocusTrap Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseFocusTrapPage = () => (
  <Document.Root className="pb-20">
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useFocusTrap</Document.Title>
    <Document.Description mb={10}>
      모달, 다이얼로그, 드로어처럼 특정 컨테이너 안에 키보드 포커스를 가두어 Tab / Shift+Tab 포커스가 컨테이너 내부에서 순환하도록 하는
      React 훅입니다.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <OverviewSection />
    <InstallSection />
    <UsageSection />
    <ApiSection />
    <SkillSection />
    <DocsPagination />
  </Document.Root>
);

export default UseFocusTrapPage;
