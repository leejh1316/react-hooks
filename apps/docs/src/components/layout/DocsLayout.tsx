import { TOC } from "@timeless-ui/react";
import { useState } from "react";
import { Outlet } from "react-router";
import OnThisPage from "./OnThisPage";
import Sidebar from "./Sidebar";

const TOC_SEARCH_TAGS = ['[data-document-element="heading1"]', '[data-document-element="heading2"]', '[data-document-element="heading3"]'];

const DocsLayout = () => {
  const [contentRef, setContentRef] = useState<HTMLElement | null>(null);
  return (
    <div className="grid grid-cols-12 gap-x-4">
      <Sidebar className="sticky top-[calc(var(--h-header)+1px)] hidden h-[calc(100dvh-var(--h-header)-1px)] overflow-auto pt-5 md:col-span-3 md:block xl:col-span-2" />
      <main className="col-span-12 pt-5 md:col-span-9 xl:col-span-8 xl:px-10" ref={setContentRef}>
        <Outlet />
      </main>
      <TOC.Root targetElement={contentRef} searchTags={TOC_SEARCH_TAGS}>
        <TOC.Observer rootMargin="-64px 0px -15% 0px" />
        <OnThisPage className="sticky top-[calc(var(--h-header)+1px)] hidden h-[calc(100dvh-var(--h-header)-1px)] overflow-y-auto pt-5 md:col-span-2 xl:col-span-2 xl:block" />
      </TOC.Root>
    </div>
  );
};

export default DocsLayout;
