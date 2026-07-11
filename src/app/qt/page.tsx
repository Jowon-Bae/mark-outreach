'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BookOpen, CheckCircle, ArrowLeft, Users, Heart, Send, MessageSquareHeart, Lightbulb, Sparkles, Dices, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './qt.css';

// 묵상 콘텐츠 데이터 (날짜별 매핑)
interface QTContent {
  passage: string;
  title: string;
  verses: string;
  meditation: string;
}

const QT_DATA: Record<string, QTContent> = {
  '2026-07-10': {
    passage: '시편 114편 1~8절',
    title: '반석을 변하여 못이 되게 하시는 하나님',
    verses: '“여호와 앞 곧 야곱의 하나님 앞에서 땅이여 떨지어다 그가 반석을 쳐서 못물이 되게 하시며 차돌로 샘물이 되게 하셨도다”',
    meditation: '이스라엘이 애굽에서 나올 때 하나님은 굳은 반석에서 샘물이 터지게 하셨습니다. 우리의 아웃리치 현장이 아무리 척박하고 굳게 닫혀 있는 곳일지라도, 하나님의 임재가 함께하시면 메마른 심령이 은혜의 샘물로 변화될 줄 믿습니다. 오늘 하루 주님의 일하심을 기대하며 나아갑시다.'
  },
  '2026-07-11': {
    passage: '시편 115편 1~8절',
    title: '오직 주의 이름에만 영광을 돌리소서',
    verses: '“여호와여 영광을 우리에게 돌리지 마옵소서 우리에게 돌리지 마옵소서 오직 주는 인자하시고 진실하시므로 주의 이름에만 영광을 돌리소서”',
    meditation: '세상은 헛된 우상과 자신의 능력을 의지하지만, 우리는 오직 크고 인자하신 하나님만을 의지합니다. 아웃리치 사역의 모든 과정 속에서 우리의 의나 자랑은 철저히 감추어지고, 오직 우리를 통해 일하시는 하나님의 이름만이 높임 받으시기를 기도합니다.'
  },
  '2026-07-12': {
    passage: '시편 115편 9~18절',
    title: '여호와를 의지하는 자를 도우시는 주',
    verses: '“여호와를 경외하는 자들아 너희는 여호와를 의지하여라 그는 너희의 도움이시요 너희의 방패시로다”',
    meditation: '하나님은 주님을 경외하고 의지하는 자들의 도움이 되시며 방패가 되어 주십니다. 사역의 마지막 날, 육체적으로 지치고 피곤할 수 있지만 끝까지 우리를 도우시고 복 주시는 하나님을 온전히 의지합시다. 삶의 모든 영역에서 주님을 찬양하는 예배자로 살아가기를 결단합시다.'
  }
};

const DEFAULT_QT: QTContent = {
  passage: '마가복음 1장 35절',
  title: '새벽 오히려 미명에 기도하신 예수님',
  verses: '“새벽 아직도 밝기 전에 예수께서 일어나 나가 한적한 곳으로 가사 거기서 기도하시더니”',
  meditation: '아웃리치 사역의 첫출발과 모든 능력의 원천은 바로 기도에 있습니다. 바쁜 사역 일정 중에서도 예수님처럼 한적한 곳에서 조용히 하나님을 마주하고 기도로 하루를 준비하여 주의 은혜를 풍성히 누리는 날이 됩시다.'
};

