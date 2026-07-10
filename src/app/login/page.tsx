'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

const ALLOWED_NAMES = [
  '배주원', '두진문', '김민우', '신민재', '선우진', '성민선', '박소희', // 총무단
  '류남현', '장영철', '박형규', '김순정', '김상형', '박성연', '육양수', '최애진', '김신곤', '고은정', '김희준', '김지은', '임은주', '이광숙', '이용섭', '김경록', // 전도팀
  '신재식', '박진은', '채양석', '조은혜', '신승주', '한은정', // 의료팀
  '허민', '윤석민', '이용건', '서기열', '한영원', '김나리', // 미디어팀
  '황상수', '이지은', '김원영', '김산수', '박경현', '강수은', '이석찬', '이희승', '강원균', '장영송', '김진한', '최연진', '심지호', '이민후', '전승우', '이현정', '김연주', '박순관', '하진수', // 식사팀
  '박제윤', '전민기', '김태희', '안승국', '이혜수', '강진규', '김지현', '김영민', '문정은', '노소영', '박순호', // 키즈케어팀
  '최지은', '박선민', '이희선', '서승원', '윤인희', '김신혜', '이미영', '김지준', '김민', '유영삼', '추인애', '김지선', '이승용', // 공연팀
  '이문석', '박성수', '나경준', '오국환', '박희정', '이상연', '이승호', '박희주', '최윤호', '김규연', '이재원', '김유진', '염귀화', // 발마사지팀
  '장윤경', '강정호', '남아란', '김동진', '김민혜', '김인호', '신유리', '김지인', '김보화', '안민균', '김사무엘', '손성웅', '이용준', '김혜미', '김성희', '현지혜', '김선정', '안지원', // 데코팀
  '이현신', '송은지', '심연옥', '유숙희', '정수현', '이혜인', '이지영', '구량주', '최혜남', '송영선', // 이미용팀
  '유상현', '강나로', '김도훈', '김수아', '김아론', '박하솜', '유상윤', '심이안', '이하은', '태현영' // 안내팀
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      alert('이름을 입력해주세요!');
      return;
    }

    if (!ALLOWED_NAMES.includes(trimmed)) {
      alert('아웃리치 등록 명단에 없는 이름입니다. 등록된 이름으로 다시 입력해 주세요! (문의: 총무단)');
      return;
    }
    
    // 로컬 스토리지에 이름 저장 (로그인 유지)
    localStorage.setItem('username', trimmed);
    sessionStorage.setItem('username', trimmed); // 기존 세션스토리지 코드와 호환
    
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
