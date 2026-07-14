import { Document } from "@src/components/ui/Document";
import { IntersectionObserverSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useIntersectionObserver Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (가시성 추적 / once+reset 데모 + 코드 스니펫)
   4. API 명세         → ApiSection (Options / Returns)
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseIntersectionObserverPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useIntersectionObserver</Document.Title>
    <Document.Description mb={10}>
      useIntersectionObserver는 IntersectionObserver API를 React 훅으로 감싸 요소의 뷰포트 진입·이탈을 감지하는 훅이에요. 컨테이너에
      callback ref 하나만 연결하면 내부 타깃의 가시성 상태(isVisible, hasEntered)와 진입/이탈 콜백을 제공하므로, 스크롤 애니메이션 트리거,
      무한 스크롤, lazy loading, 요소 노출 추적 등에 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <IntersectionObserverSections.OverviewSection />
    <IntersectionObserverSections.InstallSection />
    <IntersectionObserverSections.UsageSection />
    <IntersectionObserverSections.ApiSection />
    <IntersectionObserverSections.SkillSection />
  </Document.Root>
);

export default UseIntersectionObserverPage;
