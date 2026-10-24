/* DuoLang curriculum — Advanced C1 (weeks 17–20) */
window.DL = window.DL || {};
DL.raw = DL.raw || {};
DL.raw.advanced = (DL.raw.advanced || []).concat([
{
  id: "a1", no: 1, emoji: "🤝", title: "협상과 설득", titleEn: "Negotiation", cefr: "C1",
  desc: "가격과 조건을 조율하며 모두가 만족하는 합의를 만들어요.",
  goal: "조건을 제시하고 양보하며 계약 확정하기",
  vocab: [
    ["negotiate", "협상하다"],
    ["compromise", "타협하다"],
    ["leverage", "협상력"],
    ["counteroffer", "반대 제안"],
    ["terms", "조건"],
    ["mutual", "상호의"],
    ["concession", "양보"],
    ["walk away", "협상을 깨다"],
    ["bottom line", "핵심 조건, 최저선"],
    ["finalize", "확정하다"],
    ["win-win", "윈윈"],
    ["budget", "예산"]
  ],
  patterns: [
    ["If we lower the price, can you increase the order?", "가격을 낮추면 주문량을 늘리실 수 있나요?", "If + 현재, can + 동사원형"],
    ["That's a bit above our budget.", "저희 예산보다 조금 높네요.", "above = ~보다 위에"],
    ["Let's meet in the middle.", "중간에서 맞춰요.", "meet in the middle = 절충하다"],
    ["We're willing to make a concession.", "저희는 양보할 의사가 있어요.", "be willing to = 기꺼이 ~하다"],
    ["What are your terms?", "조건이 어떻게 되나요?", "terms = 계약 조건"],
    ["I'm afraid that doesn't work for us.", "그건 저희에게 맞지 않는 것 같아요.", "I'm afraid = 유감이지만"]
  ],
  dialogues: [
    { title: "Price negotiation", ko: "가격 협상", lines: [
      ["Buyer", "Thanks for the proposal. We're interested, but the price is above our budget.", "제안서 감사합니다. 관심은 있는데 가격이 예산을 넘네요."],
      ["Seller", "I understand. What figure did you have in mind?", "이해합니다. 어느 정도를 생각하셨나요?"],
      ["Buyer", "We could sign today at 8,000 per unit.", "오늘 계약한다면 개당 8,000으로 할 수 있습니다."],
      ["Seller", "That's a bit low. If you increase the order to 2,000 units, we can meet you at 8,500.", "조금 낮네요. 주문을 2,000개로 늘리시면 8,500에 맞춰 드릴 수 있어요."],
      ["Buyer", "Let's meet in the middle: 1,500 units at 8,200.", "중간으로 합시다. 1,500개에 8,200이요."],
      ["Seller", "That works for us. I'll revise the terms and send them over.", "저희도 괜찮습니다. 조건을 수정해서 보내 드릴게요."]
    ]},
    { title: "Finalizing the deal", ko: "계약 확정", lines: [
      ["Buyer", "Before we finalize, can we talk about the payment schedule?", "확정하기 전에 결제 일정을 이야기할 수 있을까요?"],
      ["Seller", "Of course. We usually ask for 30 percent upfront.", "물론입니다. 보통 선금 30%를 요청합니다."],
      ["Buyer", "Would you consider 20 percent, with the rest on delivery?", "20%로 하고 나머지는 납품 시에 지불하는 건 어떨까요?"],
      ["Seller", "We're willing to make a concession if the deadline is firm.", "마감일이 확실하다면 양보할 의사가 있습니다."],
      ["Buyer", "It is. We need everything by the end of March.", "확실합니다. 3월 말까지 전부 필요해요."],
      ["Seller", "Then we have a deal.", "그럼 합의된 겁니다."]
    ]}
  ],
  lessons: [
    ["협상의 언어", "leverage, concession, win-win을 익혀요."],
    ["조건 제시와 양보", "If we..., we can... 구조를 연습해요."],
    ["가격 협상 대화", "예산과 조건을 조율하며 합의해요."],
    ["듣기: 계약 조건", "계약 조건을 듣고 핵심을 정리해요."],
    ["실전: 딜 클로징", "최종 조건을 확정하고 마무리해요."]
  ]
},
{
  id: "a2", no: 2, emoji: "🎤", title: "프레젠테이션", titleEn: "Presentations", cefr: "C1",
  desc: "핵심을 구조화해 말하고, 질문에 자신 있게 답해요.",
  goal: "3분 발표를 구성하고 Q&A에 답하기",
  vocab: [
    ["agenda", "발표 순서"],
    ["takeaway", "핵심 메시지"],
    ["highlight", "강조하다"],
    ["chart", "도표"],
    ["concise", "간결한"],
    ["audience", "청중"],
    ["transition", "전환"],
    ["emphasize", "강조하다"],
    ["compelling", "설득력 있는"],
    ["overview", "개요"],
    ["data-driven", "데이터 기반의"],
    ["walk someone through", "차근차근 설명하다"]
  ],
  patterns: [
    ["Today I'll walk you through three key points.", "오늘 세 가지 핵심을 차례로 설명드리겠습니다.", "walk through = 차근차근 설명하다"],
    ["Let me draw your attention to this chart.", "이 도표를 봐 주시기 바랍니다.", "draw attention to = 주목하게 하다"],
    ["To put it simply, we cut two steps.", "간단히 말해, 두 단계를 줄였습니다.", "put simply = 간단히 말하면"],
    ["That brings me to my next point.", "그러면 다음 요점으로 넘어가겠습니다.", "전환 표현"],
    ["Does anyone have any questions?", "질문 있으신가요?", "Q&A 시작"],
    ["To sum up, retention improved by 18 percent.", "요약하면 잔존율이 18% 올랐습니다.", "sum up = 요약하다"]
  ],
  dialogues: [
    { title: "Presentation opening", ko: "발표 시작", lines: [
      ["Presenter", "Good morning, everyone. Thanks for joining.", "좋은 아침입니다, 여러분. 참석해 주셔서 감사합니다."],
      ["Presenter", "Today I'll walk you through three key points: the problem, our approach, and the results.", "오늘 문제, 접근 방식, 결과 세 가지를 차례로 말씀드리겠습니다."],
      ["Colleague", "Could you start with the key takeaway?", "핵심 메시지부터 말씀해 주시겠어요?"],
      ["Presenter", "Sure. In short, retention improved by 18 percent.", "물론입니다. 간단히 말해 잔존율이 18% 올랐습니다."],
      ["Colleague", "That's impressive. What drove the change?", "인상적이네요. 무엇이 변화를 이끌었나요?"],
      ["Presenter", "We simplified the onboarding and cut two steps. Let me draw your attention to this chart.", "온보딩을 단순화하고 두 단계를 줄였습니다. 이 도표를 봐 주세요."]
    ]},
    { title: "Handling Q&A", ko: "질의응답", lines: [
      ["Presenter", "That concludes my presentation. Does anyone have any questions?", "이상으로 발표를 마칩니다. 질문 있으신가요?"],
      ["Colleague", "Yes, how did you measure retention?", "네, 잔존율은 어떻게 측정하셨나요?"],
      ["Presenter", "Good question. We tracked users who returned within seven days.", "좋은 질문입니다. 7일 이내에 다시 방문한 사용자를 추적했습니다."],
      ["Colleague", "And what was the biggest challenge?", "가장 큰 어려움은 무엇이었나요?"],
      ["Presenter", "Honestly, getting the team to agree on the metrics.", "솔직히 팀이 지표에 합의하게 하는 일이었습니다."],
      ["Colleague", "Thank you. That was very clear.", "감사합니다. 아주 명확했어요."]
    ]}
  ],
  lessons: [
    ["발표 구성 단어", "agenda, takeaway, highlight를 익혀요."],
    ["청중을 이끄는 문장", "전환과 강조 표현을 연습해요."],
    ["발표 시작과 질의응답", "발표를 열고 질문에 답해요."],
    ["듣기: 데이터 발표", "수치 발표를 듣고 핵심을 잡아요."],
    ["실전: 3분 발표", "내 프로젝트를 3분으로 소개해요."]
  ]
},
{
  id: "a3", no: 3, emoji: "🌏", title: "문화와 관용표현", titleEn: "Culture & Idioms", cefr: "C1",
  desc: "직역이 통하지 않는 표현과 문화적 뉘앙스를 익혀요.",
  goal: "관용표현 5개를 상황에 맞게 사용하기",
  vocab: [
    ["idiom", "관용표현"],
    ["small talk", "가벼운 잡담"],
    ["custom", "관습"],
    ["gesture", "몸짓"],
    ["taboo", "금기"],
    ["stereotype", "고정관념"],
    ["adapt", "적응하다"],
    ["polite", "예의 바른"],
    ["direct", "직설적인"],
    ["break the ice", "어색함을 깨다"],
    ["culture shock", "문화 충격"],
    ["play it by ear", "즉흥적으로 하다"]
  ],
  patterns: [
    ["It's easier said than done.", "말은 쉽지만 실행은 어려워요.", "속담처럼 쓰는 표현"],
    ["Let's play it by ear.", "그때그때 정해요.", "계획 없이 상황에 맞추다"],
    ["That's not my cup of tea.", "그건 제 취향이 아니에요.", "cup of tea = 취향"],
    ["You hit the nail on the head.", "정확히 맞혔어요.", "nail on the head = 핵심을 찌르다"],
    ["When in Rome, do as the Romans do.", "로마에서는 로마법을 따르세요.", "현지 관습을 따르라는 말"],
    ["I'm still getting used to the culture.", "아직 문화에 적응 중이에요.", "get used to + 명사"]
  ],
  dialogues: [
    { title: "Culture shock", ko: "문화 차이", lines: [
      ["Mina", "I'm still getting used to the way meetings work here.", "여기 회의 방식에 아직 적응 중이에요."],
      ["Alex", "What do you mean?", "무슨 뜻이에요?"],
      ["Mina", "In my country, we usually wait for the most senior person to speak.", "제 나라에서는 보통 가장 선배가 말할 때까지 기다려요."],
      ["Alex", "Ah, here it's more informal. People jump in whenever they have an idea.", "아, 여기서는 더 비격식적이에요. 생각나면 바로 말하죠."],
      ["Mina", "I noticed. It felt rude at first, but now I see it's just efficient.", "느꼈어요. 처음엔 무례하게 느껴졌는데 이제는 효율적이라는 걸 알겠어요."],
      ["Alex", "Exactly. When in Rome, do as the Romans do.", "맞아요. 로마에서는 로마법을 따르는 거죠."]
    ]},
    { title: "Idioms in action", ko: "관용표현 사용", lines: [
      ["Alex", "Are you coming to the karaoke night?", "노래방 갈래요?"],
      ["Mina", "Honestly, singing in front of people isn't my cup of tea.", "솔직히 사람들 앞에서 노래하는 건 제 취향이 아니에요."],
      ["Alex", "Come on, it's just for fun. You don't have to be good.", "왜 그래요, 그냥 재미로 하는 거예요. 잘할 필요 없어요."],
      ["Mina", "Maybe I'll just watch. I don't want to break the ice that way.", "그냥 구경할래요. 그런 식으로 어색함을 깨고 싶지는 않아요."],
      ["Alex", "Fair enough. Let's play it by ear.", "그럴 수 있죠. 그때그때 정해요."],
      ["Mina", "Sounds good. I'll decide when I get there.", "좋아요. 도착해서 결정할게요."]
    ]}
  ],
  lessons: [
    ["관용표현 첫걸음", "일상에서 자주 쓰는 idiom을 배워요."],
    ["문화 차이 이야기", "직접적 표현과 예의를 비교해요."],
    ["문화 충격 대화", "현지 문화에 적응하는 대화를 해요."],
    ["듣기: 관용표현 듣기", "관용표현을 듣고 의미를 추론해요."],
    ["실전: 관용표현 사용", "자연스럽게 관용표현을 써 봐요."]
  ]
},
{
  id: "a4", no: 4, emoji: "🧑‍💼", title: "커리어와 면접", titleEn: "Career & Interviews", cefr: "C1",
  desc: "성과를 수치로 말하고, 연봉과 조건을 협의해요.",
  goal: "영어 면접에서 강점을 사례로 설명하기",
  vocab: [
    ["résumé", "이력서"],
    ["strength", "강점"],
    ["weakness", "약점"],
    ["achievement", "성과"],
    ["candidate", "지원자"],
    ["promotion", "승진"],
    ["transferable skills", "전이 가능한 기술"],
    ["salary", "연봉"],
    ["notice period", "퇴사 통보 기간"],
    ["reference", "추천인"],
    ["onboarding", "온보딩, 적응 과정"],
    ["role", "직무"]
  ],
  patterns: [
    ["Could you tell me about yourself?", "자기소개를 해 주시겠어요?", "면접 첫 질문"],
    ["What would you say is your greatest strength?", "가장 큰 강점은 무엇이라고 생각하세요?", "What would you say = 어떻게 보세요"],
    ["I'm looking for a role where I can grow.", "성장할 수 있는 직무를 찾고 있어요.", "where I can + 동사"],
    ["I handled a similar challenge at my previous job.", "이전 직장에서 비슷한 문제를 처리했어요.", "handle = 처리하다"],
    ["What does the onboarding process look like?", "온보딩 과정은 어떻게 되나요?", "What does ... look like?"],
    ["Thank you for your time today.", "오늘 시간 내 주셔서 감사합니다.", "면접 마무리 인사"]
  ],
  dialogues: [
    { title: "Job interview", ko: "면접", lines: [
      ["Interviewer", "Thanks for coming in. Could you tell me about yourself?", "와 주셔서 감사합니다. 자기소개를 해 주시겠어요?"],
      ["Mina", "I've worked as a product manager for five years, mostly in fintech.", "5년 동안 주로 핀테크에서 프로덕트 매니저로 일했습니다."],
      ["Interviewer", "What would you say is your greatest strength?", "가장 큰 강점은 무엇이라고 생각하세요?"],
      ["Mina", "I'm good at turning vague problems into clear plans.", "모호한 문제를 명확한 계획으로 바꾸는 걸 잘합니다."],
      ["Interviewer", "Can you give me an example?", "예를 들어 주시겠어요?"],
      ["Mina", "At my last job, I led a team that cut onboarding time by half.", "이전 직장에서 온보딩 시간을 절반으로 줄인 팀을 이끌었습니다."],
      ["Interviewer", "Impressive. Why are you looking to leave?", "인상적이네요. 이직하려는 이유는 무엇인가요?"],
      ["Mina", "I'm looking for a role where I can grow internationally.", "국제적으로 성장할 수 있는 직무를 찾고 있습니다."]
    ]},
    { title: "Salary negotiation", ko: "연봉 협상", lines: [
      ["Interviewer", "We'd like to offer you the position.", "이 자리를 제안하고 싶습니다."],
      ["Mina", "Thank you. I'm excited. Could we discuss the salary?", "감사합니다. 기쁩니다. 연봉을 논의할 수 있을까요?"],
      ["Interviewer", "Of course. The offer is 55,000 per year.", "물론입니다. 연봉은 55,000입니다."],
      ["Mina", "Based on my experience, I was hoping for something closer to 62,000.", "제 경력에 비추어 62,000에 가까운 금액을 기대했습니다."],
      ["Interviewer", "That's above our range, but we could add a performance bonus.", "저희 범위를 넘지만 성과급을 추가할 수 있습니다."],
      ["Mina", "I appreciate that. Could we also review the title?", "감사합니다. 직책도 검토할 수 있을까요?"]
    ]}
  ],
  lessons: [
    ["커리어 핵심 단어", "strength, achievement, promotion을 익혀요."],
    ["강점을 증명하기", "경험을 수치로 설명하는 법을 배워요."],
    ["면접 실전 대화", "자기소개와 강점 질문에 답해요."],
    ["듣기: 면접 질문", "면접 질문을 듣고 의도를 파악해요."],
    ["실전: 연봉 협상", "제안에 답하고 조건을 협의해요."]
  ]
}
]);
