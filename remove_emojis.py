with open('src/app/schedule/page.tsx', 'r') as f:
    content = f.read()

emojis_to_remove = ["📍 ", "💡 ", "💤 ", "🍔 ", "🔥 "]

for emoji in emojis_to_remove:
    content = content.replace(emoji, "")

with open('src/app/schedule/page.tsx', 'w') as f:
    f.write(content)

print("Removed emojis")
