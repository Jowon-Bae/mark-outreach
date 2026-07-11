import re

with open('src/app/qt/page.tsx', 'r') as f:
    content = f.read()

# 1. Import RELAY_PRAYER_SCHEDULE
import_pattern = re.compile(r"import \{ QT_DATA, DEFAULT_QT \} from '@\/data\/qtData';")
import_replacement = """import { QT_DATA, DEFAULT_QT } from '@/data/qtData';
import { RELAY_PRAYER_SCHEDULE } from '@/data/relayPrayer';"""
content = import_pattern.sub(import_replacement, content)

# 2. Get today's relay targets in render
relay_logic_pattern = re.compile(r"const handlePrayerSubmit = async \(\) => \{")
relay_logic_replacement = """const todayRelayTargets = RELAY_PRAYER_SCHEDULE[dateStr] || [];
  const isSunday = new Date(dateStr).getUTCDay() === 0;

  const handlePrayerSubmit = async () => {"""
content = relay_logic_pattern.sub(relay_logic_replacement, content)

# 3. Replace random prayer UI with relay prayer UI
ui_pattern = re.compile(r"          \{\/\* 랜덤 기도 뽑기 배너 \*\/\}.*?\{\/\* 기도제목 목록 피드 \*\/\}", re.DOTALL)
ui_replacement = """          {/* 릴레이 기도 배너 */}
          <div className="relay-prayer-card">
            <div className="relay-header">
              <MessageSquareHeart size={20} color="var(--primary)" />
              <h3>오늘의 릴레이 기도</h3>
            </div>
            {isSunday ? (
              <div className="relay-empty">
                <p>오늘은 주일입니다. 온전한 예배에 집중하며 릴레이 기도는 쉬어갑니다.</p>
              </div>
            ) : todayRelayTargets.length > 0 ? (
              <>
                <div className="relay-common-topic">
                  <strong>공동의 기도제목</strong>
                  <p>아웃리치를 통해 영혼들이 주님께 돌아오게 하소서. 사역의 모든 여정 가운데 안전을 지켜주시고, 팀원들이 하나 되어 기쁨으로 섬기게 하소서.</p>
                </div>
                <div className="relay-targets">
                  <p className="relay-subtitle">오늘의 집중 기도 대상자</p>
                  <div className="relay-tags">
                    {todayRelayTargets.map((target: any, idx: number) => (
                      <span key={idx} className={`relay-tag ${target.type}`}>
                        {target.name}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="relay-empty">
                <p>오늘은 예정된 릴레이 기도 명단이 없습니다.</p>
              </div>
            )}
          </div>

          {/* 기도제목 목록 피드 */}"""
content = ui_pattern.sub(ui_replacement, content)

with open('src/app/qt/page.tsx', 'w') as f:
    f.write(content)

print("Patched page.tsx")
