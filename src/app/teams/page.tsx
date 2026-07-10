'use client';

import { useState } from 'react';
import { Phone, Search, ArrowLeft, MapPin, ExternalLink, ShieldAlert, Crown, Music, Video, Shield, User, Utensils, Baby, Paintbrush, Scissors, Laugh, HeartHandshake, Activity, Sparkles } from 'lucide-react';
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
      { name: '김민우', role: '총무', phone: '010-7557-1090' },
      { name: '신민재', role: '부총무', phone: '010-5292-5620' },
      { name: '선우진', role: '회계', phone: '010-8781-8806' },
      { name: '성민선', role: '팀원', phone: '010-7122-1090' },
      { name: '박소희', role: '팀원', phone: '010-3936-3656' }
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
      { name: '김경록', role: '팀원', phone: '010-9521-0066' }
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
      { name: '박제윤', role: '팀장', phone: '010-0000-0000' }
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
      { name: '손성웅', role: '팀원', phone: '010-5967-3299' },
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
      { name: '정수현', role: '팀원', phone: '010-3758-1452' },
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
      { name: '유상현', role: '팀장', phone: '010-0000-0000' }
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
