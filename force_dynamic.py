import re

with open('src/app/schedule/page.tsx', 'r') as f:
    content = f.read()

# Add export const dynamic = 'force-dynamic'; after imports
import_end_pattern = re.compile(r"(import .*?;\n)(?!import )", re.MULTILINE)
matches = list(import_end_pattern.finditer(content))
if matches:
    last_match = matches[-1]
    insert_pos = last_match.end()
    content = content[:insert_pos] + "\nexport const dynamic = 'force-dynamic';\n" + content[insert_pos:]

with open('src/app/schedule/page.tsx', 'w') as f:
    f.write(content)

print("Added force-dynamic")
