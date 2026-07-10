'use client';

import { useState } from 'react';
import { Phone, Search, ArrowLeft, MapPin, ExternalLink, ShieldAlert, Crown, Music, Video, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './teams.css';

// 조직원 데이터 모델
interface Member {
  name: string;
  role: string;
  phone: string;
}

interface Team {
  teamName: string;
  members: Member[];
  icon: any;
}

interface MapLocation {
  name: string;
  description: string;
  naverUrl: string;
  kakaoUrl: string;
}

// 예시 마가 공동체 조직도 데이터 (아웃리치 사역에 최적화)
const INITIAL_TEAMS: Team[] = [
  {
    teamName: '총무단',
    icon: Crown,
    members: [
      { name: '배주원', role: '담당 목사', phone: '010-9017-1848' },
      { name: '두진문', role: '담당 장로', phone: '010-4020-1389' },
      { name: '김민우', role: '총무', phone: '010-4020-1389' },
      { name: '신민재', role: '부총무', phone: '010-5292-5620' },
      { name: '선우진', role: '회계', phone: '010-8781-8806' }
    ]
  },
  {
    teamName: '예배 및 찬양팀',
    icon: Music,
    members: [
      { name: '김민준', role: '예배팀장 (싱어)', phone: '010-1111-2222' },
      { name: '이서연', role: '반주자 (신디)', phone: '010-3333-4444' },
      { name: '박건우', role: '어쿠스틱 기타', phone: '010-5555-6666' },
      { name: '최다은', role: '싱어 (알토)', phone: '010-7777-8888' }
    ]
  },
  {
    teamName: '미디어 & 방송팀',
    icon: Video,
    members: [
      { name: '정우진', role: '미디어팀장 (영상 촬영)', phone: '010-9999-0000' },
      { name: '한소희', role: 'PPT/자막 총괄', phone: '010-2222-3333' },
      { name: '강현우', role: '음향 엔지니어', phone: '010-4444-5555' }
    ]
  },
  {
    teamName: '안전 & 안내팀',
    icon: Shield,
    members: [
      { name: '송지훈', role: '안전팀장 (차량 통제)', phone: '010-6666-7777' },
      { name: '윤아름', role: '의료/비상 구호', phone: '010-8888-9999' },
      { name: '임재희', role: '안내 및 주차', phone: '010-1212-3434' }
    ]
  }
];

const MAP_LOCATIONS: MapLocation[] = [
  {
    name: '아웃리치 사역 본부 (충주 방주교회)',
    description: '사역 총괄 본부 및 예배 처소',
    naverUrl: 'https://map.naver.com/v5/entry/place/13490713',
    kakaoUrl: 'https://map.kakao.com/?itemId=8110992'
  },
  {
    name: '메인 숙소 (방주 샬롬관)',
    description: '전체 지체 공동 숙소',
    naverUrl: 'https://map.naver.com/',
    kakaoUrl: 'https://map.kakao.com/'
  },
  {
    name: '노방 전도 사역지 (충주 중앙시장)',
    description: '오후 문화 사역 및 관계 전도 장소',
    naverUrl: 'https://map.naver.com/',
    kakaoUrl: 'https://map.kakao.com/'
  }
];

export default function Teams() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'contact' | 'safety'>('contact');
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 로직
  const filteredTeams = INITIAL_TEAMS.map(team => {
    const matchedMembers = team.members.filter(
      member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...team, members: matchedMembers };
  }).filter(team => team.members.length > 0);

  return (
    <div className="teams-container">
      {/* 상단 네비게이션 바 */}
      <div className="teams-header">
        <button className="back-btn" onClick={() => router.push('/')}>
          <ArrowLeft size={20} />
        </button>
        <h2>조직 & 안전</h2>
        <div style={{ width: 20 }}></div> {/* 중앙 정렬 밸런스용 */}
      </div>

      {/* 상단 서브 탭 */}
      <div className="top-tab-bar">
        <button 
          className={`tab-item ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          조직원 연락망
        </button>
        <button 
          className={`tab-item ${activeTab === 'safety' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety')}
        >
          안전 가이드 (SOS)
        </button>
      </div>

      {activeTab === 'contact' ? (
        <>
          {/* 검색 바 */}
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="이름 또는 역할로 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 팀 리스트 */}
          <div className="teams-list-section">
            {filteredTeams.length === 0 ? (
              <div className="no-result">검색 결과가 없습니다.</div>
            ) : (
              filteredTeams.map((team, idx) => {
                const TeamIcon = team.icon;
                return (
                  <div key={idx} className="team-group-card">
                    <h3 className="team-title">
                      <TeamIcon size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      <span style={{ verticalAlign: 'middle' }}>{team.teamName}</span>
                    </h3>
                    <div className="team-members-list">
                      {team.members.map((member, mIdx) => (
                        <div key={mIdx} className="member-row">
                          <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            <span className="member-role">{member.role}</span>
                          </div>
                          {/* 전화 걸기 버튼 */}
                          <a href={`tel:${member.phone}`} className="phone-call-btn">
                            <Phone size={16} />
                            <span>통화</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div className="safety-section-content">
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
          <div className="safety-sub-section">
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
          <div className="safety-sub-section">
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
      )}
    </div>
  );
}
