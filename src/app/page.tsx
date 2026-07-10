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
        {/* 1. SOS 긴급버튼 */}
        <div className="home-top-bar">
          <a href="tel:010-1234-5678" className="home-sos-btn">
            <span className="sos-dot"></span>
            <span>SOS 긴급 본부</span>
          </a>
        </div>

        {/* 2. 메인 로고/타이틀 영역 */}
        <div className="home-main-section">
          <div className="home-logo-wrap">
            <img src="/assets/logo_transparent.png" alt="Logo" className="home-logo-image" />
          </div>
          <h1 className="home-title-text">MARK OUTREACH</h1>
          <p className="home-desc-text">2026 국내 아웃리치</p>
        </div>

        {/* 3. 4대 기능 대시보드 그리드 */}
        <div className="home-dashboard-grid">
          <button className="dashboard-card" onClick={() => router.push('/teams')}>
            <span className="card-icon">👥</span>
            <span className="card-title">조직원 연락망</span>
            <span className="card-desc">팀원 연락처 검색</span>
          </button>
          
          <button className="dashboard-card draw-prayer" onClick={drawRandomPrayer}>
            <span className="card-icon">🎲</span>
            <span className="card-title">기도제목 뽑기</span>
            <span className="card-desc">릴레이 중보기도</span>
          </button>
          
          <button className="dashboard-card" onClick={() => router.push('/qt')}>
            <span className="card-icon">📖</span>
            <span className="card-title">오늘의 QT</span>
            <span className="card-desc">말씀 묵상 완료</span>
          </button>
          
          <button className="dashboard-card" onClick={() => router.push('/safety')}>
            <span className="card-icon">🚨</span>
            <span className="card-title">안전 & 지도</span>
            <span className="card-desc">비상대응 및 사역지</span>
          </button>
        </div>
      </div>

      {/* 웰컴 팝업 */}
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

      {/* 랜덤 기도 카드 팝업 (터치하면 닫힘) */}
      {showPrayerPopup && randomPrayer && (
        <div 
          className={`welcome-popup-overlay ${isPrayerFadingOut ? 'fade-out' : 'fade-in'}`}
          onClick={closePrayerPopup}
        >
          <div className="prayer-popup-card">
            <div className="prayer-card-decor">🙏 PRAYER RELAY</div>
            <div className="prayer-card-author">👤 {randomPrayer.author} 지체의 기도제목</div>
            <p className="prayer-card-content">“ {randomPrayer.content} ”</p>
            <div className="prayer-card-footer-btns" onClick={(e) => e.stopPropagation()}>
              <button className="prayer-card-btn close" onClick={closePrayerPopup}>아멘 (닫기)</button>
              <button className="prayer-card-btn write" onClick={() => {
                closePrayerPopup();
                router.push('/prayer');
              }}>나도 기도 올리기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
