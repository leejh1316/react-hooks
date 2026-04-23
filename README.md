# @leejaehyeok/react-hooks

유용한 React Hook을 만들고 배포하고 있습니다.

---

## 패키지

| 패키지                                                                           | 버전  | 설명               |
| -------------------------------------------------------------------------------- | ----- | ------------------ |
| [`@leejaehyeok/use-compose-ref`](./packages/use-compose-ref)                     | 0.1.0 | 여러 ref 합성 관리 |
| [`@leejaehyeok/use-controllable-state`](./packages/use-controllable-state)       | 0.1.0 | 제어/비제어 상태   |
| [`@leejaehyeok/use-debounce`](./packages/use-debounce)                           | 0.1.0 | 함수 호출 지연     |
| [`@leejaehyeok/use-deferred-loading`](./packages/use-deferred-loading)           | 0.1.0 | 지연 로딩          |
| [`@leejaehyeok/use-focus-trap`](./packages/use-focus-trap)                       | 0.1.0 | 포커스 범위 제한   |
| [`@leejaehyeok/use-intersection-observer`](./packages/use-intersection-observer) | 0.1.0 | 요소 가시성 추적   |
| [`@leejaehyeok/use-latest-ref`](./packages/use-latest-ref)                       | 0.1.0 | 최신값 ref         |
| [`@leejaehyeok/use-overflow`](./packages/use-overflow)                           | 0.1.0 | 오버플로우 감지    |
| [`@leejaehyeok/use-pagination`](./packages/use-pagination)                       | 0.1.0 | 페이지 관리        |
| [`@leejaehyeok/use-prev-ref`](./packages/use-prev-ref)                           | 0.1.0 | 이전값 저장        |
| [`@leejaehyeok/use-roving-focus`](./packages/use-roving-focus)                   | 0.1.0 | 키보드 포커스 관리 |
| [`@leejaehyeok/use-snooze`](./packages/use-snooze)                               | 0.1.0 | 지연 처리          |
| [`@leejaehyeok/use-throttle`](./packages/use-throttle)                           | 0.1.0 | 함수 호출 제한     |

---

## 스크립트

```bash
pnpm dev             # 데모 앱 시작 (패키지 src를 직접 별칭으로 사용)
pnpm build           # 모든 패키지 + 데모 앱 빌드
pnpm preview         # 패키지 빌드 후 빌드된 dist로 데모 미리보기
pnpm build:packages  # 패키지만 빌드
```

---

## 새로운 hook 패키지 추가하기

### 1. 패키지 디렉토리 생성

```
packages/use-your-hook/
  src/
    index.ts
    useYourHook.ts
  package.json
  tsconfig.json
  vite.config.ts
```

### 2. `package.json`

```json
{
  "name": "@leejaehyeok/use-your-hook",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "peerDependencies": {
    "react": ">=18"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "typescript": "~6.0.2",
    "vite": "^8.0.4",
    "vite-plugin-dts": "^4.0.0"
  }
}
```

### 3. `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationDir": "dist",
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### 4. `vite.config.ts`

```ts
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: ["src"], insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
});
```

### 5. `apps/demo/vite.config.ts`에 별칭 추가

```ts
alias: command === 'serve'
  ? {
      '@leejaehyeok/use-roving-focus': resolve(__dirname, '../../packages/use-roving-focus/src/index.ts'),
      // 새 항목 추가:
      '@leejaehyeok/use-your-hook': resolve(__dirname, '../../packages/use-your-hook/src/index.ts'),
    }
  : {},
```

### 6. `apps/demo/package.json`에 의존성 추가

```json
"dependencies": {
  "@leejaehyeok/use-your-hook": "workspace:*"
}
```

### 7. `pnpm install` 실행 후 개발 시작

```bash
pnpm install
pnpm dev
```

---

## 프로젝트 구조

```
react-hooks/
├── apps/
│   └── demo/                  # 데모 앱 (GitHub Pages)
├── packages/
│   └── use-roving-focus/      # @leejaehyeok/use-roving-focus
├── tsconfig.base.json         # 공유 TS 설정
├── pnpm-workspace.yaml
└── package.json
```
