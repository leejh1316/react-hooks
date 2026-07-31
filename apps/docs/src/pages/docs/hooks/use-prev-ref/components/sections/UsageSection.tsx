import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import NoPrevRefDemo, { NO_PREV_REF_DEMO_CODE } from "../demos/NoPrevRefDemo";
import PrevRefDemo, { PREV_REF_DEMO_CODE } from "../demos/PrevRefDemo";
import ReadTimingDemo, { READ_TIMING_DEMO_CODE } from "../demos/ReadTimingDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        추적하고 싶은 값을 <InlineCode>usePrevRef</InlineCode>에 전달하고, 이벤트 핸들러나 <InlineCode>useEffect</InlineCode>에서{" "}
        <InlineCode>prevRef.current</InlineCode>를 읽으면 돼요. 아래 두 데모는 요금제를 고른 뒤 "직전 선택으로 되돌리기"를 제공하는 같은
        화면을, 훅 미적용과 적용으로 각각 구현한 예시예요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>이전 값 없이 되돌리기</Document.Heading2>
      <Document.Paragraph mb={6}>
        훅을 적용하지 않았을 때의 동작을 보여주는 예시예요. 현재 선택만 상태로 들고 있어서 직전 선택이 무엇이었는지 알 수 없고, 되돌리기는
        기본값인 <InlineCode>Basic</InlineCode>으로만 이동해요. 요금제를 <InlineCode>Pro</InlineCode> →<InlineCode> Max</InlineCode> 순으로
        고른 뒤 되돌리기를 눌러 보세요. <InlineCode>Pro</InlineCode>가 아니라 <InlineCode>Basic</InlineCode>으로 돌아가요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <NoPrevRefDemo />
      </PreviewContainer>
      <CodeBlock code={NO_PREV_REF_DEMO_CODE} className="mb-8" />

      {/* 적용 데모 */}
      <Document.Heading2>usePrevRef로 직전 선택 되돌리기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 화면에 <InlineCode>usePrevRef</InlineCode>를 적용한 예시예요. 되돌리기 버튼은 이벤트 핸들러이므로{" "}
        <InlineCode>prevPlanRef.current</InlineCode>에 정확히 직전 선택이 담겨 있어요. 되돌리기를 다시 누르면 되돌리기 직전의 값이 새로운
        "직전 선택"이 되므로 두 값 사이를 오가게 돼요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <PrevRefDemo />
      </PreviewContainer>
      <CodeBlock code={PREV_REF_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>이전 값 추적하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 추적할 값을 인자로 전달하기만 하면 되고, 별도의 옵션 객체는 없어요. 반환값은 ref 객체이므로{" "}
        <InlineCode>.current</InlineCode>로 접근하고, 상태가 아니기 때문에 이전 값이 갱신돼도 리렌더링이 발생하지 않아요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 읽는 시점 데모 */}
      <Document.Heading2>읽는 시점에 따른 차이 확인하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        이 훅에서 가장 중요한 부분이에요. ref 갱신이 <InlineCode>useEffect</InlineCode>의 cleanup에서 일어나기 때문에, 렌더링 도중에 읽으면
        아직 갱신 전이라 2단계 이전 값이 보여요. 버튼을 여러 번 눌러 왼쪽 카드(렌더링 중 읽은 값)와 아래 로그(이벤트 핸들러에서 읽은 값)를
        비교해 보세요. 로그의 <InlineCode>prevCountRef.current</InlineCode>는 항상 클릭 시점 <InlineCode>current</InlineCode>보다 정확히 1
        작아요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ReadTimingDemo />
      </PreviewContainer>
      <CodeBlock code={READ_TIMING_DEMO_CODE} className="mb-8" />

      {/* useEffect에서 변화 감지 */}
      <Document.Heading2>useEffect에서 값의 변화 감지하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>useEffect</InlineCode> 안에서 읽어도 정확히 1단계 이전 값이에요. React는 커밋 시 모든 cleanup을 실행한 뒤 effect를
        실행하므로, effect가 도는 시점에는 ref 갱신이 이미 끝나 있어요. 값이 어느 방향으로 바뀌었는지에 따라 다른 처리를 해야 할 때
        유용해요.
      </Document.Paragraph>
      <CodeBlock code={EFFECT_USAGE_CODE} className="mb-8" />

      {/* 렌더링에 이전 값을 보여줘야 할 때 */}
      <Document.Heading2>화면에 이전 값을 표시해야 한다면</Document.Heading2>
      <Document.Paragraph mb={6}>
        이전 값을 화면에 그대로 그려야 한다면 이 훅만으로는 부족해요. 렌더링 중 읽은 값은 2단계 이전 값이기 때문이에요. 이럴 때는{" "}
        <InlineCode>useEffect</InlineCode>에서 읽은 이전 값을 상태로 옮겨 두고 그 상태를 렌더링하세요.
      </Document.Paragraph>
      <CodeBlock code={RENDER_PREVIOUS_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

function Counter() {
  const [count, setCount] = useState(0);

  // 추적할 값을 그대로 전달하면 ref 객체가 반환돼요.
  const prevCountRef = usePrevRef(count);

  const handleCheck = () => {
    // 이벤트 핸들러(커밋 이후)에서 읽으면 정확히 1단계 이전 값이에요.
    console.log("이전 값:", prevCountRef.current, "현재 값:", count);
  };

  return (
    <>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      <button onClick={handleCheck}>이전 값 확인</button>
    </>
  );
}`;

const EFFECT_USAGE_CODE = `import { useEffect, useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

function VolumeIndicator() {
  const [volume, setVolume] = useState(50);
  const prevVolumeRef = usePrevRef(volume);

  useEffect(() => {
    const prevVolume = prevVolumeRef.current;

    // 값이 그대로면 effect가 실행되지 않지만, 방어적으로 한 번 더 확인해요.
    if (prevVolume === volume) return;

    // 이전 값과 비교해 변화 방향에 따라 다른 처리를 할 수 있어요.
    if (volume > prevVolume) {
      console.log(\`볼륨 증가: \${prevVolume} → \${volume}\`);
    } else {
      console.log(\`볼륨 감소: \${prevVolume} → \${volume}\`);
    }
  }, [volume, prevVolumeRef]);

  return <input type="range" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />;
}`;

const RENDER_PREVIOUS_CODE = `function SearchKeyword({ keyword }: { keyword: string }) {
  const prevKeywordRef = usePrevRef(keyword);
  const [prevKeyword, setPrevKeyword] = useState(keyword);

  useEffect(() => {
    // effect에서 읽은 값은 정확하므로, 그 값을 상태로 옮겨 렌더링해요.
    setPrevKeyword(prevKeywordRef.current);
  }, [keyword, prevKeywordRef]);

  return (
    <p>
      {/* ✅ 상태로 옮긴 값을 렌더링해요. */}
      이전 검색어: {prevKeyword} / 현재 검색어: {keyword}

      {/* ❌ prevKeywordRef.current를 직접 렌더링하면 2단계 이전 값이 보여요. */}
    </p>
  );
}`;

export default UsageSection;
