'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, Bell, Info, Shield, User } from 'lucide-react';
import './settings.css';

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username') || '');
      setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
      if ('Notification' in window) {
        setPushPermission(Notification.permission);
      }
    }
  }, []);

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

  // 알림 신청 유도
  const requestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('이 기기는 알림 기능을 지원하지 않습니다.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      setPushPermission(permission);
      if (permission === 'granted') {
        alert('알림 권한이 승인되었습니다! 실시간 긴급 공지를 즉시 받아보실 수 있습니다.');
        // 서비스워커를 통한 구독 재생성 유도
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(async (registration) => {
            const publicVapidKey = 'BB611KNZS2KvEkk7Nystn0Mvdk35Cdks3yaRJy8txCNb0FAHiIcLw8S9nHVK-NbZEiOM8F4dFEsN-n7V0oxIGlA';
            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey
              });
            }
            const { supabase } = await import('@/lib/supabaseClient');
            await supabase.from('push_subscriptions').insert([{ subscription: subscription }]);
          });
        }
      } else {
        alert('알림 권한이 거부되었습니다. 휴대폰의 시스템 설정에서 알림을 직접 허용해 주세요.');
      }
    });
  };

  return (
    <div className="settings-container">
      {/* 헤더 바 */}
      <div className="settings-header">
        <h2 style={{ margin: 0 }}>설정</h2>
      </div>

      <div className="settings-content">
        {/* 프로필 카드 */}
        <div className="profile-card">
          <div className="profile-avatar">
            <User size={32} color="#1b64da" />
          </div>
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
          <div className="settings-row" onClick={requestNotificationPermission} style={{ cursor: 'pointer' }}>
            <div className="row-left">
              <Bell size={18} className="row-icon notification" />
              <div className="row-meta">
                <span className="row-title">긴급 공지 알림 설정</span>
                <span className="row-desc">실시간 백그라운드 푸시 수신 설정</span>
              </div>
            </div>
            <div className="row-right">
              {pushPermission === 'granted' ? (
                <span className="status-badge active">활성화됨</span>
              ) : pushPermission === 'denied' ? (
                <span className="status-badge blocked">차단됨</span>
              ) : (
                <span className="status-badge pending">신청하기</span>
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
    </div>
  );
}
