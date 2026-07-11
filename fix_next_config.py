import re

with open('next.config.ts', 'r') as f:
    config = f.read()

config = re.sub(r"\s*eslint:\s*\{\s*ignoreDuringBuilds:\s*true,?\s*\},", "", config)

with open('next.config.ts', 'w') as f:
    f.write(config)
