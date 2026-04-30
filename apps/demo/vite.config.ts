import { defineConfig, type AliasOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// dev: alias to package src for instant HMR without building packages first
// build/preview: use workspace package dist (run `pnpm build:packages` first)
const devAliases: AliasOptions = {
  "@leejaehyeok/use-debounce": resolve(__dirname, "../../packages/use-debounce/src/index.ts"),
  "@leejaehyeok/use-focus-trap": resolve(__dirname, "../../packages/use-focus-trap/src/index.ts"),
  "@leejaehyeok/use-roving-focus": resolve(__dirname, "../../packages/use-roving-focus/src/index.ts"),
  "@leejaehyeok/use-snooze": resolve(__dirname, "../../packages/use-snooze/src/index.ts"),
  "@leejaehyeok/use-throttle": resolve(__dirname, "../../packages/use-throttle/src/index.ts"),
  "@leejaehyeok/use-prev-ref": resolve(__dirname, "../../packages/use-prev-ref/src/index.ts"),
  "@leejaehyeok/use-latest-ref": resolve(__dirname, "../../packages/use-latest-ref/src/index.ts"),
  "@leejaehyeok/use-controllable-state": resolve(__dirname, "../../packages/use-controllable-state/src/index.ts"),
  "@leejaehyeok/use-pagination": resolve(__dirname, "../../packages/use-pagination/src/index.ts"),
  "@leejaehyeok/use-deferred-loading": resolve(__dirname, "../../packages/use-deferred-loading/src/index.ts"),
  "@leejaehyeok/use-compose-ref": resolve(__dirname, "../../packages/use-compose-ref/src/index.ts"),
  "@leejaehyeok/use-overflow": resolve(__dirname, "../../packages/use-overflow/src/index.ts"),
  "@leejaehyeok/use-intersection-observer": resolve(__dirname, "../../packages/use-intersection-observer/src/index.ts"),
  "@leejaehyeok/use-compose-state": resolve(__dirname, "../../packages/use-compose-state/src/index.ts"),
  "@leejaehyeok/use-custom-event-state": resolve(__dirname, "../../packages/use-custom-event-state/src/index.ts"),
};

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), react()],
  base: "/react-hooks/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      ...(command === "serve" ? devAliases : {}),
    },
  },
}));
