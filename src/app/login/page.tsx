'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Supabase Auth 연동 (현재는 하드코딩 패스)
    router.push('/');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">환영합니다</h1>
        <p className="login-subtitle">등록된 계정으로 로그인해 주세요.</p>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label>이메일 또는 휴대폰 번호</label>
          <input 
            type="text" 
            placeholder="example@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label>비밀번호</label>
          <input 
            type="password" 
            placeholder="비밀번호를 입력하세요" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-submit-btn">
          로그인
        </button>
      </form>

      <div className="login-footer">
        <p>계정이 없으신가요? 관리자에게 문의하세요.</p>
      </div>
    </div>
  );
}
