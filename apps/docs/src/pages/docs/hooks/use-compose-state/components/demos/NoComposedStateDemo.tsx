import { Button } from "@src/components/ui";
import { useState } from "react";
import StateBoard from "./StateBoard";

/* ──────────────────────────────────────────────
   Demo: useComposedState 미적용 (비교용)
   갱신 지점마다 setter를 직접 나열해 호출해야 해서,
   업데이트 경로가 늘어나면 호출 누락이 생겨요
   ────────────────────────────────────────────── */

const NoComposedStateDemo = () => {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [lastQuantity, setLastQuantity] = useState(1);

  const increase = () => {
    // 갱신 지점마다 setter를 하나씩 나열해야 해요.
    setOrderQuantity((prev) => prev + 1);
    setPreviewQuantity((prev) => prev + 1);
    setLastQuantity((prev) => prev + 1);
  };

  const reset = () => {
    // ⚠️ setLastQuantity 호출을 빠뜨렸어요. 이런 누락이 곧바로 값 불일치로 이어져요.
    setOrderQuantity(1);
    setPreviewQuantity(1);
  };

  return (
    <StateBoard title="독립적인 useState 3개" items={buildItems(orderQuantity, previewQuantity, lastQuantity)}>
      <Button onClick={increase}>수량 +1 (setter 3개 호출)</Button>
      <Button variant="secondary" onClick={reset}>
        초기화 (setter 2개만 호출)
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

export default NoComposedStateDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const NO_COMPOSED_STATE_DEMO_CODE = `import { useState } from "react";

function QuantityPanel() {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [lastQuantity, setLastQuantity] = useState(1);

  const increase = () => {
    // 갱신 지점마다 setter를 하나씩 나열해야 해요.
    setOrderQuantity((prev) => prev + 1);
    setPreviewQuantity((prev) => prev + 1);
    setLastQuantity((prev) => prev + 1);
  };

  const reset = () => {
    // ⚠️ setLastQuantity 호출을 빠뜨렸어요. 이런 누락이 곧바로 값 불일치로 이어져요.
    setOrderQuantity(1);
    setPreviewQuantity(1);
  };

  return (
    <>
      <button onClick={increase}>수량 +1</button>
      <button onClick={reset}>초기화</button>
    </>
  );
}`;
