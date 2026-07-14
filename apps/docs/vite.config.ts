import { defineConfig, loadEnv, type AliasOptions } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "child_process";
let commitHash;
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (e) {
  console.warn("Could not get commit hash");
  commitHash = "unknown";
}

// dev: alias to package src for instant HMR without building packages first
// build/preview: use workspace package dist (run `pnpm build:packages` first)
const devAliases: AliasOptions = {
  "@leejaehyeok/use-browser-storage": path.resolve(__dirname, "../../packages/use-browser-storage/src/index.ts"),
  "@leejaehyeok/use-compose-ref": path.resolve(__dirname, "../../packages/use-compose-ref/src/index.ts"),
  "@leejaehyeok/use-compose-state": path.resolve(__dirname, "../../packages/use-compose-state/src/index.ts"),
  "@leejaehyeok/use-controllable-state": path.resolve(__dirname, "../../packages/use-controllable-state/src/index.ts"),
  "@leejaehyeok/use-custom-event-state": path.resolve(__dirname, "../../packages/use-custom-event-state/src/index.ts"),
  "@leejaehyeok/use-debounce": path.resolve(__dirname, "../../packages/use-debounce/src/index.ts"),
  "@leejaehyeok/use-deferred-loading": path.resolve(__dirname, "../../packages/use-deferred-loading/src/index.ts"),
  "@leejaehyeok/use-focus-trap": path.resolve(__dirname, "../../packages/use-focus-trap/src/index.ts"),
  "@leejaehyeok/use-intersection-observer": path.resolve(__dirname, "../../packages/use-intersection-observer/src/index.ts"),
  "@leejaehyeok/use-latest-ref": path.resolve(__dirname, "../../packages/use-latest-ref/src/index.ts"),
  "@leejaehyeok/use-overflow": path.resolve(__dirname, "../../packages/use-overflow/src/index.ts"),
  "@leejaehyeok/use-pagination": path.resolve(__dirname, "../../packages/use-pagination/src/index.ts"),
  "@leejaehyeok/use-prev-ref": path.resolve(__dirname, "../../packages/use-prev-ref/src/index.ts"),
  "@leejaehyeok/use-roving-focus": path.resolve(__dirname, "../../packages/use-roving-focus/src/index.ts"),
  "@leejaehyeok/use-snooze": path.resolve(__dirname, "../../packages/use-snooze/src/index.ts"),
  "@leejaehyeok/use-throttle": path.resolve(__dirname, "../../packages/use-throttle/src/index.ts"),
};

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const OUT_DIR = "./dist";
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // workspace packages resolve their react peer dep to a different copy (react 19);
      // force a single react instance from the app to avoid a null-dispatcher crash
      dedupe: ["react", "react-dom"],
      alias: {
        "@src": path.resolve(__dirname, "./src"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@const": path.resolve(__dirname, "./src/const"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@models": path.resolve(__dirname, "./src/models"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@router": path.resolve(__dirname, "./src/router"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        ...(command === "serve" ? devAliases : {}),
      },
    },
    build: {
      outDir: OUT_DIR,
    },

    server: {
      host: true,
      port: 3000,
    },
  };
});
