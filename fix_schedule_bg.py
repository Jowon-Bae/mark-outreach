import re

with open('src/app/schedule/schedule.css', 'r') as f:
    css = f.read()

old_container = """.schedule-container {
  padding: 20px;
  animation: fadeIn 0.4s ease-out;
}"""

new_container = """.schedule-container {
  padding: 16px;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 95px;
  animation: fadeIn 0.4s ease-out;
}"""

css = css.replace(old_container, new_container)

with open('src/app/schedule/schedule.css', 'w') as f:
    f.write(css)

print("Fixed schedule background")
