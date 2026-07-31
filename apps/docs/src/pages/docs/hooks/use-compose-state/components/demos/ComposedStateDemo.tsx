import { useComposedState } from "@leejaehyeok/use-compose-state";
import { Button } from "@src/components/ui";
import { useState } from "react";
import StateBoard from "./StateBoard";

/* ──────────────────────────────────────────────
   Demo: useComposedState 적용
   세 개의 setter를 하나로 합성해 두면
   갱신 지점이 늘어나도 setState 한 번으로 끝나요
   ────────────────────────────────────────────── */

const ComposedStateDemo = () => {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [lastQuantity, setLastQuantity] = useState(1);

  // 세 개의 setter를 하나의 setter로 합성해요.
  const setQuantity = useComposedState(setOrderQuantity, setPreviewQuantity, setLastQuantity);

  return (
    <StateBoard title="useComposedState로 합성한 상태 3개" items={buildItems(orderQuantity, previewQuantity, lastQuantity)}>
      {/* 함수형 업데이트도 useState와 동일하게 사용할 수 있어요 */}
      <Button onClick={() => setQuantity((prev) => prev + 1)}>수량 +1 (setState 1회)</Button>
      <Button variant="secondary" onClick={() => setQuantity(1)}>
        초기화 (setState 1회)
      </Button>
    </StateBoard>
  );
};

/* 세 상태를 보드에 표시할 형태로 변환해요 */
const buildItems = (orderQuantity: number, previewQuantity: number, lastQuantity: number) => [
  { label: "setOrderQuantity", caption: "주문 요약 수량", value: orderQuantity },
  { label: "setPreviewQuantity", caption: "미리보기 수량", value: previewQuantity },
  { label: "setLastQuantity", caption: "최근 선택 수량", value: lastQuantity },
];

export default ComposedStateDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const COMPOSED_STATE_DEMO_CODE = `import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

function QuantityPanel() {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [lastQuantity, setLastQuantity] = useState(1);

  // 세 개의 setter를 하나의 setter로 합성해요.
  const setQuantity = useComposedState(setOrderQuantity, setPreviewQuantity, setLastQuantity);

  return (
    <>
      {/* 함수형 업데이트도 useState와 동일하게 사용할 수 있어요 */}
      <button onClick={() => setQuantity((prev) => prev + 1)}>수량 +1</button>
      {/* 갱신 지점이 늘어나도 호출부는 setState 한 번이라 누락이 생기지 않아요 */}
      <button onClick={() => setQuantity(1)}>초기화</button>
    </>
  );
}`;
