import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { ComposeStateSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useComposedState Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 직접 값·함수형 업데이트 데모 + 코드 스니펫)
   4. API 명세         → ApiSection (시그니처 / Parameters / Returns / 옵션 / 주의사항)
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseComposeStatePage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useComposedState" />
    </Document.Title>
    <Document.Description mb={10}>
      useComposedState는 여러 개의 state setter를 하나의 setter로 합성해, 한 번의 호출로 모든 상태를 함께 갱신하게 해주는 React 훅이에요.
      부모가 소유한 제어 상태와 컴포넌트 내부 상태처럼 하나로 합칠 수 없는 상태들을 항상 같은 값으로 유지해야 할 때 유용하게 사용할 수
      있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <ComposeStateSections.OverviewSection />
    <ComposeStateSections.InstallSection />
    <ComposeStateSections.UsageSection />
    <ComposeStateSections.ApiSection />
    <ComposeStateSections.SkillSection />
  </Document.Root>
);

export default UseComposeStatePage;
