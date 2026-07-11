import re

# 1. Remove from QT page
with open('src/app/qt/page.tsx', 'r') as f:
    qt_content = f.read()

# Remove import
import_pattern = re.compile(r"import \{ RELAY_PRAYER_SCHEDULE \} from '@\/data\/relayPrayer';\n")
qt_content = import_pattern.sub('', qt_content)

# Remove tabs
tabs_pattern = re.compile(r"<div className=\"qt-tabs\">\n.*?<\/div>", re.DOTALL)
qt_content = tabs_pattern.sub('', qt_content)

# Remove activeTab state
state_pattern = re.compile(r"const \[activeTab, setActiveTab\] = useState\('qt'\);\n  ")
qt_content = state_pattern.sub('', qt_content)

# Remove relay targets logic
logic_pattern = re.compile(r"const todayRelayTargets = RELAY_PRAYER_SCHEDULE\[dateStr\] \|\| \[\];\n  const isSunday = new Date\(dateStr\)\.getUTCDay\(\) === 0;\n\n  ")
qt_content = logic_pattern.sub('', qt_content)

# Remove activeTab condition around QT content
# Before: {activeTab === 'qt' ? ( ... ) : ( ...relay content... )}
qt_content = qt_content.replace("{activeTab === 'qt' ? (\n        <div", "<div")
qt_content = re.sub(r"        <\/div>\n      \) : \(\n        <div className=\"prayer-tab-content\">.*", "        </div>\n      </div>\n    </div>\n  );\n}", qt_content, flags=re.DOTALL)

with open('src/app/qt/page.tsx', 'w') as f:
    f.write(qt_content)

# 2. Remove from Admin page
with open('src/app/admin/page.tsx', 'r') as f:
    admin_content = f.read()

admin_import = re.compile(r"\nimport \{ RELAY_PRAYER_SCHEDULE \} from '@\/data\/relayPrayer';")
admin_content = admin_import.sub('', admin_content)

admin_tab = re.compile(r"<button \n            className=\{`nav-tab \$\{activeTab === 'relay' \? 'active' : ''\}`\}\n            onClick=\{\(\) => setActiveTab\('relay'\)\}\n          >\n            <span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\n              <Calendar size=\{18\} \/>\n              릴레이 명단\n            <\/span>\n          <\/button>")
admin_content = admin_tab.sub('', admin_content)

admin_relay_ui = re.compile(r"\{\/\* ---------------------------------------------------------------------- \*\/\}\n          \{activeTab === 'relay' && \(.*?\}\)\}\n              <\/div>\n            <\/div>\n          \)", re.DOTALL)
admin_content = admin_relay_ui.sub('', admin_content)

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(admin_content)

print("Relay removed")
