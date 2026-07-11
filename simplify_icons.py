import re

with open('src/app/schedule/page.tsx', 'r') as f:
    content = f.read()

# The headers look like this:
# <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
#   <Car size={18} />
#   <span>출발</span>
#   <span style={{ color: '#ccc', fontWeight: '400', fontSize: '0.9rem' }}>&</span>
#   <Key size={16} />
#   <span>체크인</span>
# </h4>

# We can replace the <Icon size={xx} /> inside the <h4 ...> block.
# Actually, since the icons are just React components, I can remove any <[A-Z][a-zA-Z]+ size=\{1[68]\} \/> from the h4 headers inside guide-card-header.

# Instead of complex regex, let's just do targeted replacements.
replacements = [
    "<Car size={18} />\n                    ",
    "<Key size={16} />\n                    ",
    "<ClipboardList size={18} />\n                    ",
    "<Utensils size={18} />\n                    ",
    "<Smile size={18} />\n                    ",
    "<Sun size={18} />\n                    ",
    "<Sparkles size={18} />\n                    ",
    "<Moon size={18} />\n                    "
]

for r in replacements:
    content = content.replace(r, "")

# Also, there might be other icons in the detailed guide like <Check size={16} /> or something.
# Let's remove the `gap: '8px'` from the h4 so they don't look weird if they have no icons but still have gaps.
# Wait, gap won't hurt. But removing `gap: '8px'` is cleaner.
content = content.replace("style={{ display: 'flex', alignItems: 'center', gap: '8px' }}", "style={{ display: 'flex', alignItems: 'center' }}")

with open('src/app/schedule/page.tsx', 'w') as f:
    f.write(content)

print("Simplified icons")
