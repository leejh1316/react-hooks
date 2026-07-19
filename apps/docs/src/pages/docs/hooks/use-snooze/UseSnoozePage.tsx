import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";
import { Document } from "@src/components/ui/Document";
import { SnoozeSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useSnooze Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (배너 스누즈 대표 데모 + 코드 스니펫)
   4. 옵션 활용        → OptionsSection (duration / storageType / autoReactivate 데모 + 플레이그라운드)
   5. API 명세         → ApiSection (시그니처 + Options / Returns)
   6. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseSnoozePage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>
      <BreakableCamelCase text="useSnooze" />
    </Document.Title>
    <Document.Description mb={10}>
      useSnooze는 "오늘 하루 보지 않기", "일주일간 숨기기" 같은 스누즈(Snooze) 기능을 웹 스토리지(localStorage / sessionStorage) 기반으로
      구현하는 React 훅이에요. 만료 시각을 스토리지에 저장해 새로고침해도 숨김 상태가 유지되므로, 팝업·배너·툴팁처럼 사용자가 일정 기간
      숨길 수 있어야 하는 UI를 만들 때 유용하게 사용할 수 있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <SnoozeSections.OverviewSection />
    <SnoozeSections.InstallSection />
    <SnoozeSections.UsageSection />
    <SnoozeSections.OptionsSection />
    <SnoozeSections.ApiSection />
    <SnoozeSections.SkillSection />
  </Document.Root>
);

export default UseSnoozePage;
