import re
import urllib.request
from bs4 import BeautifulSoup
import time
import json

# Day-by-day mapping for the API queries
days = {
    '2026-07-10': 'psa/114:1-8',
    '2026-07-11': 'psa/115:1-8',
    '2026-07-12': 'psa/115:9-18',
    '2026-07-13': 'psa/116:1-11',
    '2026-07-14': 'psa/116:12-19',
    '2026-07-15': 'psa/117:1-2',
    '2026-07-16': 'psa/118:1-13',
    '2026-07-17': 'psa/118:14-29',
    '2026-07-18': 'eze/25:1-7',
    '2026-07-19': 'eze/25:8-17',
    '2026-07-20': 'eze/26:1-14',
    '2026-07-21': 'eze/26:15-21',
    '2026-07-22': 'eze/27:1-11',
    '2026-07-23': 'eze/27:12-25',
    '2026-07-24': 'eze/27:26-36',
    '2026-07-25': 'eze/28:1-10',
    '2026-07-26': 'eze/28:11-19',
    '2026-07-27': 'eze/28:20-26',
    '2026-07-28': 'eze/29:1-12',
    '2026-07-29': 'eze/29:13-21',
    '2026-07-30': 'eze/30:1-12',
    '2026-07-31': 'eze/30:13-26',
    '2026-08-01': 'eze/31:1-9',
    '2026-08-02': 'eze/31:10-18'
}

with open('src/app/qt/page.tsx', 'r') as f:
    content = f.read()

# First, modify the interface
if 'fullText?: string[]' not in content:
    content = content.replace(
        '  meditation: string;\n}',
        '  meditation: string;\n  fullText?: string[];\n}'
    )

full_texts = {}

for date, query in days.items():
    print(f"Fetching {date} : {query}")
    url = f"http://ibibles.net/quote.php?kor-{query}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        verses = []
        for text in soup.stripped_strings:
            if '11' in text or '25' in text or '26' in text or '27' in text or '28' in text or '29' in text or '30' in text or '31' in text:
                if ':' in text and len(text) < 10: # This is a verse number like 114:1
                    pass
                else:
                    # Some lines contain verse number and text if not separated by tags properly
                    # In ibibles, <small>114:1</small> text.
                    # stripped_strings will separate them.
                    verses.append(text)
            else:
                 verses.append(text)
        
        # We need a better parsing: just regex the body
        body = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
        if body:
            body_html = body.group(1)
            # Replace <small>...</small> with empty or keep verse numbers? Let's keep verse numbers: [1]
            body_html = re.sub(r'<small>\d+:\d+</small>', '', body_html)
            body_html = re.sub(r'<br/?>', '\n', body_html)
            body_text = BeautifulSoup(body_html, 'html.parser').get_text()
            
            clean_verses = [line.strip() for line in body_text.split('\n') if line.strip()]
            
            # format as JSON array string
            json_array = json.dumps(clean_verses, ensure_ascii=False)
            full_texts[date] = json_array
            
    except Exception as e:
        print("Error fetching", query, e)
        full_texts[date] = '[]'
        
    time.sleep(0.5)

# Now, we need to inject this into QT_DATA block.
for date, json_arr in full_texts.items():
    # Find the block for this date
    pattern = re.compile(r"('" + date + r"': \{.*?meditation: '.*?'\n\s*)\}", re.DOTALL)
    replacement = r"\1, fullText: " + json_arr + "\n  }"
    content = pattern.sub(replacement, content)

with open('src/app/qt/page.tsx', 'w') as f:
    f.write(content)

print("Successfully injected full texts!")
