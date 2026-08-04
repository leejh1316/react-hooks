import type { ComponentType, ReactNode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach } from "vitest";

// act()로 감싼 업데이트를 React가 테스트 렌더로 인식하게 한다.
// browser 프로젝트에서 userEvent로 실제 입력을 넣는 테스트는 이 헬퍼를 쓰지 않으므로
// (act 밖 업데이트 경고를 피하기 위해) 플래그를 전역 setup이 아니라 이 모듈에 둔다.
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// 테스트가 act를 react와 이 헬퍼 두 곳에서 가져오지 않도록 함께 내보낸다.
export { act };

// 마운트한 훅은 테스트가 끝나면 반드시 언마운트한다.
// 특히 window에 리스너를 붙이는 훅(useCustomEventState, use-browser-storage의 subscribe)은
// 언마운트하지 않으면 다음 테스트의 dispatch에도 반응해서 서로를 오염시킨다.
const mounted = new Set<() => void>();

afterEach(() => {
  for (const unmount of mounted) {
    unmount();
  }
  mounted.clear();
});

type Wrapper = ComponentType<{ children: ReactNode }>;

type RenderHookOptions<Props> = {
  initialProps?: Props;
  /** StrictMode 등으로 훅을 감쌀 때 사용 */
  wrapper?: Wrapper;
};

type RenderHookResult<Result, Props> = {
  /** 가장 최근 렌더에서 훅이 반환한 값 */
  result: { current: Result };
  /** props를 바꿔 리렌더. 인자를 생략하면 직전 props로 리렌더한다. */
  rerender: (props?: Props) => void;
  unmount: () => void;
  /** 훅을 담은 컴포넌트가 마운트된 DOM 컨테이너 */
  container: HTMLElement;
};

/**
 * 훅 하나를 렌더링해 반환값을 관찰하는 최소 헬퍼.
 *
 * callback은 렌더 단계에서 실행되므로, 렌더 시점의 값을 봐야 하는 훅
 * (usePrevRef처럼 ref를 반환하는 경우)은 callback 안에서 직접 값을 수집하면 된다.
 */
export function renderHook<Result, Props = undefined>(
  callback: (props: Props) => Result,
  options: RenderHookOptions<Props> = {},
): RenderHookResult<Result, Props> {
  const result = { current: undefined as Result };
  let currentProps = options.initialProps as Props;

  const HookHarness = ({ props }: { props: Props }) => {
    result.current = callback(props);
    return null;
  };

  const Wrapper = options.wrapper;
  const tree = (props: Props) => {
    const harness = <HookHarness props={props} />;
    return Wrapper ? <Wrapper>{harness}</Wrapper> : harness;
  };

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(tree(currentProps));
  });

  const unmount = () => {
    if (!mounted.has(unmount)) return;
    mounted.delete(unmount);
    act(() => {
      root.unmount();
    });
    container.remove();
  };
  mounted.add(unmount);

  return {
    result,
    container,
    unmount,
    rerender: (props) => {
      if (props !== undefined) {
        currentProps = props;
      }
      act(() => {
        root.render(tree(currentProps));
      });
    },
  };
}
