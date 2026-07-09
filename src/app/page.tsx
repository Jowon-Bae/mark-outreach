'use client';

import { useState, useEffect } from 'react';
import './home.css';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 세션 스토리지에서 username 조회
    const user = sessionStorage.getItem('username') || '';
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    
    if (user && !welcomeShown) {
      setUsername(user);
      setShowWelcome(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 400); // fade-out 애니메이션 시간(0.4초)에 맞춤
  };

  return (
    <div className="home-container">
      {/* 그래피티 배경 이미지만 온전히 보이도록 다른 요소들은 임시로 비워둡니다 */}

      {showWelcome && (
        <div 
          className={`welcome-popup-overlay ${isFadingOut ? 'fade-out' : 'fade-in'}`}
          onClick={handleClose}
        >
          <div className="welcome-popup-content" onClick={(e) => e.stopPropagation()}>
            <p className="welcome-message">
              <strong>{username}</strong> 님<br />
              마가공동체 국내 아웃리치에<br />
              함께 하시게 된 것을<br />
              진심으로 환영합니다!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
