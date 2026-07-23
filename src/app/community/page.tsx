'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, MoreVertical, Send, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import './community.css';

export default function Community() {
  const [activeTab, setActiveTab] = useState<'board' | 'gallery'>('board');
  const [posts, setPosts] = useState<any[]>([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<Record<string, { id: string, author: string } | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [avatarMap, setAvatarMap] = useState<Record<string, string>>({});

  // 사진첩 상태
  const [photos, setPhotos] = useState<any[]>([]);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // 아바타 목록 로드
  const fetchAvatars = async () => {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*');
      if (!error && data) {
        const mapping: Record<string, string> = {};
        data.forEach((p: any) => {
          mapping[p.username] = p.avatar_url;
        });
        setAvatarMap(mapping);
      }
    } catch (e) {
      console.error('Failed to fetch avatars:', e);
    }
  };

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

  const fetchPhotos = async () => {
    setIsPhotosLoading(true);
    const { data, error } = await supabase
      .from('community_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
    setIsPhotosLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchPhotos();
    fetchAvatars();
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

  // 좋아요
  const toggleLike = async (postId: string, currentLikes: number, isLiked: boolean) => {
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
    const parent = replyingTo[postId];

    const { error } = await supabase
      .from('community_comments')
      .insert([{ 
        post_id: postId, 
        author: currentUsername, 
        text: text.trim(),
        parent_id: parent ? parent.id : null 
      }]);

    if (error) {
      alert('댓글 작성에 실패했습니다.');
      return;
    }

    setCommentInputs({ ...commentInputs, [postId]: '' });
    setReplyingTo({ ...replyingTo, [postId]: null });
    fetchPosts();
  };

  // 댓글 좋아요
  const handleCommentLike = async (postId: string, commentId: string, currentLikes: number) => {
    // Optimistic update
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map((c: any) => 
            c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
          )
        };
      }
      return post;
    }));

    await supabase
      .from('community_comments')
      .update({ likes: (currentLikes || 0) + 1 })
      .eq('id', commentId);
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
      <div className="sticky-header-wrapper">
        {/* 상단 헤더 */}
        <div className="board-header">
          <h2>소통 & 사진첩</h2>
          {activeTab === 'board' && (
            <button 
              className="write-btn" 
              onClick={(e) => {
                e.preventDefault();
                setShowWriteModal(true);
              }}
            >
              글쓰기
            </button>
          )}
        </div>

        {/* 상단 서브 탭 */}
        <div className="top-tab-bar">
          <button 
            className={`tab-item ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            소통 게시판
          </button>
          <button 
            className={`tab-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            사진첩
          </button>
        </div>
      </div>

      {activeTab === 'board' ? (
        <div className="post-list">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>로딩 중...</div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>첫 번째 글을 작성해보세요!</div>
          ) : (
            posts.map(post => {
              const lines = post.content.split('\n');
              const title = lines[0];
              const body = lines.slice(1).join('\n');

              return (
                <div key={post.id} className="post-item-flat">
                  {/* 상단 태그 및 더보기 */}
                  <div className="post-item-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="post-author-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {avatarMap[post.author] ? (
                        <img 
                          src={avatarMap[post.author]} 
                          alt={post.author} 
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          backgroundColor: '#f1f3f5', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <User size={16} color="#8b95a1" />
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1e1e' }}>{post.author}</span>
                        <span style={{ fontSize: '11px', color: '#8b95a1' }}>{formatTime(post.created_at)}</span>
                      </div>
                    </div>
                    <button className="more-options-btn">
                      <MoreVertical size={16} color="#888" />
                    </button>
                  </div>

                  {/* 본문 영역 */}
                  <div className="post-item-body" onClick={() => toggleComments(post.id)}>
                    <h3 className="post-title">{title}</h3>
                    {body && <p className="post-content-preview">{body}</p>}
                  </div>

                  {/* 메타 정보 및 반응 버튼 */}
                  <div className="post-item-footer">
                    <div className="post-meta-text">
                      {/* 헤더로 이동하여 풋터는 깔끔히 비움 */}
                    </div>
                    
                    <div className="post-interactions">
                      <button 
                        className={`like-action-btn ${post.isLiked ? 'liked' : ''}`}
                        onClick={() => toggleLike(post.id, post.likes, post.isLiked)}
                      >
                        <ThumbsUp size={16} />
                        <span>{post.likes > 0 && post.likes}</span>
                      </button>
                      <button 
                        className="comment-action-btn"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageSquare size={16} />
                        <span>{post.comments?.length > 0 && post.comments.length}</span>
                      </button>
                    </div>
                  </div>

                  {/* 댓글 영역 (당근마켓 상세 스타일) */}
                  {post.showComments && (
                    <div className="comments-drawer">
                      <div className="comments-header">
                        <span className="comments-count">댓글 {post.comments?.length || 0}</span>
                        <div className="comments-sort">
                          <span className="active">등록순</span>
                          <span>최신순</span>
                        </div>
                      </div>

                      <div className="comments-list">
                        {(() => {
                          const topLevel = post.comments?.filter((c: any) => !c.parent_id) || [];
                          const replies = post.comments?.filter((c: any) => c.parent_id) || [];
                          
                          const renderComment = (comment: any, isReply: boolean = false, idx: number = -1) => {
                            const isPostAuthor = comment.author === post.author;
                            return (
                              <div key={comment.id} className={`comment-item ${isReply ? 'is-reply' : ''}`} style={isReply ? { paddingLeft: '44px', backgroundColor: '#fafafa', borderLeft: '3px solid #eee' } : {}}>
                                <div className="comment-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {avatarMap[comment.author] ? (
                                    <img 
                                      src={avatarMap[comment.author]} 
                                      alt={comment.author} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                  ) : (
                                    comment.author.substring(0, 1)
                                  )}
                                </div>
                                <div className="comment-content-box">
                                  <div className="comment-user-info">
                                    <span className="comment-user-name">{comment.author}</span>
                                    {isPostAuthor && <span className="badge-author">작성자</span>}
                                    {idx === 0 && !isPostAuthor && !isReply && <span className="badge-first">첫 댓글</span>}
                                    <span className="comment-time-text">· {formatTime(comment.created_at)}</span>
                                  </div>
                                  <p className="comment-text-body">{comment.text}</p>
                                  <div className="comment-sub-actions">
                                    <button className="comment-like-btn" onClick={() => handleCommentLike(post.id, comment.id, comment.likes)}>
                                      <ThumbsUp size={12} /> 좋아요 {comment.likes > 0 && comment.likes}
                                    </button>
                                    {!isReply && (
                                      <button className="comment-reply-btn" onClick={() => setReplyingTo({ ...replyingTo, [post.id]: { id: comment.id, author: comment.author } })}>
                                        답글
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          };

                          return topLevel.map((comment: any, idx: number) => (
                            <div key={comment.id} style={{ display: 'flex', flexDirection: 'column' }}>
                              {renderComment(comment, false, idx)}
                              {replies.filter((r: any) => r.parent_id === comment.id).map((reply: any) => renderComment(reply, true))}
                            </div>
                          ));
                        })()}
                        {(!post.comments || post.comments.length === 0) && (
                          <div className="empty-comments">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</div>
                        )}
                      </div>

                      {/* 알약 모양 댓글 입력창 */}
                      <div className="comment-input-container">
                        <div className="comment-input-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {(() => {
                            const curUser = localStorage.getItem('username') || '';
                            const avatar = avatarMap[curUser];
                            return avatar ? (
                              <img src={avatar} alt="me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (curUser || '익').substring(0, 1)
                            );
                          })()}
                        </div>
                        <div className="comment-pill-input-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f1f3f5', borderRadius: '20px', padding: '10px 14px' }}>
                          {replyingTo[post.id] && (
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                              <span>@{replyingTo[post.id]?.author}님에게 답글 남기는 중...</span>
                              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#999' }} onClick={() => setReplyingTo({ ...replyingTo, [post.id]: null })}>✕</button>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <input 
                              type="text" 
                              placeholder={replyingTo[post.id] ? "답글을 입력해주세요." : "댓글을 입력해주세요."}
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs({
                                ...commentInputs,
                                [post.id]: e.target.value
                              })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCommentSubmit(post.id);
                              }}
                              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px' }}
                            />
                            <button 
                              className="comment-send-btn"
                              onClick={() => handleCommentSubmit(post.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#007aff' }}
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="gallery-tab-content">
          <div className="gallery-grid">
            {isPhotosLoading ? (
              <div className="loading-gallery">사진을 불러오는 중입니다...</div>
            ) : photos.length === 0 ? (
              <div className="empty-gallery">아직 올라온 사진이 없습니다.</div>
            ) : (
              photos.map(photo => (
                <div 
                  key={photo.id} 
                  className="gallery-item"
                  onClick={() => setFullscreenImage(photo.image_url)}
                >
                  <img 
                    src={photo.image_url} 
                    alt="Gallery content" 
                    className="gallery-img"
                    loading="lazy"
                  />
                </div>
              ))
            )}
          </div>

          {fullscreenImage && (
            <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
              <button className="close-fullscreen" onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}>✕</button>
              <img src={fullscreenImage} alt="Fullscreen" className="fullscreen-img" />
            </div>
          )}
        </div>
      )}

      {showWriteModal && (
        <div className="write-modal-overlay">
          <div className="write-modal">
            <div className="write-modal-header">
              <h3>동네생활 글쓰기</h3>
              <button className="close-btn" onClick={() => setShowWriteModal(false)}>✕</button>
            </div>
            <textarea 
              className="write-textarea" 
              placeholder="우리 동네 이웃들과 나누고 싶은 이야기를 자유롭게 적어주세요."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              autoFocus
            />
            <button className="submit-btn" onClick={handlePostSubmit}>
              작성 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
