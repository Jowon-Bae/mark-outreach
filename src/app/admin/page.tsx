'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Upload } from 'lucide-react';
import './admin.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'community', 'gallery'

  const [stats, setStats] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

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
            📊 이용자 통계
          </button>
          <button 
            className={`nav-tab ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            💬 자유게시판 관리
          </button>
          <button 
            className={`nav-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ 사진첩 관리
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

        </div>
      </div>
    </div>
  );
}
