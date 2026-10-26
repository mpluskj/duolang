/* DuoLang — Situational Roleplay & Dialogue Scenarios */
window.DL = window.DL || {};

DL.situations = [
  {
    id: "sit-cafe",
    emoji: "☕",
    title: "카페에서 주문하기",
    titleEn: "Ordering at a Cafe",
    desc: "바리스타와 음료 사이즈, 옵션, 테이크아웃을 정하고 결제해요.",
    level: "A1",
    tag: "일상 / 여행",
    partner: { name: "Emily", role: "Barista", avatar: "👩‍🍳" },
    userRole: "손님",
    lines: [
      { speaker: "partner", en: "Hi! Welcome to Sunny Cafe. What can I get started for you today?", ko: "안녕하세요! 써니 카페에 오신 것을 환영해요. 무엇으로 준비해 드릴까요?" },
      { speaker: "user", en: "Can I get an iced Americano with an extra shot, please?", ko: "아이스 아메리카노에 샷 하나 추가해 주시겠어요?", hint: "Can I get an iced Americano..." },
      { speaker: "partner", en: "Sure thing! What size would you like for that?", ko: "그럼요! 사이즈는 어떤 것으로 하시겠어요?" },
      { speaker: "user", en: "A regular size would be great, thank you.", ko: "보통 사이즈로 부탁드려요, 감사합니다.", hint: "A regular size would be great..." },
      { speaker: "partner", en: "For here or to go?", ko: "여기서 드시나요, 포장이신가요?" },
      { speaker: "user", en: "To go, please. And could you make it less sweet?", ko: "포장해 주세요. 그리고 덜 달게 해 주실 수 있나요?", hint: "To go, please. And could you..." },
      { speaker: "partner", en: "You got it! That will be four dollars and fifty cents.", ko: "알겠습니다! 4달러 50센트입니다." }
    ]
  },
  {
    id: "sit-airport",
    emoji: "✈️",
    title: "공항 입국심사",
    titleEn: "Airport Immigration Check",
    desc: "입국 목적, 체류 기간, 숙소를 명확하게 영어로 답변해요.",
    level: "A2",
    tag: "여행 / 출입국",
    partner: { name: "Officer Davis", role: "Immigration Officer", avatar: "👮‍♂️" },
    userRole: "여행자",
    lines: [
      { speaker: "partner", en: "Next, please. Passport and arrival card, please.", ko: "다음 분 오세요. 여권과 입국신고서 보여주세요." },
      { speaker: "user", en: "Here you go, officer.", ko: "여기 있습니다, 심사관님.", hint: "Here you go, officer." },
      { speaker: "partner", en: "What is the primary purpose of your visit to the United States?", ko: "미국 방문의 주된 목적이 무엇인가요?" },
      { speaker: "user", en: "I am here for sightseeing and traveling with my friends.", ko: "친구들과 관광하고 여행하러 왔습니다.", hint: "I am here for sightseeing..." },
      { speaker: "partner", en: "How long are you planning to stay in the country?", ko: "미국에 얼마나 머무를 계획인가요?" },
      { speaker: "user", en: "I'll be staying for two weeks. Here is my return flight ticket.", ko: "2주 동안 머무를 예정입니다. 여기 귀국 항공권이 있어요.", hint: "I'll be staying for two weeks..." },
      { speaker: "partner", en: "Where will you be staying during your trip?", ko: "여행 기간 동안 어디에 머무르시나요?" },
      { speaker: "user", en: "I will be staying at the Hilton Hotel in Manhattan.", ko: "맨해튼에 있는 힐튼 호텔에 머물 예정입니다.", hint: "I will be staying at..." },
      { speaker: "partner", en: "Everything looks good. Enjoy your stay in New York!", ko: "모두 확인되었습니다. 뉴욕에서 좋은 시간 보내세요!" }
    ]
  },
  {
    id: "sit-hotel",
    emoji: "🏨",
    title: "호텔 체크인",
    titleEn: "Hotel Check-in & Requests",
    desc: "예약 확인, 고층 룸 요청, 조식 시간 안내를 물어봐요.",
    level: "B1",
    tag: "여행 / 숙박",
    partner: { name: "Sarah", role: "Front Desk", avatar: "👩‍💼" },
    userRole: "투숙객",
    lines: [
      { speaker: "partner", en: "Good afternoon! Welcome to the Grand Hotel. How may I assist you?", ko: "안녕하세요! 그랜드 호텔에 오신 것을 환영합니다. 무엇을 도와드릴까요?" },
      { speaker: "user", en: "Hi, I have a reservation under the name Min-jun Kim.", ko: "안녕하세요, 김민준 이름으로 예약했습니다.", hint: "Hi, I have a reservation under..." },
      { speaker: "partner", en: "Let me check... Yes, a deluxe king room for three nights. May I see your ID and credit card?", ko: "확인해 보겠습니다... 네, 디럭스 킹 룸 3박이네요. 신분증과 신용카드 확인 부탁드립니다." },
      { speaker: "user", en: "Here is my passport. Could I get a room on a higher floor?", ko: "여기 제 여권입니다. 혹시 고층 방으로 배정받을 수 있을까요?", hint: "Could I get a room on a higher floor?" },
      { speaker: "partner", en: "Certainly! I've assigned you room 1804 with a wonderful city view.", ko: "물론이죠! 멋진 도시 전망의 1804호로 배정해 드렸습니다." },
      { speaker: "user", en: "Thank you so much! What time is breakfast served in the morning?", ko: "정말 감사합니다! 아침 조식은 몇 시에 제공되나요?", hint: "What time is breakfast served..." },
      { speaker: "partner", en: "Breakfast is served from 7 to 10 AM on the second floor. Here are your key cards!", ko: "조식은 2층에서 오전 7시부터 10시까지 이용 가능합니다. 여기 카드 키입니다!" }
    ]
  },
  {
    id: "sit-restaurant",
    emoji: "🍽️",
    title: "식당 주문 & 계산",
    titleEn: "Dining & Getting the Bill",
    desc: "테이블 요청, 추천 메뉴 주문, 계산서 요청을 자연스럽게 해요.",
    level: "B1",
    tag: "미식 / 일상",
    partner: { name: "James", role: "Server", avatar: "🤵" },
    userRole: "손님",
    lines: [
      { speaker: "partner", en: "Good evening! Welcome. Do you have a reservation tonight?", ko: "좋은 저녁입니다! 오늘 밤 예약하셨나요?" },
      { speaker: "user", en: "No, we don't. Do you have a table for two available?", ko: "아니요, 예약은 안 했어요. 혹시 두 명 자리 있나요?", hint: "Do you have a table for two..." },
      { speaker: "partner", en: "Yes, right this way, please. Are you ready to order, or do you need a few more minutes?", ko: "네, 이쪽으로 오세요. 주문하시겠어요, 아니면 시간이 좀 더 필요하신가요?" },
      { speaker: "user", en: "What do you recommend as the house specialty?", ko: "이 집의 대표 메뉴로 무엇을 추천하시나요?", hint: "What do you recommend as..." },
      { speaker: "partner", en: "Our grilled salmon with lemon butter sauce is very popular tonight.", ko: "오늘 밤은 레몬 버터 소스를 곁들인 연어 구이가 아주 인기 있습니다." },
      { speaker: "user", en: "That sounds delicious! I will have the grilled salmon, please.", ko: "정말 맛있겠네요! 연어 구이로 부탁드려요.", hint: "I will have the grilled salmon, please." },
      { speaker: "partner", en: "Great choice! I'll put that order in right away.", ko: "훌륭한 선택이세요! 바로 주문 넣어 드리겠습니다." },
      { speaker: "user", en: "Excuse me, could we get the check, please?", ko: "실례합니다, 계산서 좀 가져다주시겠어요?", hint: "Excuse me, could we get the check..." }
    ]
  },
  {
    id: "sit-directions",
    emoji: "🗺️",
    title: "길 찾기 & 위치 묻기",
    titleEn: "Asking for Directions",
    desc: "길을 잃었을 때 지하철역 위치와 도보 소요 시간을 물어봐요.",
    level: "A1",
    tag: "여행 / 길찾기",
    partner: { name: "David", role: "Local Resident", avatar: "🚶‍♂️" },
    userRole: "여행자",
    lines: [
      { speaker: "user", en: "Excuse me, could you tell me how to get to the subway station?", ko: "실례합니다, 지하철역으로 어떻게 가는지 알려주실 수 있나요?", hint: "Excuse me, could you tell me how to get to..." },
      { speaker: "partner", en: "Sure! Walk straight down this street for two blocks and turn left at the bakery.", ko: "물론이죠! 이 길을 따라 두 블록 직진한 뒤 빵집에서 좌회전하세요." },
      { speaker: "user", en: "Turn left at the bakery, got it. Is it within walking distance?", ko: "빵집에서 좌회전이군요, 알겠습니다. 걸어갈 만한 거리인가요?", hint: "Is it within walking distance?" },
      { speaker: "partner", en: "Yes, it only takes about five to seven minutes on foot.", ko: "네, 걸어서 5분에서 7분 정도밖에 안 걸려요." },
      { speaker: "user", en: "Thank you for your help! Have a wonderful day.", ko: "도와주셔서 감사합니다! 좋은 하루 보내세요.", hint: "Thank you for your help..." },
      { speaker: "partner", en: "You're very welcome! Safe travels.", ko: "별말씀을요! 조심히 다니세요." }
    ]
  },
  {
    id: "sit-shopping",
    emoji: "🛍️",
    title: "쇼핑 & 피팅룸 이용",
    titleEn: "Shopping & Trying Clothes On",
    desc: "사이즈 문의, 옷 입어보기, 가격 및 할인 혜택을 확인해요.",
    level: "A2",
    tag: "쇼핑 / 패션",
    partner: { name: "Olivia", role: "Shop Assistant", avatar: "👩‍💼" },
    userRole: "손님",
    lines: [
      { speaker: "partner", en: "Hello! Are you looking for anything in particular today?", ko: "안녕하세요! 오늘 특별히 찾으시는 게 있으신가요?" },
      { speaker: "user", en: "Hi! I really like this jacket. Do you have this in a medium?", ko: "안녕하세요! 이 재킷이 마음에 드는데, 미디엄 사이즈 있나요?", hint: "Do you have this in a medium?" },
      { speaker: "partner", en: "Let me check the stock... Yes, here is a medium for you!", ko: "재고 확인해 볼게요... 네, 여기 미디엄 사이즈 있습니다!" },
      { speaker: "user", en: "Thank you! Can I try this on in the fitting room?", ko: "감사합니다! 피팅룸에서 입어봐도 될까요?", hint: "Can I try this on in the fitting room?" },
      { speaker: "partner", en: "Of course! The fitting rooms are right around the corner.", ko: "물론이죠! 피팅룸은 바로 저 모퉁이 돌면 있습니다." },
      { speaker: "user", en: "It fits perfectly! How much is this jacket?", ko: "딱 맞네요! 이 재킷 얼마인가요?", hint: "It fits perfectly! How much is..." },
      { speaker: "partner", en: "It's seventy dollars, and today we have a ten percent discount!", ko: "70달러인데, 오늘 10퍼센트 할인이 적용됩니다!" }
    ]
  }
];
