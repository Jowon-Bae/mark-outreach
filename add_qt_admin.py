import re

with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()

# 1. Add state
state_pattern = re.compile(r"const \[loginRequests, setLoginRequests\] = useState<any\[\]>\(\[\]\);")
state_replacement = """const [loginRequests, setLoginRequests] = useState<any[]>([]);
  const [qtShares, setQtShares] = useState<any[]>([]);"""
content = state_pattern.sub(state_replacement, content)

# 2. Add to fetchData
fetch_data_pattern = re.compile(r"fetchLoginRequests\(\);\n  \};")
fetch_data_replacement = """fetchLoginRequests();
    fetchQTShares();
  };"""
content = fetch_data_pattern.sub(fetch_data_replacement, content)

# 3. Add fetch and delete functions
funcs_pattern = re.compile(r"// 1\. 통계 데이터 불러오기")
funcs_replacement = """// 0.5 묵상 데이터 불러오기
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

  // 1. 통계 데이터 불러오기"""
content = funcs_pattern.sub(funcs_replacement, content)

# 4. Add tab button
tab_pattern = re.compile(r"<button\n              className=\{`admin-tab \$\{activeTab === 'requests' \? 'active' : ''\}`\}\n              onClick=\{.*?\}\n            >\n              <UserCheck size=\{16\} />\n              <span>가입 요청</span>\n            </button>")
tab_replacement = """<button
              className={`admin-tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <UserCheck size={16} />
              <span>가입 요청</span>
            </button>
            <button
              className={`admin-tab ${activeTab === 'qt' ? 'active' : ''}`}
              onClick={() => setActiveTab('qt')}
            >
              <Megaphone size={16} />
              <span>묵상 관리</span>
            </button>"""
content = tab_pattern.sub(tab_replacement, content)

# 5. Add tab content
content_pattern = re.compile(r"\{/\* \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \*/\}")
content_replacement = """{activeTab === 'qt' && (
            <div className="admin-section">
              <h2>묵상 나눔 관리</h2>
              <div className="admin-list">
                {qtShares.length === 0 ? (
                  <p>등록된 묵상이 없습니다.</p>
                ) : (
                  qtShares.map(qt => (
                    <div key={qt.id} className="admin-list-item">
                      <div className="admin-item-content">
                        <strong>[{qt.date_str}] {qt.user_name}</strong>
                        <p style={{ marginTop: '8px', color: '#555', whiteSpace: 'pre-wrap' }}>
                          {qt.content ? qt.content : '(완료만 하고 나눔은 작성하지 않음)'}
                        </p>
                        <span className="admin-item-date">{new Date(qt.created_at).toLocaleString()}</span>
                      </div>
                      <button className="admin-delete-btn" onClick={() => handleDeleteQTShare(qt.id)}>
                        <Trash2 size={16} />
                        삭제
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------- */}"""
content = content_pattern.sub(content_replacement, content)

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(content)

print("Added QT Admin feature")
