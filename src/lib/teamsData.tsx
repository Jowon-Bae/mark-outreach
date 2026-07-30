import { Crown, TreeDeciduous, HeartHandshake, Activity, Video, Utensils, Baby, Sparkles, User, Paintbrush, Scissors, Shield, Music, Laugh } from 'lucide-react';

// 조직원 데이터 모델
export interface Member {
  name: string;
  role: string;
  phone: string;
}

export interface Team {
  teamName: string;
  description?: string;
  members: Member[];
  icon: any;
}

export interface MapLocation {
  name: string;
  description: string;
  naverUrl: string;
  kakaoUrl: string;
  tmapUrl: string;
}

// 예시 마가 공동체 조직도 데이터 (아웃리치 사역에 최적화)
export const INITIAL_TEAMS: Team[] = [

  {
    teamName: '총무단',
    description: '아웃리치의 전반적인 일정과 재정, 행정을 기획하고 총괄하며 전체 사역이 원활하게 진행되도록 돕는 팀입니다.',
    icon: Crown,
    members: [
      { name: '배주원', role: '담당 목사', phone: '010-9017-1848' },
      { name: '두진문', role: '담당 장로', phone: '010-4020-1389' },
      { name: '김민우', role: '총무', phone: '010-7557-1090' },
      { name: '신민재', role: '부총무', phone: '010-5292-5620' },
      { name: '선우진', role: '회계', phone: '010-8781-8806' },
    ]
  },

  {
    teamName: '로뎀팀',
    description: '지친 엘리야가 로뎀나무 아래에서 떡과 물을 통해 힘을 얻었듯이, 아웃리치 기간 동안 수고하는 우리 성도들이 힘을 얻을 수 있도록 음식을 제공하는 팀입니다.',
    icon: TreeDeciduous,
    members: [
      { name: '김석영', role: '팀장', phone: '010-0000-0000' },
      { name: '강정호', role: '팀원', phone: '010-8746-9531' },
      { name: '김동진', role: '팀원', phone: '010-3476-0888' },
      { name: '김소연', role: '팀원', phone: '010-0000-0000' },
      { name: '김원영', role: '팀원', phone: '010-3858-7160' },
      { name: '노경민', role: '팀원', phone: '010-0000-0000' },
      { name: '심경보', role: '팀원', phone: '010-0000-0000' },
      { name: '오지연', role: '팀원', phone: '010-0000-0000' },
      { name: '전민기', role: '팀원', phone: '010-3761-0004' },
      { name: '최문정', role: '팀원', phone: '010-0000-0000' },
      { name: '김인호', role: '팀원', phone: '010-5781-4427' },
      { name: '박소희', role: '팀원', phone: '010-3936-3656' },
      { name: '성민선', role: '팀원', phone: '010-7122-1090' }
    ]
  },

  {
    teamName: '전도팀',
    description: '지역 주민들에게 복음을 전하고 예수님의 사랑을 나누며 영혼 구원의 사명을 감당하는 팀입니다.',
    icon: HeartHandshake,
    members: [
      { name: '류남현', role: '팀장', phone: '010-9011-3270' },
      { name: '장영철', role: '팀원', phone: '010-5672-6271' },
      { name: '박형규', role: '팀원', phone: '010-8994-4430' },
      { name: '김순정', role: '팀원', phone: '010-3546-4430' },
      { name: '김상형', role: '팀원', phone: '010-7410-9185' },
      { name: '박성연', role: '팀원', phone: '010-7192-4213' },
      { name: '육양수', role: '팀원', phone: '010-9722-8972' },
      { name: '최애진', role: '팀원', phone: '010-4171-3391' },
      { name: '김신곤', role: '팀원', phone: '010-9058-7815' },
      { name: '고은정', role: '팀원', phone: '010-2711-7724' },
      { name: '김희준', role: '팀원', phone: '010-9208-7596' },
      { name: '김지은', role: '팀원', phone: '010-7101-4158' },
      { name: '임은주', role: '팀원', phone: '010-5048-7580' },
      { name: '이광숙', role: '팀원', phone: '010-4425-3270' },
      { name: '이용섭', role: '팀원', phone: '010-5298-3127' },
      { name: '김경록', role: '팀원', phone: '010-9521-0066' },
      { name: '정수현', role: '팀원', phone: '010-3758-1452' },
      { name: '이병주', role: '팀원', phone: '010-0000-0000' }
    ]
  },

  {
    teamName: '의료팀',
    description: '초대된 어르신들에게 비타민 주사와 보톡스를 제공하여 건강 회복을 돕는 팀입니다.',
    icon: Activity,
    members: [
      { name: '신재식', role: '팀장', phone: '010-7363-2610' },
      { name: '박진은', role: '팀원', phone: '010-9429-9340' },
      { name: '채양석', role: '팀원', phone: '010-3392-3297' },
      { name: '조은혜', role: '팀원', phone: '010-5017-6620' },
      { name: '신승주', role: '팀원', phone: '010-9956-9786' },
      { name: '한은정', role: '팀원', phone: '010-9870-3147' }
    ]
  },

  {
    teamName: '미디어팀',
    description: '아웃리치의 모든 은혜로운 순간을 사진과 영상으로 기록하며, 지역 어르신들을 위한 장수사진 촬영 사역도 함께 감당하는 팀입니다.',
    icon: Video,
    members: [
      { name: '허민', role: '팀장', phone: '010-8587-5221' },
      { name: '윤석민', role: '팀원', phone: '010-7370-9594' },
      { name: '이용건', role: '팀원', phone: '010-9100-3396' },
      { name: '서기열', role: '팀원', phone: '010-7155-3116' },
      { name: '한영원', role: '팀원', phone: '010-8538-0177' },
      { name: '김나리', role: '팀원', phone: '010-8543-6612' },
      { name: '한라온', role: '팀원', phone: '010-0000-0000' }
    ]
  },

  {
    teamName: '식사팀',
    description: '마을 잔치에 초대된 어르신들에게 맛있는 식사와 영양을 책임지고 섬기는 팀입니다.',
    icon: Utensils,
    members: [
      { name: '이지은', role: '팀원', phone: '010-7320-2081' },
      { name: '김산수', role: '팀원', phone: '010-3298-9089' },
      { name: '정진혜', role: '팀원', phone: '010-0000-0000' },
      { name: '강수은', role: '팀원', phone: '010-5187-7948' },
      { name: '두진문', role: '식사팀', phone: '010-4020-1389' },
      { name: '이석찬', role: '팀원', phone: '010-2539-5040' },
      { name: '이희승', role: '팀원', phone: '010-4263-5040' },
      { name: '김진한', role: '팀원', phone: '010-3138-3105' },
      { name: '최연진', role: '팀원', phone: '010-8681-0753' },
      { name: '김재연', role: '식사팀', phone: '010-0000-0000' },
      { name: '심지호', role: '팀원', phone: '010-2121-8182' },
      { name: '이민후', role: '팀원', phone: '010-9277-5502' },
      { name: '전승우', role: '팀원', phone: '010-5413-7799' },
      { name: '이현정', role: '팀원', phone: '010-6234-9512' },
      { name: '김연주', role: '팀원', phone: '010-8513-9860' },
      { name: '민정기', role: '팀원', phone: '010-0000-0000' },
      { name: '조민영', role: '팀원', phone: '010-0000-0000' },
      { name: '박순관', role: '팀원', phone: '010-2794-2017' },
      { name: '서지혜', role: '팀원', phone: '010-0000-0000' },
      { name: '하진수', role: '팀원', phone: '010-8919-4875' },
      { name: '황상수', role: '팀장', phone: '010-0000-0000' }
    ]
  },

  {
    teamName: '키즈케어팀',
    description: '아웃리치에 동행한 차세대 아이들을 사랑으로 돌보며, 재미있는 프로그램과 간식으로 아이들을 케어하는 팀입니다.',
    icon: Baby,
    members: [
      { name: '김태희', role: '팀원', phone: '010-4731-8340' },
      { name: '장한나', role: '팀원', phone: '010-0000-0000' },
      { name: '이정환', role: '팀원', phone: '010-0000-0000' },
      { name: '안승국', role: '팀원', phone: '010-8878-4920' },
      { name: '이혜수', role: '팀원', phone: '010-3669-9318' },
      { name: '박제윤', role: '팀장', phone: '010-5392-7838' },
      { name: '손성웅', role: '팀원', phone: '010-5967-3299' },
      { name: '김문선', role: '팀원', phone: '010-0000-0000' },
      { name: '강진규', role: '팀원', phone: '010-5152-0401' },
      { name: '김지현', role: '팀원', phone: '010-2778-5853' },
      { name: '김영민', role: '팀원', phone: '010-2718-4682' },
      { name: '문정은', role: '팀원', phone: '010-4702-8587' },
      { name: '노소영', role: '팀원', phone: '010-4818-4015' },
      { name: '박순호', role: '팀원', phone: '010-9996-4877' },
      { name: '조을원', role: '팀원', phone: '010-0000-0000' }
    ]
  },

  {
    teamName: '공연팀',
    description: '노래, 춤, 연주 등 다양한 문화 공연을 준비하여 어르신들에게 기쁨을 주고 사랑으로 섬기는 팀입니다.',
    icon: Sparkles,
    members: [
      { name: '최지은', role: '팀장', phone: '010-2210-9212' },
      { name: '박선민', role: '팀원', phone: '010-2774-3007' },
      { name: '이희선', role: '팀원', phone: '010-9096-1379' },
      { name: '서승원', role: '팀원', phone: '010-8821-6900' },
      { name: '윤인희', role: '팀원', phone: '010-4469-0769' },
      { name: '김신혜', role: '팀원', phone: '010-4946-1991' },
      { name: '이미영', role: '팀원', phone: '010-3426-7902' },
      { name: '김지준', role: '팀원', phone: '010-2034-5155' },
      { name: '김민', role: '팀원', phone: '010-9154-9053' },
      { name: '유영삼', role: '팀원', phone: '010-7226-3546' },
      { name: '추인애', role: '팀원', phone: '010-8617-8105' },
      { name: '김지선', role: '팀원', phone: '010-5411-8448' },
      { name: '이승용', role: '팀원', phone: '010-2838-2147' },
      { name: '강원균', role: '팀원', phone: '010-0000-0000' }
    ]
  },

  {
    teamName: '발마사지팀',
    description: '지역 어르신들과 주민들의 지친 발을 정성껏 마사지해 드리며 예수님의 따뜻한 사랑과 섬김을 실천하는 팀입니다.',
    icon: User,
    members: [
      { name: '박성수', role: '팀원', phone: '010-7907-4845' },
      { name: '나경준', role: '팀원', phone: '010-2898-7599' },
      { name: '노지훈', role: '팀원', phone: '010-0000-0000' },
      { name: '오국환', role: '팀원', phone: '010-3521-2664' },
      { name: '이문석', role: '팀장', phone: '010-8465-1664' },
      { name: '박희정', role: '팀원', phone: '010-8399-1664' },
      { name: '이상연', role: '팀원', phone: '010-8768-2624' },
      { name: '이승호', role: '팀원', phone: '010-8641-3554' },
      { name: '박희주', role: '팀원', phone: '010-8546-3554' },
      { name: '최윤호', role: '팀원', phone: '010-9881-8119' },
      { name: '김규연', role: '팀원', phone: '010-8228-4938' },
      { name: '이재원', role: '팀원', phone: '010-9041-9142' },
      { name: '김유진', role: '팀원', phone: '010-9450-3632' },
      { name: '염귀화', role: '팀원', phone: '010-9592-3371' }
    ]
  },

  {
    teamName: '데코팀',
    description: '행사 장소와 예배당을 아름답게 꾸미고 데코레이션하여 성도들과 주민들이 은혜롭게 참여할 수 있도록 돕는 팀입니다.',
    icon: Paintbrush,
    members: [
      { name: '남아란', role: '팀원', phone: '010-7900-9531' },
      { name: '강나엘', role: '팀원', phone: '010-0000-0000' },
      { name: '김민혜', role: '팀원', phone: '010-7282-5677' },
      { name: '신유리', role: '팀원', phone: '010-4242-2946' },
      { name: '김지인', role: '팀원', phone: '010-6623-2033' },
      { name: '김지혜', role: '팀원', phone: '010-0000-0000' },
      { name: '김보화', role: '팀원', phone: '010-7353-4648' },
      { name: '박설희', role: '팀원', phone: '010-0000-0000' },
      { name: '안민균', role: '팀원', phone: '010-9273-5938' },
      { name: '김사무엘', role: '팀원', phone: '010-6367-8764' },
      { name: '이용준', role: '팀원', phone: '010-8496-5311' },
      { name: '김성희', role: '팀원', phone: '010-5248-7415' },
      { name: '송순옥', role: '팀원', phone: '010-0000-0000' },
      { name: '장윤경', role: '팀장', phone: '010-4477-4144' },
      { name: '현지혜', role: '팀원', phone: '010-9001-7028' },
      { name: '김선정', role: '팀원', phone: '010-3693-1323' },
      { name: '김아인', role: '팀원', phone: '010-0000-0000' },
      { name: '안지원', role: '팀원', phone: '010-2222-5988' }
    ]
  },

  {
    teamName: '이미용팀',
    description: '지역 어르신들과 주민들의 머리를 단정하고 아름답게 손질해 드리며 기쁨을 선물하는 팀입니다.',
    icon: Scissors,
    members: [
      { name: '김수아', role: '팀원', phone: '010-0000-0000' },
      { name: '송은지', role: '팀원', phone: '010-3808-9718' },
      { name: '김진경', role: '팀원', phone: '010-0000-0000' },
      { name: '심연옥', role: '팀원', phone: '010-7131-8833' },
      { name: '유숙희', role: '팀원', phone: '010-7123-6407' },
      { name: '노아윤', role: '팀원', phone: '010-0000-0000' },
      { name: '박하솜', role: '팀원', phone: '010-0000-0000' },
      { name: '박하랑', role: '팀원', phone: '010-0000-0000' },
      { name: '이혜인', role: '팀원', phone: '010-4948-3870' },
      { name: '신아민', role: '팀원', phone: '010-0000-0000' },
      { name: '이지영', role: '팀원', phone: '010-5260-2624' },
      { name: '구랑주', role: '팀원', phone: '010-3720-7336' },
      { name: '이현신', role: '팀장', phone: '010-9265-5747' },
      { name: '최혜남', role: '팀원', phone: '010-3035-6570' },
      { name: '장영송', role: '팀원', phone: '010-2303-1990' },
      { name: '최성은', role: '팀원', phone: '010-0000-0000' },
      { name: '이하은', role: '팀원', phone: '010-0000-0000' },
      { name: '태현영', role: '팀원', phone: '010-0000-0000' },
      { name: '송영선', role: '팀원', phone: '010-3765-8487' }
    ]
  },

  {
    teamName: '안내팀',
    description: '행사장 곳곳에서 밝은 미소로 성도와 주민들을 맞이하고 동선을 안내하며 친절하게 섬기는 팀입니다.',
    icon: Shield,
    members: [
      { name: '강나로', role: '팀원', phone: '010-0000-0000' },
      { name: '김은파', role: '팀원', phone: '010-0000-0000' },
      { name: '김도훈', role: '팀원', phone: '010-0000-0000' },
      { name: '김아론', role: '팀원', phone: '010-0000-0000' },
      { name: '김샤론', role: '팀원', phone: '010-0000-0000' },
      { name: '나지온', role: '팀원', phone: '010-0000-0000' },
      { name: '서지우', role: '팀원', phone: '010-0000-0000' },
      { name: '강로희', role: '팀원', phone: '010-0000-0000' },
      { name: '김주아', role: '팀원', phone: '010-0000-0000' },
      { name: '유상현', role: '팀장', phone: '010-0000-0000' },
      { name: '유상윤', role: '팀원', phone: '010-0000-0000' },
      { name: '민다연', role: '팀원', phone: '010-0000-0000' },
      { name: '송리안', role: '팀원', phone: '010-0000-0000' }
    ]
  },

  {
    teamName: '예배팀',
    icon: Music,
    members: [
      { name: '전승우', role: '팀장', phone: '010-5413-7799' },
      { name: '이지은', role: '예배팀', phone: '010-7320-2081' },
      { name: '김산수', role: '예배팀', phone: '010-3298-9089' },
      { name: '이현정', role: '예배팀', phone: '010-6234-9512' },
      { name: '신민재', role: '예배팀', phone: '010-5292-5620' }
    ]
  },

  {
    teamName: '레크레이션',
    icon: Laugh,
    members: [
      { name: '유영삼', role: 'MC유', phone: '010-7226-3546' }
    ]
  }
];

