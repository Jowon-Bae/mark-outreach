'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BookOpen, CheckCircle, ArrowLeft, Users, Heart, Send, MessageSquareHeart, Lightbulb, Sparkles, Dices, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './qt.css';
import { RELAY_PRAYER_SCHEDULE } from '@/data/relayPrayer';
// 묵상 콘텐츠 데이터 (날짜별 매핑)
interface QTContent {
  passage: string;
  title: string;
  verses: string;
  meditation: string;
  fullText?: string[];
}

const QT_DATA: Record<string, QTContent> = {
  '2026-07-10': {
    passage: '시편 114편 1~8절',
    title: '반석을 변하여 못이 되게 하시는 하나님',
    verses: '“여호와 앞 곧 야곱의 하나님 앞에서 땅이여 떨지어다 그가 반석을 쳐서 못물이 되게 하시며 차돌로 샘물이 되게 하셨도다”',
    meditation: '이스라엘이 애굽에서 나올 때 하나님은 굳은 반석에서 샘물이 터지게 하셨습니다. 우리의 아웃리치 현장이 아무리 척박하고 굳게 닫혀 있는 곳일지라도, 하나님의 임재가 함께하시면 메마른 심령이 은혜의 샘물로 변화될 줄 믿습니다. 오늘 하루 주님의 일하심을 기대하며 나아갑시다.'
  , fullText: ["1. 이스라엘이 애굽에서 나오며 야곱의 집안이 언어가 다른 민족에게서 나올 때에", "2. 유다는 여호와의 성소가 되고 이스라엘은 그의 영토가 되었도다", "3. 바다가 보고 도망하며 요단은 물러갔으며", "4. 산들은 숫양들 같이 뛰놀며 작은 산들은 어린 양들 같이 뛰었도다", "5. 바다야 네가 도망함은 어찌함이며 요단아 네가 물러감은 어찌함인가", "6. 너희 산들아 숫양들 같이 뛰놀며 작은 산들아 어린 양들 같이 뛰놂은 어찌함인가", "7. 땅이여 너는 주 앞 곧 야곱의 하나님 앞에서 떨지어다", "8. 그가 반석을 쳐서 못물이 되게 하시며 차돌로 샘물이 되게 하셨도다"]
  },
  '2026-07-11': {
    passage: '시편 115편 1~8절',
    title: '오직 주의 이름에만 영광을 돌리소서',
    verses: '“여호와여 영광을 우리에게 돌리지 마옵소서 우리에게 돌리지 마옵소서 오직 주는 인자하시고 진실하시므로 주의 이름에만 영광을 돌리소서”',
    meditation: '세상은 헛된 우상과 자신의 능력을 의지하지만, 우리는 오직 크고 인자하신 하나님만을 의지합니다. 아웃리치 사역의 모든 과정 속에서 우리의 의나 자랑은 철저히 감추어지고, 오직 우리를 통해 일하시는 하나님의 이름만이 높임 받으시기를 기도합니다.'
  , fullText: ["1. 여호와여 영광을 우리에게 돌리지 마옵소서 우리에게 돌리지 마옵소서 오직 주는 인자하시고 진실하시므로 주의 이름에만 영광을 돌리소서", "2. 어찌하여 뭇 나라가 그들의 하나님이 이제 어디 있느냐 말하게 하리이까", "3. 오직 우리 하나님은 하늘에 계셔서 원하시는 모든 것을 행하셨나이다", "4. 그들의 우상들은 은과 금이요 사람이 손으로 만든 것이라", "5. 입이 있어도 말하지 못하며 눈이 있어도 보지 못하며", "6. 귀가 있어도 듣지 못하며 코가 있어도 냄새 맡지 못하며", "7. 손이 있어도 만지지 못하며 발이 있어도 걷지 못하며 목구멍이 있어도 작은 소리조차 내지 못하느니라", "8. 우상들을 만드는 자들과 그것을 의지하는 자들이 다 그와 같으리로다"]
  },
  '2026-07-12': {
    passage: '시편 115편 9~18절',
    title: '여호와를 의지하는 자를 도우시는 주',
    verses: '“여호와를 경외하는 자들아 너희는 여호와를 의지하여라 그는 너희의 도움이시요 너희의 방패시로다”',
    meditation: '하나님은 주님을 경외하고 의지하는 자들의 도움이 되시며 방패가 되어 주십니다. 사역의 마지막 날, 육체적으로 지치고 피곤할 수 있지만 끝까지 우리를 도우시고 복 주시는 하나님을 온전히 의지합시다. 삶의 모든 영역에서 주님을 찬양하는 예배자로 살아가기를 결단합시다.'
  , fullText: ["9. 이스라엘아 여호와를 의지하라 그는 너희의 도움이시요 너희의 방패시로다", "10. 아론의 집이여 여호와를 의지하라 그는 너희의 도움이시요 너희의 방패시로다", "11. 여호와를 경외하는 자들아 너희는 여호와를 의지하여라 그는 너희의 도움이시요 너희의 방패시로다", "12. 여호와께서 우리를 생각하사 복을 주시되 이스라엘 집에도 복을 주시고 아론의 집에도 복을 주시며", "13. 높은 사람이나 낮은 사람을 막론하고 여호와를 경외하는 자들에게 복을 주시리로다", "14. 여호와께서 너희를 곧 너희와 너희의 자손을 더욱 번창하게 하시기를 원하노라", "15. 너희는 천지를 지으신 여호와에게 복을 받는 자로다", "16. 하늘은 여호와의 하늘이라도 땅은 사람에게 주셨도다", "17. 죽은 자들은 여호와를 찬양하지 못하나니 적막한 데로 내려가는 자들은 아무도 찬양하지 못하리로다", "18. 우리는 이제부터 영원까지 여호와를 송축하리로다 할렐루야"]
  },
  '2026-07-13': {
    passage: '시편 116편 1~11절',
    title: '내 간구를 들으시는 하나님',
    verses: '“여호와께서 내 음성과 내 간구를 들으시므로 내가 그를 사랑하는도다 그의 귀를 내게 기울이셨으므로 내가 평생에 기도하리로다”',
    meditation: '하나님은 우리의 작은 신음과 간구에도 귀를 기울이십니다. 아웃리치 현장에서 만나는 영혼들을 향한 우리의 간절한 기도를 주님께서 반드시 들으시고 응답하실 것입니다. 오늘도 쉬지 않고 영혼들을 위해 중보하는 하루가 됩시다.'
  , fullText: ["1. 여호와께서 내 음성과 내 간구를 들으시므로 내가 그를 사랑하는도다", "2. 그의 귀를 내게 기울이셨으므로 내가 평생에 기도하리로다", "3. 사망의 줄이 나를 두르고 스올의 고통이 내게 이르므로 내가 환난과 슬픔을 만났을 때에", "4. 내가 여호와의 이름으로 기도하기를 여호와여 주께 구하오니 내 영혼을 건지소서 하였도다", "5. 여호와는 은혜로우시며 의로우시며 우리 하나님은 긍휼이 많으시도다", "6. 여호와께서는 순진한 자를 지키시나니 내가 크게 어려울 때에 나를 구원하셨도다", "7. 내 영혼아 네 평안함으로 돌아갈지어다 여호와께서 너를 후대하심이로다", "8. 주께서 내 영혼을 사망에서, 내 눈을 눈물에서, 내 발을 넘어짐에서 건지셨나이다", "9. 내가 생명이 있는 땅에서 여호와 앞에 행하리로다", "10. 내가 크게 고통을 당하였다고 말할 때에도 나는 믿었도다", "11. 내가 놀라서 이르기를 모든 사람이 거짓말쟁이라 하였도다"]
  },
  '2026-07-14': {
    passage: '시편 116편 12~19절',
    title: '은혜에 보답하는 삶',
    verses: '“내게 주신 모든 은혜를 내가 여호와께 무엇으로 보답할까 내가 구원의 잔을 들고 여호와의 이름을 부르며”',
    meditation: '구원의 감격과 은혜를 아는 자는 그 사랑을 흘려보내지 않을 수 없습니다. 우리가 받은 측량할 수 없는 은혜를 기억하며, 아웃리치 사역을 통해 만나는 이들에게 그 십자가의 은혜와 구원의 소식을 기쁨으로 나누는 축복의 통로가 됩시다.'
  , fullText: ["12. 내게 주신 모든 은혜를 내가 여호와께 무엇으로 보답할까", "13. 내가 구원의 잔을 들고 여호와의 이름을 부르며", "14. 여호와의 모든 백성 앞에서 나는 나의 서원을 여호와께 갚으리로다", "15. 그의 경건한 자들의 죽음은 여호와께서 보시기에 귀중한 것이로다", "16. 여호와여 나는 진실로 주의 종이요 주의 여종의 아들 곧 주의 종이라 주께서 나의 결박을 푸셨나이다", "17. 내가 주께 감사제를 드리고 여호와의 이름을 부르리이다", "18. 내가 여호와께 서원한 것을 그의 모든 백성이 보는 앞에서 내가 지키리로다", "19. 예루살렘아, 네 한가운데에서 곧 여호와의 성전 뜰에서 지키리로다 할렐루야"]
  },
  '2026-07-15': {
    passage: '시편 117편 1~2절',
    title: '모든 나라여 여호와를 찬양하라',
    verses: '“너희 모든 나라들아 여호와를 찬양하며 너희 모든 백성들아 그를 찬송할지어다 우리에게 향하신 여호와의 인자하심이 크시고 진실하심이 영원함이로다”',
    meditation: '하나님의 인자하심과 구원의 계획은 온 열방을 향해 열려 있습니다. 우리가 밟는 이 땅, 만나는 모든 영혼이 언젠가 함께 하나님을 찬양하게 될 날을 꿈꾸며, 하나님의 크신 사랑과 복음을 담대히 선포합시다.'
  , fullText: ["1. 너희 모든 나라들아 여호와를 찬양하며 너희 모든 백성들아 그를 찬송할지어다", "2. 우리에게 향하신 여호와의 인자하심이 크시고 진실하심이 영원함이로다 할렐루야"]
  },
  '2026-07-16': {
    passage: '시편 118편 1~13절',
    title: '내 편이 되시는 여호와',
    verses: '“여호와는 내 편이시라 내가 두려워하지 아니하리니 사람이 내게 어찌할까”',
    meditation: '사역의 현장에서 때로는 예상치 못한 영적 방해나 두려움을 마주할 수 있습니다. 그러나 만군의 여호와께서 친히 우리 편이 되어 주십니다. 사람이나 환경을 두려워하지 말고, 우리를 도우시는 하나님만을 굳게 믿고 담대히 나아갑시다.'
  , fullText: ["1. 여호와께 감사하라 그는 선하시며 그의 인자하심이 영원함이로다", "2. 이제 이스라엘은 말하기를 그의 인자하심이 영원하다 할지로다", "3. 이제 아론의 집은 말하기를 그의 인자하심이 영원하다 할지로다", "4. 이제 여호와를 경외하는 자는 말하기를 그의 인자하심이 영원하다 할지로다", "5. 내가 고통 중에 여호와께 부르짖었더니 여호와께서 응답하시고 나를 넓은 곳에 세우셨도다", "6. 여호와는 내 편이시라 내가 두려워하지 아니하리니 사람이 내게 어찌할까", "7. 여호와께서 내 편이 되사 나를 돕는 자들 중에 계시니 그러므로 나를 미워하는 자들에게 보응하시는 것을 내가 보리로다", "8. 여호와께 피하는 것이 사람을 신뢰하는 것보다 나으며", "9. 여호와께 피하는 것이 고관들을 신뢰하는 것보다 낫도다", "10. 뭇 나라가 나를 에워쌌으니 내가 여호와의 이름으로 그들을 끊으리로다", "11. 그들이 나를 에워싸고 에워쌌으니 내가 여호와의 이름으로 그들을 끊으리로다", "12. 그들이 벌들처럼 나를 에워쌌으나 가시덤불의 불 같이 타없어졌나니 내가 여호와의 이름으로 그들을 끊으리로다", "13. 너는 나를 밀쳐 넘어뜨리려 하였으나 여호와께서는 나를 도우셨도다"]
  },
  '2026-07-17': {
    passage: '에스겔 25:12~17',
    title: '자기 백성의 원수를 친히 갚으시는 하나님',
    verses: '“내가 내 백성 이스라엘의 손으로 내 원수를 에돔에게 갚으리니 그들이 내 진노와 분노를 따라 에돔에 행한즉 내가 원수를 갚음인 줄을 에돔이 알리라”',
    meditation: '에돔이 형제 나라 이스라엘이 망할 때 기뻐하며 원수를 갚은 것처럼, 우리도 때로 형제의 실패를 내심 기뻐할 때가 있습니다. 그러나 하나님은 그 교만과 악의를 반드시 심판하십니다. 오늘 아웃리치 현장에서 함께하는 지체들을 경쟁자가 아닌 동역자로 여기며 사랑으로 섬겨 주님을 기쁘게 합시다.'
  },
  '2026-07-18': {
    passage: '에스겔 26:1~21',
    title: '남의 실패를 나의 성공으로 여기는 죄',
    verses: '“두로야 내가 너를 대적하여 바다가 그 파도를 굽이치게 함 같이 여러 민족들이 와서 너를 치게 하리니”',
    meditation: '두로는 예루살렘의 멸망을 보며 오히려 상업적 이익을 기대하며 기뻐했습니다. 형제의 실패를 나의 기회로 삼는 이 죄악은 오늘날도 우리 마음에 도사리고 있습니다. 아웃리치 현장에서 우리가 만나는 모든 영혼의 고통을 내 것처럼 여기고 진심으로 복음을 나누는 하루가 됩시다.'
  },
  '2026-07-19': {
    passage: '에스겔 27:1~25',
    title: '화려함 속에서 복의 근원을 망각한 죄',
    verses: '“두로야 네가 말하기를 나는 온전히 아름답다 하였도다 네 땅이 바다 가운데에 있음이여 너를 지은 자가 네 아름다움을 온전하게 하였도다”',
    meditation: '두로는 하나님이 주신 지리적 조건과 아름다움을 누리면서도 그것을 주신 하나님을 망각하고 스스로 영광을 취했습니다. 우리에게 주어진 모든 환경과 은사와 재능이 주님께로부터 온 것임을 기억하며, 오늘도 모든 복의 근원이신 하나님께 감사와 영광을 돌립시다.'
  },
  '2026-07-20': {
    passage: '에스겔 27:26~36',
    title: '찬가에서 통곡으로 끝나는 어리석은 삶',
    verses: '“네 사공이 너를 인도하여 큰 물에 이름이여 동풍이 바다 한가운데에서 너를 무찔렀도다”',
    meditation: '두로의 상인들을 찬양했던 노래는 결국 통곡과 애도의 소리로 끝났습니다. 세상의 영광과 번영을 좇는 삶은 언제나 이처럼 허무한 결말을 맞습니다. 아웃리치의 첫날, 오직 영원한 복음 위에 삶을 세우고 그 기쁨을 이 땅 영혼들과 함께 나누는 지혜로운 삶을 선택합시다.'
  },
  '2026-07-21': {
    passage: '에스겔 28:1~19',
    title: '하나님인 체하면 한 줌의 재로 사라집니다',
    verses: '“네 마음이 교만하여 말하기를 나는 신이라 내가 하나님의 자리 곧 바다 가운데에 앉아 있다 하도다”',
    meditation: '두로 왕은 자신의 지혜와 재물을 믿고 스스로를 신이라 여겼지만, 결국 불로 사라지는 재가 되었습니다. 우리 삶에서도 하나님의 자리를 빼앗으려는 교만의 싹이 자라지 않도록 매일 십자가 앞에 나아가 자신을 낮추고 오직 주님만을 높이는 하루가 됩시다.'
  },
  '2026-07-22': {
    passage: '에스겔 28:20~26',
    title: '아프게 하던 가시가 제거되는 회복의 날',
    verses: '“이스라엘 족속에게는 그 사방에서 그들을 멸시하는 자 중에 찌르는 가시와 아프게 하는 가시가 다시는 없으리니”',
    meditation: '하나님은 이스라엘 주변의 교만한 열방들을 심판하시고, 그들을 괴롭히던 찌르는 가시들을 제거하실 것을 약속하십니다. 우리 삶을 오랫동안 찌르고 아프게 했던 상처와 관계의 가시들도 하나님의 회복하시는 손길 안에서 치유될 것을 믿고 담대히 나아갑시다.'
  },
  '2026-07-23': {
    passage: '에스겔 29:1~16',
    title: '갈대 지팡이가 아닌 하나님을 붙드십시오',
    verses: '“애굽은 본래 이스라엘 족속에게 갈대 지팡이라 그들이 너를 손으로 잡은즉 네가 부러져서 그들의 모든 어깨를 찢었고”',
    meditation: '이스라엘이 하나님을 떠나 애굽이라는 갈대 지팡이를 의지했을 때, 그것은 오히려 어깨를 찢는 상처가 되었습니다. 우리 삶에서 하나님 대신 붙잡고 있는 갈대 지팡이는 없는지 돌아보고, 오직 부러지지 않는 반석이신 예수 그리스도만을 굳게 붙드는 오늘이 됩시다.'
  },
  '2026-07-24': {
    passage: '에스겔 29:17~30:9',
    title: '교만한 권세를 꺾는 하나님의 도구',
    verses: '“그 날에 나는 이스라엘 족속에게 한 뿔이 돋아나게 하고 나는 또 네가 그들 가운데에서 입을 열게 하리니 내가 여호와인 줄을 그들이 알리라”',
    meditation: '바벨론 느부갓네살 왕은 스스로의 야욕으로 움직였지만, 하나님은 그를 교만한 애굽을 꺾는 도구로 사용하셨습니다. 하나님은 역사의 모든 권세와 사건을 주관하시며 당신의 뜻을 이루어 가십니다. 오늘 아웃리치의 현장도 하나님의 손 안에 있음을 믿고 담대히 나아갑시다.'
  },
  '2026-07-25': {
    passage: '에스겔 30:10~26',
    title: '강하게도, 약하게도 하시는 역사의 주권자',
    verses: '“내가 바벨론 왕의 팔은 들어 주고 바로의 팔은 내려뜨릴 것이라 내가 내 칼을 바벨론 왕의 손에 넘겨 주어 그를 들어 애굽 땅을 치게 하리니”',
    meditation: '하나님은 바벨론 왕의 팔은 들어주시고 애굽 바로의 팔은 꺾으셨습니다. 강하게도 하시고 약하게도 하시는 분은 오직 하나님뿐이십니다. 아웃리치 마지막 날을 향해 달려가는 우리를 강하게 붙들어 주시는 하나님의 주권을 온전히 신뢰합시다.'
  },
  '2026-07-26': {
    passage: '에스겔 31:1~18',
    title: '높아진다고 교만하면 반드시 낮아집니다',
    verses: '“그의 키가 높고 꼭대기가 구름에 닿아서 교만하였으므로 내가 여러 나라의 능한 자의 손에 넘겨 줄지라”',
    meditation: '거대한 앗수르 백향목은 그 높이와 아름다움을 자랑했지만, 교만으로 인해 결국 베어져 쓰러졌습니다. 높아질수록 더 낮아지는 것이 하나님 나라의 법칙임을 기억하며, 이 주일 예배 가운데 우리 마음의 교만을 내려놓고 겸손히 하나님 앞에 엎드리는 시간이 됩시다.'
  },
  '2026-07-27': {
    passage: '에스겔 32:1~16',
    title: '물을 흐린 죄에 임하는 심판',
    verses: '“내가 너와 네 강들을 쳐서 애굽 땅 믹돌에서부터 수에네 곧 구스 지경까지 적막한 황무지 곧 사막이 되게 하리니”',
    meditation: '물을 흐려놓는 바로처럼, 우리도 모르는 사이에 주변을 혼탁하게 하는 삶을 살 수 있습니다. 아웃리치 현장에서 우리의 언어와 행동과 태도가 맑고 깨끗하여 오히려 영혼들에게 생수가 흘러넘치게 되기를 기도합시다.'
  },
  '2026-07-28': {
    passage: '에스겔 32:17~32',
    title: '교만으로 심판받은 죽은 자들의 세계',
    verses: '“할례를 받지 못하고 칼에 죽임을 당한 자가 거기에 있고 그 사방에는 그의 군대들의 무덤들이 있도다”',
    meditation: '강력했던 여러 나라들이 교만으로 인해 스올에 함께 누워 있습니다. 죽음 이후의 세계는 현세의 영광과 권세로 아무것도 할 수 없습니다. 오늘 우리가 만나는 영혼들이 영원한 생명을 얻게 되도록 열정을 다해 복음을 전합시다.'
  },
  '2026-07-29': {
    passage: '에스겔 33:1~9',
    title: '생명을 구원하는 파수꾼의 역할과 사명',
    verses: '“그러므로 인자야 나는 너를 이스라엘 족속의 파수꾼으로 세웠으니 너는 내 입의 말을 듣고 나를 대신하여 그들에게 경고할지어다”',
    meditation: '하나님은 에스겔에게 파수꾼의 사명을 주셨습니다. 파수꾼이 나팔을 불어 백성을 경고하지 않으면 그 피값이 파수꾼에게 돌아옵니다. 우리도 복음을 들고 이 땅 영혼들에게 나아가야 할 파수꾼의 사명을 가지고 있음을 기억하며 오늘도 담대히 사역에 임합시다.'
  },
  '2026-07-30': {
    passage: '에스겔 33:10~20',
    title: '죄의 길에서 돌이키면 삽니다',
    verses: '“주 여호와의 말씀이니라 너희는 돌이키고 돌이키라 너희 악한 길에서 떠나라 이스라엘 족속아 어찌 죽고자 하느냐”',
    meditation: '하나님은 악인의 죽음을 기뻐하지 않으시고 돌이켜 사는 것을 원하십니다. 아웃리치 현장에서 만나는 영혼들도 하나님의 이 뜨거운 마음처럼, 그들이 죄에서 돌이켜 영생을 얻게 되기를 간절히 기도하며 사역합시다.'
  },
  '2026-07-31': {
    passage: '에스겔 33:21~33',
    title: '실패에서 배우고 생명 길로 행하십시오',
    verses: '“주 여호와께서 이같이 말씀하셨느니라 너희가 피 있는 고기를 먹으며 너희 우상들에게 눈을 들며 피를 흘리니 그 땅이 너희의 소유가 되겠느냐”',
    meditation: '예루살렘 함락의 소식이 에스겔에게 전해졌습니다. 이스라엘의 실패와 멸망의 역사는 우리에게 반면교사가 됩니다. 아웃리치를 마무리하며, 우리의 삶에서 하나님보다 높아졌던 것들을 모두 내려놓고 오직 생명의 말씀을 따라 살아가기로 결단합시다.'
  },
  '2026-08-01': {
    passage: '에스겔 31장 1~9절',
    title: '높이 솟은 백향목 앗수르',
    verses: '“볼지어다 앗수르는 가지가 아름답고 그늘은 숲의 그늘 같으며 키가 높고 꼭대기가 구름에 닿은 레바논 백향목이었느니라”',
    meditation: '세상 모든 나무보다 아름답고 거대하게 자라난 앗수르 나무처럼, 세상의 영광은 참으로 위대해 보입니다. 그러나 그 거대함조차 하나님의 허락 없이는 존재할 수 없음을 기억하며, 모든 주권이 하나님께 있음을 고백하는 오늘이 됩시다.'
  , fullText: ["1. 열한째 해 셋째 달 초하루에 여호와의 말씀이 내게 임하여 이르시되", "2. 인자야 너는 애굽의 바로 왕과 그 무리에게 이르기를 네 큰 위엄을 누구에게 비하랴", "3. 볼지어다 앗수르는 가지가 아름답고 그늘은 숲의 그늘 같으며 키가 높고 꼭대기가 구름에 닿은 레바논 백향목이었느니라", "4. 물들이 그것을 기르며 깊은 물이 그것을 자라게 하며 강들이 그 심어진 곳을 둘러 흐르며 보의 물이 들의 모든 나무에까지 미치매", "5. 그 나무가 키가 들의 모든 나무보다 높으며 굵은 가지가 번성하며 가는 가지가 길게 뻗어나갔고", "6. 공중의 모든 새가 그 큰 가지에 깃들이며 들의 모든 짐승이 그 가는 가지 밑에 새끼를 낳으며 모든 큰 나라가 그 그늘 아래에 거주하였느니라", "7. 그 뿌리가 큰 물 가에 있으므로 그 나무가 크고 가지가 길어 모양이 아름다우매", "8. 하나님의 동산의 백향목이 능히 그를 가리지 못하며 잣나무가 그 굵은 가지만 못하며 단풍나무가 그 가는 가지만 못하며 하나님의 동산의 어떤 나무도 그 아름다운 모양과 같지 못하였도다", "9. 내가 그 가지를 많게 하여 모양이 아름답게 하였더니 하나님의 동산 에덴에 있는 모든 나무가 다 시기하였느니라"]
  },
  '2026-08-02': {
    passage: '에스겔 31장 10~18절',
    title: '교만한 자의 필연적인 최후',
    verses: '“그의 키가 높고 꼭대기가 구름에 닿아서 교만하였으므로 내가 여러 나라의 능한 자의 손에 넘겨 줄지라”',
    meditation: '교만의 끝은 결국 멸망과 심판입니다. 아웃리치를 마무리하는 이 시점, 우리의 모든 사역과 헌신 속에서 행여나 싹틀 수 있는 교만을 온전히 십자가에 못 박고, 모든 영광을 온전히 살아계신 하나님께만 돌려드리는 예배로 마치게 하옵소서.'
  , fullText: ["10. 그러므로 주 여호와께서 이같이 말씀하셨느니라 그의 키가 높고 꼭대기가 구름에 닿아서 교만하였으므로", "11. 내가 여러 나라의 능한 자의 손에 넘겨 줄지라 그가 임의로 대우할 것은 내가 그의 악으로 말미암아 쫓아내었음이라", "12. 여러 나라의 포악한 다른 민족이 그를 찍어 버렸으므로 그 가는 가지가 산과 모든 골짜기에 떨어졌고 그 굵은 가지가 그 땅 모든 물 가에 꺾어졌으며 세상 모든 백성이 그를 버리고 그 그늘 아래에서 떠나매", "13. 공중의 모든 새가 그 넘어진 나무에 거주하며 들의 모든 짐승이 그 가지에 있으리니", "14. 이는 물 가에 있는 모든 나무는 키가 크다고 교만하지 못하게 하며 그 꼭대기가 구름에 닿지 못하게 하며 또 물을 마시는 모든 나무가 스스로 높이 서지 못하게 함이니 그들을 다 죽음에 넘겨 주어 사람들 가운데에서 구덩이로 내려가는 자와 함께 지하로 내려가게 하였음이라", "15. 주 여호와께서 이같이 말씀하셨느니라 그가 스올에 내려가던 날에 내가 그를 위하여 슬프게 울게 하며 깊은 바다를 덮으며 모든 강물을 쉬게 하며 큰 물을 그치게 하고 레바논이 그를 위하여 슬프게 울게 하며 들의 모든 나무를 그로 말미암아 쇠잔하게 하였느니라", "16. 내가 그를 구덩이에 내려가는 자와 함께 스올에 떨어뜨리던 때에 백성들이 그 떨어지는 소리로 말미암아 진동하게 하였고 물을 마시는 에덴의 모든 나무 곧 레바논의 뛰어나고 아름다운 나무들이 지하에서 위로를 받게 하였느니라", "17. 그러나 그들도 그와 함께 스올에 내려 칼에 죽임을 당한 자에게 이르렀나니 그들은 옛적에 그의 팔이 된 자요 나라들 가운데에서 그 그늘 아래에 거주하던 자니라", "18. 에덴의 나무들 가운데에서 네 영광과 위대함이 나무와 같으냐 그러나 네가 에덴의 나무들과 함께 지하에 내려갈 것이요 거기에서 할례를 받지 못하고 칼에 죽임을 당한 자 가운데에 누우리라 이들은 바로와 그의 모든 군대니라 주 여호와의 말씀이니라"]
  }
};

