'use client';

import { useState, useEffect } from 'react';
import { Phone, Search, ArrowLeft, MapPin, ExternalLink, ShieldAlert, Crown, Music, Video, Shield, User, Utensils, Baby, Paintbrush, Scissors, Laugh, HeartHandshake, Activity, Sparkles, X, ChevronDown, ChevronUp, TreeDeciduous } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './teams.css';

import { INITIAL_TEAMS, Team, Member, MapLocation } from '@/lib/teamsData';
const MAP_LOCATIONS: MapLocation[] = [
  {
    name: '아웃리치 사역 교회 (신광교회)',
    description: '사역 총괄 본부 및 예배 처소',
    naverUrl: 'https://naver.me/xF4hudjw',
    kakaoUrl: 'https://map.kakao.com/?q=%EC%98%81%EC%A3%BC%20%EC%8B%A0%EA%B4%91%EA%B5%90%ED%9A%8C',
    tmapUrl: 'tmap://search?name=%EC%98%81%EC%A3%BC%20%EC%8B%A0%EA%B4%91%EA%B5%90%ED%9A%8C'
  },
  {
    name: '숙소 (복된교회 영주수련원)',
    description: '전체 지체 공동 숙소 및 수련처',
    naverUrl: 'https://naver.me/5kxZAFyk',
    kakaoUrl: 'https://map.kakao.com/?q=%EB%B3%B5%EB%90%9C%EA%B5%90%ED%9A%8C%20%EC%98%81%EC%A3%BC%EC%88%98%EB%A0%A8%EC%9B%90',
    tmapUrl: 'tmap://search?name=%EB%B3%B5%EB%90%9C%EA%B5%90%ED%9A%8C%20%EC%98%81%EC%A3%BC%EC%88%98%EB%A0%A8%EC%9B%90'
  },
  {
    name: '다담뜰한식뷔페',
    description: '토요일 저녁 식사 장소\n(경북 영주시 대학로284번길 10)',
    naverUrl: 'https://map.naver.com/p/search/%EA%B2%BD%EB%B6%81%20%EC%98%81%EC%A3%BC%EC%8B%9C%20%EB%8C%80%ED%95%99%EB%A1%9C284%EB%B2%88%EA%B8%B8%2010',
    kakaoUrl: 'https://map.kakao.com/?q=%EA%B2%BD%EB%B6%81%20%EC%98%81%EC%A3%BC%EC%8B%9C%20%EB%8C%80%ED%95%99%EB%A1%9C284%EB%B2%88%EA%B8%B8%2010',
    tmapUrl: 'tmap://search?name=%EB%8B%A4%EB%8B%B4%EB%9C%B0%ED%95%9C%EC%8B%9D%EB%B7%94%ED%8E%98%20%EC%98%81%EC%A3%BC'
  }
];

