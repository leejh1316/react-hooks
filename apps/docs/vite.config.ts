import { defineConfig, loadEnv } from "vite";
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
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const OUT_DIR = "./dist";
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      conditions: ["timeless-source"], // dev 시 소스 직접 참조
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
