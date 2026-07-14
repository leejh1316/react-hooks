import { useComposedRefs } from "@leejaehyeok/use-compose-ref";
import { Button } from "@src/components/ui";
import { forwardRef, useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: forwardRef와 함께 사용
   부모가 전달한 ref와 컴포넌트 내부 ref를 병합해 하나의 input에 함께 연결해요
   ────────────────────────────────────────────── */

const FancyInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>((props, forwardedRef) => {
  // 내부 ref — 지우기 버튼이 사용해요.
  const internalRef = useRef<HTMLInputElement>(null);
  const composedRef = useComposedRefs(internalRef, forwardedRef);

  const handleClear = () => {
    const input = internalRef.current;
    if (input) {
      input.value = "";
      input.focus();
    }
  };

  return (
    <div className="flex w-full max-w-sm gap-2">
      <input
        ref={composedRef}
        type="text"
        placeholder="내용을 입력해 보세요"
        className="border-line-regular text-body-3 focus:border-primary-500 w-full rounded-lg border px-3 py-2 outline-none"
        {...props}
      />
      <Button variant="secondary" onClick={handleClear}>
        지우기
      </Button>
    </div>
  );
});
FancyInput.displayName = "FancyInput";

const ForwardRefDemo = () => {
  // 부모의 ref — FancyInput 내부 ref와 같은 input에 연결돼요.
  const parentRef = useRef<HTMLInputElement>(null);
  const [readValue, setReadValue] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FancyInput ref={parentRef} />

      <p className="text-body-3 text-ink-secondary">
        부모 ref가 읽은 값 <span className="text-ink-primary font-semibold">{readValue !== null ? `"${readValue}"` : "-"}</span>
      </p>

      <div className="flex gap-2">
        <Button onClick={() => parentRef.current?.focus()}>부모 ref로 포커스</Button>
        <Button variant="secondary" onClick={() => setReadValue(parentRef.current?.value ?? "")}>
          부모 ref로 값 읽기
        </Button>
      </div>

      <p className="text-body-3 text-ink-tertiary">부모의 ref와 컴포넌트 내부 ref가 하나의 input에 함께 연결되어 있어요.</p>
    </div>
  );
};

export default ForwardRefDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const FORWARD_REF_DEMO_CODE = `import { forwardRef, useRef } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

const FancyInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (props, forwardedRef) => {
    // 내부 동작(지우기)에 사용할 ref와 부모가 전달한 ref를 병합해요.
    const internalRef = useRef<HTMLInputElement>(null);
    const composedRef = useComposedRefs(internalRef, forwardedRef);

    const handleClear = () => {
      if (internalRef.current) {
        internalRef.current.value = "";
        internalRef.current.focus();
      }
    };

    return (
      <>
        <input ref={composedRef} {...props} />
        <button onClick={handleClear}>지우기</button>
      </>
    );
  },
);

function Parent() {
  const parentRef = useRef<HTMLInputElement>(null);

  // 부모 ref와 FancyInput 내부 ref가 같은 input을 가리켜요.
  return (
    <>
      <FancyInput ref={parentRef} />
      <button onClick={() => parentRef.current?.focus()}>부모에서 포커스</button>
    </>
  );
}`;
