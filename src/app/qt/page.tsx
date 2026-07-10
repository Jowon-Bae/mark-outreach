'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BookOpen, CheckCircle, ArrowLeft, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './qt.css';

// 묵상 콘텐츠 데이터 (날짜별 매핑)
interface QTContent {
  passage: string;
  title: string;
  verses: string;
  meditation: string;
}

const QT_DATA: Record<string, QTContent> = {
  '2026-07-10': {
    passage: '마가복음 1장 1~8절',
    title: '광야에서 들리는 외치는 자의 소리',
    verses: '“보라 내가 내 사자를 네 앞에 보내노니 그가 네 길을 준비하리라 광야에 외치는 자의 소리가 있어 이르되 너희는 주의 길을 준비하라 그의 지경을 곧게 하라”',
    meditation: '세례 요한은 주님의 길을 준비하는 자였습니다. 그의 사역지는 화려한 예루살렘 성전이 아니라 거칠고 척박한 광야였습니다. 아웃리치 기간 동안 우리가 서 있는 그 자리가 비록 낮설고 척박할지라도, 그곳에서 주의 길을 예비하는 겸손한 외치는 소리가 되기를 소망합니다.'
  },
  '2026-07-11': {
    passage: '마가복음 1장 9~15절',
    title: '성령에 이끌림과 천국의 선포',
    verses: '“이르시되 때가 찼고 하나님의 나라가 가까이 왔으니 회개하고 복음을 믿으라 하시더라”',
    meditation: '예수님은 공생애를 시작하시기 전 성령에 이끌려 광야에서 시험을 받으셨습니다. 아웃리치 사역을 시작하기에 앞서 우리 역시 성령의 충만함으로 무장하고, 모든 영적 싸움에서 승리하며 마주하는 이들에게 당당히 하나님의 나라를 선포합시다.'
  },
  '2026-07-12': {
    passage: '마가복음 1장 16~20절',
    title: '사람을 낚는 어부로 부르심',
    verses: '“예수께서 이르시되 나를 따라오라 내가 너희로 사람을 낚는 어부가 되게 하리라 하시니 곧 그물을 버려두고 따르니라”',
    meditation: '제자들은 주님의 부르심에 지체하지 않고 그들의 그물과 배를 버려두고 예수님을 따랐습니다. 아웃리치 현장에서 주님이 부르실 때, 나의 소유나 익숙함을 내려놓고 부르심에 즉각 순종하는 영적 민감함을 가집시다.'
  }
};

const DEFAULT_QT: QTContent = {
  passage: '마가복음 1장 35절',
  title: '새벽 오히려 미명에 기도하신 예수님',
  verses: '“새벽 아직도 밝기 전에 예수께서 일어나 나가 한적한 곳으로 가사 거기서 기도하시더니”',
  meditation: '아웃리치 사역의 첫출발과 모든 능력의 원천은 바로 기도에 있습니다. 바쁜 사역 일정 중에서도 예수님처럼 한적한 곳에서 조용히 하나님을 마주하고 기도로 하루를 준비하여 주의 은혜를 풍성히 누리는 날이 됩시다.'
};

export default function QuietTime() {
  const router = useRouter();
  const [dateStr, setDateStr] = useState('');
  const [qt, setQt] = useState<QTContent>(DEFAULT_QT);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedUsers, setCompletedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 오늘 날짜 계산 (KST 기준)
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const kstDate = new Date(today.getTime() - offset);
    const kstDateString = kstDate.toISOString().split('T')[0];
    
    setDateStr(kstDateString);
    setQt(QT_DATA[kstDateString] || DEFAULT_QT);

    fetchQTCompletions(kstDateString);
  }, []);

  const fetchQTCompletions = async (dateKey: string) => {
    setIsLoading(true);
    const currentUsername = sessionStorage.getItem('username') || '';

    // 오늘 날짜 완료자 조회
    const { data, error } = await supabase
      .from('qt_completions')
      .select('user_name')
      .eq('date_str', dateKey);

    if (!error && data) {
      const users = data.map((item: any) => item.user_name);
      setCompletedUsers(users);
      
      // 로그인한 사용자가 오늘 완료했는지 확인
      if (currentUsername && users.includes(currentUsername)) {
        setIsCompleted(true);
      }
    }
    setIsLoading(false);
  };

  const handleComplete = async () => {
    const currentUsername = sessionStorage.getItem('username');
    if (!currentUsername) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isCompleted) return;

    const { error } = await supabase
      .from('qt_completions')
      .insert([{ user_name: currentUsername, date_str: dateStr }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint error
        setIsCompleted(true);
      } else {
        alert('묵상 완료 기록에 실패했습니다.');
        return;
      }
    }

    setIsCompleted(true);
    fetchQTCompletions(dateStr);
  };

  return (
    <div className="qt-container">
      {/* 상단 헤더 */}
      <div className="qt-header">
        <button className="back-btn" onClick={() => router.push('/')}>
          <ArrowLeft size={20} />
        </button>
        <h2>오늘의 QT & 묵상 📖</h2>
        <div style={{ width: 20 }}></div>
      </div>

      {/* 날짜 표시 */}
      <div className="qt-date-card">
        <span className="qt-label">TODAY'S BREAD</span>
        <span className="qt-date">{dateStr}</span>
      </div>

      {/* 말씀 카드 */}
      <div className="qt-card">
        <span className="qt-passage-badge">{qt.passage}</span>
        <h3 className="qt-title">{qt.title}</h3>
        <div className="qt-verses">
          <p>{qt.verses}</p>
        </div>
      </div>

      {/* 묵상 가이드 */}
      <div className="meditation-card">
        <h4>오늘의 묵상 나눔 💡</h4>
        <p className="meditation-text">{qt.meditation}</p>
      </div>

      {/* 완료 상태 버튼 */}
      <div className="action-section">
        {isCompleted ? (
          <div className="completed-badge">
            <CheckCircle size={20} color="#1b64da" />
            <span>오늘의 말씀 묵상을 완료했습니다! 은혜로운 하루 보내세요.</span>
          </div>
        ) : (
          <button className="complete-btn" onClick={handleComplete} disabled={isLoading}>
            <CheckCircle size={20} />
            <span>오늘 말씀 묵상 완료하기</span>
          </button>
        )}
      </div>

      {/* 실시간 묵상 완료자 목록 */}
      <div className="completions-card">
        <div className="completions-header">
          <Users size={16} />
          <h4>오늘 묵상을 완료한 지체들 ({completedUsers.length}명)</h4>
        </div>
        <div className="completions-list">
          {isLoading ? (
            <div className="loading-text">로딩 중...</div>
          ) : completedUsers.length === 0 ? (
            <div className="no-completions">가장 먼저 오늘의 말씀을 묵상해 보세요!</div>
          ) : (
            <div className="completions-tags">
              {completedUsers.map((name, index) => (
                <span key={index} className="completion-tag">
                  👤 {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
