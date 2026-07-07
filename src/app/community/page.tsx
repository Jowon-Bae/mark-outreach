'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import './community.css';

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 불러오기
  const fetchPosts = async () => {
    setIsLoading(true);
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error(postsError);
      setIsLoading(false);
      return;
    }

    const { data: commentsData, error: commentsError } = await supabase
      .from('community_comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error(commentsError);
      setIsLoading(false);
      return;
    }

    // 게시글과 댓글 합치기
    const formattedPosts = postsData.map(post => {
      const postComments = commentsData.filter(c => c.post_id === post.id);
      return {
        ...post,
        comments: postComments,
        showComments: false,
        isLiked: false // 로컬 전용 상태
      };
    });

    setPosts(formattedPosts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 글쓰기
  const handlePostSubmit = async () => {
    if (!newContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const currentUsername = localStorage.getItem('username') || '익명';

    const { error } = await supabase
      .from('community_posts')
      .insert([{ author: currentUsername, content: newContent }]);

    if (error) {
      alert('글 작성에 실패했습니다.');
      return;
    }

    setNewContent('');
    setShowWriteModal(false);
    fetchPosts();
  };

  // 좋아요 (간단 구현)
  const toggleLike = async (postId: string, currentLikes: number, isLiked: boolean) => {
    // 로컬 상태 즉시 업데이트 (Optimistic UI)
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !isLiked,
          likes: isLiked ? currentLikes - 1 : currentLikes + 1
        };
      }
      return post;
    }));

    // DB 업데이트
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    await supabase
      .from('community_posts')
      .update({ likes: newLikes })
      .eq('id', postId);
  };

  const toggleComments = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    }));
  };

  // 댓글 쓰기
  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    
    const currentUsername = localStorage.getItem('username') || '익명';

    const { error } = await supabase
      .from('community_comments')
      .insert([{ post_id: postId, author: currentUsername, text: text.trim() }]);

    if (error) {
      alert('댓글 작성에 실패했습니다.');
      return;
    }

    setCommentInputs({ ...commentInputs, [postId]: '' });
    fetchPosts();
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // 분 단위
    
    if (diff < 1) return '방금 전';
    if (diff < 60) return `${diff}분 전`;
    if (diff < 24 * 60) return `${Math.floor(diff / 60)}시간 전`;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="community-container">
      <div className="board-header">
        <h2>자유 게시판</h2>
        <button 
          className="write-btn" 
          onClick={(e) => {
            e.preventDefault();
            setShowWriteModal(true);
          }}
        >
          글쓰기
        </button>
      </div>

      <div className="post-list">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>로딩 중...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>첫 번째 글을 작성해보세요!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author-info">
                  <div className="author-avatar">{post.author.substring(0, 1)}</div>
                  <div>
                    <span className="post-author">{post.author}</span>
                    <span className="post-time">{formatTime(post.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                {post.content.split('\n').map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="post-actions">
                <button 
                  className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => toggleLike(post.id, post.likes, post.isLiked)}
                >
                  <Heart size={18} fill={post.isLiked ? "#ff4b4b" : "none"} color={post.isLiked ? "#ff4b4b" : "#666"} />
                  <span>{post.likes}</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle size={18} />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>

              {post.showComments && (
                <div className="comments-section">
                  <div className="comments-list">
                    {post.comments?.map((comment: any) => (
                      <div key={comment.id} className="comment">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-text">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="comment-input-area">
                    <input 
                      type="text" 
                      placeholder="댓글을 입력하세요..." 
                      className="comment-input"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({
                        ...commentInputs,
                        [post.id]: e.target.value
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                    />
                    <button 
                      className="comment-submit-btn"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showWriteModal && (
        <div className="write-modal-overlay">
          <div className="write-modal">
            <div className="write-modal-header">
              <h3>새 글 쓰기</h3>
              <button className="close-btn" onClick={() => setShowWriteModal(false)}>✕</button>
            </div>
            <textarea 
              className="write-textarea" 
              placeholder="나누고 싶은 이야기를 자유롭게 적어주세요."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              autoFocus
            />
            <button className="submit-btn" onClick={handlePostSubmit}>
              게시물 등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
