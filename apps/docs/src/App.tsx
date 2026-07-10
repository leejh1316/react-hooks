import { Outlet, ScrollRestoration } from "react-router";
import Header from "./components/layout/Header";

function App() {
  return (
    <>
      <div className="">
        <Header />
        <div className="max-w-page mx-auto min-h-[calc(100dvh-var(--h-header)-1px)] w-full px-5">
          <Outlet />
        </div>
      </div>
      <ScrollRestoration />
    </>
  );
}

export default App;
