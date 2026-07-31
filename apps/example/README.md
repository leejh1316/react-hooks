# Brewly · 카페 주문 데모 앱

`@leejaehyeok/*` 커스텀 훅들을 **실제 서비스 흐름**에 넣어 본 데모 앱입니다.
훅 하나하나를 설명하는 문서(`apps/docs`)와 달리, 여러 훅이 한 화면에서 어떻게 맞물리는지를 보여줍니다.

- **주제**: 모바일 카페 주문 앱 (메뉴 탐색 → 장바구니 → 주문 / 리뷰 / 마이)
- **화면 크기**: 모바일 폭(430px) 고정 · PC 브라우저에서는 가운데 정렬된 프레임으로 표시
- **스택**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui

## 실행

```bash
pnpm run dev:example
```

http://localhost:3020 에서 확인할 수 있습니다. (docs 앱은 3000번 포트를 사용합니다)

> 훅 패키지는 각 패키지의 `dist`를 그대로 참조합니다. `packages/*`의 소스를 수정했다면 `pnpm run build:packages`로 다시 빌드한 뒤 확인하세요.

```bash
pnpm run build:example
```

## 화면과 훅 매핑

앱 우측 하단의 **`{ } 훅 N`** 버튼을 누르면, 현재 화면에서 사용한 훅 목록을 바텀시트로 확인할 수 있습니다.

### 홈 `/`

| 훅                             | 사용처                                                                 |
| ------------------------------ | ---------------------------------------------------------------------- |
| `useThrottle`                  | 스크롤 시 헤더 축소, '맨 위로' 버튼 노출 (`src/hooks/use-scrolled.ts`) |
| `useSnooze`                    | 프로모션 배너 '오늘 하루 보지 않기' (24시간)                           |
| `useDebounce`                  | 검색어 입력 300ms 디바운스 (`leading: false`)                          |
| `useComposedState`             | 최근 검색어 클릭 시 입력값 + 검색어 상태를 한 번에 갱신                |
| `useLocalStorage`              | 최근 검색어 · 장바구니 저장                                            |
| `useDeferredLoading`           | 검색 스켈레톤 (150ms 안에 끝나면 미노출, 노출되면 350ms 유지)          |
| `useRovingFocus`               | 카테고리 칩 ← → · Home / End 키 이동, roving tabindex                  |
| `useOverflow`                  | 칩이 넘칠 때만 '전체 보기' 버튼 노출                                   |
| `useComposeRef`                | 하나의 칩 컨테이너에 roving ref + overflow ref 합성                    |
| `useIntersectionObserver`      | 목록 하단 sentinel 기반 무한 스크롤                                    |
| `useIntersectionObserverGroup` | 메뉴 카드 노출(impression) 집계 — 옵저버 1개로 전체 카드 관찰          |
| `useFocusTrap`                 | 메뉴 상세 바텀시트 포커스 가두기 + `[data-initial-focus]` 초기 포커스  |
| `useLatestRef`                 | 바텀시트 Escape 핸들러, 토스트 자동 닫기 타이머                        |
| `useControllableState`         | 수량 스테퍼 (상세 시트에서는 **비제어** 모드)                          |
| `usePrevRef`                   | 수량 증감 방향에 따른 숫자 애니메이션                                  |
| `useCustomEventState`          | Provider 없이 전역 토스트 (`src/hooks/use-toast.ts`)                   |

### 장바구니 `/cart`

| 훅                     | 사용처                                                                 |
| ---------------------- | ---------------------------------------------------------------------- |
| `useLocalStorage`      | 장바구니 영속화 · 같은 탭 컴포넌트 동기화 · `subscribe`로 다른 탭 반영 |
| `useControllableState` | 수량 스테퍼 (**제어** 모드 — 장바구니 상태가 곧 값)                    |
| `usePrevRef`           | 결제 예정 금액의 증감(+/-) 표시                                        |
| `useDeferredLoading`   | 주문 처리 버튼 로딩 상태                                               |
| `useFocusTrap`         | 주문 완료 / 전체 삭제 확인 시트                                        |

### 리뷰 `/reviews`

| 훅                   | 사용처                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| `usePagination`      | 47건 리뷰 페이지네이션 (`siblings` / `boundaries` / ellipsis / skip 이동) |
| `useSessionStorage`  | 마지막으로 보던 페이지 기억 → `usePagination`의 제어 모드 값으로 사용     |
| `useDeferredLoading` | 페이지 전환 스켈레톤                                                      |
| `usePrevRef`         | `이전 → 현재` 페이지 이동 표시                                            |
| `useRovingFocus`     | 평점 필터 칩 키보드 이동                                                  |

### 마이 `/me`

| 훅                  | 사용처                                          |
| ------------------- | ----------------------------------------------- |
| `useLocalStorage`   | 다크 모드 · 혜택 알림 · 닉네임                  |
| `useSessionStorage` | 최근 본 메뉴                                    |
| `useDebounce`       | 닉네임 입력 500ms 후 자동 저장                  |
| `browserStorage`    | 배너 스누즈 만료 시각 조회 / 데모 데이터 초기화 |
| `useFocusTrap`      | 데이터 초기화 확인 시트                         |

## 구조

```
src/
├── app/                 # 라우트 (홈 / cart / reviews / me)
├── components/          # 앱 공통 UI
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── bottom-sheet.tsx # useFocusTrap + useComposeRef + useLatestRef
│   └── quantity-stepper.tsx  # useControllableState + usePrevRef
├── features/            # 화면 단위 기능 (home / cart / reviews / me)
├── hooks/               # 앱 전용 훅 (use-cart, use-toast, use-scrolled …)
└── lib/                 # 목 데이터 · 타입 · 유틸
```

## SSR 관련 메모

스토리지를 읽는 훅(`useLocalStorage`, `useSessionStorage`, `useSnooze`)은 서버에서는 저장값을 알 수 없어
기본값을 반환합니다. 그대로 렌더링하면 hydration 불일치가 나기 때문에,
해당 UI는 `ClientOnly`(`src/components/client-only.tsx`)로 감싸 **마운트 이후**에 그립니다.
테마는 깜빡임을 막기 위해 `ThemeScript`에서 hydration 이전에 `<html>`에 클래스를 적용합니다.
