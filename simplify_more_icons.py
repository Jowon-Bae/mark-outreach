with open('src/app/schedule/page.tsx', 'r') as f:
    content = f.read()

replacements = [
    "<Flame size={18} />\n                    ",
    "<Calendar size={20} color=\"var(--primary)\" />\n          "
]

for r in replacements:
    content = content.replace(r, "")

with open('src/app/schedule/page.tsx', 'w') as f:
    f.write(content)

print("More icons removed")
