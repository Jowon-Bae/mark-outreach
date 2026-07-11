import os
from PIL import Image

dirs = [
    '/Users/juwonbae/.gemini/antigravity/brain/34ccd4fb-710a-4bff-ba88-fac2e858c231/'
]

for d in dirs:
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith(('.jpg', '.png', '.jpeg')):
                path = os.path.join(root, f)
                try:
                    img = Image.open(path)
                    img = img.convert('RGB')
                    bg = img.getpixel((5, 5))
                    print(f"{f}: size={img.width}x{img.height}, color={bg}")
                except Exception as e:
                    pass
