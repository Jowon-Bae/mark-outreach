'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from './SplashScreen';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isSplash, setIsSplash] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 1. 스플래시 화면 타이머 (처음 한 번만 실행)
  useEffect(() => {
    setIsHydrated(true);
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 3000); // CSS 애니메이션(3초)과 동일하게 맞춤
    return () => clearTimeout(timer);
  }, []);

  // 2. 권한 체크 및 리다이렉트 (경로 변경 시마다 실행)
  useEffect(() => {
    if (!isHydrated) return;
    
    const username = localStorage.getItem('username');
    if (!username && pathname !== '/login') {
      router.replace('/login');
    } else if (username && pathname === '/login') {
      router.replace('/');
    }
  }, [pathname, isHydrated, router]);

  if (!isHydrated) {
    return <SplashScreen />;
  }

  const hideLayout = pathname === '/login' || pathname === '/onboarding';

  return (
    <>
      {isSplash && <SplashScreen />}
      {!hideLayout && <Header />}
      <main 
        className={hideLayout ? "" : "main-content"} 
        style={{ display: isSplash ? 'none' : 'block' }}
      >
        {children}
      </main>
      {!hideLayout && <BottomNav />}
    </>
  );
}
