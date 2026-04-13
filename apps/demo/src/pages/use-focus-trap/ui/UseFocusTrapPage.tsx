import { DemoPageHeader } from "@/shared/ui";
import { ModalDemo, SidebarDemo } from "@/features/focus-trap-demos";

export function UseFocusTrapPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-focus-trap"
        description="모달·다이얼로그에서 포커스를 컨테이너 안에 가둡니다."
      />
      <ModalDemo />
      <SidebarDemo />
    </div>
  );
}
