import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { ComposeRefPageSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useComposedRefs Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (ref 병합 / forwardRef 데모 + React 19 cleanup 코드 스니펫)
   4. API 명세         → ApiSection (useComposedRefs / composeRefs / setRef)
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseComposeRefPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useComposedRefs" />
    </Document.Title>
    <Document.Description mb={10}>
      useComposedRefs는 여러 개의 ref를 하나의 callback ref로 병합해 하나의 엘리먼트에 동시에 연결할 수 있게 해주는 React 훅이에요. 객체형,
      함수형 등 모든 ref 유형을 지원하고 React 19의 callback ref cleanup도 자동으로 처리하므로, forwardRef로 전달받은 외부 ref와 컴포넌트
      내부 ref를 함께 사용해야 할 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <ComposeRefPageSections.OverviewSection />
    <ComposeRefPageSections.InstallSection />
    <ComposeRefPageSections.UsageSection />
    <ComposeRefPageSections.ApiSection />
    <ComposeRefPageSections.SkillSection />
  </Document.Root>
);

export default UseComposeRefPage;
