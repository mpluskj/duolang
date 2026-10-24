/* DuoLang curriculum — Advanced C1 (weeks 21–24) */
window.DL = window.DL || {};
DL.raw = DL.raw || {};
DL.raw.advanced = (DL.raw.advanced || []).concat([
{
  id: "a5", no: 5, emoji: "⚖️", title: "토론과 논리", titleEn: "Debate & Argument", cefr: "C1",
  desc: "주장과 근거를 구분하고, 반박하면서도 배려를 잃지 않아요.",
  goal: "근거를 들어 주장하고 반론에 응답하기",
  vocab: [
    ["claim", "주장"],
    ["evidence", "근거"],
    ["counterargument", "반론"],
    ["assumption", "전제"],
    ["bias", "편향"],
    ["consistent", "일관된"],
    ["valid", "타당한"],
    ["perspective", "관점"],
    ["on the other hand", "반면에"],
    ["draw a conclusion", "결론을 내리다"],
    ["nuance", "미묘한 차이"],
    ["refute", "반박하다"]
  ],
  patterns: [
    ["That's a valid point, but have you considered the cost?", "타당한 지적이지만 비용은 고려하셨나요?", "인정 + 반박"],
    ["The data suggests otherwise.", "데이터는 다른 쪽을 가리키고 있어요.", "suggest otherwise = 반대를 시사하다"],
    ["Let me play devil's advocate.", "반대 입장에서 말해 볼게요.", "devil's advocate = 반대 의견 제시자"],
    ["That argument doesn't hold up.", "그 주장은 설득력이 없어요.", "hold up = 견디다, 성립하다"],
    ["We seem to disagree on the premise.", "우리는 전제에 동의하지 않는 것 같아요.", "premise = 전제"],
    ["On the other hand, the sample was quite small.", "반면에 표본이 꽤 작았어요.", "on the other hand = 반면에"]
  ],
  dialogues: [
    { title: "Remote work debate", ko: "재택근무 토론", lines: [
      ["Alex", "I think remote work hurts creativity.", "재택근무는 창의성을 해친다고 생각해요."],
      ["Dana", "That's a valid point, but have you considered the commute time we save?", "타당한 지적이지만 우리가 아끼는 통근 시간은 고려하셨나요?"],
      ["Alex", "Sure, but informal conversations matter.", "물론이죠, 하지만 비공식적인 대화도 중요해요."],
      ["Dana", "I agree. Still, the data suggests productivity hasn't dropped.", "동의해요. 그래도 데이터는 생산성이 떨어지지 않았다고 보여 줘요."],
      ["Alex", "Productivity isn't the same as innovation.", "생산성은 혁신과 같지 않아요."],
      ["Dana", "Fair enough. Maybe the answer is a hybrid model.", "인정해요. 아마 답은 하이브리드 모델일 거예요."]
    ]},
    { title: "Playing devil's advocate", ko: "반론 제기", lines: [
      ["Dana", "If we raise prices, we'll lose customers.", "가격을 올리면 고객을 잃을 거예요."],
      ["Alex", "Let me play devil's advocate. What if we lose the least profitable ones?", "반대 입장에서 말해 볼게요. 수익성이 가장 낮은 고객을 잃으면 어떨까요?"],
      ["Dana", "That could happen, but our brand is built on affordability.", "그럴 수 있지만 우리 브랜드는 합리적인 가격이 기반이에요."],
      ["Alex", "That argument doesn't hold up if our costs keep rising.", "비용이 계속 오르면 그 주장은 성립하지 않아요."],
      ["Dana", "So what do you suggest?", "그럼 어떻게 하자는 거예요?"],
      ["Alex", "A smaller increase, with a clear explanation to customers.", "소폭 인상하고 고객에게 명확히 설명하는 거죠."]
    ]}
  ],
  lessons: [
    ["논리적 토론 단어", "claim, evidence, bias를 익혀요."],
    ["반박과 양보", "That's a valid point, but...을 연습해요."],
    ["찬반 토론 대화", "재택근무 논쟁을 펼쳐요."],
    ["듣기: 토론 클립", "토론의 주장과 근거를 구분해요."],
    ["실전: 나의 주장", "근거를 들어 의견을 설득해요."]
  ]
},
{
  id: "a6", no: 6, emoji: "📱", title: "미디어와 비판적 사고", titleEn: "Media Literacy", cefr: "C1",
  desc: "헤드라인 뒤의 의도를 읽고, 정보를 검증하는 습관을 만들어요.",
  goal: "의심 가는 기사를 검증하고 판단 근거 말하기",
  vocab: [
    ["source", "출처"],
    ["credible", "신뢰할 수 있는"],
    ["misleading", "오해를 부르는"],
    ["clickbait", "낚시성 콘텐츠"],
    ["fact-check", "사실을 검증하다"],
    ["headline", "헤드라인"],
    ["bias", "편향"],
    ["verify", "확인하다"],
    ["circulate", "유포되다"],
    ["misinformation", "허위 정보"],
    ["coverage", "보도"],
    ["editorial", "사설"]
  ],
  patterns: [
    ["Where did you get that information?", "그 정보 어디서 얻었어요?", "출처를 묻는 질문"],
    ["That headline is misleading.", "그 헤드라인은 오해를 부릅니다.", "misleading = 오해를 부르는"],
    ["Let's fact-check this before sharing it.", "공유하기 전에 사실을 확인해 봐요.", "fact-check = 팩트체크하다"],
    ["The article seems biased.", "그 기사는 편향된 것 같아요.", "seem + 형용사"],
    ["It's been circulating on social media.", "소셜 미디어에서 유포되고 있어요.", "circulate = 돌다, 유포되다"],
    ["We should look at multiple sources.", "여러 출처를 봐야 해요.", "multiple = 여러 개의"]
  ],
  dialogues: [
    { title: "Checking a viral article", ko: "가짜뉴스 확인", lines: [
      ["Jin", "Did you see this article? It says the new law bans all imports.", "이 기사 봤어요? 새 법이 모든 수입을 금지한다고 해요."],
      ["Mina", "Where did you get that? That headline is misleading.", "어디서 봤어요? 그 헤드라인은 오해를 불러요."],
      ["Jin", "It's been circulating on social media.", "소셜 미디어에서 유포되고 있어요."],
      ["Mina", "Let's fact-check it before sharing. The original source might be unreliable.", "공유하기 전에 확인해 봐요. 원 출처가 신뢰할 수 없을지도 몰라요."],
      ["Jin", "You're right. The article doesn't quote anyone.", "맞네요. 기사에 누구 인용도 없어요."],
      ["Mina", "Exactly. We should look at multiple sources.", "그렇죠. 여러 출처를 봐야 해요."]
    ]},
    { title: "Critiquing an editorial", ko: "기사 비판", lines: [
      ["Jin", "This editorial seems biased to me.", "이 사설은 제게 편향돼 보여요."],
      ["Mina", "What makes you say that?", "왜 그렇게 생각해요?"],
      ["Jin", "It only interviews people who agree with the writer.", "작성자와 같은 의견의 사람만 인터뷰했어요."],
      ["Mina", "Good point. But the data in the second half is well sourced.", "좋은 지적이에요. 하지만 후반부 데이터는 출처가 탄탄해요."],
      ["Jin", "True. I just wish they had included the other side.", "맞아요. 반대 측도 담았으면 좋겠어요."],
      ["Mina", "That's why I read two or three outlets.", "그래서 저는 두세 개 매체를 읽어요."]
    ]}
  ],
  lessons: [
    ["미디어 리터러시 단어", "credible, misleading, bias를 배워요."],
    ["출처 검증하기", "fact-check과 확인 질문을 익혀요."],
    ["가짜뉴스 대화", "의심 가는 기사를 함께 검증해요."],
    ["듣기: 뉴스 비판", "보도 내용을 듣고 편향을 찾아요."],
    ["실전: 팩트체크", "주장을 검증하고 결론을 내려요."]
  ]
},
{
  id: "a7", no: 7, emoji: "🕊️", title: "갈등 해결", titleEn: "Conflict Resolution", cefr: "C1",
  desc: "감정과 책임을 분리해, 관계를 지키면서 문제를 풀어요.",
  goal: "갈등을 중재하고 다음 단계에 합의하기",
  vocab: [
    ["escalate", "확대되다, 악화되다"],
    ["mediate", "중재하다"],
    ["de-escalate", "진정시키다"],
    ["empathy", "공감"],
    ["boundary", "경계"],
    ["accountability", "책임"],
    ["tension", "긴장"],
    ["resolve", "해결하다"],
    ["concede", "인정하다, 양보하다"],
    ["resent", "분개하다"],
    ["transparent", "투명한"],
    ["common ground", "공통점"]
  ],
  patterns: [
    ["I understand where you're coming from.", "무슨 말씀인지 이해해요.", "공감 표현"],
    ["Let's find some common ground.", "공통점을 찾아봐요.", "common ground = 공통 입장"],
    ["I'd like to address this before it escalates.", "확대되기 전에 이 문제를 다루고 싶어요.", "address = 다루다"],
    ["I take full responsibility.", "전적으로 제 책임입니다.", "take responsibility = 책임지다"],
    ["That crossed a line for me.", "그건 제 선을 넘었어요.", "cross a line = 선을 넘다"],
    ["Can we agree on the next steps?", "다음 단계에 합의할 수 있을까요?", "agree on + 안건"]
  ],
  dialogues: [
    { title: "Team tension", ko: "팀 갈등", lines: [
      ["Dana", "I'd like to address the tension in the team before it escalates.", "팀의 긴장이 커지기 전에 다루고 싶어요."],
      ["Alex", "I appreciate that. I've been feeling excluded from decisions.", "고마워요. 결정에서 소외된다고 느껴 왔어요."],
      ["Dana", "I understand where you're coming from. That wasn't intentional.", "무슨 말인지 알아요. 의도한 건 아니었어요."],
      ["Alex", "Maybe not, but it happened three times.", "아닐 수도 있지만 세 번이나 있었어요."],
      ["Dana", "You're right. I take full responsibility. Let's agree on how we share updates.", "맞아요. 전적으로 제 책임이에요. 업데이트 공유 방식을 합의해요."],
      ["Alex", "Okay. A short weekly message would help.", "좋아요. 짧은 주간 메시지가 도움이 될 거예요."]
    ]},
    { title: "A real apology", ko: "진심 어린 사과", lines: [
      ["Dana", "I'm sorry I snapped at you in the meeting.", "회의에서 짜증을 내서 미안해요."],
      ["Alex", "It caught me off guard, to be honest.", "솔직히 당황했어요."],
      ["Dana", "I was under a lot of pressure, but that's not an excuse.", "압박이 컸지만 변명이 될 수는 없죠."],
      ["Alex", "Thanks for saying that. It crossed a line for me.", "그렇게 말해 줘서 고마워요. 제 선을 넘긴 건 사실이에요."],
      ["Dana", "I know. I'll be more careful. Can we find some common ground on the deadline?", "알아요. 더 조심할게요. 마감일에서 공통점을 찾을 수 있을까요?"],
      ["Alex", "Yes. Let's talk about what's realistic.", "네. 현실적인 게 뭔지 이야기해 봐요."]
    ]}
  ],
  lessons: [
    ["갈등 해결 단어", "mediate, boundary, accountability를 익혀요."],
    ["공감과 책임", "I understand, I take responsibility를 연습해요."],
    ["팀 갈등 중재", "소외감 문제를 다루는 대화를 해요."],
    ["듣기: 사과의 기술", "사과와 합의의 흐름을 들어요."],
    ["실전: 합의 도출", "공통점을 찾아 다음 단계를 정해요."]
  ]
},
{
  id: "a8", no: 8, emoji: "🌱", title: "글로벌 이슈", titleEn: "Global Issues", cefr: "C1",
  desc: "기후, 기술, 불평등을 균형 있게 논하고 장기적 해법을 제시해요.",
  goal: "글로벌 이슈에 대해 양면을 고려한 의견 말하기",
  vocab: [
    ["sustainability", "지속 가능성"],
    ["inequality", "불평등"],
    ["emissions", "배출량"],
    ["artificial intelligence", "인공지능"],
    ["regulation", "규제"],
    ["globalization", "세계화"],
    ["resilience", "회복력"],
    ["initiative", "이니셔티브, 계획"],
    ["impact", "영향"],
    ["transition", "전환"],
    ["stakeholder", "이해관계자"],
    ["long-term", "장기적인"]
  ],
  patterns: [
    ["The transition won't happen overnight.", "전환은 하루아침에 일어나지 않아요.", "overnight = 하루아침에"],
    ["There are both risks and opportunities.", "위험과 기회가 모두 있어요.", "both A and B"],
    ["It's a matter of long-term sustainability.", "장기적 지속 가능성의 문제예요.", "a matter of = ~의 문제"],
    ["We need a coordinated global response.", "국제적 공조가 필요해요.", "coordinated = 조율된"],
    ["The impact varies from country to country.", "영향은 나라마다 달라요.", "vary from A to A"],
    ["Let's not lose sight of the bigger picture.", "큰 그림을 놓치지 맙시다.", "lose sight of = 놓치다"]
  ],
  dialogues: [
    { title: "Climate policy debate", ko: "기후 정책 토론", lines: [
      ["Dana", "Do you think the new emissions plan is realistic?", "새 배출 계획이 현실적이라고 생각해요?"],
      ["Alex", "There are both risks and opportunities. It won't happen overnight.", "위험과 기회가 모두 있어요. 하루아침에 되지는 않죠."],
      ["Dana", "Some industries say the transition will cost jobs.", "일부 산업은 전환이 일자리를 잃게 할 거라고 해요."],
      ["Alex", "That's true, but delaying it will cost more in the long run.", "맞지만 미루면 장기적으로 더 큰 비용이 들어요."],
      ["Dana", "We need a coordinated global response, not just local rules.", "지역 규제만이 아니라 국제적 공조가 필요해요."],
      ["Alex", "Agreed. The impact varies from country to country, though.", "동의해요. 다만 영향은 나라마다 달라요."]
    ]},
    { title: "Regulating AI", ko: "AI 규제 토론", lines: [
      ["Dana", "Should governments regulate artificial intelligence?", "정부가 인공지능을 규제해야 할까요?"],
      ["Alex", "I think some regulation is necessary, but it has to be flexible.", "어느 정도 규제는 필요하지만 유연해야 해요."],
      ["Dana", "What about innovation? Too many rules could slow it down.", "혁신은요? 규제가 많으면 느려질 수 있어요."],
      ["Alex", "Let's not lose sight of the bigger picture. Trust is part of innovation.", "큰 그림을 놓치지 맙시다. 신뢰도 혁신의 일부예요."],
      ["Dana", "So you'd start with transparency requirements?", "그럼 투명성 요구부터 시작하시겠네요?"],
      ["Alex", "Yes, and independent audits for high-risk systems.", "네, 그리고 고위험 시스템에 대한 독립적 감사도요."]
    ]}
  ],
  lessons: [
    ["글로벌 이슈 단어", "sustainability, regulation을 익혀요."],
    ["균형 있게 말하기", "on the one hand, however를 연습해요."],
    ["기후 정책 토론", "전환 비용과 기회를 논의해요."],
    ["듣기: AI 규제 토론", "규제 논쟁의 쟁점을 파악해요."],
    ["실전: 글로벌 토론", "장기적 관점에서 해법을 제시해요."]
  ]
}
]);
