import { CodeBlock, ParameterTable, ReturnTable, type ParameterTableRow, type ReturnTableRow } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const ApiSection = () => {
  return (
    <section>
      <Document.Heading1>API</Document.Heading1>
      <Document.Paragraph mb={6}>
        패키지는 <InlineCode>useComposedRefs</InlineCode> 훅과, 훅 밖에서도 사용할 수 있는 <InlineCode>composeRefs</InlineCode> /{" "}
        <InlineCode>setRef</InlineCode> 유틸리티 함수를 named export 해요. 별도의 옵션 객체는 없으며, 병합할 ref들을 인자로 나열하는 것이
        전부예요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} />

      {/* useComposedRefs */}
      <Document.Heading2>useComposedRefs</Document.Heading2>
      <Document.Paragraph mb={4}>
        전달한 ref들을 하나의 callback ref로 병합해 반환하는 훅이에요. 반환값은 <InlineCode>useCallback</InlineCode>으로 메모이제이션되어,
        전달한 ref들의 참조가 유지되는 동안 같은 참조를 유지해요.
      </Document.Paragraph>
      <CodeBlock code={USE_COMPOSED_REFS_SIGNATURE} language="ts" className="mb-6" />
      <ParameterTable rows={USE_COMPOSED_REFS_PARAMS} className="mb-6" />
      <ReturnTable rows={USE_COMPOSED_REFS_RETURNS} />

      {/* composeRefs */}
      <Document.Heading2>composeRefs</Document.Heading2>
      <Document.Paragraph mb={4}>
        <InlineCode>useComposedRefs</InlineCode>의 훅이 아닌 버전이에요. 병합 동작은 동일하지만 메모이제이션이 없으므로, 훅을 호출할 수 없는
        곳(고차 컴포넌트, 클래스 컴포넌트, 렌더링 밖 로직 등)에서 사용하거나 직접 <InlineCode>useCallback</InlineCode> 등으로 감싸서
        사용하세요.
      </Document.Paragraph>
      <CodeBlock code={COMPOSE_REFS_SIGNATURE} language="ts" className="mb-6" />
      <ParameterTable rows={COMPOSE_REFS_PARAMS} className="mb-6" />
      <ReturnTable rows={COMPOSE_REFS_RETURNS} />

      {/* setRef */}
      <Document.Heading2>setRef</Document.Heading2>
      <Document.Paragraph mb={4}>
        ref 하나에 값을 할당하는 저수준 유틸리티예요. 함수형 ref는 호출하고(반환된 cleanup이 있으면 그대로 반환), 객체형 ref는{" "}
        <InlineCode>.current</InlineCode>에 값을 할당하고, <InlineCode>null</InlineCode> / <InlineCode>undefined</InlineCode>는 무시해요.
        커스텀 ref 병합 로직을 직접 만들 때 사용할 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={SET_REF_SIGNATURE} language="ts" className="mb-6" />
      <ParameterTable rows={SET_REF_PARAMS} className="mb-6" />
      <ReturnTable rows={SET_REF_RETURNS} />

      {/* 주의사항 */}
      <Document.Heading2>주의사항</Document.Heading2>
      <Document.Paragraph mb={4}>
        <InlineCode>useComposedRefs</InlineCode>는 전달한 ref들을 의존성 배열로 사용해요. 함수형 ref를 인라인으로 작성하면 렌더링마다 새
        함수가 만들어져 병합된 ref도 매번 다시 생성되고, 엘리먼트에 ref가 해제·재연결되는 과정이 반복돼요. 함수형 ref는{" "}
        <InlineCode>useCallback</InlineCode>으로 참조를 고정해서 전달하세요. 같은 이유로 렌더링마다 ref의 개수나 순서를 바꾸면 안 돼요.
      </Document.Paragraph>
      <Document.Paragraph>
        cleanup 함수 실행은 React 19의 callback ref cleanup 기능에 의존해요. React 18 이하에서는 callback ref의 반환값이 무시되고 엘리먼트
        해제 시 각 ref에 <InlineCode>null</InlineCode>이 전달되는 기존 방식으로 동작하므로, 정리 로직이 반드시 필요하다면 React 18에서는{" "}
        <InlineCode>null</InlineCode> 분기에서 처리해야 해요.
      </Document.Paragraph>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useComposedRefs, composeRefs, setRef } from "@leejaehyeok/use-compose-ref";`;

const USE_COMPOSED_REFS_SIGNATURE = `function useComposedRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T>;`;

const COMPOSE_REFS_SIGNATURE = `function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T>;`;

const SET_REF_SIGNATURE = `function setRef<T>(ref: React.Ref<T> | undefined, value: T): void | (() => void);`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useComposedRefs(...refs) 인자 */
const USE_COMPOSED_REFS_PARAMS: ParameterTableRow[] = [
  {
    name: "...refs",
    type: "(React.Ref<T> | undefined)[]",
    description:
      "병합할 ref들이에요. 객체형 ref(RefObject / MutableRefObject)와 함수형 ref(RefCallback)를 섞어서 몇 개든 전달할 수 있고, null / undefined는 무시돼요. 이 목록이 의존성 배열로 사용되므로 렌더링마다 개수와 순서를 유지하세요.",
  },
];

/** useComposedRefs 반환값 */
const USE_COMPOSED_REFS_RETURNS: ReturnTableRow[] = [
  {
    name: "composedRef",
    type: "React.RefCallback<T>",
    description:
      "엘리먼트의 ref 속성에 연결할 병합된 callback ref예요. 엘리먼트가 연결되면 모든 ref에 값을 전파하고, 해제되면 cleanup 실행 또는 null 초기화로 정리해요. 전달한 ref들의 참조가 유지되는 동안 같은 참조를 유지해요.",
  },
];

/** composeRefs(...refs) 인자 */
const COMPOSE_REFS_PARAMS: ParameterTableRow[] = [
  {
    name: "...refs",
    type: "(React.Ref<T> | undefined)[]",
    description: "병합할 ref들이에요. useComposedRefs와 동일하게 모든 ref 유형을 섞어서 전달할 수 있어요.",
  },
];

/** composeRefs 반환값 */
const COMPOSE_REFS_RETURNS: ReturnTableRow[] = [
  {
    name: "composedRef",
    type: "React.RefCallback<T>",
    description:
      "병합된 callback ref예요. 메모이제이션이 없으므로 호출할 때마다 새 함수가 반환돼요. 렌더링 안에서 사용한다면 useComposedRefs를 사용하세요.",
  },
];

/** setRef(ref, value) 인자 */
const SET_REF_PARAMS: ParameterTableRow[] = [
  {
    name: "ref",
    type: "React.Ref<T> | undefined",
    description: "값을 할당할 ref예요. 함수형 ref는 value를 인자로 호출하고, 객체형 ref는 .current에 할당하고, null / undefined는 무시해요.",
  },
  {
    name: "value",
    type: "T",
    description: "ref에 할당할 값이에요. 엘리먼트 연결 시에는 엘리먼트를, 해제 시에는 null을 전달하는 식으로 사용해요.",
  },
];

/** setRef 반환값 */
const SET_REF_RETURNS: ReturnTableRow[] = [
  {
    name: "cleanup",
    type: "void | (() => void)",
    description:
      "함수형 ref가 cleanup 함수를 반환한 경우(React 19) 그 함수를 그대로 반환하고, 그 외에는 undefined를 반환해요. 반환된 cleanup은 호출한 쪽에서 해제 시점에 실행해야 해요.",
  },
];

export default ApiSection;
