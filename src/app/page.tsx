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
    }, 1200); // fade-out 애니메이션 시간(1.2초)에 맞춤
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
            <div className="welcome-overlay-text">
              {username} 님 환영합니다!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
