'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, Bell, Info, Shield, User, X, Camera } from 'lucide-react';
import './settings.css';

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideTab, setGuideTab] = useState<'ios' | 'android'>('ios');
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('username') || '';
      setUsername(storedName);
      setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
      if ('Notification' in window) {
        setPushPermission(Notification.permission);
      }
      
      // 실제 서비스 워커의 푸시 구독 상태를 체크하여 토글 스위치 상태 동기화
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(async (registration) => {
          const subscription = await registration.pushManager.getSubscription();
          setIsPushEnabled(!!subscription);
        }).catch(err => console.error('Error checking SW subscription status:', err));
      }

      // 프로필 이미지 조회
      if (storedName) {
        (async () => {
          try {
            const { supabase: supabaseClient } = await import('@/lib/supabaseClient');
            const { data } = await supabaseClient
              .from('user_profiles')
              .select('*')
              .eq('username', storedName)
              .maybeSingle();
            
            if (data && data.avatar_url) {
              setAvatarUrl(data.avatar_url);
              localStorage.setItem('avatar_url', data.avatar_url);
            }
          } catch (e) {
            console.error('Failed to load profile image:', e);
          }
        })();
      }
    }
  }, []);

  // 아바타 이미지 업로드 처리
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      // 한글 파일명으로 인한 Supabase Storage Invalid key 에러를 막기 위해 영문 난수/타임스탬프로 파일명 생성
      const filePath = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { supabase: supabaseClient } = await import('@/lib/supabaseClient');

      // 1. Storage 업로드
      const { error: uploadError } = await supabaseClient.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Public URL 획득
      const { data: publicUrlData } = supabaseClient.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // 3. user_profiles 테이블에 upsert 기록
      const { error: dbError } = await supabaseClient
        .from('user_profiles')
        .upsert({ username, avatar_url: publicUrl }, { onConflict: 'username' });

      if (dbError) throw dbError;

      setAvatarUrl(publicUrl);
      localStorage.setItem('avatar_url', publicUrl);
      alert('프로필 사진이 정상 등록되었습니다! 📸');
    } catch (err: any) {
      console.error(err);
      alert('사진 업로드 실패: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    if (!confirm('정말 로그아웃 하시겠습니까? 로그아웃 시 공지 수신 알림 설정이 무력화될 수 있습니다.')) return;
    
    // 로컬스토리지 및 세션스토리지 초기화
    localStorage.removeItem('username');
    localStorage.removeItem('welcomeShown');
    localStorage.removeItem('dismissedNoticeId');
    localStorage.removeItem('lastSeenNoticeId');
    sessionStorage.clear();
    
    alert('로그아웃 되었습니다. 다시 로그인 화면으로 이동합니다.');
    
    // 페이지 리로드하여 초기화된 세션 적용
    window.location.href = '/login';
  };

  // 알림 설정 온오프 토글 처리
  const handleTogglePush = async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('이 기기는 알림 기능을 지원하지 않습니다.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    if (isPushEnabled) {
      // 1. 알림 끄기 (구독 해제)
      try {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          
          const { supabase: supabaseClient } = await import('@/lib/supabaseClient');
          await supabaseClient
            .from('push_subscriptions')
            .delete()
            .eq('subscription->>endpoint', subscription.endpoint);
        }
        setIsPushEnabled(false);
        alert('실시간 긴급 공지 알림 수신을 껐습니다.');
      } catch (err) {
        console.error('Failed to unsubscribe:', err);
        alert('알림을 끄는 데 실패했습니다.');
      }
    } else {
      // 2. 알림 켜기 (구독 신청)
      if (Notification.permission === 'denied') {
        const ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
          setGuideTab('ios');
        } else {
          setGuideTab('android');
        }
        setShowGuideModal(true);
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        setPushPermission(permission);

        if (permission === 'granted') {
          const publicVapidKey = 'BB611KNZS2KvEkk7Nystn0Mvdk35Cdks3yaRJy8txCNb0FAHiIcLw8S9nHVK-NbZEiOM8F4dFEsN-n7V0oxIGlA';
          let subscription = await registration.pushManager.getSubscription();
          
          if (!subscription) {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicVapidKey
            });
          }

          const { supabase: supabaseClient } = await import('@/lib/supabaseClient');
          
          // 중복 검사 후 저장
          const { data, error } = await supabaseClient
            .from('push_subscriptions')
            .select('*')
            .eq('subscription->>endpoint', subscription.endpoint);

          if (!error && (!data || data.length === 0)) {
            await supabaseClient
              .from('push_subscriptions')
              .insert([{ subscription: subscription }]);
          }

          setIsPushEnabled(true);
          alert('실시간 긴급 공지 알림 수신을 켰습니다! 🔊');
        } else if (permission === 'denied') {
          setShowGuideModal(true);
        }
      } catch (err) {
        console.error('Failed to subscribe:', err);
        alert('알림 권한 요청에 실패했습니다.');
      }
    }
  };

  return (
    <div className="settings-container">
      <div className="sticky-header-wrapper">
        {/* 헤더 바 */}
        <div className="settings-header">
          <h2 style={{ margin: 0 }}>설정</h2>
        </div>
      </div>

      <div className="settings-content">
        {/* 프로필 카드 */}
        <div className="profile-card">
          <div 
            className="profile-avatar clickable" 
            onClick={() => !uploading && document.getElementById('avatar-upload')?.click()}
            title="프로필 사진 등록/변경"
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="profile-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={32} color="#1b64da" />
            )}
            <div className="avatar-edit-overlay" style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#1b64da',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              <Camera size={11} color="white" />
            </div>
          </div>
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleAvatarUpload} 
          />
          <div className="profile-info">
            <h3 className="profile-name">{username} 님</h3>
            <span className={`profile-role ${isAdmin ? 'admin' : 'member'}`}>
              {isAdmin ? (
                <>
                  <Shield size={12} style={{ marginRight: 4 }} />
                  총괄 관리자
                </>
              ) : (
                '마가공동체 아웃리치 지체'
              )}
            </span>
          </div>
        </div>

        {/* 설정 목록 */}
        <div className="settings-group">
          <div className="group-title">수신 및 보안</div>
          
          {/* 알림 설정 */}
          <div className="settings-row" onClick={handleTogglePush} style={{ cursor: 'pointer' }}>
            <div className="row-left">
              <Bell size={18} className="row-icon notification" />
              <div className="row-meta">
                <span className="row-title">긴급 공지 알림 설정</span>
                <span className="row-desc">실시간 백그라운드 푸시 수신 설정</span>
              </div>
            </div>
            <div className="row-right">
              {pushPermission === 'denied' ? (
                <span className="status-badge blocked">차단됨 (설정 안내)</span>
              ) : (
                <div className={`switch-toggle ${isPushEnabled ? 'active' : ''}`}>
                  <div className="switch-handle" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="group-title">어플리케이션 정보</div>
          
          {/* 앱 버전 */}
          <div className="settings-row">
            <div className="row-left">
              <Info size={18} className="row-icon info" />
              <div className="row-meta">
                <span className="row-title">버전 정보</span>
                <span className="row-desc">최신 빌드 및 시스템 정보</span>
              </div>
            </div>
            <div className="row-right">
              <span className="version-text">v1.2.5</span>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} style={{ marginRight: '8px' }} />
          <span>로그아웃</span>
        </button>
      </div>

      {/* 알림 설정 해결 가이드 모달 */}
      {showGuideModal && (
        <div className="guide-modal-overlay">
          <div className="guide-modal">
            <div className="guide-modal-header">
              <h3>🔔 알림 수동 허용 가이드</h3>
              <button className="guide-close-btn" onClick={() => setShowGuideModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <p className="guide-subtitle-text">
              현재 기기의 브라우저 알림 권한이 차단되어 있습니다. 긴급 공지를 정상적으로 받으려면 아래 가이드에 따라 직접 권한을 켜주셔야 합니다.
            </p>

            <div className="guide-tabs">
              <button 
                className={`guide-tab ${guideTab === 'ios' ? 'active' : ''}`}
                onClick={() => setGuideTab('ios')}
              >
                아이폰 (iOS)
              </button>
              <button 
                className={`guide-tab ${guideTab === 'android' ? 'active' : ''}`}
                onClick={() => setGuideTab('android')}
              >
                안드로이드 / PC
              </button>
            </div>

            <div className="guide-tab-content">
              {guideTab === 'ios' ? (
                <ol className="guide-list">
                  <li>
                    먼저 어플이 <strong>[홈 화면에 추가]</strong>(아이콘 설치) 되어 있는지 확인해 주세요.
                    <span className="guide-note">* 홈 화면에 추가하지 않은 일반 브라우저 창 상태에서는 아이폰 알림 기능이 나타나지 않습니다.</span>
                  </li>
                  <li>
                    아이폰 시스템 <strong>[설정]</strong> 앱을 켭니다.
                  </li>
                  <li>
                    설정 메뉴에서 <strong>[알림]</strong>을 선택합니다.
                  </li>
                  <li>
                    목록에서 설치된 어플 이름(예: <strong>[마가아웃리치]</strong>)을 찾아서 선택합니다.
                  </li>
                  <li>
                    <strong>[알림 허용]</strong> 스위치를 초록색(활성화)으로 켜줍니다.
                  </li>
                </ol>
              ) : (
                <ol className="guide-list">
                  <li>
                    인터넷 주소창(상단 주소창)의 왼쪽 끝에 있는 <strong>자물쇠 아이콘(⚙️ 또는 슬라이더)</strong>을 터치합니다.
                  </li>
                  <li>
                    메뉴 목록 중에서 <strong>[알림]</strong> 권한 항목을 찾습니다.
                  </li>
                  <li>
                    차단된 알림 권한을 <strong>[허용]</strong>으로 스위치를 켜주거나 직접 설정을 해제합니다.
                  </li>
                  <li>
                    권한을 변경하신 뒤 화면을 새로고침 하시면 알림 구독이 자동으로 연동됩니다!
                  </li>
                </ol>
              )}
            </div>

            <button className="guide-confirm-btn" onClick={() => setShowGuideModal(false)}>
              확인했습니다
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
