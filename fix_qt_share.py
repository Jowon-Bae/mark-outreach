import re

with open('src/app/qt/page.tsx', 'r') as f:
    content = f.read()

# 1. Update handleComplete
handle_complete_old = """  const handleComplete = async () => {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isCompleted) return;

    const { error } = await supabase
      .from('qt_completions')
      .insert([{ user_name: currentUsername, date_str: dateStr, content: shareText }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint error
        setIsCompleted(true);
      } else {
        alert('묵상 완료 기록에 실패했습니다.');
        return;
      }
    } else {
      setIsCompleted(true);
    }
    
    // Refresh list
    fetchQTCompletions(dateStr);
  };"""

# Wait, let me check the exact existing code of handleComplete.
# Ah, I don't need to replace the whole block if I just use regex.