const DEFAULT_QT: QTContent = {
  passage: '마가복음 1장 35절',
  title: '새벽 오히려 미명에 기도하신 예수님',
  verses: '“새벽 아직도 밝기 전에 예수께서 일어나 나가 한적한 곳으로 가사 거기서 기도하시더니”',
  meditation: '아웃리치 사역의 첫출발과 모든 능력의 원천은 바로 기도에 있습니다. 바쁜 사역 일정 중에서도 예수님처럼 한적한 곳에서 조용히 하나님을 마주하고 기도로 하루를 준비하여 주의 은혜를 풍성히 누리는 날이 됩시다.'
};

export default function QuietTime() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'qt' | 'prayer'>('qt');
  const [dateStr, setDateStr] = useState('');
  const [qt, setQt] = useState<QTContent>(DEFAULT_QT);
  const [isCompleted, setIsCompleted] = useState(false);
    const [completedUsers, setCompletedUsers] = useState<any[]>([]);
  const [shareText, setShareText] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 기도제목 상태
  const [prayers, setPrayers] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrayersLoading, setIsPrayersLoading] = useState(true);
  const [randomPrayer, setRandomPrayer] = useState<any>(null);
  const [showPrayerPopup, setShowPrayerPopup] = useState(false);
  const [isPrayerFadingOut, setIsPrayerFadingOut] = useState(false);

  const fetchQTCompletions = async (dateKey: string) => {
    setIsLoading(true);
    const currentUsername = localStorage.getItem('username') || '';

    // 오늘 날짜 완료자 조회 (전체 데이터 가져오기)
    const { data, error } = await supabase
      .from('qt_completions')
      .select('*')
      .eq('date_str', dateKey)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCompletedUsers(data);
      
      if (currentUsername) {
        const myCompletion = data.find((item: any) => item.user_name === currentUsername);
        if (myCompletion) {
          setIsCompleted(true);
          if (myCompletion.content) {
            setShareText(myCompletion.content);
          }
        }
      }
    }
    setIsLoading(false);
  };

  const fetchPrayers = async () => {
    setIsPrayersLoading(true);
    const { data, error } = await supabase
      .from('community_prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPrayers(data);
    }
    setIsPrayersLoading(false);
  };

  useEffect(() => {
    // 오늘 날짜 계산 (KST 기준)
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const kstDate = new Date(today.getTime() - offset);
    const kstDateString = kstDate.toISOString().split('T')[0];
    
    setDateStr(kstDateString);
    setQt(QT_DATA[kstDateString] || DEFAULT_QT);

    fetchQTCompletions(kstDateString);
    fetchPrayers();
  }, []);

  const handleComplete = async () => {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isCompleted) {
      // Update existing record
      const { error } = await supabase
        .from('qt_completions')
        .update({ content: shareText })
        .eq('user_name', currentUsername)
        .eq('date_str', dateStr);
        
      if (error) {
        alert('나눔 글 수정에 실패했습니다: ' + error.message);
        return;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('qt_completions')
        .insert([{ user_name: currentUsername, date_str: dateStr, content: shareText }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint error
          setIsCompleted(true);
          // try updating instead since it exists
          await supabase
            .from('qt_completions')
            .update({ content: shareText })
            .eq('user_name', currentUsername)
            .eq('date_str', dateStr);
        } else {
          alert('묵상 완료 기록에 실패했습니다.');
          return;
        }
      }
    }

    setIsCompleted(true);
    fetchQTCompletions(dateStr);
  };

  const todayRelaySlots = RELAY_PRAYER_SCHEDULE[dateStr] || null;
  const isSunday = new Date(dateStr).getUTCDay() === 0;

  // 현재 시간에 따라 기도 슬롯 결정 (아침 ~12시, 점심 12~17시, 저녁 17시~)
  const getCurrentTimeSlot = (): '아침' | '점심' | '저녁' => {
    const hour = new Date().getHours();
    if (hour < 12) return '아침';
    if (hour < 17) return '점심';
    return '저녁';
  };
  const [activeTimeSlot, setActiveTimeSlot] = useState<'아침' | '점심' | '저녁'>(getCurrentTimeSlot());

  const handlePrayerSubmit = async () => {
    if (!content.trim()) {
      alert('기도제목을 입력해 주세요.');
      return;
    }

    const currentUsername = localStorage.getItem('username') || '익명';
    setIsSubmitting(true);

    const { error } = await supabase
      .from('community_prayers')
      .insert([{ author: currentUsername, content: content.trim() }]);

    setIsSubmitting(false);

    if (error) {
      alert('기도제목 등록에 실패했습니다.');
      return;
    }

    setContent('');
    fetchPrayers();
  };

  const drawRandomPrayer = () => {
    if (prayers.length === 0) {
      alert('등록된 기도제목이 없습니다. 먼저 첫 기도제목을 나누어보세요!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * prayers.length);
    setRandomPrayer(prayers[randomIndex]);
    setIsPrayerFadingOut(false);
    setShowPrayerPopup(true);
  };

  const closePrayerPopup = () => {
    setIsPrayerFadingOut(true);
    setTimeout(() => {
      setShowPrayerPopup(false);
      setRandomPrayer(null);
    }, 1200);
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // 분 단위
    
    if (diff < 1) return '방금 전';
    if (diff < 60) return `${diff}분 전`;
    if (diff < 24 * 60) return `${Math.floor(diff / 60)}시간 전`;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="qt-container">
      <div className="sticky-header-wrapper">
        {/* 상단 헤더 */}
        <div className="qt-header">
          <button className="back-btn" onClick={() => router.push('/')}>
            <ArrowLeft size={20} />
          </button>
          <h2>묵상 & 기도</h2>
          <div style={{ width: 20 }}></div>
        </div>

        {/* 상단 서브 탭 (제거됨) */}
      </div>

      <div className="qt-tab-content">
          {/* 날짜 표시 */}
          <div className="qt-date-card">
            <span className="qt-label">TODAY'S BREAD</span>
            <span className="qt-date">{dateStr}</span>
          </div>

          {/* 말씀 카드 */}
          <div className="qt-card">
            <span className="qt-passage-badge">[생명의 삶] {qt.passage}</span>
            <h3 className="qt-title">{qt.title}</h3>
                        <div className="qt-verses">
              <p>{qt.verses}</p>
            </div>
            {qt.fullText && qt.fullText.length > 0 && (
              <div className="qt-full-text-wrapper">
                <button 
                  className="qt-full-text-toggle" 
                  onClick={() => setShowFullText(!showFullText)}
                >
                  <BookOpen size={16} />
                  {showFullText ? '본문 닫기' : '본문 전체 보기'}
                </button>
                {showFullText && (
                  <div className="qt-full-text-content">
                    {qt.fullText.map((verse, idx) => (
                      <p key={idx}>{verse}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 묵상 가이드 */}
          <div className="meditation-card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={16} />
              <span>오늘의 묵상 나눔</span>
            </h4>
            <p className="meditation-text">{qt.meditation}</p>
          </div>

          {/* 릴레이 기도 배너 */}
          {!isSunday && todayRelaySlots && (
            <div className="relay-prayer-banner">
              <div className="relay-banner-header">
                <Heart size={16} color="#e05c5c" />
                <span>오늘의 릴레이 기도</span>
              </div>
              {/* 아침/점심/저녁 탭 */}
              <div className="relay-time-tabs">
                {(['아침', '점심', '저녁'] as const).map((slot) => (
                  <button
                    key={slot}
                    className={`relay-time-tab ${activeTimeSlot === slot ? 'active' : ''}`}
                    onClick={() => setActiveTimeSlot(slot)}
                  >
                    {slot === '아침' ? '🌅' : slot === '점심' ? '☀️' : '🌙'} {slot}
                  </button>
                ))}
              </div>
              {/* 해당 슬롯 멤버 목록 */}
              <div className="relay-names-grid">
                {(todayRelaySlots[activeTimeSlot] || []).map((name, idx) => (
                  <span key={idx} className="relay-name-chip">{name}</span>
                ))}
              </div>
              <p className="relay-banner-desc">위 지체들을 위해 함께 기도해 주세요 🙏</p>
            </div>
          )}

          {/* 묵상 완료 및 나눔 입력 */}
          <div className="qt-share-section">
            <div className="qt-share-input-wrapper">
              <textarea
                className="qt-share-input"
                placeholder="오늘 말씀에서 받은 은혜를 자유롭게 나누어 주세요. (선택 사항)"
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
              />
              <button className="complete-btn" onClick={handleComplete} disabled={isLoading} style={{ backgroundColor: isCompleted ? '#4CAF50' : 'var(--primary)' }}>
                <CheckCircle size={20} />
                <span>{isCompleted ? '묵상 올리기' : '오늘 말씀 묵상 완료하기'}</span>
              </button>
            </div>
          </div>
          
          {isCompleted && (
            <div className="action-section" style={{ marginTop: '12px' }}>
              <div className="completed-badge">
                <CheckCircle size={20} color="#1b64da" />
                <span>오늘의 말씀 묵상을 완료했습니다! 은혜로운 하루 보내세요.</span>
              </div>
            </div>
          )}

          {/* 지체들의 묵상 나눔 피드 */}
          <div className="completions-card" style={{ marginTop: '20px' }}>
            <div className="completions-header" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
              <Users size={16} />
              <h4>오늘 묵상을 완료한 지체들 ({completedUsers.length}명)</h4>
            </div>
            
            <div className="qt-share-list">
              {isLoading ? (
                <div className="loading-text">로딩 중...</div>
              ) : completedUsers.length === 0 ? (
                <div className="no-completions">가장 먼저 오늘의 말씀을 묵상해 보세요!</div>
              ) : (
                completedUsers.map((completion, idx) => (
                  <div key={idx} className="qt-share-card">
                    <div className="qt-share-header">
                      <div className="qt-share-avatar">
                        {completion.user_name.substring(0, 1)}
                      </div>
                      <span className="qt-share-name">{completion.user_name}</span>
                    </div>
                    {completion.content && (
                      <div className="qt-share-text">
                        {completion.content}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}