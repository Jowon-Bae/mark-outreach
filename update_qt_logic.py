import re

with open('src/app/qt/page.tsx', 'r') as f:
    content = f.read()

# 1. Update State
state_replacement = """  const [completedUsers, setCompletedUsers] = useState<any[]>([]);
  const [shareText, setShareText] = useState('');
  const [showFullText, setShowFullText] = useState(false);"""
content = re.sub(r"const \[completedUsers, setCompletedUsers\] = useState<string\[\]>\(\[\]\);", state_replacement, content)

# 2. Update fetchQTCompletions
fetch_pattern = re.compile(r"const fetchQTCompletions = async.*?setIsLoading\(false\);\n  };", re.DOTALL)
fetch_replacement = """const fetchQTCompletions = async (dateKey: string) => {
    setIsLoading(true);
    const currentUsername = localStorage.getItem('username') || '';

    // 오늘 날짜 완료자 조회 (전체 데이터 가져오기)
    const { data, error } = await supabase
      .from('qt_completions')
      .select('*')
      .eq('date_str', dateKey)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCompletedUsers(data);
      
      const userNames = data.map((item: any) => item.user_name);
      if (currentUsername && userNames.includes(currentUsername)) {
        setIsCompleted(true);
      }
    }
    setIsLoading(false);
  };"""
content = fetch_pattern.sub(fetch_replacement, content)

# 3. Update handleComplete
insert_pattern = re.compile(r"\.insert\(\[\{ user_name: currentUsername, date_str: dateStr \}\]\);")
content = insert_pattern.sub(r".insert([{ user_name: currentUsername, date_str: dateStr, content: shareText }]);", content)

# 4. Update UI: Full Text
full_text_replacement = """            <div className="qt-verses">
              <p>{qt.verses}</p>
            </div>
            {qt.fullText && qt.fullText.length > 0 && (
              <div className="qt-full-text-wrapper">
                <button 
                  className="qt-full-text-toggle" 
                  onClick={() => setShowFullText(!showFullText)}
                >
                  <BookOpen size={16} />
                  {showFullText ? '본문 닫기' : '본문 전체 보기'}
                </button>
                {showFullText && (
                  <div className="qt-full-text-content">
                    {qt.fullText.map((verse, idx) => (
                      <p key={idx}>{verse}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>"""
content = re.sub(r'<div className="qt-verses">\s*<p>\{qt.verses\}</p>\s*</div>\s*</div>', full_text_replacement, content)

# 5. Update UI: Share input and list
# Look for: {!isCompleted ? ( ... ) : ( ... )} and <div className="completed-users-card"> ... </div>
bottom_ui_pattern = re.compile(r"\{\!isCompleted \? \(\s*<button className=\"complete-btn\" onClick=\{handleComplete\}>\s*<CheckCircle size=\{20\} />\s*오늘 말씀 묵상 완료하기\s*</button>\s*\) : \(\s*<div className=\"complete-message\">\s*<CheckCircle size=\{24\} />\s*<p>오늘의 말씀 묵상을 완료했습니다\! 은혜로운 하루 보내세요\.</p>\s*</div>\s*\)\}\s*<div className=\"completed-users-card\">\s*<h4>\s*<Users size=\{18\} />\s*오늘 묵상을 완료한 지체들 \(\{completedUsers\.length\}명\)\s*</h4>\s*\{completedUsers\.length === 0 \? \(\s*<p className=\"empty-message\">가장 먼저 오늘의 말씀을 묵상해 보세요\!</p>\s*\) : \(\s*<div className=\"users-list\">\s*\{completedUsers\.map\(\(user, idx\) => \(\s*<div key=\{idx\} className=\"user-chip\">\s*<User size=\{14\} />\s*<span>\{user\}</span>\s*</div>\s*\)\)\}\s*</div>\s*\)\}\s*</div>", re.DOTALL)

bottom_ui_replacement = """{!isCompleted ? (
            <div className="qt-share-section">
              <div className="qt-share-input-wrapper">
                <textarea
                  className="qt-share-input"
                  placeholder="오늘 말씀에서 받은 은혜를 자유롭게 나누어 주세요. (선택 사항)"
                  value={shareText}
                  onChange={(e) => setShareText(e.target.value)}
                />
                <button className="complete-btn" onClick={handleComplete}>
                  <CheckCircle size={20} />
                  오늘 말씀 묵상 완료하기
                </button>
              </div>
            </div>
          ) : (
            <div className="complete-message">
              <CheckCircle size={24} />
              <p>오늘의 말씀 묵상을 완료했습니다! 은혜로운 하루 보내세요.</p>
            </div>
          )}

          <div className="completed-users-card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
              <Users size={18} />
              오늘 묵상을 완료한 지체들 ({completedUsers.length}명)
            </h4>
            
            <div className="qt-share-list">
              {completedUsers.length === 0 ? (
                <p className="empty-message">가장 먼저 오늘의 말씀을 묵상해 보세요!</p>
              ) : (
                completedUsers.map((completion, idx) => (
                  <div key={idx} className="qt-share-card">
                    <div className="qt-share-header">
                      <div className="qt-share-avatar">
                        {completion.user_name.substring(0, 1)}
                      </div>
                      <span className="qt-share-name">{completion.user_name}</span>
                    </div>
                    {completion.content && (
                      <div className="qt-share-text">
                        {completion.content}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>"""

content = bottom_ui_pattern.sub(bottom_ui_replacement, content)

with open('src/app/qt/page.tsx', 'w') as f:
    f.write(content)

print("Updated page.tsx logic")
