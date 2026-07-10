'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Megaphone, Plus, Trash2, X, Lock } from 'lucide-react';
import './home.css';

// 오디오 컨텍스트 전역 선언 및 브라우저 보안 해제(잠금 해제)
let sharedAudioCtx: AudioContext | null = null;

const initAudioContext = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtxClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
  } catch (e) {
    console.error('Failed to init AudioContext:', e);
  }
};

if (typeof window !== 'undefined') {
  const unlock = () => {
    initAudioContext();
    window.removeEventListener('click', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('click', unlock);
  window.addEventListener('touchstart', unlock);
}

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

  // 실시간 공지사항 상태
  const [notice, setNotice] = useState<string>('');
  const [noticePostId, setNoticePostId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNoticeInput, setShowNoticeInput] = useState(false);
  const [newNoticeText, setNewNoticeText] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 실시간 공지 팝업 알림 상태
  const [showNoticeAlert, setShowNoticeAlert] = useState(false);
  const [alertNoticeContent, setAlertNoticeContent] = useState('');
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);

  // 랜덤 기도 뽑기 상태
  const [randomPrayer, setRandomPrayer] = useState<any>(null);
  const [showPrayerPopup, setShowPrayerPopup] = useState(false);
  const [isPrayerFadingOut, setIsPrayerFadingOut] = useState(false);

  // Web Audio API 기반 알림음 합성음 재생
  const playNotificationSound = () => {
    try {
      initAudioContext();
      if (!sharedAudioCtx) return;
      const ctx = sharedAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      
      // 첫 번째 음 (도5 - 523.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);
      
      // 두 번째 음 (솔5 - 783.99Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.12);
      gain2.gain.setValueAtTime(0.12, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.12 + 0.45);
    } catch (e) {
      console.error('Audio play failed:', e);
    }
  };

  useEffect(() => {
    if (showWelcome) {
      sessionStorage.setItem('welcomeShown', 'true');
    }
    // 관리자 세션 체크
    if (typeof window !== 'undefined') {
      setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
    }
    fetchLatestNotice();

    // 5초마다 실시간 공지사항 체크
    const interval = setInterval(fetchLatestNotice, 5000);
    return () => clearInterval(interval);
  }, [showWelcome]);

  // 실시간 공지글 불러오기
  const fetchLatestNotice = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const latest = data.find((post: any) => post.content.startsWith('[공지]'));
      if (latest) {
        const cleanContent = latest.content.replace('[공지]', '').trim();
        setNotice(cleanContent);
        setNoticePostId(latest.id);

        // 새로운 공지 감지 (이전 ID와 다른 경우에만 알림 실행 및 숨김 상태 해제)
        const storedId = localStorage.getItem('lastSeenNoticeId');
        if (storedId && storedId !== latest.id) {
          playNotificationSound();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([150, 100, 150]); // 진동 발생
          }
          setAlertNoticeContent(cleanContent);
          setShowNoticeAlert(true);
          setIsNoticeDismissed(false); // 새 공지가 오면 배너 다시 노출
        }
        localStorage.setItem('lastSeenNoticeId', latest.id);
      } else {
        setNotice('');
        setNoticePostId(null);
      }
    }
  };

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
      router.push('/qt');
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

  // 어드민 로그인
  const handleAdminLoginSubmit = () => {
    if (adminPassword === 'admin1234!') {
      sessionStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      alert('관리자 모드로 활성화되었습니다.');
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  // 공지 등록
  const handleNoticeSubmit = async () => {
    if (!newNoticeText.trim()) return;

    // 기존 공지가 있다면 삭제 처리하거나, 게시판 누적 등록
    const { error } = await supabase
      .from('community_posts')
      .insert([{ author: '관리자', content: `[공지] ${newNoticeText.trim()}` }]);

    if (!error) {
      alert('공지가 실시간 등록되었습니다.');
      setNewNoticeText('');
      setShowNoticeInput(false);
      setIsNoticeDismissed(false); // 직접 등록 시에도 노출 보장
      fetchLatestNotice();
    } else {
      alert('공지 등록에 실패했습니다.');
    }
  };

  // 공지 삭제
  const handleDeleteNotice = async () => {
    if (!noticePostId) return;
    if (!confirm('현재 실시간 공지를 삭제하시겠습니까?')) return;

    // 해당 공지글 삭제 (자유게시판에서도 내려감)
    await supabase.from('community_comments').delete().eq('post_id', noticePostId);
    const { error } = await supabase.from('community_posts').delete().eq('id', noticePostId);

    if (!error) {
      alert('공지가 삭제되었습니다.');
      fetchLatestNotice();
    } else {
      alert('공지 삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <div className="home-container">
        {/* 그래피티 배경 이미지만 온전히 보이도록 다른 요소들은 임시로 비워둡니다 */}
      </div>

      {/* 우측 상단 어드민 활성화 기어 */}
      <button className="admin-key-btn" onClick={() => setShowAdminLogin(true)}>
        <Lock size={16} />
      </button>

      {/* 실시간 공지 배너 영역 */}
      {(notice || isAdmin) && !isNoticeDismissed && (
        <div className="home-notice-bar" onClick={() => setIsNoticeDismissed(true)} style={{ cursor: 'pointer' }} title="터치하여 공지 숨기기">
          <div className="notice-inner-content">
            <Megaphone size={16} className="notice-icon" />
            <div className="notice-text-marquee">
              {notice ? (
                <span>{notice}</span>
              ) : (
                <span className="no-notice-text">현재 등록된 실시간 공지가 없습니다.</span>
              )}
            </div>
          </div>
          <div className="notice-actions" onClick={(e) => e.stopPropagation()}>
            {isAdmin && (
              <>
                {notice ? (
                  <button className="notice-action-btn delete" onClick={handleDeleteNotice} title="공지 삭제">
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <button className="notice-action-btn add" onClick={() => setShowNoticeInput(true)} title="공지 등록">
                    <Plus size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 공지 등록 모달 */}
      {showNoticeInput && (
        <div className="notice-modal-overlay" onClick={() => setShowNoticeInput(false)}>
          <div className="notice-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="notice-modal-header">
              <h3>실시간 공지 등록</h3>
              <button className="close-notice-modal" onClick={() => setShowNoticeInput(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="notice-modal-body">
              <textarea
                placeholder="전체 사용자에게 노출할 실시간 공지 내용을 입력해 주세요."
                value={newNoticeText}
                onChange={(e) => setNewNoticeText(e.target.value)}
              />
            </div>
            <div className="notice-modal-footer">
              <button className="notice-submit-btn" onClick={handleNoticeSubmit}>공지 등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 관리자 암호 로그인 모달 */}
      {showAdminLogin && (
        <div className="notice-modal-overlay" onClick={() => setShowAdminLogin(false)}>
          <div className="notice-modal-card admin-login-card" onClick={(e) => e.stopPropagation()}>
            <div className="notice-modal-header">
              <h3>관리자 모드 활성화</h3>
              <button className="close-notice-modal" onClick={() => setShowAdminLogin(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="notice-modal-body">
              <input
                type="password"
                placeholder="관리자 암호 입력"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLoginSubmit()}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e8eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div className="notice-modal-footer">
              <button className="notice-submit-btn" onClick={handleAdminLoginSubmit}>인증하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 새 공지 알림 팝업 (진동 & 소리 발생 시 중앙 노출) */}
      {showNoticeAlert && (
        <div className="notice-modal-overlay" onClick={() => setShowNoticeAlert(false)}>
          <div className="notice-modal-card alert-notice-card" onClick={(e) => e.stopPropagation()}>
            <div className="notice-modal-header alert-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d32f2f', margin: 0, fontSize: '15px' }}>
                <Megaphone size={18} />
                긴급 공지사항 알림
              </h3>
              <button className="close-notice-modal" onClick={() => setShowNoticeAlert(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="notice-modal-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <p className="alert-notice-text" style={{ fontSize: '15px', fontWeight: '700', color: '#333d4b', margin: 0, lineHeight: '1.6', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                {alertNoticeContent}
              </p>
            </div>
            <div className="notice-modal-footer">
              <button className="notice-submit-btn alert-confirm-btn" onClick={() => setShowNoticeAlert(false)} style={{ backgroundColor: '#d32f2f' }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

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
