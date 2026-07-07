'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지는 통계에서 제외
    if (pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      const username = localStorage.getItem('username') || '익명';
      
      // 메뉴 이름 매핑
      let menuName = '기타';
      if (pathname === '/home' || pathname === '/') menuName = '홈';
      else if (pathname === '/calendar') menuName = '일정';
      else if (pathname === '/community') menuName = '자유게시판';
      else if (pathname === '/gallery') menuName = '사진첩';
      else if (pathname === '/mypage') menuName = '마이페이지';

      await supabase.from('page_visits').insert([
        { user_name: username, path: menuName }
      ]);
    };

    trackVisit();
  }, [pathname]);

  return null; // 화면에 아무것도 그리지 않고 백그라운드에서만 동작
}
