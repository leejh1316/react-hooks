import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { CustomEventStateSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useCustomEventState Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseCustomEventStatePage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useCustomEventState" />
    </Document.Title>
    <Document.Description mb={10}>
      useCustomEventState는 브라우저의 CustomEvent API를 이용해 같은 key를 사용하는 여러 컴포넌트의 상태를 동기화하는 React 훅이에요.
      useState와 동일한 형태로 사용하면서 Provider나 prop drilling 없이 컴포넌트 트리의 위치와 무관하게 상태를 공유할 수 있어, 멀리
      떨어진 컴포넌트 간 가벼운 전역 상태가 필요할 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <CustomEventStateSections.OverviewSection />
    <CustomEventStateSections.InstallSection />
    <CustomEventStateSections.UsageSection />
    <CustomEventStateSections.ApiSection />
    <CustomEventStateSections.SkillSection />
  </Document.Root>
);

export default UseCustomEventStatePage;
