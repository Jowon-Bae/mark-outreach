import re

with open('src/app/settings/settings.css', 'r') as f:
    css = f.read()

# Remove sticky behavior
css = css.replace('position: sticky;', '/* position: sticky; removed */')
css = css.replace('top: 40px;', '/* top: 40px; removed */')
css = css.replace('z-index: 100;', '/* z-index: 100; removed */')

# Remove the before pseudo element completely
css = re.sub(r'\.sticky-header-wrapper::before\s*\{[^}]+\}', '', css)

with open('src/app/settings/settings.css', 'w') as f:
    f.write(css)