export default function Teams() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'contact' | 'safety'>('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSafetyRules, setShowSafetyRules] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [avatarMap, setAvatarMap] = useState<Record<string, string>>({});
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // 페이지 진입 시 강제로 최상단 스크롤 이동
    window.scrollTo(0, 0);
    
    (async () => {
      try {
        const { supabase: supabaseClient } = await import('@/lib/supabaseClient');
        const { data } = await supabaseClient.from('user_profiles').select('*');
        if (data) {
          const mapping: Record<string, string> = {};
          data.forEach((p: any) => {
            mapping[p.username] = p.avatar_url;
          });
          setAvatarMap(mapping);
        }
      } catch (e) {
        console.error('Failed to load user avatars:', e);
      }
    })();
  }, []);

  const toggleTeam = (teamName: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamName]: !prev[teamName]
    }));
  };

  // 검색 필터링 및 가나다 순 정렬 로직
  const filteredTeams = INITIAL_TEAMS.map(team => {
    // 1. 검색어 필터링
    const matchedMembers = team.members.filter(
      member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. 핵심 직책(목사, 장로, 총무단, 팀장)과 일반 팀원 구분하여 정렬
    const coreRoles = ['담당 목사', '담당 장로', '총무', '부총무', '회계', '팀장'];
    const coreMembers = matchedMembers.filter(m => coreRoles.includes(m.role));
    const regularMembers = matchedMembers.filter(m => !coreRoles.includes(m.role));

    // 일반 팀원 이름순(가나다) 정렬
    regularMembers.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

    return { 
      ...team, 
      members: [...coreMembers, ...regularMembers] 
    };
  }).filter(team => team.members.length > 0);

  return (
    <div className="teams-container">
      <div className="sticky-header-wrapper">
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
            팀별 연락망
          </button>
          <button 
            className={`tab-item ${activeTab === 'safety' ? 'active' : ''}`}
            onClick={() => setActiveTab('safety')}
          >
            안전 가이드 (SOS)
          </button>
        </div>

        {activeTab === 'contact' && (
          /* 검색 바 */
          <div className="search-bar-container" style={{ margin: '0 0 12px 0' }}>
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
        )}
      </div>

      {activeTab === 'contact' ? (
        <>

          {/* 팀 리스트 */}
          <div className="teams-list-section">
            {filteredTeams.length === 0 ? (
              <div className="no-result">검색 결과가 없습니다.</div>
            ) : (
              filteredTeams.map((team, idx) => {
                const TeamIcon = team.icon;
                const isExpanded = searchQuery.trim() !== '' ? true : !!expandedTeams[team.teamName];
                
                return (
                  <div key={idx} className={`team-group-card ${isExpanded ? 'expanded' : ''}`}>
                    <div className="team-header-row" onClick={() => toggleTeam(team.teamName)} style={{ cursor: 'pointer' }}>
                      <h3 className="team-title" style={{ margin: 0 }}>
                        <TeamIcon size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        <span style={{ verticalAlign: 'middle' }}>{team.teamName}</span>
                        <span className="member-count-badge">{team.members.length}명</span>
                      </h3>
                      <div className="chevron-icon">
                        {isExpanded ? <ChevronUp size={18} color="#8b95a1" /> : <ChevronDown size={18} color="#8b95a1" />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="team-members-list">
                        {team.description && (
                          <div className="team-description" style={{ fontSize: '13px', color: '#4e5968', marginBottom: '12px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', lineHeight: '1.5' }}>
                            {team.description}
                          </div>
                        )}
                        {team.members.map((member, mIdx) => (
                          <div key={mIdx} className="member-row">
                            <div className="member-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {avatarMap[member.name] ? (
                                <img 
                                  src={avatarMap[member.name]} 
                                  alt={member.name} 
                                  onClick={() => setFullscreenImage(avatarMap[member.name])}
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }} 
                                />
                              ) : (
                                <div style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  borderRadius: '50%', 
                                  backgroundColor: '#f1f3f5', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  flexShrink: 0 
                                }}>
                                  <User size={15} color="#8b95a1" />
                                </div>
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <span className="member-name">{member.name}</span>
                                <span className="member-role">{member.role}</span>
                              </div>
                            </div>
                            {/* 전화 걸기 버튼 */}
                            <a href={`tel:${member.phone}`} className="phone-call-btn">
                              <Phone size={16} />
                              <span>통화</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div className="safety-section-content">
          {/* 비상 경보 카드 */}
          <div className="emergency-alert-card" onClick={() => setShowSafetyRules(true)} style={{ cursor: 'pointer' }}>
            <div className="alert-icon-wrapper">
              <ShieldAlert size={28} />
            </div>
            <div className="alert-text-wrapper">
              <h4>안전 사고 발생 시 행동 요령</h4>
              <p>비상 상황 및 환자 발생 즉시 본부 또는 의료진에게 연락하고, 119에 신고하십시오. (클릭 시 아웃리치 전체 안전수칙 보기)</p>
            </div>
          </div>

          {/* SOS 긴급 연락망 섹션 */}
          <div className="safety-sub-section">
            <h3 className="section-title">긴급 연락처 (SOS)</h3>
            <div className="sos-buttons-grid">
              <a href="tel:010-7557-1090" className="sos-card hq">
                <span className="sos-label">김민우 총무 연락처</span>
                <span className="sos-number">010-7557-1090</span>
                <div className="sos-icon-btn">
                  <Phone size={18} />
                  <span>전화 연결</span>
                </div>
              </a>

              <a href="tel:010-7363-2610" className="sos-card medical">
                <span className="sos-label">신재식 의료팀장 연락처</span>
                <span className="sos-number">010-7363-2610</span>
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
                      <p style={{ whiteSpace: 'pre-line' }}>{loc.description}</p>
                    </div>
                  </div>
                  
                  <div className="map-links">
                    {/* 네이버 지도 */}
                    <a href={loc.naverUrl} target="_blank" rel="noopener noreferrer" className="map-link naver">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="white"/>
                      </svg>
                      <span>지도</span>
                    </a>
                    {/* 카카오맵 */}
                    <a href={loc.kakaoUrl} target="_blank" rel="noopener noreferrer" className="map-link kakao">
                      <svg width="15" height="20" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M60 0C26.863 0 0 26.863 0 60c0 14.542 5.176 27.876 13.754 38.258L60 160l46.246-61.742C114.824 87.876 120 74.542 120 60c0-33.137-26.863-60-60-60zm0 85c-13.807 0-25-11.193-25-25s11.193-25 25-25 25 11.193 25 25-11.193 25-25 25z" fill="#0068FF"/>
                      </svg>
                      <span>kakao<b>map</b></span>
                    </a>
                    {/* 티맵 */}
                    <a href={loc.tmapUrl} className="map-link tmap">
                      <svg width="22" height="16" viewBox="0 0 110 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id={`tmapGrad-${index}`} x1="10" y1="10" x2="75" y2="80" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#E00073"/>
                            <stop offset="100%" stopColor="#0054FF"/>
                          </linearGradient>
                        </defs>
                        <path d="M10 10 H 50 A 25 25 0 0 1 75 35 V 80 H 50 V 35 H 10 Z" fill={`url(#tmapGrad-${index})`}/>
                        <path d="M82 10 H 107 V 35 H 82 Z" fill="#00C896"/>
                      </svg>
                      <span>TMAP</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 안전수칙 자세히 보기 모달 */}
          {showSafetyRules && (
            <div className="safety-modal-overlay" onClick={() => setShowSafetyRules(false)}>
              <div className="safety-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="safety-modal-header">
                  <h3>국내 아웃리치 안전수칙</h3>
                  <button className="close-modal-btn" onClick={() => setShowSafetyRules(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="safety-modal-body">
                  <p className="safety-modal-intro">
                    본 안전수칙은 여름 국내 아웃리치 전 기간 동안 모든 공동체와 인솔자가 숙지하고 적용해야 하는 기준입니다.
                    각 공동체 인솔 책임자는 출발 전 전체 인원에게 본 내용을 교육하고 현장 수시 확인을 진행합니다.
                  </p>

                  <div className="safety-rule-section">
                    <h4>1. 의료·응급 상황 대비</h4>
                    <ul>
                      <li><strong>의료팀 상시 대기:</strong> 의사·간호사 등 의료 종사자를 현장에 배치하고, 사전에 명단을 확인합니다.</li>
                      <li><strong>응급 이송 차량 대기:</strong> 사역지 인근에 이동 가능한 차량 또는 구급차를 상시 대기시켜, 응급 시 즉시 이송이 가능하도록 준비합니다.</li>
                      <li><strong>폭염 응급키트 상비:</strong> 얼음팩, 이온음료, 생수, 부채, 구급약(해열제·벌레약·두통약·소화제·지사제·밴드·소독약 등), 수건, 비닐백을 포함한 키트를 구비합니다.</li>
                      <li><strong>인근 의료기관 사전 파악:</strong> 행사 장소 기준으로 가까운 병원(응급실 운영 여부 포함)·보건소·약국의 위치, 연락처, 진료 시간을 사전에 확보합니다.</li>
                      <li><strong>참가자 건강 사전 조사:</strong> 지병, 알레르기, 복용 중인 약, 비상 연락처를 사전에 파악하여 인솔 책임자가 보관합니다.</li>
                      <li><strong>알레르기·아나필락시스 대응:</strong> 중증 알레르기 보유자를 사전에 확인하고 필요 시 비상약을 준비합니다.</li>
                      <li><strong>119 신고 체계 교육:</strong> 신고 시 정확한 주소와 인근 랜드마크를 즉시 전달할 수 있도록 사전 교육하고, 장소별 주소를 공유합니다.</li>
                    </ul>
                  </div>

                  <div className="safety-rule-section">
                    <h4>2. 무더위 및 온열 질환 예방</h4>
                    <ul>
                      <li><strong>기온별 활동 제한:</strong> 기온 33도 이상 시 2시간 이내에 20분 이상 휴식을 보장하고, 35도 이상 시 야외활동을 전면 재검토 또는 중단합니다.</li>
                      <li><strong>차량 이동 원칙:</strong> 가까운 거리도 차량 이동을 원칙으로 하며, 무리한 도보 이동을 금지합니다.</li>
                      <li><strong>수분 섭취 체계화:</strong> 15~30분마다 물을 마시도록 하고, 이름을 표시한 개인 텀블러를 지참합니다. (생수 보급팀 상시 배정: 생수, 이온음료)</li>
                      <li><strong>그늘 쉼터·쿨링 공간 마련:</strong> 야외에 그늘막, 선풍기, 냉풍기, 휴식의자, 쿨매트 등을 설치합니다.</li>
                      <li><strong>폭염 특보 대응 매뉴얼:</strong> 폭염주의보·경보 단계를 확인합니다.</li>
                      <li><strong>온열질환 증상 식별 교육:</strong> 열사병·열탈진의 초기 증상(어지럼증, 두통, 메스꺼움, 발한 중단 등)과 응급 대응법을 사전 교육합니다.</li>
                      <li><strong>음료·식사 관리:</strong> 이뇨 작용이 있는 카페인·고당 음료는 자제하고, 폭염 시 음식 변질에 주의하여 보냉 보관과 식중독 예방에 유의합니다.</li>
                    </ul>
                    <div className="safety-alert-box">
                      <h5>⚠️ 온열질환 의심 시 즉시 행동</h5>
                      <ol>
                        <li>환자를 그늘·시원한 실내로 옮기고 옷을 느슨하게 한다.</li>
                        <li>물·이온음료를 천천히 마시게 하고, 목·겨드랑이·사타구니를 얼음팩으로 식힌다.</li>
                        <li>의식이 흐리거나 구토·경련이 있으면 음료를 억지로 먹이지 말고 즉시 119에 신고한다.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="safety-rule-section">
                    <h4>3. 복장 및 개별 준비물</h4>
                    <ul>
                      <li><strong>복장 지침:</strong> 야외 활동 시 긴팔의 통풍 가능한 옷, 밝은 색 계열, 챙 넓은 모자, 선크림, 냉수건을 착용·휴대합니다. 장시간 활동에 대비해 편하고 미끄럼이 적은 신발을 권장합니다.</li>
                      <li><strong>개인 준비물:</strong> 상비약, 모자, 개인 물병·텀블러(이름 표시), 여벌 옷과 양말, 우비, 선크림, 세면도구.</li>
                      <li><strong>어린이 동반 시:</strong> 이름표(보호자 연락처 부착), 여벌 옷, 어린이용 모자·물병, 비상약.</li>
                    </ul>
                  </div>

                  <div className="safety-rule-section">
                    <h4>4. 안전교육 및 역할 분담</h4>
                    <ul>
                      <li><strong>출발 전 전체 안전교육:</strong> 모든 참가자를 대상으로 본 안전수칙을 사전 교육합니다.</li>
                      <li><strong>담당자 사전 배정:</strong> 응급 담당, 차량 안전 담당, 감염예방 담당을 미리 지정합니다.</li>
                      <li><strong>지속적인 안전 안내:</strong> 행사 중 수시로 안전 공지를 전달하고, 안전팀이 정기적으로 점검합니다.</li>
                      <li><strong>비상 연락망 운영:</strong> 공동체·팀별 비상 연락망과 단체 채팅방을 운영하여 실시간으로 상황을 공유합니다.</li>
                    </ul>
                  </div>

                  <div className="safety-rule-section">
                    <h4>5. 물놀이 안전수칙</h4>
                    <h5>• 공통 수칙</h5>
                    <ul>
                      <li>안전요원을 배치하고, 활동 전후로 반드시 인원을 점검합니다.</li>
                      <li>입수 전 준비운동을 실시합니다.</li>
                    </ul>
                    <h5>• 물놀이 (바다 이용시)</h5>
                    <ul>
                      <li>어린이는 보호자가 책임 구역을 나누어 1:N으로 밀착 관리하고, 구명조끼를 착용합니다.</li>
                      <li>수심과 입수 가능 구역을 명확히 표시하고, 어린이만의 단독 입수를 금지합니다.</li>
                      <li>안전요원은 튜브, 구명환, 호루라기 등 수상 안전장비를 비치합니다.</li>
                    </ul>
                  </div>
                </div>
                <div className="safety-modal-footer">
                  <button className="confirm-btn" onClick={() => setShowSafetyRules(false)}>확인</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* 아바타 이미지 풀스크린 확대 모달 */}
      {fullscreenImage && (
        <>
          <style>{`
            @keyframes avatarZoomIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .avatar-zoom-in-ani {
              animation: avatarZoomIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
          <div 
            className="fullscreen-overlay" 
            onClick={() => {
              setIsClosing(true);
              setTimeout(() => {
                setFullscreenImage(null);
                setIsClosing(false);
              }, 200);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.15)', // 투명 배경으로 지체 리스트가 보이도록 조정
              backdropFilter: 'blur(8px)', // 세련된 블러 처리
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              transition: 'opacity 0.2s ease-out, backdrop-filter 0.2s ease-out',
              opacity: isClosing ? 0 : 1
            }}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsClosing(true);
                setTimeout(() => {
                  setFullscreenImage(null);
                  setIsClosing(false);
                }, 200);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2100
              }}
            >
              ✕
            </button>
            <img 
              src={fullscreenImage} 
              alt="Zoomed Avatar" 
              className={isClosing ? '' : 'avatar-zoom-in-ani'}
              style={{
                maxWidth: '85%',
                maxHeight: '75%',
                borderRadius: '24px',
                objectFit: 'contain',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                border: '4px solid white',
                backgroundColor: 'white',
                transition: 'transform 0.2s cubic-bezier(0.3, 0, 0.8, 0.15), opacity 0.2s ease-out',
                transform: isClosing ? 'scale(0.8) translateY(10px)' : 'scale(1)',
                opacity: isClosing ? 0 : 1
              }} 
            />
          </div>
        </>
      )}
    </div>
  );
}
