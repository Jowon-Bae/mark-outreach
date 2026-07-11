import sys
from PIL import Image

img_path = '/Users/juwonbae/.gemini/antigravity/brain/34ccd4fb-710a-4bff-ba88-fac2e858c231/media__1783776251728.jpg'
img = Image.open(img_path).convert('RGB')
bg_color = (196, 155, 93)

pixels = img.load()

# Find rows with content
rows_with_content = []
for y in range(img.height):
    if y > 800: continue
    has_content = False
    for x in range(img.width):
        p = pixels[x, y]
        dist = abs(p[0]-bg_color[0]) + abs(p[1]-bg_color[1]) + abs(p[2]-bg_color[2])
        if dist > 30:
            has_content = True
            break
    rows_with_content.append(has_content)

# Find the gap
in_logo = False
logo_bottom = 0
for y in range(267, len(rows_with_content)):
    if rows_with_content[y]:
        in_logo = True
    elif in_logo:
        # found the first empty row after the logo
        logo_bottom = y
        break

print(f"Logo ends at row {logo_bottom}")

# Erase everything below logo_bottom
for y in range(logo_bottom, img.height):
    for x in range(img.width):
        pixels[x, y] = bg_color

# Now recalculate bbox
bbox_left = img.width
bbox_right = 0
bbox_top = img.height
bbox_bottom = 0

for y in range(img.height):
    for x in range(img.width):
        p = pixels[x, y]
        dist = abs(p[0]-bg_color[0]) + abs(p[1]-bg_color[1]) + abs(p[2]-bg_color[2])
        if dist > 30:
            if x < bbox_left: bbox_left = x
            if x > bbox_right: bbox_right = x
            if y < bbox_top: bbox_top = y
            if y > bbox_bottom: bbox_bottom = y

content_w = bbox_right - bbox_left
content_h = bbox_bottom - bbox_top

print(f"New bbox: left={bbox_left}, right={bbox_right}, top={bbox_top}, bottom={bbox_bottom}")

# Scale to 85% of 1024
target_content_size = int(1024 * 0.85)
scale = target_content_size / max(content_w, content_h)

new_w = int(img.width * scale)
new_h = int(img.height * scale)
img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

final_img = Image.new('RGB', (1024, 1024), bg_color)
scaled_bbox_left = int(bbox_left * scale)
scaled_bbox_top = int(bbox_top * scale)
scaled_content_w = int(content_w * scale)
scaled_content_h = int(content_h * scale)

paste_x = (1024 - scaled_content_w) // 2 - scaled_bbox_left
paste_y = (1024 - scaled_content_h) // 2 - scaled_bbox_top

final_img.paste(img_resized, (paste_x, paste_y))

final_img.save('src/app/apple-icon.png')
final_img.save('src/app/icon.png')
final_img.save('public/assets/logo-v4.png')
print("Saved textless logo successfully.")
