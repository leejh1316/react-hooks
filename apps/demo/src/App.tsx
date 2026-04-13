import { Suspense, useEffect, useState } from "react";
import "./App.css";
import { hookRegistry } from "./hooks/registry";

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const handler = () => setHash(window.location.hash.slice(1));
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return hash;
}

function HomePage() {
  return (
    <div className="home">
      <header className="app-header">
        <h1>@leejaehyeok/react-hooks</h1>
        <p>접근성을 고려한 React Custom Hooks 모음</p>
      </header>
      <div className="hook-grid">
        {hookRegistry.map((hook) => (
          <a key={hook.id} className="hook-card" href={`#${hook.id}`}>
            <div className="hook-card-top">
              <code className="hook-name">{hook.name}</code>
              <div className="hook-tags">
                {hook.tags?.map((tag) => (
                  <span key={tag} className="hook-tag">{tag}</span>
                ))}
              </div>
            </div>
            <p className="hook-desc">{hook.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const hook = hookRegistry.find((h) => h.id === hash);

  if (!hook) return <HomePage />;

  const { Page } = hook;

  return (
    <div className="app">
      <nav className="page-nav">
        <a className="back-btn" href="#">
          ← 목록으로
        </a>
        <code className="nav-hook-name">{hook.name}</code>
      </nav>
      <main>
        <Suspense fallback={<div className="loading">Loading…</div>}>
          <Page />
        </Suspense>
      </main>
    </div>
  );
}
