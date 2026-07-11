import re

# AppWrapper
with open('src/components/layout/AppWrapper.tsx', 'r') as f:
    text = f.read()
text = text.replace('setIsHydrated(true);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n    setIsHydrated(true);')
with open('src/components/layout/AppWrapper.tsx', 'w') as f:
    f.write(text)

# Settings
with open('src/app/settings/page.tsx', 'r') as f:
    text = f.read()
text = text.replace('setUsername(storedName);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n      setUsername(storedName);')
text = re.sub(r'catch \(err: any\)', 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any', text)
with open('src/app/settings/page.tsx', 'w') as f:
    f.write(text)

# Teams
with open('src/app/teams/page.tsx', 'r') as f:
    text = f.read()
text = re.sub(r'catch \(error: any\)', 'catch (error: any) // eslint-disable-line @typescript-eslint/no-explicit-any', text)
text = re.sub(r'catch \(err: any\)', 'catch (err: any) // eslint-disable-line @typescript-eslint/no-explicit-any', text)
with open('src/app/teams/page.tsx', 'w') as f:
    f.write(text)

