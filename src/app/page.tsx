'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import './home.css';

export default function Home() {
  const router = useRouter();
  
  // 웰컴 팝업 상태
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

  // 랜덤 기도 뽑기 상태
  const [randomPrayer, setRandomPrayer] = useState<any>(null);
  const [showPrayerPopup, setShowPrayerPopup] = useState(false);
  const [isPrayerFadingOut, setIsPrayerFadingOut] = useState(false);

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

  // 랜덤 기도 뽑기 로직
  const drawRandomPrayer = async () => {
    const { data, error } = await supabase
      .from('community_prayers')
      .select('*');
      
    if (error || !data || data.length === 0) {
      alert('지체들이 올린 기도제목이 아직 없습니다. 먼저 본인의 기도제목을 나눔방에 등록해 주세요! 🚀');
      router.push('/prayer');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * data.length);
    setRandomPrayer(data[randomIndex]);
    setIsPrayerFadingOut(false);
    setShowPrayerPopup(true);
  };

  const closePrayerPopup = () => {
    setIsPrayerFadingOut(true);
    setTimeout(() => {
      setShowPrayerPopup(false);
      setRandomPrayer(null);
    }, 1200); // 1.2초 페이드 아웃
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
