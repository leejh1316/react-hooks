import { Document } from "@src/components/ui/Document";
import { ControllableStateSections } from "./components/sections";

/* ──────────────────────────────────────────────
   useControllableState Documentation Page
   ──────────────────────────────────────────────
   1. 훅의 설명        → OverviewSection
   2. 설치 방법 (npm)  → InstallSection
   3. 데모 & 사용 방법 → UsageSection (미적용/비제어/제어 비교 데모 + 코드 스니펫)
   4. API 명세         → ApiSection
   5. Agent Skill      → SkillSection (SKILL.md 복사 가능 스니펫)
   ────────────────────────────────────────────── */

const UseControllableStatePage = () => (
  <Document.Root>
    {/* ─── Page Header ─── */}
    <Document.Title mb={3}>useControllableState</Document.Title>
    <Document.Description mb={10}>
      useControllableState는 하나의 컴포넌트가 제어(controlled) 모드와 비제어(uncontrolled) 모드를 모두 지원하도록 상태를 관리해 주는 React
      훅이에요. value / defaultValue / onChange props를 받는 재사용 컴포넌트를 만들 때, useState를 쓰듯 간단하게 두 모드를 동시에 지원할 수
      있어요.
    </Document.Description>
    <Document.Divider />

    {/* ─── Sections ─── */}
    <ControllableStateSections.OverviewSection />
    <ControllableStateSections.InstallSection />
    <ControllableStateSections.UsageSection />
    <ControllableStateSections.ApiSection />
    <ControllableStateSections.SkillSection />
  </Document.Root>
);

export default UseControllableStatePage;
