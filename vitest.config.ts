import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const packagesDir = resolve(rootDir, "packages");

// 패키지 간 의존(@leejaehyeok/use-latest-ref 등)은 워크스페이스 링크를 통해 dist/를 가리킨다.
// 그대로 두면 테스트 전에 매번 pnpm build:packages가 필요하고 소스 수정이 반영되지 않으므로,
// 테스트에서는 src를 직접 보도록 alias로 덮어쓴다.
const workspaceAlias = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    find: new RegExp(`^@leejaehyeok/${entry.name}$`),
    replacement: resolve(packagesDir, entry.name, "src/index.ts"),
  }));

// 두 프로젝트가 공유하는 설정. 각 프로젝트에서 extends: true로 상속받는다.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: workspaceAlias,
  },
  test: {
    projects: [
      // 순수 로직·타이머·스토리지 훅. jsdom으로 충분하고 빠르다.
      {
        extends: true,
        test: {
          name: "node",
          environment: "jsdom",
          include: ["packages/*/src/**/*.test.{ts,tsx}"],
          // *.browser.test.ts도 위 패턴에 걸리므로 명시적으로 제외한다.
          exclude: ["packages/*/src/**/*.browser.test.{ts,tsx}"],
          setupFiles: ["./test/setup.ts"],
        },
      },
      // 실제 레이아웃·포커스 이동·IntersectionObserver가 필요한 훅.
      // jsdom은 getBoundingClientRect가 전부 0이고 Tab 키로 포커스가 이동하지 않는다.
      {
        extends: true,
        test: {
          name: "browser",
          include: ["packages/*/src/**/*.browser.test.{ts,tsx}"],
          setupFiles: ["./test/setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
