import type { ComponentType, LazyExoticComponent } from "react";

export interface HookMeta {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  Page: LazyExoticComponent<ComponentType>;
}
