import { DemoPageHeader } from "@/shared/ui";
import {
  PropCallbackRefDemo,
  ComparisonDemo,
  PropsCallbackDemo,
} from "@/features/use-latest-ref-demos";

export function UseLatestRefPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-latest-ref"
        description="Props로 받은 콜백을 useLatestRef에 저장하고, useCallback의 의존성 배열에 빈 배열을 사용하면 useCallback이 재생성되지 않으면서도 항상 최신 콜백을 유지할 수 있습니다."
      />
      <PropCallbackRefDemo />
      <ComparisonDemo />
      <PropsCallbackDemo />
    </div>
  );
}
