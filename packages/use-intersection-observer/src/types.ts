export type IntersectionBaseOptions = {
  root?: "container" | null;
  once?: boolean;
} & Omit<IntersectionObserverInit, "root">;
