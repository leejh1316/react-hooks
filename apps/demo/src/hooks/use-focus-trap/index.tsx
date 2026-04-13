import "./styles.css";
import { ModalDemo } from "./ModalDemo";
import { SidebarDemo } from "./SidebarDemo";

export default function UseFocusTrapPage() {
  return (
    <div className="demo-page">
      <header className="demo-page-header">
        <h1>use-focus-trap</h1>
        <p>모달·다이얼로그에서 포커스를 컨테이너 안에 가둡니다.</p>
      </header>
      <ModalDemo />
      <SidebarDemo />
    </div>
  );
}
