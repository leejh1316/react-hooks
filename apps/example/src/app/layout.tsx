import type { Metadata, Viewport } from "next";

import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { FloatingActions } from "@/components/floating-actions";
import { ThemeScript } from "@/components/theme-script";
import { ToastHost } from "@/components/toast-host";

import "./globals.css";

export const metadata: Metadata = {
  title: "Brewly · 카페 주문 데모",
  description: "@leejaehyeok/* 커스텀 훅으로 만든 모바일 카페 주문 데모 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeScript />
        <div className="bg-background mx-auto flex min-h-dvh w-full max-w-[430px] flex-col border-x">
          <AppHeader />
          <main className="flex-1 pb-24">{children}</main>
        </div>
        <BottomNav />
        <FloatingActions />
        <ToastHost />
      </body>
    </html>
  );
}
