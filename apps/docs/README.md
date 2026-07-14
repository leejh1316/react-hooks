# @leejaehyeok/react-hooks 문서

React Hooks 라이브러리의 문서화 사이트입니다.

현재 작성된 문서

- Hook: 7

## Docs Prompt

```md
목표: @apps/docs/src/pages/docs/ 에 hooks 문서 페이지를 추가
타겟: @packages/use-deferred-loading/src/useDeferredLoading.ts

참고자료:

- @apps/docs/src/pages/docs/hooks/use-focus-trap/UseFocusTrapPage.tsx
- @apps/docs/src/pages/docs/hooks/use-browser-storage/UseBrowserStoragePage.tsx

규칙:

- 참고자료와 동일한형태의 UI 레이아웃으로 훅 Docs 문서 페이지 제작
- 해당 훅에서 export하고있고 개발자가 사용할 수 있는 모든것에 대해 설명하는 문서.
- 섹션의 개수는 자유롭게 구성, 단 구성의 순서는 유지
- 데모의 개수는 자유롭게 구성
- 필수적으로 들어가야 하는 내용
  -- Hook에 대한 설명
  -- Hook 동작 설명
  -- Hook 설치 방법
  -- Hook 사용 방법과 코드 스니펫
  -- Hook 데모(적용/미적용)
  -- Hook 옵션 설명
  -- Hook Agent Skill 섹션

작업이후: @apps/docs/src/router/router.tsx 에 DOCS 문서 페이지 링크 연결
```
