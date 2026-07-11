import sys
from PIL import Image

img_path = '/Users/juwonbae/.gemini/antigravity/brain/34ccd4fb-710a-4bff-ba88-fac2e858c231/media__1783776251728.jpg'
img = Image.open(img_path).convert('RGB')
bg_color = (196, 155, 93)

pixels = img.load()
for y in range(img.height):
    has_content = False
    for x in range(img.width):
        p = pixels[x, y]
        dist = abs(p[0]-bg_color[0]) + abs(p[1]-bg_color[1]) + abs(p[2]-bg_color[2])
        if dist > 30:
            has_content = True
            break
    if has_content:
        print(f"Row {y} has content")

