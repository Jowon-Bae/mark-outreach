'use client';

import { useState, useEffect } from 'react';
import { Phone, Search, ArrowLeft, MapPin, ExternalLink, ShieldAlert, Crown, Music, Video, Shield, User, Utensils, Baby, Paintbrush, Scissors, Laugh, HeartHandshake, Activity, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  tmapUrl: string;
}

// 예시 마가 공동체 조직도 데이터 (아웃리치 사역에 최적화)
const INITIAL_TEAMS: Team[] = [
  {
    teamName: '총무단',
    icon: Crown,
    members: [
      { name: '배주원', role: '담당 목사', phone: '010-9017-1848' },
      { name: '두진문', role: '담당 장로', phone: '010-4020-1389' },
      { name: '김민우', role: '총무', phone: '010-7557-1090' },
      { name: '신민재', role: '부총무', phone: '010-5292-5620' },
      { name: '선우진', role: '회계', phone: '010-8781-8806' },
      { name: '성민선', role: '팀원', phone: '010-7122-1090' },
      { name: '박소희', role: '팀원', phone: '010-3936-3656' }
    ]
  },
  {
    teamName: '전도팀',
    icon: HeartHandshake,
    members: [
      { name: '류남현', role: '팀장', phone: '010-9011-3270' },
      { name: '장영철', role: '팀원', phone: '010-5672-6271' },
      { name: '박형규', role: '팀원', phone: '010-8994-4430' },
      { name: '김순정', role: '팀원', phone: '010-3546-4430' },
      { name: '김상형', role: '팀원', phone: '010-7410-9185' },
      { name: '박성연', role: '팀원', phone: '010-7192-4213' },
      { name: '육양수', role: '팀원', phone: '010-9722-8972' },
      { name: '최애진', role: '팀원', phone: '010-4171-3391' },
      { name: '김신곤', role: '팀원', phone: '010-9058-7815' },
      { name: '고은정', role: '팀원', phone: '010-2711-7724' },
      { name: '김희준', role: '팀원', phone: '010-9208-7596' },
      { name: '김지은', role: '팀원', phone: '010-7101-4158' },
      { name: '임은주', role: '팀원', phone: '010-5048-7580' },
      { name: '이광숙', role: '팀원', phone: '010-4425-3270' },
      { name: '이용섭', role: '팀원', phone: '010-5298-3127' },
      { name: '김경록', role: '팀원', phone: '010-9521-0066' },
      { name: '정수현', role: '팀원', phone: '010-3758-1452' },
      { name: '이병주', role: '팀원', phone: '010-0000-0000' }
    ]
  },
  {
    teamName: '의료팀',
    icon: Activity,
    members: [
      { name: '신재식', role: '팀장', phone: '010-7363-2610' },
      { name: '박진은', role: '팀원', phone: '010-9429-9340' },
      { name: '채양석', role: '팀원', phone: '010-3392-3297' },
      { name: '조은혜', role: '팀원', phone: '010-5017-6620' },
      { name: '신승주', role: '팀원', phone: '010-9956-9786' },
      { name: '한은정', role: '팀원', phone: '010-9870-3147' }
    ]
  },
  {
    teamName: '미디어팀',
    icon: Video,
    members: [
      { name: '허민', role: '팀장', phone: '010-8587-5221' },
      { name: '윤석민', role: '팀원', phone: '010-7370-9594' },
      { name: '이용건', role: '팀원', phone: '010-9100-3396' },
      { name: '서기열', role: '팀원', phone: '010-7155-3116' },
      { name: '한영원', role: '팀원', phone: '010-8538-0177' },
      { name: '김나리', role: '팀원', phone: '010-8543-6612' }
    ]
  },
  {
    teamName: '식사팀',
    icon: Utensils,
    members: [
      { name: '황상수', role: '팀장', phone: '010-3765-8467' },
      { name: '이지은', role: '팀원', phone: '010-7320-2081' },
      { name: '김원영', role: '팀원', phone: '010-3858-7160' },
      { name: '김산수', role: '팀원', phone: '010-3298-9089' },
      { name: '박경현', role: '팀원', phone: '010-5394-4221' },
      { name: '강수은', role: '팀원', phone: '010-5187-7948' },
      { name: '두진문', role: '팀원', phone: '010-4020-1389' },
      { name: '이석찬', role: '팀원', phone: '010-2539-5040' },
      { name: '이희승', role: '팀원', phone: '010-4263-5040' },
      { name: '강원균', role: '팀원', phone: '010-8500-7085' },
      { name: '장영송', role: '팀원', phone: '010-2303-1990' },
      { name: '김진한', role: '팀원', phone: '010-3138-3105' },
      { name: '최연진', role: '팀원', phone: '010-8681-0753' },
      { name: '심지호', role: '팀원', phone: '010-2121-8182' },
      { name: '이민후', role: '팀원', phone: '010-9277-5502' },
      { name: '전승우', role: '팀원', phone: '010-5413-7799' },
      { name: '이현정', role: '팀원', phone: '010-6234-9512' },
      { name: '김연주', role: '팀원', phone: '010-8513-9860' },
      { name: '박순관', role: '팀원', phone: '010-2794-2017' },
      { name: '하진수', role: '팀원', phone: '010-8919-4875' }
    ]
  },
  {
    teamName: '키즈케어팀',
    icon: Baby,
    members: [
      { name: '박제윤', role: '팀장', phone: '010-5392-7838' },
      { name: '전민기', role: '팀원', phone: '010-3761-0004' },
      { name: '김태희', role: '팀원', phone: '010-4731-8340' },
      { name: '안승국', role: '팀원', phone: '010-8878-4920' },
      { name: '이혜수', role: '팀원', phone: '010-3669-9318' },
      { name: '강진규', role: '팀원', phone: '010-5152-0401' },
      { name: '김지현', role: '팀원', phone: '010-2778-5853' },
      { name: '김영민', role: '팀원', phone: '010-2718-4682' },
      { name: '문정은', role: '팀원', phone: '010-4702-8587' },
      { name: '노소영', role: '팀원', phone: '010-4818-4015' },
      { name: '박순호', role: '팀원', phone: '010-9996-4877' },
      { name: '손성웅', role: '팀원', phone: '010-5967-3299' },
      { name: '김문선', role: '팀원', phone: '010-0000-0000' }
    ]
  },
  {
    teamName: '공연팀',
    icon: Sparkles,
    members: [
      { name: '최지은', role: '팀장', phone: '010-2210-9212' },
      { name: '박선민', role: '팀원', phone: '010-2774-3007' },
      { name: '이희선', role: '팀원', phone: '010-9096-1379' },
      { name: '서승원', role: '팀원', phone: '010-8821-6900' },
      { name: '윤인희', role: '팀원', phone: '010-4469-0769' },
      { name: '김신혜', role: '팀원', phone: '010-4946-1991' },
      { name: '이미영', role: '팀원', phone: '010-3426-7902' },
      { name: '김지준', role: '팀원', phone: '010-2034-5155' },
      { name: '김민', role: '팀원', phone: '010-9154-9053' },
      { name: '유영삼', role: '팀원', phone: '010-7226-3546' },
      { name: '추인애', role: '팀원', phone: '010-8617-8105' },
      { name: '김지선', role: '팀원', phone: '010-5411-8448' },
      { name: '이승용', role: '팀원', phone: '010-2838-2147' }
    ]
  },
  {
    teamName: '발마사지팀',
    icon: User,
    members: [
      { name: '이문석', role: '팀장', phone: '010-8465-1664' },
      { name: '박성수', role: '팀원', phone: '010-7907-4845' },
      { name: '나경준', role: '팀원', phone: '010-2898-7599' },
      { name: '오국환', role: '팀원', phone: '010-3521-2664' },
      { name: '박희정', role: '팀원', phone: '010-8399-1664' },
      { name: '이상연', role: '팀원', phone: '010-8768-2624' },
      { name: '이승호', role: '팀원', phone: '010-8641-3554' },
      { name: '박희주', role: '팀원', phone: '010-8546-3554' },
      { name: '최윤호', role: '팀원', phone: '010-9881-8119' },
      { name: '김규연', role: '팀원', phone: '010-8228-4938' },
      { name: '이재원', role: '팀원', phone: '010-9041-9142' },
      { name: '김유진', role: '팀원', phone: '010-9450-3632' },
      { name: '염귀화', role: '팀원', phone: '010-9592-3371' }
    ]
  },
  {
    teamName: '데코팀',
    icon: Paintbrush,
    members: [
      { name: '장윤경', role: '팀장', phone: '010-4477-4144' },
      { name: '강정호', role: '팀원', phone: '010-8746-9531' },
      { name: '남아란', role: '팀원', phone: '010-7900-9531' },
      { name: '김동진', role: '팀원', phone: '010-3476-0888' },
      { name: '김민혜', role: '팀원', phone: '010-7282-5677' },
      { name: '김인호', role: '팀원', phone: '010-5781-4427' },
      { name: '신유리', role: '팀원', phone: '010-4242-2946' },
      { name: '김지인', role: '팀원', phone: '010-6623-2033' },
      { name: '김보화', role: '팀원', phone: '010-7353-4648' },
      { name: '안민균', role: '팀원', phone: '010-9273-5938' },
      { name: '김사무엘', role: '팀원', phone: '010-6367-8764' },
      { name: '이용준', role: '팀원', phone: '010-8496-5311' },
      { name: '김혜미', role: '팀원', phone: '010-9171-6517' },
      { name: '김성희', role: '팀원', phone: '010-5248-7415' },
      { name: '현지혜', role: '팀원', phone: '010-9001-7028' },
      { name: '김선정', role: '팀원', phone: '010-3693-1323' },
      { name: '안지원', role: '팀원', phone: '010-2222-5988' }
    ]
  },
  {
    teamName: '이미용팀',
    icon: Scissors,
    members: [
      { name: '이현신', role: '팀장', phone: '010-9265-5747' },
      { name: '송은지', role: '팀원', phone: '010-3808-9718' },
      { name: '심연옥', role: '팀원', phone: '010-7131-8833' },
      { name: '유숙희', role: '팀원', phone: '010-7123-6407' },
      { name: '이혜인', role: '팀원', phone: '010-4948-3870' },
      { name: '이지영', role: '팀원', phone: '010-5260-2624' },
      { name: '구량주', role: '팀원', phone: '010-3720-7336' },
      { name: '최혜남', role: '팀원', phone: '010-3035-6570' },
      { name: '송영선', role: '팀원', phone: '010-3765-8487' }
    ]
  },
  {
    teamName: '안내팀',
    icon: Shield,
    members: [
      { name: '유상현', role: '팀장', phone: '010-0000-0000' },
      { name: '강나로', role: '팀원', phone: '010-0000-0000' },
      { name: '김도훈', role: '팀원', phone: '010-0000-0000' },
      { name: '김수아', role: '팀원', phone: '010-0000-0000' },
      { name: '김아론', role: '팀원', phone: '010-0000-0000' },
      { name: '박하솜', role: '팀원', phone: '010-0000-0000' },
      { name: '유상윤', role: '팀원', phone: '010-0000-0000' },
      { name: '심이안', role: '팀원', phone: '010-0000-0000' },
      { name: '이하은', role: '팀원', phone: '010-0000-0000' },
      { name: '태현영', role: '팀원', phone: '010-0000-0000' }
    ]
  },
  {
    teamName: '예배팀',
    icon: Music,
    members: [
      { name: '전승우', role: '팀장', phone: '010-0000-0000' }
    ]
  },
  {
    teamName: '레크레이션',
    icon: Laugh,
    members: [
      { name: '유영삼', role: '팀장', phone: '010-0000-0000' }
    ]
  }
];

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
                      <p>{loc.description}</p>
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
