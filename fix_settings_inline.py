import re

with open('src/app/settings/page.tsx', 'r') as f:
    tsx = f.read()

# Replace className="settings-content" with className="settings-content" style={{ paddingTop: '56px' }}
tsx = tsx.replace('<div className="settings-content">', '<div className="settings-content" style={{ paddingTop: \'56px\' }}>')

with open('src/app/settings/page.tsx', 'w') as f:
    f.write(tsx)

