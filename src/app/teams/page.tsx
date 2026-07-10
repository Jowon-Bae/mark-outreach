'use client';

import { useState } from 'react';
import { Phone, Search, ArrowLeft } from 'lucide-react';
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
}

// 예시 마가 공동체 조직도 데이터 (아웃리치 사역에 최적화)
const INITIAL_TEAMS: Team[] = [
  {
    teamName: '총괄 및 사역자본부 👑',
    members: [
      { name: '김동혁', role: '담당 목사 (총괄 총무)', phone: '010-1234-5678' },
      { name: '이은혜', role: '담당 전도사 (양육)', phone: '010-8765-4321' },
      { name: '배주원', role: '총괄 팀장 (진행 리더)', phone: '010-5555-4444' }
    ]
  },
  {
    teamName: '예배 및 찬양팀 🎸',
    members: [
      { name: '김민준', role: '예배팀장 (싱어)', phone: '010-1111-2222' },
      { name: '이서연', role: '반주자 (신디)', phone: '010-3333-4444' },
      { name: '박건우', role: '어쿠스틱 기타', phone: '010-5555-6666' },
      { name: '최다은', role: '싱어 (알토)', phone: '010-7777-8888' }
    ]
  },
  {
    teamName: '미디어 & 방송팀 🎥',
    members: [
      { name: '정우진', role: '미디어팀장 (영상 촬영)', phone: '010-9999-0000' },
      { name: '한소희', role: 'PPT/자막 총괄', phone: '010-2222-3333' },
      { name: '강현우', role: '음향 엔지니어', phone: '010-4444-5555' }
    ]
  },
  {
    teamName: '안전 & 안내팀 🚨',
    members: [
      { name: '송지훈', role: '안전팀장 (차량 통제)', phone: '010-6666-7777' },
      { name: '윤아름', role: '의료/비상 구호', phone: '010-8888-9999' },
      { name: '임재희', role: '안내 및 주차', phone: '010-1212-3434' }
    ]
  }
];

export default function Teams() {
  const router = useRouter();
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
        <h2>조직원 연락망</h2>
        <div style={{ width: 20 }}></div> {/* 중앙 정렬 밸런스용 */}
      </div>

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
          filteredTeams.map((team, idx) => (
            <div key={idx} className="team-group-card">
              <h3 className="team-title">{team.teamName}</h3>
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
          ))
        )}
      </div>
    </div>
  );
}
