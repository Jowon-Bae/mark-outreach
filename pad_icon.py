from PIL import Image
import sys

img = Image.open('public/apple-icon-v2.png')
img = img.convert('RGB')
bg_color = img.getpixel((5, 5))
size = max(img.width, img.height)
new_img = Image.new('RGB', (size, size), bg_color)
new_img.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
new_img.save('public/apple-touch-icon.png')
new_img.save('public/assets/logo.png')
print(f"Padded to {size}x{size} with color {bg_color}")
