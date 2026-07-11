const fs = require('fs');

const adultsText = "배주원 이지은 강정호 남아란 김동진 김민혜 김민우 성민선 김원영 조을원 김인호 신유리 송은지 전민기 김태희 김산수 김지인 장영철 박경현 강수은 박성수 두진문 심연옥 유숙희 박형규 김순정 안승국 이혜수 나경준 김보화 김상형 박선민 정수현 박성연 이희선 서승원 윤인희 육양수 최애진 윤석민 김신혜 이용건 김신곤 박제윤 고은정 안민균 이혜인 이석찬 이희승 선우진 강원균 최지은 김사무엘 이미영 김희준 김지은 손성웅 김문선 신민재 박소희 이용준 김석영 김소연 신재식 박진은 채양석 조은혜 김지준 김민 오국환 임은주 유영삼 추인애 서기열 김혜미 이문석 박희정 이상연 이지영 이승호 박희주 최윤호 김규연 구량주 이현신 최혜남 장영송 김성희 김지선 장윤경 현지혜 강진규 김지현 김진한 최연진 김영민 문정은 심지호 이민후 이승용 전승우 이현정 허민 노소영 신승주 한은정 이재원 김유진 이병주 황상수 송영선 김선정 김연주 류남현 이광숙 박순관 박순호 안지원 염귀화 이용섭 김경록 하진수 한영원 김나리";
const childrenText = "배이안 강나로 강나엘 김은파 김도훈 김도윤 김지한 김수아 김아론 김샤론 장한나 장하음 나지온 나예온 박하솜 박하랑 서지우 서지아 육이현 윤이나 안바하 안바론 이선호 이인호 강로희 강아인 김희상 김채민 손루이 신아민 김카이 신연서 채수윤 채수호 김주아 유상현 유상윤 서정민 최노아 강하은 김재연 김하윤 심이안 심이엘 이루아 이안 허은율 허지율 허선율 이하은 이하온 태현영 김아인 한라온";

const adults = adultsText.split(' ');
const children = childrenText.split(' ');

const days = [];
let curr = new Date('2026-07-13T00:00:00Z');
const end = new Date('2026-07-30T00:00:00Z');

while (curr <= end) {
  if (curr.getUTCDay() !== 0) { // Sunday is 0
    days.push(curr.toISOString().split('T')[0]);
  }
  curr.setUTCDate(curr.getUTCDate() + 1);
}

const schedule = {};
let aIdx = 0;
let cIdx = 0;

days.forEach((day, i) => {
  const aTake = Math.floor(adults.length / days.length) + (i < adults.length % days.length ? 1 : 0);
  const cTake = Math.floor(children.length / days.length) + (i < children.length % days.length ? 1 : 0);
  
  const todayAdults = adults.slice(aIdx, aIdx + aTake);
  const todayChildren = children.slice(cIdx, cIdx + cTake);
  
  const todayList = [];
  let ia = 0, ic = 0;
  while (ia < todayAdults.length || ic < todayChildren.length) {
    if (ia < todayAdults.length) todayList.push({ name: todayAdults[ia++], type: 'adult' });
    if (ic < todayChildren.length) todayList.push({ name: todayChildren[ic++], type: 'child' });
    if (ia < todayAdults.length) todayList.push({ name: todayAdults[ia++], type: 'adult' });
  }
  
  schedule[day] = todayList;
  aIdx += aTake;
  cIdx += cTake;
});

const tsContent = `export const RELAY_PRAYER_SCHEDULE: Record<string, { name: string, type: 'adult' | 'child' }[]> = ${JSON.stringify(schedule, null, 2)};
`;

fs.writeFileSync('src/data/relayPrayer.ts', tsContent, 'utf-8');
console.log('Generated src/data/relayPrayer.ts');
