'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!username.trim()) {
      alert('이름 또는 닉네임을 입력해주세요!');
      return;
    }
    
    // 로컬 스토리지에 이름 저장 (로그인 유지)
    localStorage.setItem('username', username.trim());
    sessionStorage.setItem('username', username.trim()); // 기존 세션스토리지 코드와 호환
    
    // 홈 화면으로 이동
    router.replace('/');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo-wrapper">
          <img src="/assets/logo_transparent.png" alt="Logo" className="login-logo" />
        </div>
        
        <h1 className="login-title">마가공동체<br/>국내아웃리치</h1>
        <p className="login-subtitle">환영합니다! 시작하기 위해<br/>이름(또는 닉네임)을 입력해주세요.</p>
        
        <div className="login-input-group">
          <input 
            type="text" 
            id="user-name-input"
            name="user-name-input"
            autoComplete="off"
            className="login-input" 
            placeholder="이름을 입력하세요" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        
        <button className="login-submit-btn" onClick={handleLogin}>
          시작하기
        </button>
      </div>
    </div>
  );
}
