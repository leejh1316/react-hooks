import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import AutoReactivateDemo, { AUTO_REACTIVATE_DEMO_CODE } from "../demos/AutoReactivateDemo";
import OptionsPlaygroundDemo, { OPTIONS_PLAYGROUND_DEMO_CODE } from "../demos/OptionsPlaygroundDemo";
import StorageTypeDemo, { STORAGE_TYPE_DEMO_CODE } from "../demos/StorageTypeDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const OptionsSection = () => {
  return (
    <section>
      <Document.Heading1>옵션 활용</Document.Heading1>
      <Document.Paragraph mb={8}>
        <InlineCode>duration</InlineCode>으로 숨김 기간을, <InlineCode>storageType</InlineCode>으로 유지 범위를,{" "}
        <InlineCode>autoReactivate</InlineCode>로 만료 시 복귀 방식을 제어할 수 있어요. 각 옵션을 데모와 함께 살펴보고, 마지막
        플레이그라운드에서 모든 옵션을 직접 바꿔가며 확인해 보세요.
      </Document.Paragraph>

      {/* duration — 숨김 기간 */}
      <Document.Heading2>
        <InlineCode>duration</InlineCode> — 숨김 기간 설정
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>"day"</InlineCode>를 넘기면 24시간으로 자동 변환되고, 숫자를 넘기면 밀리초(ms) 단위로 해석돼요. 일주일, 한 시간처럼
        임의의 기간은 밀리초로 계산해 넘기면 돼요.
      </Document.Paragraph>
      <CodeBlock code={DURATION_CODE} className="mb-8" />

      {/* storageType — 유지 범위 */}
      <Document.Heading2>
        <InlineCode>storageType</InlineCode> — 스누즈 유지 범위
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        기본값 <InlineCode>"local"</InlineCode>은 localStorage에 저장되어 브라우저를 닫았다 열어도 유지되고,{" "}
        <InlineCode>"session"</InlineCode>은 sessionStorage에 저장되어 현재 탭에서만 유지돼요. "오늘 하루 보지 않기"처럼 재방문에도
        유지되어야 하면 <InlineCode>"local"</InlineCode>을, "이번 방문 동안만 숨기기"면 <InlineCode>"session"</InlineCode>을 사용하세요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <StorageTypeDemo />
      </PreviewContainer>
      <CodeBlock code={STORAGE_TYPE_DEMO_CODE} className="mb-8" />

      {/* autoReactivate — 자동 재활성화 */}
      <Document.Heading2>
        <InlineCode>autoReactivate</InlineCode> — 만료 시 자동 재활성화
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        기본 동작은 스토리지를 읽는 시점(마운트)에만 만료를 검사하므로, 페이지에 머무는 동안에는 만료가 지나도 요소가 다시 나타나지 않아요.{" "}
        <InlineCode>autoReactivate</InlineCode>를 켜면 만료 시각에 맞춰 타이머를 걸어, 새로고침 없이도 만료 즉시{" "}
        <InlineCode>isActive</InlineCode>가 자동으로 <InlineCode>true</InlineCode>로 돌아와요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <AutoReactivateDemo />
      </PreviewContainer>
      <CodeBlock code={AUTO_REACTIVATE_DEMO_CODE} className="mb-8" />

      {/* 플레이그라운드 */}
      <Document.Heading2>플레이그라운드</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>duration</InlineCode>, <InlineCode>storageType</InlineCode>, <InlineCode>autoReactivate</InlineCode>를 실시간으로
        바꿔가며 스누즈 동작을 확인해 보세요. 스누즈된 동안에는 스토리지에 저장된 만료 시각까지 남은 시간이 표시돼요. 초기 상태는 마운트
        시점에 스토리지를 읽어 결정되므로, 옵션을 바꾸면 데모가 재마운트되어 스토리지를 다시 읽어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <OptionsPlaygroundDemo />
      </PreviewContainer>
      <CodeBlock code={OPTIONS_PLAYGROUND_DEMO_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const DURATION_CODE = `// "day" — 24시간(86,400,000ms)으로 자동 변환돼요.
const [isActive, snooze] = useSnooze({ key: "daily-banner", duration: "day" });

// 숫자 — 밀리초(ms) 단위로 해석돼요.
const ONE_HOUR = 1000 * 60 * 60;
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

useSnooze({ key: "hourly-tooltip", duration: ONE_HOUR }); // 1시간 동안 숨기기
useSnooze({ key: "weekly-popup", duration: ONE_WEEK }); // 일주일 동안 숨기기`;

export default OptionsSection;
