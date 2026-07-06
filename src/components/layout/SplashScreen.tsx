'use client';

import { useEffect, useState } from 'react';
import './splash.css';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // 앱이 처음 구동될 때(새로고침 시) 무조건 스플래시를 보여줌
    setShowSplash(true);
    
    // 2.5초 뒤에 스플래시 화면 숨김
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <div className="splash-container">
      <div className="splash-logo-wrapper pulse">
        <div className="splash-logo" />
      </div>
    </div>
  );
}
