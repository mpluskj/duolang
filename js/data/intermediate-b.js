/* DuoLang curriculum — Intermediate B1–B2 (weeks 13–16) */
window.DL = window.DL || {};
DL.raw = DL.raw || {};
DL.raw.intermediate = (DL.raw.intermediate || []).concat([
{
  id: "i5", no: 5, emoji: "🛠️", title: "문제 해결", titleEn: "Problems & Complaints", cefr: "B1–B2",
  desc: "배송, 환불, 고장 같은 문제를 침착하게 해결해요.",
  goal: "고객센터에 문제를 설명하고 해결책 얻기",
  vocab: [
    ["complain", "불만을 제기하다"],
    ["broken", "고장 난"],
    ["refund", "환불"],
    ["warranty", "품질 보증"],
    ["mistake", "실수, 착오"],
    ["solve", "해결하다"],
    ["apologize", "사과하다"],
    ["inconvenient", "불편한"],
    ["on hold", "통화 대기 중인"],
    ["customer service", "고객 서비스"],
    ["replace", "교체하다"],
    ["receipt", "영수증"]
  ],
  patterns: [
    ["My order hasn't arrived yet.", "주문한 물건이 아직 도착하지 않았어요.", "yet = 아직"],
    ["I'd like to file a complaint.", "불만을 제기하고 싶어요.", "file a complaint = 불만 접수"],
    ["There must be some mistake.", "뭔가 착오가 있는 것 같아요.", "must be = 틀림없이 ~이다"],
    ["We apologize for the inconvenience.", "불편을 드려 죄송합니다.", "격식 있는 사과"],
    ["Could you put me through to the manager?", "매니저에게 연결해 주시겠어요?", "put through = 연결하다"],
    ["Would you be able to replace it?", "교환해 주실 수 있나요?", "be able to = ~할 수 있다"]
  ],
  dialogues: [
    { title: "Where is my order?", ko: "배송 문의", lines: [
      ["Alex", "Hi, I'm calling about order number 4821.", "안녕하세요, 주문번호 4821 건으로 전화했어요."],
      ["Agent", "Let me check. What seems to be the problem?", "확인해 볼게요. 어떤 문제인가요?"],
      ["Alex", "My order hasn't arrived yet, and it's been two weeks.", "주문한 물건이 아직 안 왔고, 벌써 2주가 지났어요."],
      ["Agent", "I'm sorry about that. It looks like it was sent to the wrong address.", "죄송합니다. 잘못된 주소로 발송된 것 같아요."],
      ["Alex", "Can you send it again?", "다시 보내 주실 수 있나요?"],
      ["Agent", "Yes, we'll ship it today at no extra cost.", "네, 추가 비용 없이 오늘 발송하겠습니다."],
      ["Alex", "Thank you. Please make sure it comes this time.", "고마워요. 이번엔 꼭 도착하게 해 주세요."]
    ]},
    { title: "Asking for a refund", ko: "환불 요청", lines: [
      ["Alex", "I'd like to return this coffee machine. It doesn't work.", "이 커피 머신을 반품하고 싶어요. 작동하지 않아요."],
      ["Agent", "Did you keep the receipt?", "영수증 가지고 계신가요?"],
      ["Alex", "Yes, and the warranty is still valid.", "네, 그리고 보증 기간도 남아 있어요."],
      ["Agent", "We can replace it or give you a refund.", "교환하거나 환불해 드릴 수 있습니다."],
      ["Alex", "I'd prefer a refund, please.", "환불로 부탁드려요."],
      ["Agent", "No problem. We apologize for the inconvenience.", "문제없습니다. 불편을 드려 죄송합니다."]
    ]}
  ],
  lessons: [
    ["문제 상황 단어", "refund, broken, warranty를 배워요."],
    ["불만 제기 표현", "I'd like to file a complaint를 익혀요."],
    ["고객센터 통화", "배송 문제를 설명하고 해결해요."],
    ["듣기: 환불 안내", "환불 절차 안내를 듣고 이해해요."],
    ["실전: 환불 요청", "제품 문제를 설명하고 환불받아요."]
  ]
},
{
  id: "i6", no: 6, emoji: "📰", title: "뉴스와 사회", titleEn: "News & Society", cefr: "B2",
  desc: "뉴스 헤드라인을 읽고 사회 이슈에 의견을 말해요.",
  goal: "정책 뉴스에 대해 근거를 들어 의견 말하기",
  vocab: [
    ["headline", "헤드라인"],
    ["issue", "쟁점, 문제"],
    ["policy", "정책"],
    ["increase", "증가하다"],
    ["according to", "~에 따르면"],
    ["survey", "설문 조사"],
    ["affect", "영향을 주다"],
    ["debate", "논쟁"],
    ["majority", "다수"],
    ["economy", "경제"],
    ["environment", "환경"],
    ["public", "대중, 공공의"]
  ],
  patterns: [
    ["Did you hear about the new policy?", "새 정책에 대해 들었어요?", "hear about + 소식"],
    ["According to the survey, most people agree.", "설문 조사에 따르면 대부분 동의해요.", "According to + 출처"],
    ["It's a controversial issue in Korea.", "한국에서 논란이 되는 문제예요.", "controversial = 논란이 많은"],
    ["The prices have gone up a lot.", "물가가 많이 올랐어요.", "go up = 오르다"],
    ["I saw it on the news this morning.", "오늘 아침 뉴스에서 봤어요.", "on the news = 뉴스에서"],
    ["It could affect a lot of people.", "많은 사람에게 영향을 줄 수 있어요.", "could + 동사원형"]
  ],
  dialogues: [
    { title: "Talking about the news", ko: "뉴스 이야기", lines: [
      ["Dana", "Did you hear about the new housing policy?", "새 주거 정책에 대해 들었어요?"],
      ["Alex", "I saw the headline, but I didn't read the article.", "헤드라인은 봤는데 기사는 안 읽었어요."],
      ["Dana", "According to the survey, most people support it.", "설문에 따르면 대부분 지지한다고 해요."],
      ["Alex", "Really? I'm not sure it will help young people.", "정말요? 젊은 사람들에게 도움이 될지 모르겠어요."],
      ["Dana", "Why do you think that?", "왜 그렇게 생각해요?"],
      ["Alex", "The prices have gone up so much that small changes won't matter.", "물가가 너무 올라서 작은 변화로는 소용없을 거예요."]
    ]},
    { title: "Climate talk", ko: "환경 이야기", lines: [
      ["Dana", "Have you noticed how hot it's been this summer?", "올여름 얼마나 더운지 느꼈어요?"],
      ["Alex", "Yeah. It's the third heat wave this month.", "네. 이번 달 세 번째 폭염이에요."],
      ["Dana", "The news said it could affect the harvest.", "뉴스에서 수확에 영향을 줄 수 있다고 했어요."],
      ["Alex", "That's concerning. We need to take climate change seriously.", "걱정되네요. 기후 변화를 심각하게 받아들여야 해요."],
      ["Dana", "I agree. Even small habits can make a difference.", "동의해요. 작은 습관도 차이를 만들 수 있어요."],
      ["Alex", "True. I started taking the bus instead of driving.", "맞아요. 저는 운전 대신 버스를 타기 시작했어요."]
    ]}
  ],
  lessons: [
    ["뉴스 핵심 단어", "policy, survey, economy를 익혀요."],
    ["인용하고 비교하기", "According to로 정보를 전달해요."],
    ["뉴스 이야기 나누기", "정책 뉴스에 대한 의견을 나눠요."],
    ["듣기: 뉴스 클립", "뉴스 클립을 듣고 요지를 파악해요."],
    ["실전: 환경 토크", "기후 변화에 대해 의견을 말해요."]
  ]
},
{
  id: "i7", no: 7, emoji: "🏨", title: "여행 심화", titleEn: "Travel & Accommodation", cefr: "B2",
  desc: "현지인처럼 추천을 구하고, 숙소 문제도 해결해요.",
  goal: "숙박 연장·업그레이드를 요청하고 현지 추천 받기",
  vocab: [
    ["accommodation", "숙소"],
    ["local", "현지의"],
    ["reservation", "예약"],
    ["refundable", "환불 가능한"],
    ["check out", "체크아웃하다"],
    ["scenic", "경치 좋은"],
    ["off the beaten track", "덜 알려진"],
    ["itinerary", "여행 일정"],
    ["jet lag", "시차 피로"],
    ["upgrade", "업그레이드"],
    ["extend", "연장하다"],
    ["touristy", "관광객이 많은"]
  ],
  patterns: [
    ["Could you recommend a good local restaurant?", "현지 맛집을 추천해 주시겠어요?", "recommend + 명사"],
    ["I'd like to extend my stay by two nights.", "이틀 더 묵고 싶어요.", "extend by + 기간"],
    ["Is breakfast included?", "조식이 포함되어 있나요?", "be included = 포함되다"],
    ["We got upgraded to a bigger room.", "더 큰 방으로 업그레이드됐어요.", "get upgraded = 업그레이드받다"],
    ["I'm still jet-lagged.", "아직 시차 적응이 안 됐어요.", "jet-lagged = 시차 피로가 있는"],
    ["Let's avoid the touristy places.", "관광객이 많은 곳은 피해요.", "touristy = 관광지화된"]
  ],
  dialogues: [
    { title: "Local recommendations", ko: "현지 추천 받기", lines: [
      ["Tom", "Excuse me, could you recommend a good local restaurant?", "실례합니다, 현지 맛집을 추천해 주시겠어요?"],
      ["Local", "Sure. There's a small place around the corner. It's not touristy.", "물론이죠. 모퉁이에 작은 식당이 있어요. 관광객이 많은 곳은 아니에요."],
      ["Tom", "Sounds perfect. What should I order?", "완벽하네요. 뭘 주문해야 할까요?"],
      ["Local", "The seafood noodles are amazing. Ask for less spicy if you need.", "해산물 국수가 훌륭해요. 필요하면 덜 맵게 해 달라고 하세요."],
      ["Tom", "Great. Do they take cards?", "좋네요. 카드 받나요?"],
      ["Local", "I think so, but bring some cash just in case.", "아마도요, 그래도 혹시 모르니 현금을 조금 가져가세요."]
    ]},
    { title: "Extending a stay", ko: "숙박 연장", lines: [
      ["Tom", "Hi, I'd like to extend my stay by two nights.", "안녕하세요, 이틀 더 묵고 싶어요."],
      ["Staff", "Let me check availability. We have a room, but it's a different type.", "가능한지 확인해 볼게요. 방은 있는데 다른 타입이에요."],
      ["Tom", "That's fine. Is breakfast included?", "괜찮아요. 조식 포함인가요?"],
      ["Staff", "Yes. We can also upgrade you to a bigger room for the same price.", "네. 같은 가격으로 더 큰 방으로 업그레이드해 드릴 수도 있어요."],
      ["Tom", "Oh, thank you. What time is check-out?", "감사합니다. 체크아웃은 몇 시예요?"],
      ["Staff", "Eleven, but you can leave your bags here after that.", "11시인데, 그 이후에도 짐을 맡아 드릴 수 있어요."]
    ]}
  ],
  lessons: [
    ["숙소와 여행 단어", "accommodation, upgrade를 익혀요."],
    ["현지인처럼 묻기", "추천과 요청을 자연스럽게 해요."],
    ["호텔 연장 대화", "숙박 연장과 업그레이드를 요청해요."],
    ["듣기: 여행 팁", "현지 여행 팁을 듣고 메모해요."],
    ["실전: 여행 중 문제", "예약 변경과 문제 해결을 연습해요."]
  ]
},
{
  id: "i8", no: 8, emoji: "🤝", title: "관계와 소통", titleEn: "Relationships & Communication", cefr: "B2",
  desc: "오해를 풀고, 조언을 건네며, 관계를 건강하게 유지해요.",
  goal: "사과하고 화해하며 조언을 주고받기",
  vocab: [
    ["get along with", "~와 잘 지내다"],
    ["trust", "신뢰하다"],
    ["misunderstanding", "오해"],
    ["open-minded", "열린 마음의"],
    ["give advice", "조언하다"],
    ["argue", "다투다"],
    ["make up", "화해하다"],
    ["support", "지지하다"],
    ["respect", "존중하다"],
    ["honest", "솔직한"],
    ["keep in touch", "연락을 유지하다"],
    ["apologize", "사과하다"]
  ],
  patterns: [
    ["We've known each other for ten years.", "우리는 10년 동안 알고 지냈어요.", "for + 기간"],
    ["I think there's been a misunderstanding.", "오해가 있었던 것 같아요.", "there has been = ~이 있었다"],
    ["He's easy to talk to.", "그는 이야기하기 편한 사람이에요.", "easy to + 동사"],
    ["You should be honest with her.", "그녀에게 솔직해지는 게 좋겠어요.", "be honest with + 사람"],
    ["Let's talk it through.", "차분히 이야기해 봐요.", "talk through = 끝까지 논의하다"],
    ["I'm sorry I didn't listen.", "제가 귀 기울이지 않아서 미안해요.", "I'm sorry + 문장"]
  ],
  dialogues: [
    { title: "Clearing up a misunderstanding", ko: "오해 풀기", lines: [
      ["Sora", "Hey, are you upset with me?", "저기, 나한테 화났어?"],
      ["Jin", "A little. You didn't show up last night.", "조금. 어젯밤에 안 나왔잖아."],
      ["Sora", "I'm sorry. I thought we changed the time.", "미안해. 시간을 바꾼 줄 알았어."],
      ["Jin", "I waited for an hour. You could have texted me.", "한 시간을 기다렸어. 문자라도 할 수 있었잖아."],
      ["Sora", "You're right. There's been a misunderstanding, but it's my fault.", "네 말이 맞아. 오해가 있었지만 내 잘못이야."],
      ["Jin", "Okay. Just tell me next time.", "알았어. 다음엔 꼭 알려 줘."]
    ]},
    { title: "Asking for advice", ko: "조언 구하기", lines: [
      ["Jin", "I don't know how to talk to my brother.", "형이랑 어떻게 이야기해야 할지 모르겠어."],
      ["Sora", "What happened?", "무슨 일인데?"],
      ["Jin", "We argue every time we meet. He never listens.", "만날 때마다 싸워. 형은 절대 안 들어."],
      ["Sora", "Have you tried telling him how you feel?", "네 기분을 말해 본 적 있어?"],
      ["Jin", "Not really. I usually just get angry.", "별로. 보통 그냥 화만 내."],
      ["Sora", "Be honest but calm. It might help to write it down first.", "솔직하되 침착하게. 먼저 글로 써 보는 것도 도움이 될 거야."]
    ]}
  ],
  lessons: [
    ["관계 표현 단어", "trust, respect, misunderstanding을 배워요."],
    ["조언하고 공감하기", "You should와 I understand로 말해요."],
    ["오해 풀기 대화", "사과하고 화해하는 대화를 해요."],
    ["듣기: 친구의 고민", "고민을 듣고 조언을 골라요."],
    ["실전: 갈등 해결", "서운한 마음을 차분히 전해요."]
  ]
}
]);
