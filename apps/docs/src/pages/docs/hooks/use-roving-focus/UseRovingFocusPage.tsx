import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { RovingFocusSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useRovingFocus Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫)
   4. 옵션 활용        → OptionsSection (colSkipCount / clickOnNavigate / scrollIntoView / 경계 콜백 데모 + 플레이그라운드)
   5. API 명세         → ApiSection (시그니처 + Options / Returns / Types)
   6. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseRovingFocusPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useRovingFocus" />
    </Document.Title>
    <Document.Description mb={10}>
      useRovingFocus는 WAI-ARIA roving tabindex 패턴으로 키보드 내비게이션을 구현하는 React 훅이에요. 그룹 전체가 하나의 Tab 스톱이 되고
      내부 이동은 방향키·Home·End로 하므로, 메뉴·탭·툴바·그리드·리스트박스처럼 여러 항목으로 이루어진 위젯의 키보드 접근성을 만들 때
      유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <RovingFocusSections.OverviewSection />
    <RovingFocusSections.InstallSection />
    <RovingFocusSections.UsageSection />
    <RovingFocusSections.OptionsSection />
    <RovingFocusSections.ApiSection />
    <RovingFocusSections.SkillSection />
  </Document.Root>
);

export default UseRovingFocusPage;
