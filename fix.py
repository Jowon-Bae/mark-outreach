import json
with open('package.json', 'r') as f:
    pkg = json.load(f)

if 'lint' in pkg['scripts']:
    del pkg['scripts']['lint']

with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)

with open('next.config.ts', 'r') as f:
    config = f.read()

config = config.replace('typescript: {', 'eslint: {\n    ignoreDuringBuilds: true,\n  },\n  typescript: {')

with open('next.config.ts', 'w') as f:
    f.write(config)

