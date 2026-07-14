import { Document } from "@src/components/ui/Document";
import { BrowserStoragePageSections } from "./components/sections";
import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";

/* ──────────────────────────────────────────────
   useBrowserStorage Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (localStorage / TTL / sessionStorage / serializer 미적용·적용 데모 + 코드 스니펫)
   4. API — 훅         → HooksApiSection (훅 4종 시그니처 + Options / Returns)
   5. API — 유틸리티   → UtilsApiSection (browserStorage / ttl / serializer)
   6. API — 타입       → TypesSection (StorageResult, StorageError 등)
   7. Agent Skill      → SkillSection (SKILL.md + references 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseBrowserStoragePage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useBrowserStorage" />
    </Document.Title>
    <Document.Description mb={10}>
      useBrowserStorage는 브라우저 스토리지(localStorage / sessionStorage)를 React 상태처럼 사용할 수 있게 해주는 훅 모음이에요. TTL 자동
      만료, 커스텀 직렬화, 같은 탭 안 컴포넌트 간 동기화와 크로스탭 동기화를 지원하고 SSR·Private 모드에서도 안전하게 동작하므로, 새로고침
      후에도 유지되어야 하는 상태를 다룰 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <BrowserStoragePageSections.OverviewSection />
    <BrowserStoragePageSections.InstallSection />
    <BrowserStoragePageSections.UsageSection />
    <BrowserStoragePageSections.HooksApiSection />
    <BrowserStoragePageSections.UtilsApiSection />
    <BrowserStoragePageSections.TypesSection />
    <BrowserStoragePageSections.SkillSection />
  </Document.Root>
);

export default UseBrowserStoragePage;
