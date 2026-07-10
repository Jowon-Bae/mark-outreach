'use client';

import { useState, useEffect } from 'react';
import './home.css';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem('username') || '';
      const welcomeShown = sessionStorage.getItem('welcomeShown');
      if (user && !welcomeShown) {
        return true;
      }
    }
    return false;
  });

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('username') || '';
    }
    return '';
  });

  useEffect(() => {
    if (showWelcome) {
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [showWelcome]);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 1200); // fade-out 애니메이션 시간(1.2초)에 맞춤
  };

  return (
    <>
      <div className="home-container">
        {/* 그래피티 배경 이미지만 온전히 보이도록 다른 요소들은 임시로 비워둡니다 */}
      </div>

      {showWelcome && (
        <div 
          className={`welcome-popup-overlay ${isFadingOut ? 'fade-out' : 'fade-in'}`}
          onClick={handleClose}
        >
          <div className="welcome-popup-content">
            <div className="welcome-overlay-text">
              <span className="welcome-name">{username} 님</span>
              <br />
              <span className="welcome-greet">환영합니다!</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
