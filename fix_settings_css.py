import re

with open('src/app/settings/settings.css', 'r') as f:
    css = f.read()

# 1. Add padding-top: 40px to .settings-container
old_container = """
.settings-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 95px; /* 늘어난 하단 탭바 여유 공간 설정 */
}"""

new_container = """
.settings-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 50px; /* 글로벌 고정 헤더 영역(40px) + 여유(10px) 확보 */
  padding-bottom: 95px; /* 늘어난 하단 탭바 여유 공간 설정 */
}"""

css = css.replace(old_container.strip(), new_container.strip())

# 2. Revert settings-content padding
old_content = """
.settings-content {
  padding: 56px 16px 20px 16px; /* 상단 헤더 가려짐 방지를 위해 패딩 증가 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}"""

new_content = """
.settings-content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}"""

css = css.replace(old_content.strip(), new_content.strip())

with open('src/app/settings/settings.css', 'w') as f:
    f.write(css)

