import "./styles.css";
import { ToolbarDemo } from "./ToolbarDemo";
import { ListDemo } from "./ListDemo";
import { GridDemo } from "./GridDemo";
import { DynamicListDemo } from "./DynamicListDemo";

export default function UseRovingFocusPage() {
  return (
    <div className="demo-page">
      <header className="demo-page-header">
        <h1>use-roving-focus</h1>
        <p>Roving tabindex 패턴으로 키보드 내비게이션을 구현합니다.</p>
      </header>
      <ToolbarDemo />
      <ListDemo />
      <GridDemo />
      <DynamicListDemo />
    </div>
  );
}
