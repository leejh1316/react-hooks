/**
 * hydration 이전에 저장된 테마를 적용해 화면 깜빡임을 막는다.
 * (useLocalStorage가 JSON.stringify로 저장하므로 동일하게 JSON.parse로 읽는다.)
 */
const themeScript = `(function(){try{var raw=window.localStorage.getItem("brewly/theme");if(raw&&JSON.parse(raw)==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
