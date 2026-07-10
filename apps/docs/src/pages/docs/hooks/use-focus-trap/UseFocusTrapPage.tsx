import { DocsPagination } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import ApiSection from "./components/ApiSection";
import DemoSection from "./components/DemoSection";
import HookCodeSection from "./components/HookCodeSection";
import InstallSection from "./components/InstallSection";
import OverviewSection from "./components/OverviewSection";
import SkillSection from "./components/SkillSection";
import UsageSection from "./components/UsageSection";

const UseFocusTrapPage = () => {
  return (
    <Document.Root className="pb-20">
      <OverviewSection />
      <InstallSection />
      <UsageSection />
      <DemoSection />
      <ApiSection />
      <HookCodeSection />
      <SkillSection />
      <DocsPagination />
    </Document.Root>
  );
};

export default UseFocusTrapPage;
