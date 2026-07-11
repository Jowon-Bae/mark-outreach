import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SplashScreen from "@/components/layout/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
  title: "마가 공동체 국내 아웃리치",
  description: "서울드림교회 마가공동체 국내 아웃리치 앱",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "마가 공동체 국내 아웃리치",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import AppWrapper from "@/components/layout/AppWrapper";
import PageTracker from "@/components/PageTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <PageTracker />
        <div id="app-container">
          <AppWrapper>{children}</AppWrapper>
        </div>
      </body>
    </html>
  );
}
