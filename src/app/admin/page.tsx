'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Upload, Megaphone, UserCheck } from 'lucide-react';
import './admin.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'community', 'gallery', 'notices', 'requests'
  const [loginRequests, setLoginRequests] = useState<any[]>([]);
  const [qtShares, setQtShares] = useState<any[]>([]);

  const [stats, setStats] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // 공지 관련 상태
  const [currentNotice, setCurrentNotice] = useState('');
  const [currentNoticeId, setCurrentNoticeId] = useState<string | null>(null);
  const [adminNewNotice, setAdminNewNotice] = useState('');

  // 비밀번호 확인
  const handleLogin = () => {
    if (password === 'admin1234!') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const fetchData = () => {
    fetchStats();
    fetchPosts();
    fetchPhotos();
    fetchNotice();
    fetchLoginRequests();
    fetchQTShares();
  };

  // 0. 로그인 승인 요청 불러오기
  const fetchLoginRequests = async () => {
    const { data, error } = await supabase
      .from('login_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setLoginRequests(data);
  };

  // 0.5 묵상 데이터 불러오기
  const fetchQTShares = async () => {
    const { data, error } = await supabase
      .from('qt_completions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setQtShares(data);
  };

  const handleDeleteQTShare = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('qt_completions').delete().eq('id', id);
    if (!error) {
      alert('삭제되었습니다.');
      fetchQTShares();
    } else {
      alert('삭제 실패: ' + error.message);
    }
  };

  // 1. 통계 데이터 불러오기
  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('page_visits')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setStats(data);
  };

  // 2. 게시글 데이터 불러오기
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setPosts(data);
  };

  // 3. 사진첩 데이터 불러오기
  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('community_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setPhotos(data);
  };

  // 게시글 삭제
  const handleDeletePost = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('community_comments').delete().eq('post_id', id);
    const { error } = await supabase.from('community_posts').delete().eq('id', id);
    if (!error) {
      alert('삭제되었습니다.');
      fetchPosts();
    }
  };

  // 사진 업로드
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Public URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 3. DB에 기록
      const { error: dbError } = await supabase
        .from('community_gallery')
        .insert([{ image_url: publicUrlData.publicUrl }]);

      if (dbError) throw dbError;

      alert('사진이 업로드되었습니다!');
      fetchPhotos();
    } catch (error: any) {
      alert('업로드 실패: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 사진 삭제
  const handleDeletePhoto = async (id: string, imageUrl: string) => {
    if (!confirm('사진을 삭제하시겠습니까?')) return;
    
    try {
      // 1. Storage에서 파일 삭제 (선택사항, URL 파싱 필요)
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName]);
      }

      // 2. DB에서 삭제
      await supabase.from('community_gallery').delete().eq('id', id);
      alert('삭제되었습니다.');
      fetchPhotos();
    } catch (error: any) {
      alert('삭제 실패: ' + error.message);
    }
  };

  // 4. 실시간 공지사항 조회
  const fetchNotice = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const latest = data.find((post: any) => post.content.startsWith('[공지]'));
      if (latest) {
        setCurrentNotice(latest.content.replace('[공지]', '').trim());
        setCurrentNoticeId(latest.id);
      } else {
        setCurrentNotice('');
        setCurrentNoticeId(null);
      }
    }
  };

  // 공지사항 등록
  const handlePostNotice = async () => {
    if (!adminNewNotice.trim()) {
      alert('공지 내용을 입력해 주세요.');
      return;
    }
    const { error } = await supabase
      .from('community_posts')
      .insert([{ author: '관리자', content: `[공지] ${adminNewNotice.trim()}` }]);

    if (!error) {
      alert('공지가 실시간 등록되었습니다!');
      
      // 웹 푸시 API 호출 (백그라운드 스마트폰 알림 발송)
      fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '📢 마가공동체 아웃리치 긴급 공지',
          body: adminNewNotice.trim()
        })
      }).catch(err => console.error('Failed to send push notifications:', err));

      setAdminNewNotice('');
      fetchNotice();
      fetchPosts();
    } else {
      alert('공지 등록 실패: ' + error.message);
    }
  };

  // 공지사항 삭제
  const handleDeleteNotice = async (id: string) => {
    if (!confirm('현재 실시간 공지사항을 삭제하시겠습니까?')) return;
    await supabase.from('community_comments').delete().eq('post_id', id);
    const { error } = await supabase.from('community_posts').delete().eq('id', id);

    if (!error) {
      alert('공지가 삭제되었습니다.');
      fetchNotice();
      fetchPosts();
    } else {
      alert('공지 삭제 실패: ' + error.message);
    }
  };

  // 로그인 승인 처리
  const handleApproveRequest = async (id: string, name: string) => {
    const { error } = await supabase
      .from('login_requests')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      alert(`'${name}' 지체님의 로그인을 승인했습니다.`);
      fetchLoginRequests();
    } else {
      alert('승인 처리 실패: ' + error.message);
    }
  };

  // 로그인 반려 처리
  const handleRejectRequest = async (id: string, name: string) => {
    if (!confirm(`'${name}' 지체님의 로그인 요청을 반려하시겠습니까?`)) return;
    const { error } = await supabase
      .from('login_requests')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) {
      alert(`'${name}' 지체님의 요청을 반려했습니다.`);
      fetchLoginRequests();
    } else {
      alert('반려 처리 실패: ' + error.message);
    }
  };

  // 통계 계산 로직
  const getStatsSummary = () => {
    const summary: Record<string, number> = {};
    stats.forEach(visit => {
      summary[visit.path] = (summary[visit.path] || 0) + 1;
    });
    return summary;
  };

  const statsSummary = getStatsSummary();

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-login">
          <h2>관리자 모드 접속</h2>
          <br/>
          <input 
            type="password" 
            autoComplete="new-password"
            placeholder="비밀번호 입력" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>접속하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="dashboard-layout">
        
        {/* 네비게이션 탭 */}
        <div className="dashboard-nav">
          <button 
            className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              이용자 통계
            </span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              자유게시판 관리
            </span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              사진첩 관리
            </span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Megaphone size={18} />
              실시간 공지 관리
            </span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={18} />
              로그인 승인 관리
            </span>
          </button>
        </div>

        {/* 탭 내용 영역 */}
        <div className="dashboard-content">
          
          {/* 통계 탭 */}
          {activeTab === 'stats' && (
            <div>
              <div className="section-header">
                <h3>방문 통계 요약 (총 {stats.length}회)</h3>
                <button onClick={fetchStats} className="nav-tab">새로고침</button>
              </div>
              <table className="data-table" style={{ marginBottom: '30px' }}>
                <thead>
                  <tr>
                    <th>메뉴 이름</th>
                    <th>방문 횟수</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(statsSummary).map(([path, count]) => (
                    <tr key={path}>
                      <td style={{ fontWeight: 'bold' }}>{path}</td>
                      <td>{count}회</td>
                    </tr>
                  ))}
                  {Object.keys(statsSummary).length === 0 && (
                    <tr><td colSpan={2} style={{textAlign:'center'}}>데이터가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>

              <h3>최근 방문 기록</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>사용자</th>
                    <th>메뉴</th>
                    <th>시간</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.slice(0, 50).map((visit) => (
                    <tr key={visit.id}>
                      <td>{visit.user_name}</td>
                      <td>{visit.path}</td>
                      <td>{new Date(visit.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 게시판 탭 */}
          {activeTab === 'community' && (
            <div>
              <div className="section-header">
                <h3>자유게시판 게시글 (총 {posts.length}개)</h3>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>작성자</th>
                    <th>내용</th>
                    <th>작성 시간</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td style={{ fontWeight: 'bold' }}>{post.author}</td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.content}
                      </td>
                      <td>{new Date(post.created_at).toLocaleString()}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 size={16} /> 삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center' }}>게시글이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 사진첩 탭 */}
          {activeTab === 'gallery' && (
            <div>
              <div className="upload-area">
                <h3>새 사진 업로드</h3>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  disabled={uploading}
                />
                {uploading && <p style={{color: '#888', fontSize: '14px'}}>업로드 중... 잠시만 기다려주세요.</p>}
              </div>

              <div className="section-header">
                <h3>등록된 사진 (총 {photos.length}장)</h3>
              </div>
              <div className="gallery-grid-admin">
                {photos.map(photo => (
                  <div key={photo.id} className="gallery-item-admin">
                    <img src={photo.image_url} alt="Gallery item" />
                    <button 
                      className="delete-photo-btn"
                      onClick={() => handleDeletePhoto(photo.id, photo.image_url)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 실시간 공지사항 탭 */}
          {activeTab === 'notices' && (
            <div>
              <div className="section-header">
                <h3>실시간 공지사항 관리</h3>
              </div>

              {/* 현재 활성화된 공지 */}
              <div className="admin-current-notice-card" style={{
                background: '#f8f9fa',
                border: '1px solid #e5e8eb',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '30px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#d32f2f' }}>
                  <Megaphone size={18} />
                  현재 활성화된 실시간 공지
                </h4>
                {currentNotice ? (
                  <div>
                    <p style={{
                      margin: '0 0 16px 0',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#333d4b',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {currentNotice}
                    </p>
                    <button 
                      className="delete-btn" 
                      onClick={() => currentNoticeId && handleDeleteNotice(currentNoticeId)}
                      style={{ padding: '8px 14px', fontSize: '13px' }}
                    >
                      <Trash2 size={14} /> 현재 공지 내리기 (삭제)
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#8b95a1', fontStyle: 'italic' }}>
                    현재 등록된 실시간 공지가 없습니다. 어플 첫 화면 상단 배너가 비활성화 상태입니다.
                  </p>
                )}
              </div>

              {/* 새 공지 등록 양식 */}
              <div className="admin-new-notice-form" style={{
                background: 'white',
                border: '1px solid #e5e8eb',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e1e1e' }}>새 실시간 공지 등록</h4>
                <textarea
                  placeholder="사용자 홈 화면 상단에 띄울 공지 내용을 입력해 주세요. (주의: 새로 등록 시 기존 공지는 자동으로 대체됩니다.)"
                  value={adminNewNotice}
                  onChange={(e) => setAdminNewNotice(e.target.value)}
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '14px',
                    border: '1px solid #e5e8eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none',
                    marginBottom: '16px',
                    color: '#1e1e1e'
                  }}
                />
                <button 
                  onClick={handlePostNotice}
                  className="nav-tab active"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  실시간 공지 발행하기 (저장)
                </button>
              </div>
            </div>
          )}

          {/* 로그인 승인 요청 관리 탭 */}
          {activeTab === 'requests' && (
            <div>
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>로그인 승인 요청 리스트</h3>
                <button onClick={fetchLoginRequests} className="refresh-btn" style={{ padding: '8px 16px', border: '1px solid #e5e8eb', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>새로고침</button>
              </div>

              <div style={{ background: 'white', border: '1px solid #e5e8eb', borderRadius: '16px', overflow: 'hidden' }}>
                {loginRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8b95a1', fontStyle: 'italic' }}>
                    접수된 로그인 승인 요청이 없습니다.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e8eb', color: '#4e5968', fontWeight: 'bold' }}>
                        <th style={{ padding: '16px' }}>요청 이름</th>
                        <th style={{ padding: '16px' }}>연락처</th>
                        <th style={{ padding: '16px' }}>신청 시간</th>
                        <th style={{ padding: '16px' }}>상태</th>
                        <th style={{ padding: '16px', textAlign: 'right' }}>관리 동작</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginRequests.map((req: any) => (
                        <tr key={req.id} style={{ borderBottom: '1px solid #e5e8eb', color: '#333d4b' }}>
                          <td style={{ padding: '16px', fontWeight: '700' }}>{req.name}</td>
                          <td style={{ padding: '16px' }}>{req.phone || '-'}</td>
                          <td style={{ padding: '16px', color: '#8b95a1', fontSize: '12px' }}>
                            {new Date(req.created_at).toLocaleString('ko-KR')}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: req.status === 'approved' ? '#e2f9e7' : req.status === 'rejected' ? '#ffebeb' : '#fff3dc',
                              color: req.status === 'approved' ? '#2e7d32' : req.status === 'rejected' ? '#c62828' : '#b78103'
                            }}>
                              {req.status === 'approved' ? '승인 완료' : req.status === 'rejected' ? '반려됨' : '대기 중'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            {req.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => handleApproveRequest(req.id, req.name)}
                                  style={{ padding: '6px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  승인
                                </button>
                                <button 
                                  onClick={() => handleRejectRequest(req.id, req.name)}
                                  style={{ padding: '6px 12px', background: '#c62828', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  반려
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#8b95a1', fontSize: '12px' }}>처리 완료</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