export default function QuietTime() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'qt' | 'prayer'>('qt');
  const [dateStr, setDateStr] = useState('');
  const [qt, setQt] = useState<QTContent>(DEFAULT_QT);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedUsers, setCompletedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 기도제목 상태
  const [prayers, setPrayers] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrayersLoading, setIsPrayersLoading] = useState(true);
  const [randomPrayer, setRandomPrayer] = useState<any>(null);
  const [showPrayerPopup, setShowPrayerPopup] = useState(false);
  const [isPrayerFadingOut, setIsPrayerFadingOut] = useState(false);

  const fetchQTCompletions = async (dateKey: string) => {
    setIsLoading(true);
    const currentUsername = localStorage.getItem('username') || '';

    // 오늘 날짜 완료자 조회
    const { data, error } = await supabase
      .from('qt_completions')
      .select('user_name')
      .eq('date_str', dateKey);

    if (!error && data) {
      const users = data.map((item: any) => item.user_name);
      setCompletedUsers(users);
      
      // 로그인한 사용자가 오늘 완료했는지 확인
      if (currentUsername && users.includes(currentUsername)) {
        setIsCompleted(true);
      }
    }
    setIsLoading(false);
  };

  const fetchPrayers = async () => {
    setIsPrayersLoading(true);
    const { data, error } = await supabase
      .from('community_prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPrayers(data);
    }
    setIsPrayersLoading(false);
  };

  useEffect(() => {
    // 오늘 날짜 계산 (KST 기준)
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const kstDate = new Date(today.getTime() - offset);
    const kstDateString = kstDate.toISOString().split('T')[0];
    
    setDateStr(kstDateString);
    setQt(QT_DATA[kstDateString] || DEFAULT_QT);

    fetchQTCompletions(kstDateString);
    fetchPrayers();
  }, []);

  const handleComplete = async () => {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isCompleted) return;

    const { error } = await supabase
      .from('qt_completions')
      .insert([{ user_name: currentUsername, date_str: dateStr }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint error
        setIsCompleted(true);
      } else {
        alert('묵상 완료 기록에 실패했습니다.');
        return;
      }
    }

    setIsCompleted(true);
    fetchQTCompletions(dateStr);
  };

  const handlePrayerSubmit = async () => {
    if (!content.trim()) {
      alert('기도제목을 입력해 주세요.');
      return;
    }

    const currentUsername = localStorage.getItem('username') || '익명';
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
    <div className="qt-container">
      <div className="sticky-header-wrapper">
        {/* 상단 헤더 */}
        <div className="qt-header">
          <button className="back-btn" onClick={() => router.push('/')}>
            <ArrowLeft size={20} />
          </button>
          <h2>묵상 & 기도</h2>
          <div style={{ width: 20 }}></div>
        </div>

        {/* 상단 서브 탭 */}
        <div className="top-tab-bar">
          <button 
            className={`tab-item ${activeTab === 'qt' ? 'active' : ''}`}
            onClick={() => setActiveTab('qt')}
          >
            오늘의 QT
          </button>
          <button 
            className={`tab-item ${activeTab === 'prayer' ? 'active' : ''}`}
            onClick={() => setActiveTab('prayer')}
          >
            기도 릴레이
          </button>
        </div>
      </div>

      {activeTab === 'qt' ? (
        <div className="qt-tab-content">
          {/* 날짜 표시 */}
          <div className="qt-date-card">
            <span className="qt-label">TODAY'S BREAD</span>
            <span className="qt-date">{dateStr}</span>
          </div>

          {/* 말씀 카드 */}
          <div className="qt-card">
            <span className="qt-passage-badge">{qt.passage}</span>
            <h3 className="qt-title">{qt.title}</h3>
            <div className="qt-verses">
              <p>{qt.verses}</p>
            </div>
          </div>

          {/* 묵상 가이드 */}
          <div className="meditation-card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={16} />
              <span>오늘의 묵상 나눔</span>
            </h4>
            <p className="meditation-text">{qt.meditation}</p>
          </div>

          {/* 완료 상태 버튼 */}
          <div className="action-section">
            {isCompleted ? (
              <div className="completed-badge">
                <CheckCircle size={20} color="#1b64da" />
                <span>오늘의 말씀 묵상을 완료했습니다! 은혜로운 하루 보내세요.</span>
              </div>
            ) : (
              <button className="complete-btn" onClick={handleComplete} disabled={isLoading}>
                <CheckCircle size={20} />
                <span>오늘 말씀 묵상 완료하기</span>
              </button>
            )}
          </div>

          {/* 실시간 묵상 완료자 목록 */}
          <div className="completions-card">
            <div className="completions-header">
              <Users size={16} />
              <h4>오늘 묵상을 완료한 지체들 ({completedUsers.length}명)</h4>
            </div>
            <div className="completions-list">
              {isLoading ? (
                <div className="loading-text">로딩 중...</div>
              ) : completedUsers.length === 0 ? (
                <div className="no-completions">가장 먼저 오늘의 말씀을 묵상해 보세요!</div>
              ) : (
                <div className="completions-tags">
                  {completedUsers.map((name, index) => (
                    <span key={index} className="completion-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      <span>{name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="prayer-tab-content">
          {/* 랜덤 기도 뽑기 배너 */}
          <div className="draw-prayer-banner" onClick={drawRandomPrayer}>
            <Dices size={32} className="dice-icon" style={{ color: 'white' }} />
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
            <button onClick={handlePrayerSubmit} disabled={isSubmitting} className="submit-prayer-btn">
              <Send size={16} />
              <span>기도제목 올리기</span>
            </button>
          </div>

          {/* 기도제목 목록 피드 */}
          <div className="prayer-feed-section">
            <h3>지체들의 기도제목</h3>
            <div className="prayer-list">
              {isPrayersLoading ? (
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
                <div className="prayer-card-decor" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Sparkles size={12} />
                  <span>PRAYER RELAY</span>
                </div>
                <div className="prayer-card-author" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <User size={14} />
                  <span>{randomPrayer.author} 지체의 기도제목</span>
                </div>
                <p className="prayer-card-content">“ {randomPrayer.content} ”</p>
                <div className="prayer-card-footer-btns">
                  <button className="prayer-card-btn close" onClick={closePrayerPopup}>아멘 (기도했습니다)</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
