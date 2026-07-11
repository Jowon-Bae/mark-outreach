'use client';
import { useState } from 'react';
import { Calendar, MapPin, Coffee, Info, BookOpen, Car, Key, ClipboardList, Utensils, Smile, Sun, Sparkles, Flame } from 'lucide-react';
import './schedule.css';

export const dynamic = 'force-dynamic';

export default function Schedule() {
  // 이미지 줌 상태
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 50, y: 50 });
  const [activeDetailTab, setActiveDetailTab] = useState<'day1' | 'day2'>('day1');

  const getCoordinates = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    return { x, y };
  };

  const handleStart = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    const { x, y } = getCoordinates(e);
    setZoomState({ isZoomed: true, x, y });
  };

  const handleMove = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    if (!zoomState.isZoomed) return;
    const { x, y } = getCoordinates(e);
    setZoomState(prev => ({ ...prev, x, y }));
  };

  const handleEnd = () => {
    setZoomState(prev => ({ ...prev, isZoomed: false }));
  };

  return (
    <div className="schedule-container">
      {/* 상단 이미지 표 */}
      <div style={{ marginBottom: '20px', margin: '0 -20px', overflow: 'hidden', borderBottom: '1px solid #f1f3f5' }}>
        <img 
          src="/assets/scadule.png" 
          alt="전체 일정 표" 
          role="button"
          tabIndex={0}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            transform: zoomState.isZoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
            transition: 'transform 0.2s ease-out',
            cursor: zoomState.isZoomed ? 'zoom-out' : 'zoom-in',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }} 
        />
      </div>

      {/* 일정 상세 안내 섹션 */}
      <div className="detail-guide-section">
        <div className="detail-guide-title">
          <Calendar size={20} color="#1b64da" />
          <span>아웃리치 일정 상세 가이드</span>
        </div>

        {/* 1일차 / 2일차 상세 탭 */}
        <div className="detail-tabs">
          <button 
            className={`detail-tab-btn ${activeDetailTab === 'day1' ? 'active' : ''}`}
            onClick={() => setActiveDetailTab('day1')}
          >
            1일차 (금요일) 상세
          </button>
          <button 
            className={`detail-tab-btn ${activeDetailTab === 'day2' ? 'active' : ''}`}
            onClick={() => setActiveDetailTab('day2')}
          >
            2일차 (토요일) 상세
          </button>
        </div>

        <div className="guide-cards-container">
          {activeDetailTab === 'day1' ? (
            <>
              {/* 출발 & 체크인 */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <h4 style={{ display: 'flex', alignItems: 'center' }}>
                    <span>출발</span>
                    <span style={{ color: '#ccc', fontWeight: '400', fontSize: '0.9rem' }}>&</span>
                    <span>체크인</span>
                  </h4>
                </div>
                <div className="guide-card-content">
                  <span className="guide-badge-notice">※ 도착 전, 개별 점심식사 필수!</span>
                  <span className="guide-sub-title">1. 이동 수단별 도착 지침</span>
                  <ul className="guide-ul">
                    <li><strong>자차 이동 지체:</strong> 13:00까지 복된교회 영주수련원 도착</li>
                    <li style={{ listStyleType: 'none', fontSize: '0.85rem', color: '#4e5968', marginLeft: '-10px' }}>
                      주소: 경상북도 영주시 문수면 조제로 50
                    </li>
                    <li><strong>버스 이동 지체:</strong> 상문고등학교에서 오전 8:00 정각 출발 (소요 약 3시간 30분, 휴게소 1시간 정차 예정)</li>
                  </ul>

                  <span className="guide-sub-title">2. 체크인 절차</span>
                  <ul className="guide-ul">
                    <li><strong>접수(총무팀):</strong> 수련원 도착 후 숙소 배정 안내 및 개인 명찰 배부</li>
                    <li><strong>짐 정리:</strong> 배정된 개인/팀별 숙소에 짐 정리 및 자녀 키즈케어 등록</li>
                    <li><strong>교회 이동:</strong> 준비 완료 후 버스로 교회 이동 (오후 13:30 수련원 출발)</li>
                  </ul>
                  <p style={{ margin: '8px 0 0 0', fontWeight: '700', color: '#1b64da' }}>
                    키즈케어팀 & 안전요원팀은 수련원(숙소)에서 먼저 사역이 시작됩니다!
                  </p>
                </div>
              </div>

              {/* 사역 준비 모임 */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <h4 style={{ display: 'flex', alignItems: 'center' }}>
                    <span>사역 준비 (팀별 모임 장소)</span>
                  </h4>
                </div>
                <div className="guide-card-content">
                  <span className="guide-badge-info">팀별 장소 확인 및 모임 진행</span>
                  <div className="grid-2col">
                    <div className="grid-item-team"><strong>전도팀:</strong> 2층 본당 (준비 모임 후 노방전도)</div>
                    <div className="grid-item-team"><strong>공연팀:</strong> 1층 소예배실</div>
                    <div className="grid-item-team"><strong>발마사지팀:</strong> 1층 아동부실</div>
                    <div className="grid-item-team"><strong>이미용팀:</strong> 1층 성가대실</div>
                    <div className="grid-item-team"><strong>데코팀:</strong> 1층 유치부실 (8/1 키즈케어 장소)</div>
                    <div className="grid-item-team"><strong>미디어팀:</strong> 2층 남선교회실</div>
                    <div className="grid-item-team"><strong>의료팀:</strong> 2층 청년부실</div>
                    <div className="grid-item-team"><strong>안내팀:</strong> 2층 휴게실</div>
                    <div className="grid-item-team"><strong>식사팀:</strong> 3층 식당</div>
                  </div>
                </div>
              </div>

              {/* 저녁 식사 및 레크레이션 */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <h4 style={{ display: 'flex', alignItems: 'center' }}>
                    <span>저녁 식사</span>
                    <span style={{ color: '#ccc', fontWeight: '400', fontSize: '0.9rem' }}>&</span>
                    <span>레크레이션</span>
                  </h4>
                </div>
                <div className="guide-card-content">
                  <span className="guide-badge-notice">※ 키즈케어 1일차 종료</span>
                  <span className="guide-sub-title">1. 저녁 식사 안내</span>
                  <ul className="guide-ul">
                    <li>18:00까지 숙소(수련원) 복귀 완료 (교회에서 버스 17:00 출발)</li>
                    <li><strong>BBQ팀 + 총무팀:</strong> 식사 준비 및 마무리 정리 담당 (밥과 김치는 식사팀에서 제공)</li>
                  </ul>

                  <span className="guide-sub-title">2. 레크레이션 진행 요령</span>
                  <ul className="guide-ul">
                    <li>시작 전 음향 및 영상 장비 사전 점검 필수</li>
                    <li>남자(형제) 숙소 짐 정리 및 친교를 위한 방석 세팅</li>
                    <li>모두 적극적이고 즐거운 마음으로 동참하기!</li>
                  </ul>
                  <p style={{ margin: '8px 0 0 0', fontWeight: '700', color: '#8b95a1', fontStyle: 'italic' }}>
                    취침: 1일차 일정 종료 및 휴식
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 기상 및 아침식사 */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <h4 style={{ display: 'flex', alignItems: 'center' }}>
                    <span>기상 및 아침 사역 시작</span>
                  </h4>
                </div>
                <div className="guide-card-content">
                  <span className="guide-badge-info">아침 로테이션 지침</span>
                  <ul className="guide-ul">
                    <li><strong>아침 식사:</strong> 오전 08:00부터 수련원 식당에서 제공 (조식팀 담당)</li>
                    <li><strong>키즈케어팀:</strong> 자녀 돌봄 준비를 위해 가장 이른 시간대에 교회로 사전 이동</li>
                    <li><strong>팀별 사역자:</strong> 오전 사역 개시 시간에 맞춰 버스로 순차 이동 (첫 버스 09:00 출발 예정)</li>
                  </ul>
                </div>
              </div>

              {/* 마을잔치 */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <h4 style={{ display: 'flex', alignItems: 'center' }}>
                    <span>마을잔치 (메인 합동 사역)</span>
                  </h4>
                </div>
                <div className="guide-card-content">
                  <span className="guide-badge-notice">※ 점심 식사시간: 11:30 ~ 14:00 (지정 식당 이용)</span>
                  <ul className="guide-ul">
                    <li><strong>장소 준비:</strong> 전일 팀별 준비 장소와 동일하게 세팅 (키즈케어는 1층 유치부실 사용)</li>
                    <li><strong>식사 시작:</strong> 오전 11:30부터 마을 주민 및 지체 식사 개시</li>
                    <li><strong>사역 멈춤 (STOP) 시간:</strong> 마을잔치 하이라이트인 <strong>공연(12:00 / 14:00 총 2회)</strong> 시간 동안은 모든 사역을 일시 중단하고 공연에 집중합니다.</li>
                    <li><strong>대상자 집중 전도:</strong> 이미용, 발마사지 어르신들을 대상으로 복음 전파에 힘씁니다. (단, 신광교회 기존 교인은 명찰 표시 확인 후 제외)</li>
                    <li><strong>철수 정리:</strong> 16:00 전 사역 종료 후 17:00까지 깔끔하게 정리 완료</li>
                  </ul>

                  <span className="guide-sub-title">팀원 점심 식사 메뉴</span>
                  <ul className="guide-ul">
                    <li><strong>성인 지체:</strong> 든든한 한우국밥 + 김치</li>
                    <li><strong>자녀 지체:</strong> 맛있는 공기밥, 맑은 국, 반찬류</li>
                  </ul>
                </div>
              </div>

              {/* 저녁 식사 및 집회 */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <h4 style={{ display: 'flex', alignItems: 'center' }}>
                    <span>저녁 식사</span>
                    <span style={{ color: '#ccc', fontWeight: '400', fontSize: '0.9rem' }}>&</span>
                    <span>저녁 집회</span>
                  </h4>
                </div>
                <div className="guide-card-content">
                  <span className="guide-badge-notice">※ 키즈케어 2일차 종료</span>
                  <span className="guide-sub-title">1. 저녁 식사 안내</span>
                  <ul className="guide-ul">
                    <li>밥차 배식 혹은 외부 케이터링 식사로 진행됩니다.</li>
                    <li>식사 후 집회 전까지의 잔여 시간은 개별 및 조별로 자유롭게 나눔을 진행합니다.</li>
                  </ul>

                  <span className="guide-sub-title">2. 저녁 집회 지침</span>
                  <ul className="guide-ul">
                    <li>영주 땅의 복음화, 아웃리치 교회, 동행하는 가정을 위해 뜨겁게 찬양하고 합심하여 기도/예배합니다.</li>
                    <li>집회 종료 후 숙소로 복귀하기 전, 사용한 교회 시설과 쓰레기를 완벽하게 청소·정리합니다.</li>
                  </ul>
                  <p style={{ margin: '8px 0 0 0', fontWeight: '700', color: '#8b95a1', fontStyle: 'italic' }}>
                    취침: 2일차 전체 사역 종료 및 평안한 밤
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
