import re

# 1. Update schedule.css
with open('src/app/schedule/schedule.css', 'r') as f:
    css = f.read()

css = css.replace("color: #1b64da;", "color: #1e1e1e;")
css = css.replace("background-color: #ffebeb;", "background-color: #f1f3f5;")
css = css.replace("color: #c62828;", "color: #4e5968;")
css = css.replace("background-color: #e2f9e7;", "background-color: #f1f3f5;")
css = css.replace("color: #2e7d32;", "color: #4e5968;")

with open('src/app/schedule/schedule.css', 'w') as f:
    f.write(css)

# 2. Update page.tsx inline styles
with open('src/app/schedule/page.tsx', 'r') as f:
    tsx = f.read()

tsx = tsx.replace("color: '#1b64da'", "color: 'var(--primary)'")
tsx = tsx.replace("color: '#c62828'", "color: '#4e5968'")
tsx = tsx.replace("color: '#2e7d32'", "color: '#4e5968'")

with open('src/app/schedule/page.tsx', 'w') as f:
    f.write(tsx)

print("Simplified colors")
