export type IntersectionBaseOptions = {
  root?: "container" | null;
  once?: boolean;
  enable?: boolean;
} & Omit<IntersectionObserverInit, "root">;
