/* DuoLang curriculum — Beginner A1–A2 (weeks 5–8) */
window.DL = window.DL || {};
DL.raw = DL.raw || {};
DL.raw.beginner = (DL.raw.beginner || []).concat([
{
  id: "b5", no: 5, emoji: "🛍️", title: "쇼핑과 가격", titleEn: "Shopping & Money", cefr: "A2",
  desc: "사이즈를 묻고, 입어 보고, 교환과 환불까지 해내요.",
  goal: "옷 가게에서 사이즈·가격·환불 요청하기",
  vocab: [
    ["try on", "입어 보다"],
    ["size", "사이즈"],
    ["refund", "환불"],
    ["exchange", "교환"],
    ["on sale", "할인 중인"],
    ["receipt", "영수증"],
    ["fitting room", "탈의실"],
    ["out of stock", "재고가 없는"],
    ["cash", "현금"],
    ["card", "카드"],
    ["expensive", "비싼"],
    ["bargain", "싼 물건, 특가"]
  ],
  patterns: [
    ["Do you have this in a medium?", "이거 미디엄 사이즈 있나요?", "in + 사이즈"],
    ["Can I try this on?", "이거 입어 봐도 되나요?", "try on + 옷"],
    ["It's too expensive for me.", "저한테는 너무 비싸요.", "too + 형용사 + for me"],
    ["Can I get a refund?", "환불받을 수 있나요?", "get a refund = 환불받다"],
    ["I'm just looking, thanks.", "그냥 구경하는 중이에요.", "점원에게 쓰는 표현"],
    ["How much is it altogether?", "전부 얼마예요?", "altogether = 모두 합쳐"]
  ],
  dialogues: [
    { title: "At the clothing store", ko: "옷 가게에서", lines: [
      ["Staff", "Hi, can I help you find something?", "안녕하세요, 찾으시는 게 있나요?"],
      ["Mina", "Yes, do you have this jacket in a medium?", "네, 이 재킷 미디엄 사이즈 있나요?"],
      ["Staff", "Let me check. Here you go. The fitting room is over there.", "확인해 볼게요. 여기 있습니다. 탈의실은 저쪽이에요."],
      ["Mina", "Thanks. It's a little tight. Do you have a large?", "고마워요. 조금 끼네요. 라지 있나요?"],
      ["Staff", "We're out of stock in black, but we have it in navy.", "검정은 재고가 없고, 남색은 있어요."],
      ["Mina", "That works. How much is it?", "그거면 돼요. 얼마예요?"]
    ]},
    { title: "Returning a shirt", ko: "셔츠 반품하기", lines: [
      ["Mina", "Hi, I'd like to return this shirt.", "안녕하세요, 이 셔츠 반품하고 싶어요."],
      ["Staff", "Sure, do you have the receipt?", "네, 영수증 있으세요?"],
      ["Mina", "Yes, here it is. It's the wrong size.", "네, 여기요. 사이즈가 안 맞아요."],
      ["Staff", "No problem. Would you like a refund or an exchange?", "괜찮습니다. 환불과 교환 중 어느 쪽으로 하시겠어요?"],
      ["Mina", "A refund, please.", "환불로 해 주세요."],
      ["Staff", "Okay. It will be back on your card in three days.", "알겠습니다. 3일 안에 카드로 환급됩니다."]
    ]}
  ],
  lessons: [
    ["쇼핑 기본 단어", "사이즈, 가격, 재고 표현을 익혀요."],
    ["사고 싶을 때", "Do you have...?로 물어보세요."],
    ["교환과 환불", "문제가 생겼을 때 정중히 요청해요."],
    ["듣기: 가격과 안내", "가격과 재고 안내를 듣고 답해요."],
    ["실전: 옷 가게에서", "입어 보고 계산하는 상황을 연습해요."]
  ]
},
{
  id: "b6", no: 6, emoji: "🎸", title: "취미와 여가", titleEn: "Hobbies & Free Time", cefr: "A2",
  desc: "좋아하는 것과 잘하는 것을 말하고 친구를 초대해요.",
  goal: "내 취미를 소개하고 주말 약속 잡기",
  vocab: [
    ["play the guitar", "기타를 쳐요"],
    ["go hiking", "등산해요"],
    ["watch dramas", "드라마를 봐요"],
    ["take photos", "사진을 찍어요"],
    ["join a club", "동아리에 가입해요"],
    ["be into", "~에 빠져 있어요"],
    ["once a week", "일주일에 한 번"],
    ["free time", "여가 시간"],
    ["be good at", "~을 잘해요"],
    ["be terrible at", "~을 정말 못해요"],
    ["look forward to", "~을 기대해요"],
    ["sound like fun", "재미있을 것 같아요"]
  ],
  patterns: [
    ["What do you do in your free time?", "여가 시간에 뭐 해요?", "free time = 여가 시간"],
    ["I'm into photography these days.", "요즘 사진에 빠져 있어요.", "these days = 요즘"],
    ["How often do you go hiking?", "등산은 얼마나 자주 가요?", "How often = 얼마나 자주"],
    ["I'm not very good at singing.", "저는 노래를 잘 못해요.", "be good at + 명사/동명사"],
    ["Do you want to join us?", "우리랑 같이할래요?", "join + 사람/모임"],
    ["That sounds like fun.", "재미있을 것 같아요.", "제안에 답할 때"]
  ],
  dialogues: [
    { title: "Talking about hobbies", ko: "취미 이야기", lines: [
      ["Emma", "What do you do in your free time?", "여가 시간에 뭐 해?"],
      ["Jin", "I'm into photography these days. I take photos on weekends.", "요즘 사진에 빠져 있어. 주말마다 사진 찍어."],
      ["Emma", "That sounds fun. How did you get started?", "재미있겠다. 어떻게 시작했어?"],
      ["Jin", "My sister gave me an old camera. Now I can't stop.", "누나가 오래된 카메라를 줬어. 이제 멈출 수가 없어."],
      ["Emma", "Do you want to join our photo walk on Saturday?", "토요일에 우리 사진 산책 같이할래?"],
      ["Jin", "I'd love to. What time does it start?", "좋아. 몇 시에 시작해?"]
    ]},
    { title: "Weekend plans", ko: "주말 계획", lines: [
      ["Jin", "Any plans for the weekend?", "주말에 계획 있어?"],
      ["Emma", "I'm going hiking with some friends. Want to come?", "친구들이랑 등산 갈 거야. 올래?"],
      ["Jin", "I'm not very good at hiking, but sure.", "등산은 잘 못하지만, 그래도 갈게."],
      ["Emma", "Don't worry. It's an easy trail.", "걱정 마. 쉬운 코스야."],
      ["Jin", "Should I bring anything?", "뭐 가져갈 게 있을까?"],
      ["Emma", "Just water and comfortable shoes.", "물이랑 편한 신발만."]
    ]}
  ],
  lessons: [
    ["취미를 말하는 단어", "be into, good at으로 취미를 표현해요."],
    ["빈도와 제안", "How often와 Do you want to를 연습해요."],
    ["주말 계획 대화", "친구를 초대하고 계획을 세워요."],
    ["듣기: 취미 인터뷰", "취미 인터뷰를 듣고 내용을 정리해요."],
    ["실전: 친구 초대하기", "주말 약속을 영어로 잡아 봐요."]
  ]
},
{
  id: "b7", no: 7, emoji: "🌤️", title: "날씨와 계절", titleEn: "Weather & Seasons", cefr: "A2",
  desc: "날씨로 대화를 열고, 예보에 맞춰 계획을 바꿔요.",
  goal: "오늘 날씨를 설명하고 약속 시간을 조정하기",
  vocab: [
    ["forecast", "일기예보"],
    ["humid", "습한"],
    ["freezing", "몹시 추운"],
    ["shower", "소나기"],
    ["sunny", "화창한"],
    ["thunderstorm", "천둥번개"],
    ["temperature", "기온"],
    ["season", "계절"],
    ["bring an umbrella", "우산을 가져가다"],
    ["dress warmly", "따뜻하게 입다"],
    ["perfect weather", "완벽한 날씨"],
    ["climate", "기후"]
  ],
  patterns: [
    ["It's going to rain this afternoon.", "오후에 비가 올 거예요.", "be going to = ~할 예정"],
    ["What's the weather like today?", "오늘 날씨 어때요?", "What's ... like?"],
    ["It's freezing outside.", "밖이 몹시 추워요.", "freezing = 얼어붙을 듯한"],
    ["You should bring an umbrella.", "우산을 가져가는 게 좋아요.", "should + 동사원형"],
    ["I love the fall in Korea.", "한국의 가을이 좋아요.", "fall = autumn"],
    ["It's warmer than yesterday.", "어제보다 따뜻해요.", "비교급 + than"]
  ],
  dialogues: [
    { title: "Weather small talk", ko: "날씨 잡담", lines: [
      ["Tom", "It's freezing today. Did you see the forecast?", "오늘 진짜 춥네. 일기예보 봤어?"],
      ["Sora", "Yes, it's going to snow tonight.", "응, 오늘 밤에 눈이 온대."],
      ["Tom", "Really? I didn't bring an umbrella.", "정말? 나 우산 안 가져왔는데."],
      ["Sora", "You'd better take the bus home.", "버스 타고 집에 가는 게 좋겠다."],
      ["Tom", "Good idea. I hope it's warmer tomorrow.", "좋은 생각이야. 내일은 따뜻하면 좋겠다."],
      ["Sora", "Me too. This is the coldest day of the year.", "나도. 올해 가장 추운 날이야."]
    ]},
    { title: "Changing plans", ko: "약속 조정", lines: [
      ["Sora", "What's the weather like in Busan?", "부산 날씨 어때?"],
      ["Tom", "It's sunny but really windy.", "화창한데 바람이 정말 세."],
      ["Sora", "Should we still meet at the beach?", "그래도 해변에서 만날까?"],
      ["Tom", "Let's meet at the café instead. It's too windy.", "대신 카페에서 만나자. 바람이 너무 세."],
      ["Sora", "Okay. See you at three.", "알겠어. 3시에 봐."],
      ["Tom", "Bring a jacket. It gets cold in the evening.", "재킷 챙겨. 저녁에는 추워져."]
    ]}
  ],
  lessons: [
    ["날씨 표현 모음", "sunny, humid, freezing을 익혀요."],
    ["예보와 조언", "It's going to와 should로 말해요."],
    ["날씨 잡담", "어색함을 깨는 날씨 대화를 연습해요."],
    ["듣기: 오늘의 예보", "예보를 듣고 옷차림을 정해요."],
    ["실전: 약속 조정", "날씨 때문에 계획을 바꿔 봐요."]
  ]
},
{
  id: "b8", no: 8, emoji: "✈️", title: "여행 준비", titleEn: "Travel Basics", cefr: "A2",
  desc: "공항 체크인부터 호텔 도착까지, 여행 첫날을 완성해요.",
  goal: "공항과 호텔에서 필요한 요청을 영어로 하기",
  vocab: [
    ["passport", "여권"],
    ["book a flight", "항공편을 예약해요"],
    ["check-in", "체크인"],
    ["luggage", "짐"],
    ["boarding pass", "탑승권"],
    ["window seat", "창가 자리"],
    ["delay", "지연"],
    ["customs", "세관"],
    ["travel insurance", "여행자 보험"],
    ["itinerary", "여행 일정"],
    ["souvenir", "기념품"],
    ["exchange rate", "환율"]
  ],
  patterns: [
    ["I'd like to book a flight to Tokyo.", "도쿄행 항공편을 예약하고 싶어요.", "I'd like to + 동사원형"],
    ["Is this flight delayed?", "이 항공편 지연됐나요?", "delay = 지연시키다"],
    ["Where is the baggage claim?", "수하물 찾는 곳이 어디예요?", "baggage claim = 수하물 수취대"],
    ["Can I have a window seat?", "창가 자리로 주시겠어요?", "Can I have + 명사"],
    ["How long are you staying?", "얼마나 머무르세요?", "How long = 얼마나 오래"],
    ["I'm here on vacation.", "휴가 차 왔어요.", "on vacation = 휴가 중"]
  ],
  dialogues: [
    { title: "Airport check-in", ko: "공항 체크인", lines: [
      ["Staff", "Good morning. May I see your passport?", "안녕하세요. 여권 보여 주시겠어요?"],
      ["Tom", "Here you are. I'd like a window seat, please.", "여기요. 창가 자리로 부탁드려요."],
      ["Staff", "Certainly. Are you checking any bags?", "물론입니다. 부치실 짐이 있나요?"],
      ["Tom", "Just one. Is the flight on time?", "하나요. 비행기 정시 출발인가요?"],
      ["Staff", "Yes, boarding starts at 10:30 at gate 12.", "네, 10시 30분에 12번 게이트에서 탑승합니다."],
      ["Tom", "Thank you. Where is the security check?", "고마워요. 보안 검색대는 어디예요?"]
    ]},
    { title: "Hotel check-in", ko: "호텔 체크인", lines: [
      ["Tom", "Hi, I have a reservation under Kim.", "안녕하세요, 김으로 예약했어요."],
      ["Staff", "Welcome. Could I see your ID, please?", "환영합니다. 신분증 보여 주시겠어요?"],
      ["Tom", "Sure. Is breakfast included?", "네. 조식이 포함되어 있나요?"],
      ["Staff", "Yes, from seven to ten on the second floor.", "네, 2층에서 7시부터 10시까지입니다."],
      ["Tom", "Great. What time is check-out?", "좋네요. 체크아웃은 몇 시예요?"],
      ["Staff", "Eleven. Enjoy your stay!", "11시입니다. 즐거운 숙박 되세요!"]
    ]}
  ],
  lessons: [
    ["공항 필수 단어", "체크인, 탑승권, 수하물을 배워요."],
    ["예약과 요청", "I'd like to로 예약하고 요청해요."],
    ["공항과 호텔 대화", "체크인 상황을 직접 연기해요."],
    ["듣기: 공항 안내", "탑승 안내를 듣고 정보를 찾아요."],
    ["실전: 여행 첫날", "공항에서 호텔까지 완성해요."]
  ]
}
]);
