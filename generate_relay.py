import json
from datetime import datetime, timedelta

adults_text = "배주원 이지은 강정호 남아란 김동진 김민혜 김민우 성민선 김원영 조을원 김인호 신유리 송은지 전민기 김태희 김산수 김지인 장영철 박경현 강수은 박성수 두진문 심연옥 유숙희 박형규 김순정 안승국 이혜수 나경준 김보화 김상형 박선민 정수현 박성연 이희선 서승원 윤인희 육양수 최애진 윤석민 김신혜 이용건 김신곤 박제윤 고은정 안민균 이혜인 이석찬 이희승 선우진 강원균 최지은 김사무엘 이미영 김희준 김지은 손성웅 김문선 신민재 박소희 이용준 김석영 김소연 신재식 박진은 채양석 조은혜 김지준 김민 오국환 임은주 유영삼 추인애 서기열 김혜미 이문석 박희정 이상연 이지영 이승호 박희주 최윤호 김규연 구량주 이현신 최혜남 장영송 김성희 김지선 장윤경 현지혜 강진규 김지현 김진한 최연진 김영민 문정은 심지호 이민후 이승용 전승우 이현정 허민 노소영 신승주 한은정 이재원 김유진 이병주 황상수 송영선 김선정 김연주 류남현 이광숙 박순관 박순호 안지원 염귀화 이용섭 김경록 하진수 한영원 김나리"
children_text = "배이안 강나로 강나엘 김은파 김도훈 김도윤 김지한 김수아 김아론 김샤론 장한나 장하음 나지온 나예온 박하솜 박하랑 서지우 서지아 육이현 윤이나 안바하 안바론 이선호 이인호 강로희 강아인 김희상 김채민 손루이 신아민 김카이 신연서 채수윤 채수호 김주아 유상현 유상윤 서정민 최노아 강하은 김재연 김하윤 심이안 심이엘 이루아 이안 허은율 허지율 허선율 이하은 이하온 태현영 김아인 한라온"

adults = adults_text.split()
children = children_text.split()

# 16 days total
start_date = datetime(2026, 7, 13)
end_date = datetime(2026, 7, 30)
days = []
curr = start_date
while curr <= end_date:
    if curr.weekday() != 6: # Exclude Sunday
        days.append(curr.strftime("%Y-%m-%d"))
    curr += timedelta(days=1)

schedule = {}
adults_idx = 0
children_idx = 0

for i, day in enumerate(days):
    # Calculate how many to take today
    a_take = len(adults) // len(days) + (1 if i < len(adults) % len(days) else 0)
    c_take = len(children) // len(days) + (1 if i < len(children) % len(days) else 0)
    
    today_list = []
    # Mix adults and children
    today_adults = adults[adults_idx:adults_idx+a_take]
    today_children = children[children_idx:children_idx+c_take]
    
    # Simple interleaving for UI
    idx_a, idx_c = 0, 0
    while idx_a < len(today_adults) or idx_c < len(today_children):
        if idx_a < len(today_adults):
            today_list.append({"name": today_adults[idx_a], "type": "adult"})
            idx_a += 1
        if idx_c < len(today_children):
            today_list.append({"name": today_children[idx_c], "type": "child"})
            idx_c += 1
            
        if idx_a < len(today_adults):
            today_list.append({"name": today_adults[idx_a], "type": "adult"})
            idx_a += 1
            
    schedule[day] = today_list
    adults_idx += a_take
    children_idx += c_take

ts_content = f"""export const RELAY_PRAYER_SCHEDULE: Record<string, {{ name: string, type: 'adult' | 'child' }}[]> = {json.dumps(schedule, indent=2, ensure_ascii=False)};
"""

with open("src/data/relayPrayer.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Generated src/data/relayPrayer.ts")
