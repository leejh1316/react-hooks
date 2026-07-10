import { PAGE_ROUTES } from "@src/router/router";
import { Document } from "@src/components/ui/Document";
import HeroSection from "./components/HeroSection";
import CodePreviewSection from "./components/CodePreviewSection";
import FeaturesSection from "./components/FeaturesSection";
import HooksOverviewSection from "./components/HooksOverviewSection";
import GettingStartedSection from "./components/GettingStartedSection";
import CtaSection from "./components/CtaSection";

const Home = () => {
  const hookRoutes = Object.values(PAGE_ROUTES).flatMap((category) => category.routes);

  return (
    <Document.Root className="col-span-12 pb-24">
      <HeroSection hookCount={hookRoutes.length} />

      <CodePreviewSection />

      <Document.Divider mt={20} mb={20} />

      <FeaturesSection />

      <Document.Divider mt={20} mb={20} />

      <HooksOverviewSection routes={hookRoutes} />

      <Document.Divider mt={20} mb={20} />

      <GettingStartedSection />

      <Document.Divider mt={20} mb={20} />

      <CtaSection />
    </Document.Root>
  );
};

export default Home;
