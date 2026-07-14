import { Document } from "@src/components/ui/Document";
import { PaginationSections } from "./components/sections";

/* ──────────────────────────────────────────────
   usePagination Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (기본 / 옵션 조정 플레이그라운드 데모 + 건너뛰기·제어 모드 코드 스니펫)
   4. API 명세         → ApiSection (시그니처 + Parameters / Returns)
   5. API — 타입       → TypesSection (PaginationItem, UsePaginationProps)
   6. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UsePaginationPage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>usePagination</Document.Title>
    <Document.Description mb={10}>
      usePagination은 페이지네이션 UI 구축에 필요한 모든 로직을 제공하는 headless React 훅이에요. siblings / boundaries 설정 기반의 페이지
      범위 계산과 생략 기호(ellipsis) 자동 삽입, 이전·다음·건너뛰기 내비게이션을 제공하고 제어 / 비제어 모드를 모두 지원하므로, 어떤
      디자인의 페이지네이션이든 자유롭게 만들 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <PaginationSections.OverviewSection />
    <PaginationSections.InstallSection />
    <PaginationSections.UsageSection />
    <PaginationSections.ApiSection />
    <PaginationSections.TypesSection />
    <PaginationSections.SkillSection />
  </Document.Root>
);

export default UsePaginationPage;
