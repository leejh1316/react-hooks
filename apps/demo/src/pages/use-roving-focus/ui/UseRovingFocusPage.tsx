import { DemoPageHeader } from "@/shared/ui";
import {
  ToolbarDemo,
  ListDemo,
  GridDemo,
  DynamicListDemo,
} from "@/features/roving-focus-demos";

export function UseRovingFocusPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-roving-focus"
        description="Roving tabindex 패턴으로 키보드 내비게이션을 구현합니다."
      />
      <ToolbarDemo />
      <ListDemo />
      <GridDemo />
      <DynamicListDemo />
    </div>
  );
}
