'use client';
import { useState } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import './community.css';

const initialPosts = [
  { 
    id: 1, 
    author: '김마가', 
    content: '오늘 오전 사역 너무 은혜로웠습니다. 아이들과 함께 찬양하며 율동하는 시간이 참 기뻤습니다. 오후 사역도 파이팅!', 
    likes: 12, 
    isLiked: false,
    comments: [
      { id: 101, author: '이누가', text: '아멘! 수고 많으셨습니다.' },
      { id: 102, author: '박요한', text: '오후도 파이팅입니다~' },
      { id: 103, author: '최바울', text: '너무 은혜롭네요 ㅠㅠ' }
    ], 
    showComments: false,
    time: '2시간 전' 
  },
  { 
    id: 2, 
    author: '이누가', 
    content: '점심 식사 메뉴 공유해요! 오늘 점심은 제육볶음입니다! 다들 맛있게 드세요~', 
    likes: 25, 
    isLiked: true,
    comments: [
      { id: 201, author: '김마가', text: '우와 제육볶음! 기대됩니다.' },
      { id: 202, author: '최바울', text: '식당으로 바로 갈게요!' }
    ], 
    showComments: false,
    time: '3시간 전' 
  },
];

export default function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handlePostSubmit = () => {
    if (!newContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const currentUsername = localStorage.getItem('username') || '익명';

    const newPost = {
      id: Date.now(),
      author: currentUsername,
      content: newContent,
      likes: 0,
      isLiked: false,
      comments: [],
      showComments: false,
      time: '방금 전'
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setShowWriteModal(false);
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    }));
  };

  const handleCommentSubmit = (postId: number) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    
    const currentUsername = localStorage.getItem('username') || '익명';

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), author: currentUsername, text: text.trim() }]
        };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
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
          onTouchEnd={(e) => {
            e.preventDefault();
            setShowWriteModal(true);
          }}
        >
          글쓰기
        </button>
      </div>

      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <span className="post-author">{post.author}</span>
              <span className="post-time">{post.time}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-footer">
              <button 
                className={`interaction-btn ${post.isLiked ? 'liked' : ''}`}
                onClick={(e) => { e.preventDefault(); toggleLike(post.id); }}
                onTouchEnd={(e) => { e.preventDefault(); toggleLike(post.id); }}
              >
                <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                <span>{post.likes}</span>
              </button>
              <button 
                className={`interaction-btn ${post.showComments ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); toggleComments(post.id); }}
                onTouchEnd={(e) => { e.preventDefault(); toggleComments(post.id); }}
              >
                <MessageCircle size={16} fill={post.showComments ? "currentColor" : "none"} />
                <span>{post.comments.length}</span>
              </button>
            </div>

            {post.showComments && (
              <div className="comments-section">
                <div className="comments-list">
                  {post.comments.map(c => (
                    <div key={c.id} className="comment-item">
                      <strong>{c.author}</strong>
                      <span>{c.text}</span>
                    </div>
                  ))}
                  {post.comments.length === 0 && (
                    <div className="no-comments">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</div>
                  )}
                </div>
                <div className="comment-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="댓글을 달아주세요..." 
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(post.id);
                    }}
                  />
                  <button onClick={() => handleCommentSubmit(post.id)}>등록</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showWriteModal && (
        <div className="write-modal-overlay">
          <div className="write-modal">
            <h3>새 글 쓰기</h3>
            <textarea 
              className="write-textarea" 
              placeholder="내용을 자유롭게 나누어주세요." 
              rows={6}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="write-modal-actions">
              <button className="cancel-btn" onClick={() => setShowWriteModal(false)}>취소</button>
              <button className="submit-btn" onClick={handlePostSubmit}>등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
