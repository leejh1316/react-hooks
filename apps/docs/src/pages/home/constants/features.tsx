import { Package, Feather, Code, Blocks, Accessibility } from "lucide-react";

/* ──────────────────────────────────────────────
   Feature Data
   ────────────────────────────────────────────── */

export const FEATURES = [
  {
    icon: <Package size={20} strokeWidth={1.8} />,
    title: "독립 패키지",
    description: "모든 훅이 개별 패키지로 배포됩니다. 필요한 훅만 골라 설치하여 번들 크기를 최소화할 수 있습니다.",
  },
  {
    icon: <Feather size={20} strokeWidth={1.8} />,
    title: "Lightweight",
    description: "외부 의존성 없이 React만으로 동작하는 가벼운 구현입니다.",
  },
  {
    icon: <Code size={20} strokeWidth={1.8} />,
    title: "TypeScript",
    description: "모든 훅이 TypeScript로 작성되어 완벽한 타입 안전성과 자동완성을 제공합니다.",
  },
  {
    icon: <Blocks size={20} strokeWidth={1.8} />,
    title: "Composable",
    description: "useComposeRef, useControllableState처럼 훅을 조합하여 더 복잡한 로직을 구성할 수 있습니다.",
  },
  {
    icon: <Accessibility size={20} strokeWidth={1.8} />,
    title: "Accessible",
    description: "useFocusTrap, useRovingFocus 등 접근성 있는 인터랙션 구현을 위한 훅을 제공합니다.",
  },
] as const;
