import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import BannerSnoozeDemo, { BANNER_SNOOZE_DEMO_CODE } from "../demos/BannerSnoozeDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        훅에 <InlineCode>key</InlineCode>와 <InlineCode>duration</InlineCode>을 넘기면 노출 여부 <InlineCode>isActive</InlineCode>와 숨김
        함수 <InlineCode>snooze</InlineCode>를 튜플로 돌려줘요. <InlineCode>isActive</InlineCode>가 <InlineCode>false</InlineCode>일 때
        요소를 렌더링하지 않도록 하고, "보지 않기" 버튼에 <InlineCode>snooze</InlineCode>를 연결하는 것만으로 스누즈 기능이 완성돼요.
      </Document.Paragraph>

      {/* 대표 데모 */}
      <Document.Heading2>배너에 "보지 않기" 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        데모에서는 확인하기 쉽도록 <InlineCode>duration</InlineCode>을 10초로 설정했어요. "10초 동안 보지 않기"를 누르면 배너가 사라지고,
        페이지를 새로고침해도 10초가 지나기 전까지는 숨김 상태가 유지돼요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <BannerSnoozeDemo />
      </PreviewContainer>
      <CodeBlock code={BANNER_SNOOZE_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>하루 동안 보지 않기</Document.Heading2>
      <Document.Paragraph mb={6}>
        실전에서 가장 흔한 형태예요. <InlineCode>duration</InlineCode>에 <InlineCode>"day"</InlineCode>를 넘기면 24시간으로 자동 설정되므로,
        "오늘 하루 보지 않기" 기능을 숫자 계산 없이 바로 구현할 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 만료 검사 시점 */}
      <Document.Heading2>만료 검사 시점 이해하기</Document.Heading2>
      <Document.Paragraph>
        만료 여부는 컴포넌트가 마운트되어 스토리지를 읽는 시점에 검사돼요. 그래서 페이지를 새로고침하거나 다시 방문하면 만료된 스누즈가
        자동으로 풀리지만, 페이지에 머무는 동안에는 만료 시각이 지나도 요소가 저절로 나타나지 않아요. 머무는 동안에도 만료 즉시 다시
        보여주고 싶다면 <InlineCode>autoReactivate</InlineCode> 옵션을 켜세요. 자세한 내용은 아래 옵션 활용 섹션에서 다뤄요.
      </Document.Paragraph>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useSnooze } from "@leejaehyeok/use-snooze";

function NoticePopup() {
  const [isActive, snooze] = useSnooze({
    key: "notice-popup", // 만료 시각을 저장할 스토리지 key
    duration: "day", // "day"(24시간) 또는 ms 단위 숫자
  });

  if (!isActive) return null;

  return (
    <div role="dialog">
      <p>공지사항입니다.</p>
      <button onClick={snooze}>오늘 하루 보지 않기</button>
    </div>
  );
}`;

export default UsageSection;
