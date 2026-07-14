import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import DebounceDemo, { DEBOUNCE_DEMO_CODE } from "../demos/DebounceDemo";
import NoDebounceDemo from "../demos/NoDebounceDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        디바운스 적용 전후의 차이를 직접 비교해 보세요. 미적용 데모는 입력할 때마다 핸들러가 그대로 실행되지만, 적용 데모는 입력이 아무리
        이어져도 입력이 500ms 동안 멈춘 뒤에만 핸들러가 실행돼요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>디바운스 없이 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        디바운스를 적용하지 않았을 때의 동작을 보여주는 예시예요. 입력창에 타이핑해 보세요. <InlineCode>change</InlineCode> 이벤트가 발생할
        때마다 핸들러가 실행되어 이벤트 발생 횟수와 핸들러 실행 횟수가 동일하게 증가해요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoDebounceDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>디바운스 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 핸들러를 <InlineCode>useDebounce</InlineCode>로 감싼 예시예요(<InlineCode>{`{ leading: false }`}</InlineCode>). 이벤트
        발생 횟수는 계속 증가해도 핸들러는 입력이 500ms 동안 멈춘 뒤에만 한 번 실행돼요. <InlineCode>cancel</InlineCode> 버튼으로 대기
        중인 호출을 취소하거나, <InlineCode>flush</InlineCode> 버튼으로 기다리지 않고 즉시 실행할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <DebounceDemo />
      </PreviewContainer>
      <CodeBlock code={DEBOUNCE_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>함수 디바운싱하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 디바운싱할 함수와 지연 시간(<InlineCode>wait</InlineCode>, ms)을 전달하면 <InlineCode>debounce</InlineCode> 함수를 반환해요. 원본
        함수 대신 <InlineCode>debounce</InlineCode>를 호출하세요. 인자는 원본 함수로 그대로 전달되며, trailing 실행 시에는 마지막으로
        전달된 인자가 사용돼요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* leading / trailing 옵션 */}
      <Document.Heading2>실행 시점 조절하기</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>leading</InlineCode> / <InlineCode>trailing</InlineCode> 옵션을 사용해서 실행 시점을 제어할 수 있어요. 세 번째 인자로
        옵션 객체를 전달하면 되고, 두 옵션 모두 기본값은 <InlineCode>true</InlineCode>예요. 단, 둘
        다 <InlineCode>false</InlineCode>로 지정하면 원본 함수가 전혀 실행되지 않으므로 주의하세요.
      </Document.Paragraph>

      <Document.Heading3>
        <InlineCode>{`{ leading: false }`}</InlineCode> - 입력이 멈춘 뒤에만 실행하기
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        첫 호출도 즉시 실행하지 않고, 호출이 멈춘 뒤 wait 시간이 지나야 마지막 호출만 실행해요. 검색어 자동완성처럼 "입력이 끝났을 때 한
        번만" 실행하고 싶은 가장 일반적인 디바운스 패턴이에요.
      </Document.Paragraph>
      <CodeBlock code={TRAILING_ONLY_CODE} className="mb-8" />

      <Document.Heading3>
        <InlineCode>{`{ trailing: false }`}</InlineCode> - 첫 호출만 즉시 실행하기
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        첫 호출은 즉시 실행하고, 호출이 이어지는 동안의 나머지 호출은 모두 무시해요. 버튼 연타 방지처럼 "즉시 반응하되 연속 호출은 막고
        싶을 때" 적합해요.
      </Document.Paragraph>
      <CodeBlock code={LEADING_ONLY_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useState } from "react";
import { useDebounce } from "@leejaehyeok/use-debounce";

function SearchInput() {
  const [keyword, setKeyword] = useState("");

  // 입력이 300ms 동안 멈춘 뒤에만 검색 API가 호출돼요.
  const { debounce } = useDebounce((value: string) => fetchSearchResults(value), 300, { leading: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    debounce(e.target.value);
  };

  return <input type="text" value={keyword} onChange={handleChange} placeholder="검색어 입력..." />;
}`;

const TRAILING_ONLY_CODE = `const { debounce } = useDebounce((value: string) => fetchSearchResults(value), 300, { leading: false });

// 즉시 실행되지 않고, 입력이 멈춘 뒤 300ms가 지나면 마지막 인자로 한 번만 실행돼요.
<input onChange={(e) => debounce(e.target.value)} />;`;

const LEADING_ONLY_CODE = `const { debounce } = useDebounce(submit, 1000, { trailing: false });

// 첫 클릭은 즉시 실행되고, 클릭이 이어지는 동안의 나머지 클릭은 모두 무시돼요.
<button onClick={() => debounce()}>제출</button>;`;

export default UsageSection;
