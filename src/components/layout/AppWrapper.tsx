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

  // 1. 스플래시 화면 타이머 및 앱 최초 진입 시 세션 초기화
  useEffect(() => {
    setIsHydrated(true);
    
    // 앱을 새로 실행하거나 페이지를 처음 로드할 때 로그인 정보와 팝업 상태를 강제로 초기화
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('welcomeShown');

    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 3000); // CSS 애니메이션(3초)과 동일하게 맞춤
    return () => clearTimeout(timer);
  }, []);

  // 2. 권한 체크 및 리다이렉트 (경로 변경 시마다 실행)
  useEffect(() => {
    if (!isHydrated) return;
    
    const username = sessionStorage.getItem('username');
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
