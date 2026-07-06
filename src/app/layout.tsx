import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SplashScreen from "@/components/layout/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
  title: "마가공동체 아웃리치",
  description: "서울드림교회 마가공동체 국내 아웃리치 앱",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div id="app-container">
          <SplashScreen />
          <Header />
          <main className="main-content">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
