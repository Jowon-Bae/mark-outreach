'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Send, ArrowLeft, MessageSquareHeart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './prayer.css';

export default function Prayer() {
  const router = useRouter();
  const [prayers, setPrayers] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [randomPrayer, setRandomPrayer] = useState<any>(null);
  const [showPrayerPopup, setShowPrayerPopup] = useState(false);
  const [isPrayerFadingOut, setIsPrayerFadingOut] = useState(false);

  const fetchPrayers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('community_prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPrayers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('기도제목을 입력해 주세요.');
      return;
    }

    const currentUsername = sessionStorage.getItem('username') || '익명';
    setIsSubmitting(true);

    const { error } = await supabase
      .from('community_prayers')
      .insert([{ author: currentUsername, content: content.trim() }]);

    setIsSubmitting(false);

    if (error) {
      alert('기도제목 등록에 실패했습니다.');
      return;
    }

    setContent('');
    fetchPrayers();
  };

  // 랜덤 기도 뽑기 로직
  const drawRandomPrayer = () => {
    if (prayers.length === 0) {
      alert('등록된 기도제목이 없습니다. 먼저 첫 기도제목을 나누어보세요!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * prayers.length);
    setRandomPrayer(prayers[randomIndex]);
    setIsPrayerFadingOut(false);
    setShowPrayerPopup(true);
  };

  const closePrayerPopup = () => {
    setIsPrayerFadingOut(true);
    setTimeout(() => {
      setShowPrayerPopup(false);
      setRandomPrayer(null);
    }, 1200);
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // 분 단위
    
    if (diff < 1) return '방금 전';
    if (diff < 60) return `${diff}분 전`;
    if (diff < 24 * 60) return `${Math.floor(diff / 60)}시간 전`;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="prayer-container">
      {/* 상단 헤더 */}
      <div className="prayer-header">
        <button className="back-btn" onClick={() => router.push('/')}>
          <ArrowLeft size={20} />
        </button>
        <h2>기도 릴레이 🙏</h2>
        <div style={{ width: 20 }}></div>
      </div>

      {/* 랜덤 기도 뽑기 배너 */}
      <div className="draw-prayer-banner" onClick={drawRandomPrayer}>
        <span className="dice-icon">🎲</span>
        <div className="banner-text">
          <h4>기도제목 랜덤 뽑기</h4>
          <p>지체들의 기도제목을 1개 뽑아 함께 기도해요!</p>
        </div>
      </div>

      {/* 기도 올리기 카드 */}
      <div className="write-prayer-card">
        <div className="write-header">
          <MessageSquareHeart size={18} color="var(--primary)" />
          <h3>나의 기도제목 나누기</h3>
        </div>
        <textarea
          placeholder="이곳에 사역 기간 동안 나눌 기도제목을 입력해 주세요. (올리신 기도제목은 지체들이 랜덤으로 뽑아 함께 기도합니다!)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={isSubmitting} className="submit-prayer-btn">
          <Send size={16} />
          <span>기도제목 올리기</span>
        </button>
      </div>

      {/* 기도제목 목록 피드 */}
      <div className="prayer-feed-section">
        <h3>지체들의 기도제목</h3>
        <div className="prayer-list">
          {isLoading ? (
            <div className="loading-text">로딩 중...</div>
          ) : prayers.length === 0 ? (
            <div className="empty-feed">등록된 기도제목이 없습니다. 첫 기도제목을 나누어보세요!</div>
          ) : (
            prayers.map((prayer) => (
              <div key={prayer.id} className="prayer-feed-card">
                <div className="prayer-card-header">
                  <div className="avatar">
                    {prayer.author.substring(0, 1)}
                  </div>
                  <div className="meta">
                    <span className="author">{prayer.author}</span>
                    <span className="time">{formatTime(prayer.created_at)}</span>
                  </div>
                </div>
                <p className="content">{prayer.content}</p>
                <div className="prayer-card-footer">
                  <span className="amen-badge">
                    <Heart size={12} fill="#ff4b4b" color="#ff4b4b" />
                    아멘으로 함께합니다
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 랜덤 기도 카드 팝업 */}
      {showPrayerPopup && randomPrayer && (
        <div 
          className={`welcome-popup-overlay ${isPrayerFadingOut ? 'fade-out' : 'fade-in'}`}
          onClick={closePrayerPopup}
        >
          <div className="prayer-popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="prayer-card-decor">🙏 PRAYER RELAY</div>
            <div className="prayer-card-author">👤 {randomPrayer.author} 지체의 기도제목</div>
            <p className="prayer-card-content">“ {randomPrayer.content} ”</p>
            <div className="prayer-card-footer-btns">
              <button className="prayer-card-btn close" onClick={closePrayerPopup}>아멘 (기도했습니다)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
