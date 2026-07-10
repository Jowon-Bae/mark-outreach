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

  // 1. 스플래시 화면 타이머 및 아이폰 사파리 캐시 대응
  useEffect(() => {
    setIsHydrated(true);

    // 아이폰 사파리 BFCache(이전 페이지 복원 캐시) 대응
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 3000); // CSS 애니메이션(3초)과 동일하게 맞춤

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Web 푸시 구독 신청 및 Supabase 저장
  const subscribeToPush = async (registration: ServiceWorkerRegistration) => {
    try {
      const publicVapidKey = 'BB611KNZS2KvEkk7Nystn0Mvdk35Cdks3yaRJy8txCNb0FAHiIcLw8S9nHVK-NbZEiOM8F4dFEsN-n7V0oxIGlA';
      
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey
        });
      }
      
      const { supabase: supabaseClient } = await import('@/lib/supabaseClient');
      
      // 중복 저장 방지 검사
      const { data, error } = await supabaseClient
        .from('push_subscriptions')
        .select('*')
        .eq('subscription->>endpoint', subscription.endpoint);
        
      if (!error && (!data || data.length === 0)) {
        await supabaseClient
          .from('push_subscriptions')
          .insert([{ subscription: subscription }]);
      }
    } catch (e) {
      console.error('Push subscription failed:', e);
    }
  };

  // 서비스 워커 등록 및 푸시 수신 권한 유도
  useEffect(() => {
    if (!isHydrated) return;
    
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(async (registration) => {
          console.log('Service Worker registered:', registration.scope);
          
          const permission = Notification.permission;
          if (permission === 'default') {
            // 스플래시 화면 종료 후 5초 후 알림 신청 팝업 유도
            setTimeout(() => {
              Notification.requestPermission().then(async (newPermission) => {
                if (newPermission === 'granted') {
                  await subscribeToPush(registration);
                }
              });
            }, 5000);
          } else if (permission === 'granted') {
            await subscribeToPush(registration);
          }
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, [isHydrated]);

  // 2. 권한 체크 및 리다이렉트 (경로 변경 시마다 실행)
  useEffect(() => {
    if (!isHydrated) return;
    
    const username = localStorage.getItem('username');
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
