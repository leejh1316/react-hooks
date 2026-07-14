import { Document } from "@src/components/ui/Document";
import { DeferredLoadingSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useDeferredLoading Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/적용 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseDeferredLoadingPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useDeferredLoading</Document.Title>
    <Document.Description mb={10}>
      useDeferredLoading은 로딩이 지정한 지연 시간 이상 지속될 때만 로딩 상태를 표시하고, 한 번 표시된 로딩 상태는 최소 표시 시간 동안
      유지되도록 보장하는 React 훅이에요. 빠르게 끝나는 요청에서 스피너가 순간 나타났다 사라지며 화면이 깜빡이는 현상을 방지할 때 유용하게
      사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <DeferredLoadingSections.OverviewSection />
    <DeferredLoadingSections.InstallSection />
    <DeferredLoadingSections.UsageSection />
    <DeferredLoadingSections.ApiSection />
    <DeferredLoadingSections.SkillSection />
  </Document.Root>
);

export default UseDeferredLoadingPage;
