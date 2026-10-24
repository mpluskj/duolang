/* DuoLang curriculum — Intermediate B1–B2 (weeks 9–12) */
window.DL = window.DL || {};
DL.raw = DL.raw || {};
DL.raw.intermediate = (DL.raw.intermediate || []).concat([
{
  id: "i1", no: 1, emoji: "💼", title: "직장과 업무", titleEn: "Work & Office", cefr: "B1",
  desc: "일정을 조율하고 업무를 부탁하는 직장 영어를 익혀요.",
  goal: "회의 일정을 바꾸고 진행 상황을 보고하기",
  vocab: [
    ["deadline", "마감 기한"],
    ["in charge of", "~을 담당하는"],
    ["follow up", "후속 조치하다"],
    ["work remotely", "재택근무하다"],
    ["schedule", "일정"],
    ["colleague", "동료"],
    ["client", "고객사"],
    ["update", "업데이트하다"],
    ["report", "보고서"],
    ["take on", "맡다"],
    ["behind schedule", "일정이 늦어진"],
    ["keep someone posted", "계속 알려 주다"]
  ],
  patterns: [
    ["Could you send me the updated file by Friday?", "금요일까지 업데이트된 파일을 보내 주실 수 있나요?", "by + 기한"],
    ["I've been working on the report all morning.", "아침 내내 보고서 작업을 했어요.", "have been -ing = 계속 ~해 왔어요"],
    ["Let's push the meeting to Thursday.", "회의를 목요일로 미뤄요.", "push to + 시간"],
    ["I'm in charge of the marketing team.", "제가 마케팅팀을 담당하고 있어요.", "in charge of + 명사"],
    ["We need to follow up with the client.", "고객사에 후속 연락을 해야 해요.", "follow up with + 사람"],
    ["I'll keep you posted.", "계속 상황을 알려 드릴게요.", "posted = 정보를 받은 상태"]
  ],
  dialogues: [
    { title: "Rescheduling a meeting", ko: "회의 일정 조정", lines: [
      ["Dana", "Do you have a minute? We need to talk about Thursday's meeting.", "잠깐 시간 있어요? 목요일 회의에 대해 이야기해야 해요."],
      ["Alex", "Sure. I'm in charge of the client presentation, but the file isn't ready.", "네. 제가 고객사 발표를 맡고 있는데 파일이 아직 준비가 안 됐어요."],
      ["Dana", "That's fine. Let's push the meeting to Friday.", "괜찮아요. 회의를 금요일로 미뤄요."],
      ["Alex", "Friday works. I'll send the updated file by Thursday evening.", "금요일 좋아요. 목요일 저녁까지 업데이트된 파일을 보낼게요."],
      ["Dana", "Perfect. Could you also follow up with the design team?", "완벽해요. 디자인팀에도 후속 연락해 주시겠어요?"],
      ["Alex", "Of course. I'll keep you posted.", "물론이죠. 계속 알려 드릴게요."]
    ]},
    { title: "Project update", ko: "업무 보고", lines: [
      ["Dana", "How's the new project going?", "새 프로젝트는 어떻게 진행되고 있어요?"],
      ["Alex", "We're a little behind schedule, but we're catching up.", "일정이 조금 늦었지만 따라잡고 있어요."],
      ["Dana", "What's the biggest issue?", "가장 큰 문제는 뭐예요?"],
      ["Alex", "We're waiting for the data from the research team.", "리서치팀의 데이터를 기다리고 있어요."],
      ["Dana", "I'll ask them to send it today. Anything else?", "오늘 보내 달라고 할게요. 또 있나요?"],
      ["Alex", "We might need one more designer until the deadline.", "마감 전까지 디자이너 한 명이 더 필요할 수 있어요."]
    ]}
  ],
  lessons: [
    ["업무 핵심 단어", "회의, 마감, 담당 표현을 익혀요."],
    ["정중한 요청과 일정", "Could you...?로 업무를 부탁해요."],
    ["회의 일정 조정", "동료와 일정을 조율하는 대화를 해요."],
    ["듣기: 업무 보고", "보고 내용을 듣고 핵심을 잡아요."],
    ["실전: 프로젝트 미팅", "진행 상황을 설명하고 해결책을 논의해요."]
  ]
},
{
  id: "i2", no: 2, emoji: "🏃", title: "건강과 운동", titleEn: "Health & Fitness", cefr: "B1",
  desc: "증상을 설명하고, 생활 습관을 바꾸는 조언을 주고받아요.",
  goal: "병원에서 증상 설명하고 운동 계획 상담하기",
  vocab: [
    ["symptom", "증상"],
    ["prescription", "처방전"],
    ["sore throat", "인후통"],
    ["work out", "운동하다"],
    ["balanced diet", "균형 잡힌 식단"],
    ["injury", "부상"],
    ["stress", "스트레스"],
    ["check-up", "건강 검진"],
    ["recover", "회복하다"],
    ["get in shape", "몸매를 만들다"],
    ["cut down on", "~을 줄이다"],
    ["appointment", "예약, 진료 예약"]
  ],
  patterns: [
    ["I've had a headache since yesterday.", "어제부터 두통이 있어요.", "have had = 계속 ~이 있다"],
    ["I should cut down on coffee.", "커피를 줄여야겠어요.", "cut down on + 명사"],
    ["How often do you work out?", "얼마나 자주 운동하세요?", "How often = 빈도"],
    ["It hurts when I move my shoulder.", "어깨를 움직이면 아파요.", "It hurts when + 문장"],
    ["I'm trying to get in shape.", "몸을 만들려고 노력 중이에요.", "get in shape = 몸을 만들다"],
    ["You'd better see a doctor.", "병원에 가 보는 게 좋겠어요.", "You'd better + 동사원형"]
  ],
  dialogues: [
    { title: "At the clinic", ko: "병원에서", lines: [
      ["Doctor", "What brings you in today?", "오늘 어디가 불편해서 오셨나요?"],
      ["Jin", "I've had a sore throat and a headache since Monday.", "월요일부터 목이 아프고 두통이 있어요."],
      ["Doctor", "Do you have a fever?", "열은 있나요?"],
      ["Jin", "A little. It was 38 degrees last night.", "조금요. 어젯밤에 38도였어요."],
      ["Doctor", "I'll write you a prescription. Take it twice a day.", "처방전을 써 드릴게요. 하루 두 번 드세요."],
      ["Jin", "Should I stay home from work?", "회사에 가지 않고 집에 있어야 할까요?"],
      ["Doctor", "Yes, rest for two days and drink plenty of water.", "네, 이틀 쉬고 물을 많이 드세요."]
    ]},
    { title: "At the gym", ko: "헬스장에서", lines: [
      ["Jin", "Hi, I'd like to sign up for a membership.", "안녕하세요, 회원권에 가입하고 싶어요."],
      ["Trainer", "Great. Are you looking for personal training?", "좋아요. 퍼스널 트레이닝을 원하시나요?"],
      ["Jin", "Maybe. I want to get in shape, but I'm not sure where to start.", "아마도요. 몸을 만들고 싶은데 어디서 시작할지 모르겠어요."],
      ["Trainer", "We can give you a free check-up and a simple plan.", "무료 검사와 간단한 계획을 제공해 드릴 수 있어요."],
      ["Jin", "That sounds good. How often should I work out?", "좋네요. 얼마나 자주 운동해야 하나요?"],
      ["Trainer", "Three times a week is enough at first.", "처음에는 주 3회면 충분해요."]
    ]}
  ],
  lessons: [
    ["건강 증상 단어", "몸 상태와 병원 표현을 배워요."],
    ["조언과 습관", "should, cut down on으로 조언해요."],
    ["병원에서 진료", "증상을 설명하고 처방을 받아요."],
    ["듣기: 건강 상담", "상담 내용을 듣고 조언을 구분해요."],
    ["실전: 운동 계획 세우기", "운동 루틴을 영어로 상담해요."]
  ]
},
{
  id: "i3", no: 3, emoji: "💬", title: "감정과 의견", titleEn: "Feelings & Opinions", cefr: "B1",
  desc: "미묘한 감정을 표현하고, 의견 차이를 부드럽게 좁혀요.",
  goal: "걱정을 표현하고 대안을 제안하기",
  vocab: [
    ["frustrated", "답답한"],
    ["relieved", "안도한"],
    ["anxious", "불안한"],
    ["appreciate", "고마워하다"],
    ["to be honest", "솔직히 말하면"],
    ["in my opinion", "내 생각에는"],
    ["it depends", "상황에 따라 달라요"],
    ["concerned", "걱정스러운"],
    ["disappointed", "실망한"],
    ["thrilled", "아주 기쁜"],
    ["awkward", "어색한"],
    ["have a point", "일리가 있다"]
  ],
  patterns: [
    ["I'm a bit worried about the presentation.", "발표가 조금 걱정돼요.", "be worried about + 명사"],
    ["To be honest, I don't think it's a good idea.", "솔직히 좋은 생각인 것 같지 않아요.", "To be honest = 솔직히"],
    ["I'd rather stay home tonight.", "오늘 밤은 집에 있는 게 낫겠어요.", "I'd rather + 동사원형"],
    ["It depends on the weather.", "날씨에 달려 있어요.", "depend on + 명사"],
    ["I really appreciate your help.", "도와주셔서 정말 감사해요.", "appreciate + 명사"],
    ["That's not exactly what I meant.", "그게 제가 말한 뜻은 아니에요.", "exactly = 정확히"]
  ],
  dialogues: [
    { title: "Checking in", ko: "고민 상담", lines: [
      ["Dana", "You seem quiet today. Is everything okay?", "오늘 조용해 보여요. 괜찮아요?"],
      ["Alex", "To be honest, I'm a bit worried about the presentation.", "솔직히 발표가 조금 걱정돼요."],
      ["Dana", "Why? You've prepared for weeks.", "왜요? 몇 주나 준비했잖아요."],
      ["Alex", "I know, but I get anxious in front of a big audience.", "알아요, 그런데 많은 사람 앞에서 불안해져요."],
      ["Dana", "That's normal. I'd rather present second, so you can go first.", "당연한 거예요. 저는 두 번째로 발표할게요, 먼저 하세요."],
      ["Alex", "Thanks. I really appreciate that.", "고마워요. 정말 감사해요."]
    ]},
    { title: "Disagreeing gently", ko: "의견 조율", lines: [
      ["Alex", "I don't think the new design works.", "새 디자인은 잘 맞지 않는 것 같아요."],
      ["Dana", "Why not? I thought it was much cleaner.", "왜요? 훨씬 깔끔하다고 생각했는데요."],
      ["Alex", "It's clean, but it feels a bit cold.", "깔끔하긴 한데 조금 차갑게 느껴져요."],
      ["Dana", "That's a valid point. Maybe we can add warmer colors.", "일리 있는 말이에요. 따뜻한 색을 더해 볼까요?"],
      ["Alex", "That's exactly what I meant.", "바로 그 뜻이었어요."],
      ["Dana", "Let's test both versions with users.", "두 버전을 사용자에게 테스트해 봐요."]
    ]}
  ],
  lessons: [
    ["감정을 나타내는 말", "worried, relieved, thrilled을 익혀요."],
    ["의견 말하기", "To be honest, I'd rather로 말해요."],
    ["고민 상담 대화", "친구의 고민을 듣고 공감해요."],
    ["듣기: 감정의 뉘앙스", "말투와 감정을 듣고 파악해요."],
    ["실전: 의견 조율", "디자인 의견 차이를 좁혀 봐요."]
  ]
},
{
  id: "i4", no: 4, emoji: "📅", title: "약속과 초대", titleEn: "Plans & Invitations", cefr: "B1",
  desc: "약속을 잡고, 늦고, 취소하고, 다시 잡는 상황을 연습해요.",
  goal: "정중하게 초대하고 거절하며 대안 제안하기",
  vocab: [
    ["make plans", "약속을 잡다"],
    ["run late", "늦어지다"],
    ["cancel", "취소하다"],
    ["reschedule", "일정을 변경하다"],
    ["grab dinner", "저녁을 간단히 먹다"],
    ["catch up", "밀린 이야기를 나누다"],
    ["RSVP", "참석 여부를 회신하다"],
    ["host", "주최하다"],
    ["turn down", "거절하다"],
    ["drop by", "잠깐 들르다"],
    ["at the last minute", "막판에"],
    ["flexible", "융통성 있는"]
  ],
  patterns: [
    ["Are you free this Saturday?", "이번 토요일에 시간 있어요?", "be free = 시간이 비다"],
    ["I'm running a little late, sorry.", "조금 늦어요, 미안해요.", "run late = 늦어지다"],
    ["Can we reschedule to next week?", "다음 주로 일정을 바꿀 수 있을까요?", "reschedule to + 시간"],
    ["I'd love to, but I already have plans.", "가고 싶지만 이미 약속이 있어요.", "정중한 거절"],
    ["Let's meet halfway.", "중간에서 만나요.", "halfway = 중간 지점"],
    ["Thanks for having me.", "초대해 주셔서 고마워요.", "초대받은 자리에서"]
  ],
  dialogues: [
    { title: "Making weekend plans", ko: "주말 약속 잡기", lines: [
      ["Jin", "Are you free this Saturday? I'd love to catch up.", "이번 토요일에 시간 있어? 이야기 좀 하고 싶어."],
      ["Sora", "I might be. I have a meeting in the morning.", "아마도. 아침에 회의가 있어."],
      ["Jin", "How about dinner around six?", "6시쯤 저녁 어때?"],
      ["Sora", "Six works. Can I bring my roommate?", "6시 좋아. 룸메이트 데려가도 돼?"],
      ["Jin", "Of course. Let's meet at the Italian place near the station.", "물론이지. 역 근처 이탈리안 식당에서 만나자."],
      ["Sora", "Perfect. Text me if anything changes.", "좋아. 변동 있으면 문자해."]
    ]},
    { title: "Declining an invitation", ko: "초대 거절하기", lines: [
      ["Sora", "We're having a small party on Friday. Can you come?", "금요일에 작은 파티를 해. 올 수 있어?"],
      ["Jin", "I'd love to, but I already have plans.", "가고 싶지만 이미 약속이 있어."],
      ["Sora", "That's a shame. It's been a while since we hung out.", "아쉽다. 우리 오랜만에 노는 건데."],
      ["Jin", "I know. Can we do something next week?", "그러게. 다음 주에 뭐 하자?"],
      ["Sora", "Sure. I'll send you a message.", "좋아. 문자할게."],
      ["Jin", "Thanks for inviting me anyway.", "그래도 초대해 줘서 고마워."]
    ]}
  ],
  lessons: [
    ["약속 관련 단어", "reschedule, cancel, RSVP를 익혀요."],
    ["초대하고 거절하기", "I'd love to, but으로 정중히 거절해요."],
    ["주말 약속 잡기", "친구와 시간과 장소를 정해요."],
    ["듣기: 음성 메시지", "약속 변경 메시지를 듣고 확인해요."],
    ["실전: 파티 초대", "초대하고 답하는 대화를 완성해요."]
  ]
}
]);
