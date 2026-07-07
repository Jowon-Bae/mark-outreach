'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2 } from 'lucide-react';
import './admin.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  // 비밀번호 확인
  const handleLogin = () => {
    if (password === 'admin1234!') {
      setIsAuthenticated(true);
      fetchPosts();
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 모든 게시글 불러오기
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
  };

  // 게시글 삭제하기
  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까? (관련 댓글도 함께 삭제될 수 있습니다)')) {
      return;
    }

    // 1. 댓글 먼저 삭제
    await supabase.from('community_comments').delete().eq('post_id', id);
    // 2. 게시글 삭제
    const { error } = await supabase.from('community_posts').delete().eq('id', id);

    if (error) {
      alert('삭제에 실패했습니다.');
    } else {
      alert('삭제되었습니다.');
      fetchPosts(); // 새로고침
    }
  };

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
      <div className="admin-header">
        <h2>자유게시판 관리자 모드</h2>
        <span>총 {posts.length}개의 글</span>
      </div>

      <table className="post-table">
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
              <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {post.content}
              </td>
              <td>{new Date(post.created_at).toLocaleString()}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                  <Trash2 size={16} /> 삭제
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
