import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import LatestRefDemo, { LATEST_REF_DEMO_CODE } from "../demos/LatestRefDemo";
import NoLatestRefDemo from "../demos/NoLatestRefDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        useLatestRef 적용 전후의 차이를 직접 비교해 보세요. 두 데모 모두 마운트 시 한 번만 생성되는 1초 인터벌이 count를 읽어요. 미적용
        데모는 인터벌이 클로저에 캡처된 초기 값(0)만 계속 읽지만, 적용 데모는 인터벌을 다시 만들지 않고도 항상 최신 count를 읽어요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>useLatestRef 없이 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        useLatestRef를 사용하지 않았을 때의 동작을 보여주는 예시예요. <InlineCode>count +1</InlineCode> 버튼을 눌러 보세요. 인터벌 콜백은
        마운트 시점의 <InlineCode>count</InlineCode>를 클로저로 캡처했기 때문에 count가 아무리 커져도 "인터벌이 읽은 값"은 0에 머물러요.
        전형적인 stale closure 문제예요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoLatestRefDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>useLatestRef 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 인터벌을 useLatestRef로 해결한 예시예요. 콜백이 <InlineCode>latestCountRef.current</InlineCode>를 읽기 때문에 의존성 배열은
        그대로 비어 있어 인터벌이 다시 생성되지 않는데도, "인터벌이 읽은 값"이 항상 최신 count를 따라가요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <LatestRefDemo />
      </PreviewContainer>
      <CodeBlock code={LATEST_REF_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>최신 값 참조하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 최신으로 유지하고 싶은 값을 인자로 전달하면 <InlineCode>ref</InlineCode> 객체를 반환하고, 렌더링 이후
        실행되는 콜백(타이머, 이벤트 핸들러, 비동기 작업 등)에서 <InlineCode>ref.current</InlineCode>로 읽으면 돼요. 값이 바뀔 때마다 ref가
        자동으로 갱신되므로 의존성 배열에 원본 값을 넣지 않아도 돼요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* props 콜백 안정화 패턴 */}
      <Document.Heading2>props 콜백 안정화하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        부모가 렌더링될 때마다 새로 생성되는 props 콜백을 <InlineCode>useLatestRef</InlineCode>에 보관하고, 이를 호출하는 래퍼를{" "}
        <InlineCode>useCallback</InlineCode> + 빈 의존성 배열로 감싸면 참조가 안정적인 콜백을 만들 수 있어요. 래퍼의 참조가 바뀌지 않으므로{" "}
        <InlineCode>memo</InlineCode>로 감싼 자식 컴포넌트가 재렌더링되지 않으면서도, 실행 시에는 항상 최신 콜백이 호출돼요.
      </Document.Paragraph>
      <CodeBlock code={PROP_CALLBACK_CODE} className="mb-8" />

      {/* 이벤트 리스너 패턴 */}
      <Document.Heading2>이벤트 리스너와 함께 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        상태가 바뀔 때마다 리스너를 제거하고 다시 등록하는 대신, 리스너는 마운트 시 한 번만 등록하고 내부에서{" "}
        <InlineCode>ref.current</InlineCode>를 읽으면 등록·해제 비용 없이 항상 최신 상태를 참조할 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={EVENT_LISTENER_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useEffect, useState } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

function AutoSave() {
  const [draft, setDraft] = useState("");
  const latestDraftRef = useLatestRef(draft);

  useEffect(() => {
    // 5초마다 자동 저장 — draft가 바뀌어도 인터벌은 다시 만들지 않아요.
    const id = setInterval(() => saveDraft(latestDraftRef.current), 5000);
    return () => clearInterval(id);
  }, []);

  return <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />;
}`;

const PROP_CALLBACK_CODE = `import { memo, useCallback } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

const Child = memo(({ onAction }: { onAction: () => void }) => {
  // onAction의 참조가 안정적이므로 부모가 렌더링돼도 재렌더링되지 않아요.
  return <button onClick={onAction}>실행</button>;
});

function Parent({ onAction }: { onAction: () => void }) {
  const latestOnActionRef = useLatestRef(onAction);

  // 의존성 배열이 비어 있어 참조가 바뀌지 않지만, 실행 시에는 항상 최신 onAction이 호출돼요.
  const stableOnAction = useCallback(() => {
    latestOnActionRef.current();
  }, []);

  return <Child onAction={stableOnAction} />;
}`;

const EVENT_LISTENER_CODE = `import { useEffect, useState } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

function ShortcutHandler() {
  const [enabled, setEnabled] = useState(true);
  const latestEnabledRef = useLatestRef(enabled);

  useEffect(() => {
    // 리스너는 한 번만 등록하고, 실행 시점에 최신 enabled를 읽어요.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!latestEnabledRef.current) return;
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <button onClick={() => setEnabled((prev) => !prev)}>단축키 {enabled ? "끄기" : "켜기"}</button>;
}`;

export default UsageSection;
