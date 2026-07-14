import { Document } from "@src/components/ui/Document";
import { IntersectionObserverGroupSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useIntersectionObserverGroup Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (스크롤 스파이 / 동적 리스트 데모 + 코드 스니펫)
   4. API 명세         → ApiSection (Options / Returns / TargetState)
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseIntersectionObserverGroupPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useIntersectionObserverGroup</Document.Title>
    <Document.Description mb={10}>
      useIntersectionObserverGroup은 컨테이너 하나를 기준으로 그 안의 여러 자식 요소의 뷰포트 진입·이탈을 키(key) 기반으로 한꺼번에
      추적하는 훅이에요. 내부적으로 IntersectionObserver와 MutationObserver를 조합해 동적으로 추가/제거되는 요소도 자동으로 감시하므로,
      스크롤 스파이, 리스트 아이템 진입 애니메이션, 요소별 노출 트래킹 등에 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <IntersectionObserverGroupSections.OverviewSection />
    <IntersectionObserverGroupSections.InstallSection />
    <IntersectionObserverGroupSections.UsageSection />
    <IntersectionObserverGroupSections.ApiSection />
    <IntersectionObserverGroupSections.SkillSection />
  </Document.Root>
);

export default UseIntersectionObserverGroupPage;
