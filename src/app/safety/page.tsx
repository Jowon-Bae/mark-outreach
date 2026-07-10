'use client';

import { ArrowLeft, Phone, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './safety.css';

// 지도 링크 데이터 모델
interface MapLocation {
  name: string;
  description: string;
  naverUrl: string;
  kakaoUrl: string;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    name: '아웃리치 사역 본부 (충주 방주교회) ⛪',
    description: '사역 총괄 본부 및 예배 처소',
    naverUrl: 'https://map.naver.com/v5/entry/place/13490713', // 예시 링크
    kakaoUrl: 'https://map.kakao.com/?itemId=8110992' // 예시 링크
  },
  {
    name: '메인 숙소 (방주 샬롬관) 🏡',
    description: '전체 지체 공동 숙소',
    naverUrl: 'https://map.naver.com/',
    kakaoUrl: 'https://map.kakao.com/'
  },
  {
    name: '노방 전도 사역지 (충주 중앙시장) 📍',
    description: '오후 문화 사역 및 관계 전도 장소',
    naverUrl: 'https://map.naver.com/',
    kakaoUrl: 'https://map.kakao.com/'
  }
];

export default function Safety() {
  const router = useRouter();

  return (
    <div className="safety-container">
      {/* 상단 헤더 */}
      <div className="safety-header">
        <button className="back-btn" onClick={() => router.push('/')}>
          <ArrowLeft size={20} />
        </button>
        <h2>안전 가이드 및 SOS 🚨</h2>
        <div style={{ width: 20 }}></div>
      </div>

      {/* 비상 경보 카드 */}
      <div className="emergency-alert-card">
        <div className="alert-icon-wrapper">
          <ShieldAlert size={28} />
        </div>
        <div className="alert-text-wrapper">
          <h4>안전 사고 발생 시 행동 요령</h4>
          <p>비상 상황 및 환자 발생 즉시 본부 또는 의료진에게 연락하고, 119에 신고하십시오.</p>
        </div>
      </div>

      {/* SOS 긴급 연락망 섹션 */}
      <div className="safety-section">
        <h3 className="section-title">긴급 연락처 (SOS)</h3>
        <div className="sos-buttons-grid">
          <a href="tel:010-1234-5678" className="sos-card hq">
            <span className="sos-label">총괄 사역 본부</span>
            <span className="sos-number">010-1234-5678</span>
            <div className="sos-icon-btn">
              <Phone size={18} />
              <span>전화 연결</span>
            </div>
          </a>

          <a href="tel:010-8888-9999" className="sos-card medical">
            <span className="sos-label">의료 / 구호 본부</span>
            <span className="sos-number">010-8888-9999</span>
            <div className="sos-icon-btn">
              <Phone size={18} />
              <span>전화 연결</span>
            </div>
          </a>

          <a href="tel:119" className="sos-card public-119">
            <span className="sos-label">소방서 (긴급 구조)</span>
            <span className="sos-number">119</span>
            <div className="sos-icon-btn">
              <Phone size={18} />
              <span>신고 하기</span>
            </div>
          </a>
        </div>
      </div>

      {/* 사역지 지도 링크 섹션 */}
      <div className="safety-section">
        <h3 className="section-title">아웃리치 사역지 위치 정보</h3>
        <div className="locations-list">
          {MAP_LOCATIONS.map((loc, index) => (
            <div key={index} className="location-card">
              <div className="location-info">
                <div className="location-icon">
                  <MapPin size={18} />
                </div>
                <div className="location-meta">
                  <h4>{loc.name}</h4>
                  <p>{loc.description}</p>
                </div>
              </div>
              
              <div className="map-links">
                <a href={loc.naverUrl} target="_blank" rel="noopener noreferrer" className="map-link naver">
                  <span>네이버 지도</span>
                  <ExternalLink size={12} />
                </a>
                <a href={loc.kakaoUrl} target="_blank" rel="noopener noreferrer" className="map-link kakao">
                  <span>카카오 맵</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
