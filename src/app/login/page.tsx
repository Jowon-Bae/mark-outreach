'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, UserCheck } from 'lucide-react';
import './login.css';

const ALLOWED_NAMES = [
  '배주원', '두진문', '김민우', '신민재', '선우진', '성민선', '박소희', // 총무단
  '류남현', '장영철', '박형규', '김순정', '김상형', '박성연', '육양수', '최애진', '김신곤', '고은정', '김희준', '김지은', '임은주', '이광숙', '이용섭', '김경록', '정수현', '이병주', // 전도팀
  '신재식', '박진은', '채양석', '조은혜', '신승주', '한은정', // 의료팀
  '허민', '윤석민', '이용건', '서기열', '한영원', '김나리', // 미디어팀
  '황상수', '이지은', '김원영', '김산수', '박경현', '강수은', '이석찬', '이희승', '강원균', '장영송', '김진한', '최연진', '심지호', '이민후', '전승우', '이현정', '김연주', '박순관', '하진수', // 식사팀
  '박제윤', '전민기', '김태희', '안승국', '이혜수', '강진규', '김지현', '김영민', '문정은', '노소영', '박순호', '김문선', // 키즈케어팀
  '최지은', '박선민', '이희선', '서승원', '윤인희', '김신혜', '이미영', '김지준', '김민', '유영삼', '추인애', '김지선', '이승용', // 공연팀
  '이문석', '박성수', '나경준', '오국환', '박희정', '이상연', '이승호', '박희주', '최윤호', '김규연', '이재원', '김유진', '염귀화', // 발마사지팀
  '장윤경', '강정호', '남아란', '김동진', '김민혜', '김인호', '신유리', '김지인', '김보화', '안민균', '김사무엘', '손성웅', '이용준', '김혜미', '김성희', '현지혜', '김선정', '안지원', // 데코팀
  '이현신', '송은지', '심연옥', '유숙희', '이혜인', '이지영', '구량주', '최혜남', '송영선', // 이미용팀
  '유상현', '강나로', '김도훈', '김수아', '김아론', '박하솜', '유상윤', '심이안', '이하은', '태현영', // 안내팀
  '노경민' // 추가 인원
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestPhone, setRequestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      alert('이름을 입력해주세요!');
      return;
    }

    // 1. 하드코딩된 명단 먼저 체크 (화이트리스트 통과)
    if (ALLOWED_NAMES.includes(trimmed)) {
      loginSuccess(trimmed);
      return;
    }

    // 2. 동적으로 관리자가 승인한 명단 체크
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('login_requests')
        .select('*')
        .eq('name', trimmed)
        .eq('status', 'approved');

      if (!error && data && data.length > 0) {
        loginSuccess(trimmed);
        return;
      }
    } catch (e) {
      console.error('Failed to query login request status:', e);
    }

    // 3. 둘 다 없으면 승인 신청 모달 표시
    setShowRequestModal(true);
  };

  const loginSuccess = (name: string) => {
    localStorage.setItem('username', name);
    sessionStorage.setItem('username', name); // 호환성 유지
    router.replace('/');
  };

  // 관리자에게 로그인 승인 신청
  const handleRequestSubmit = async () => {
    const trimmedName = username.trim();
    const trimmedPhone = requestPhone.trim();

    if (!trimmedPhone) {
      alert('연락처를 입력해 주세요!');
      return;
    }

    try {
      setIsSubmitting(true);
      const { supabase } = await import('@/lib/supabaseClient');
      
      // 이미 신청한 내역이 있는지 조회
      const { data: existing } = await supabase
        .from('login_requests')
        .select('*')
        .eq('name', trimmedName)
        .eq('status', 'pending')
        .maybeSingle();

      if (existing) {
        alert('이미 승인 대기 중인 요청이 있습니다. 관리자 승인을 기다려 주세요!');
        setShowRequestModal(false);
        return;
      }

      const { error } = await supabase
        .from('login_requests')
        .insert([{ name: trimmedName, phone: trimmedPhone, status: 'pending' }]);

      if (error) throw error;

      alert('로그인 승인 요청이 성공적으로 접수되었습니다!\n관리자(총무단) 승인 후 즉시 로그인하실 수 있습니다.');
      setShowRequestModal(false);
      setRequestPhone('');
    } catch (err: any) {
      alert('요청 실패: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* 로그인 권한 요청 모달 */}
      {showRequestModal && (
        <div className="request-modal-overlay">
          <div className="request-modal">
            <div className="request-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#1b64da" />
                로그인 승인 요청
              </h3>
              <button className="request-close-btn" onClick={() => setShowRequestModal(false)}>
                <X size={20} />
              </button>
            </div>

            <p className="request-desc">
              <strong>'{username}'</strong>님은 아직 등록 명단에 들어있지 않습니다. 동명이인이거나 명단 누락의 경우 아래에 연락처를 기재해 승인을 요청해 주세요.
            </p>

            <div className="request-input-group">
              <label htmlFor="request-phone-input">본인 연락처</label>
              <input 
                type="tel" 
                id="request-phone-input"
                placeholder="예: 010-1234-5678"
                value={requestPhone}
                onChange={(e) => setRequestPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestSubmit()}
              />
            </div>

            <button 
              className="request-submit-btn" 
              onClick={handleRequestSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '요청 제출 중...' : '관리자에게 승인 요청하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
