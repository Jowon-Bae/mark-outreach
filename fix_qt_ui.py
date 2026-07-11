import re

with open('src/app/qt/page.tsx', 'r') as f:
    content = f.read()

handle_complete_pattern = re.compile(r"  const handleComplete = async \(\) => \{.*?fetchQTCompletions\(dateStr\);\n  \};", re.DOTALL)
handle_complete_replacement = """  const handleComplete = async () => {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isCompleted) {
      // Update existing record
      const { error } = await supabase
        .from('qt_completions')
        .update({ content: shareText })
        .eq('user_name', currentUsername)
        .eq('date_str', dateStr);
        
      if (error) {
        alert('나눔 글 수정에 실패했습니다.');
        return;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('qt_completions')
        .insert([{ user_name: currentUsername, date_str: dateStr, content: shareText }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint error
          setIsCompleted(true);
          // try updating instead since it exists
          await supabase
            .from('qt_completions')
            .update({ content: shareText })
            .eq('user_name', currentUsername)
            .eq('date_str', dateStr);
        } else {
          alert('묵상 완료 기록에 실패했습니다.');
          return;
        }
      }
    }

    setIsCompleted(true);
    fetchQTCompletions(dateStr);
  };"""

content = handle_complete_pattern.sub(handle_complete_replacement, content)

ui_pattern = re.compile(r"          \{\/\* 묵상 완료 및 나눔 입력 \*\/\}[\s\S]*?\{\/\* 지체들의 묵상 나눔 피드 \*\/\}")
ui_replacement = """          {/* 묵상 완료 및 나눔 입력 */}
          <div className="qt-share-section">
            <div className="qt-share-input-wrapper">
              <textarea
                className="qt-share-input"
                placeholder="오늘 말씀에서 받은 은혜를 자유롭게 나누어 주세요. (선택 사항)"
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
              />
              <button className="complete-btn" onClick={handleComplete} disabled={isLoading} style={{ backgroundColor: isCompleted ? '#4CAF50' : 'var(--primary)' }}>
                <CheckCircle size={20} />
                <span>{isCompleted ? '나눔 글 수정하기' : '오늘 말씀 묵상 완료하기'}</span>
              </button>
            </div>
          </div>
          
          {isCompleted && (
            <div className="action-section" style={{ marginTop: '12px' }}>
              <div className="completed-badge">
                <CheckCircle size={20} color="#1b64da" />
                <span>오늘의 말씀 묵상을 완료했습니다! 은혜로운 하루 보내세요.</span>
              </div>
            </div>
          )}

          {/* 지체들의 묵상 나눔 피드 */}"""

content = ui_pattern.sub(ui_replacement, content)

with open('src/app/qt/page.tsx', 'w') as f:
    f.write(content)

print("Fixed handleComplete and Share UI!")
