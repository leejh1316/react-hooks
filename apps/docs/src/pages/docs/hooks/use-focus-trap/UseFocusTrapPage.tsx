import { DocsPagination } from "@src/components/docs";
import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { FocusTrapSections } from "./components/sections";

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
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useFocusTrap" />
    </Document.Title>
    <Document.Description mb={10}>
      useFocusTrap은 특정 컨테이너 안에 키보드 포커스를 가두어 Tab / Shift+Tab 포커스가 컨테이너 내부에서 순환하도록 하는 React 훅이에요.
      모달, 다이얼로그, 드로어처럼 포커스가 밖으로 벗어나면 안 되는 UI를 만들 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <FocusTrapSections.OverviewSection />
    <FocusTrapSections.InstallSection />
    <FocusTrapSections.UsageSection />
    <FocusTrapSections.ApiSection />
    <FocusTrapSections.SkillSection />
  </Document.Root>
);

export default UseFocusTrapPage;
