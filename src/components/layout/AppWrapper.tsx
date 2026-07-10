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

  // 1. 스플래시 화면 타이머 및 앱 최초 진입/백그라운드 복귀 시 세션 초기화
  useEffect(() => {
    setIsHydrated(true);
    
    // 앱 최초 실행 시 세션 초기화
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('welcomeShown');

    // 백그라운드 복귀 시 감지 (5초 이상 백그라운드에 있었을 시 로그아웃)
    let lastActive = Date.now();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timePassed = Date.now() - lastActive;
        if (timePassed > 5000) { // 5초 버퍼
          sessionStorage.removeItem('username');
          sessionStorage.removeItem('welcomeShown');
          window.location.reload(); // 강제 리로드하여 최초 스플래시 및 로그인으로 이동
        }
      } else {
        lastActive = Date.now();
      }
    };

    // 아이폰 사파리 BFCache(이전 페이지 복원 캐시) 대응
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 3000); // CSS 애니메이션(3초)과 동일하게 맞춤

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // 2. 권한 체크 및 리다이렉트 (경로 변경 시마다 실행)
  useEffect(() => {
    if (!isHydrated) return;
    
    const username = sessionStorage.getItem('username');
    if (!username && pathname !== '/login' && pathname !== '/admin') {
      router.replace('/login');
    } else if (username && pathname === '/login') {
      router.replace('/');
    }
  }, [pathname, isHydrated, router]);

  if (!isHydrated) {
    return <SplashScreen />;
  }

  const hideLayout = pathname === '/login' || pathname === '/onboarding' || pathname === '/admin';

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
