import re

with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()

# 1. Add import for RELAY_PRAYER_SCHEDULE
import_pattern = re.compile(r"import \{ Trash2, Upload, Megaphone, UserCheck \} from 'lucide-react';")
import_replacement = """import { Trash2, Upload, Megaphone, UserCheck, Calendar } from 'lucide-react';
import { RELAY_PRAYER_SCHEDULE } from '@/data/relayPrayer';"""
content = import_pattern.sub(import_replacement, content)

# 2. Add relay tab button
tab_pattern = re.compile(r"<Megaphone size=\{18\} \/>\n              묵상 나눔 관리\n            <\/span>\n          <\/button>\n        <\/div>")
tab_replacement = """<Megaphone size={18} />
              묵상 나눔 관리
            </span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'relay' ? 'active' : ''}`}
            onClick={() => setActiveTab('relay')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} />
              릴레이 명단
            </span>
          </button>
        </div>"""
content = tab_pattern.sub(tab_replacement, content)

# 3. Add relay tab content
content_pattern = re.compile(r"\{\/\* \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \*\/\}\n      <\/div>")
content_replacement = """{/* ---------------------------------------------------------------------- */}
          {activeTab === 'relay' && (
            <div className="admin-section">
              <h2>전체 릴레이 기도 로테이션</h2>
              <div className="admin-list" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {Object.entries(RELAY_PRAYER_SCHEDULE).map(([date, targets]) => (
                  <div key={date} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e8eb' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1b64da', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                      {date} ({new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' })})
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {targets.map((t: any, i: number) => (
                        <span key={i} style={{
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          backgroundColor: t.type === 'adult' ? '#e8f3ff' : '#fff0f6',
                          color: t.type === 'adult' ? '#1b64da' : '#c2255c'
                        }}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>"""
content = content_pattern.sub(content_replacement, content)

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(content)

print("Added Relay Prayer Schedule tab to Admin page")
