/* DuoLang curriculum — Beginner A1–A2 (weeks 1–4) */
window.DL = window.DL || {};
DL.raw = DL.raw || {};
DL.raw.beginner = (DL.raw.beginner || []).concat([
{
  id: "b1", no: 1, emoji: "👋", title: "인사와 자기소개", titleEn: "Greetings & Introductions", cefr: "A1",
  desc: "처음 만난 사람과 자연스럽게 인사하고 나를 소개해요.",
  goal: "이름·출신·직업을 담아 자기소개 3문장 말하기",
  vocab: [
    ["Hello, how are you?", "안녕하세요, 어떻게 지내세요?"],
    ["Nice to meet you.", "만나서 반가워요."],
    ["My name is Mina.", "제 이름은 미나예요."],
    ["I'm from Korea.", "저는 한국에서 왔어요."],
    ["What do you do?", "무슨 일을 하세요?"],
    ["I'm a student.", "저는 학생이에요."],
    ["This is my friend.", "이쪽은 제 친구예요."],
    ["See you tomorrow.", "내일 봐요."],
    ["How's it going?", "어떻게 지내?"],
    ["Long time no see.", "오랜만이에요."],
    ["Excuse me.", "실례합니다."],
    ["Have a nice day.", "좋은 하루 보내세요."]
  ],
  patterns: [
    ["Nice to meet you, too.", "저도 만나서 반가워요.", "too는 문장 끝에 붙여요."],
    ["Where are you from?", "어디에서 왔어요?", "be from + 도시/나라"],
    ["I live in Seoul.", "저는 서울에 살아요.", "live in + 장소"],
    ["I work at a small company.", "작은 회사에서 일해요.", "work at + 회사"],
    ["How do you spell your name?", "이름 철자가 어떻게 돼요?", "spell = 철자를 말하다"],
    ["It was nice talking to you.", "이야기 나눠서 즐거웠어요.", "헤어질 때 쓰는 인사"]
  ],
  dialogues: [
    { title: "First meeting", ko: "첫 만남", lines: [
      ["Alex", "Hi, I'm Alex. Nice to meet you.", "안녕, 나는 알렉스야. 만나서 반가워."],
      ["Mina", "Nice to meet you too. I'm Mina.", "저도 만나서 반가워요. 저는 미나예요."],
      ["Alex", "Where are you from, Mina?", "미나, 어디에서 왔어요?"],
      ["Mina", "I'm from Busan, but I live in Seoul now.", "부산에서 왔는데 지금은 서울에 살아요."],
      ["Alex", "Oh, I love Seoul. What do you do?", "서울 정말 좋죠. 무슨 일을 하세요?"],
      ["Mina", "I'm a graphic designer. How about you?", "그래픽 디자이너예요. 당신은요?"],
      ["Alex", "I'm a teacher. It was nice talking to you.", "저는 교사예요. 이야기 나눠서 즐거웠어요."]
    ]},
    { title: "Long time no see", ko: "오랜만에 만난 친구", lines: [
      ["Daniel", "Hey, long time no see!", "야, 진짜 오랜만이다!"],
      ["Jin", "Daniel! How's it going?", "다니엘! 어떻게 지내?"],
      ["Daniel", "Pretty good. How about you?", "꽤 좋아. 너는?"],
      ["Jin", "Not bad. Work is busy these days.", "나쁘지 않아. 요즘 일이 바빠."],
      ["Daniel", "Same here. Let's grab coffee sometime.", "나도 그래. 언제 커피 한잔하자."],
      ["Jin", "Sounds great. See you soon!", "좋아. 곧 봐!"]
    ]}
  ],
  lessons: [
    ["첫 만남의 인사", "Hello와 Nice to meet you로 자연스럽게 인사해요."],
    ["자기소개 문장 만들기", "이름, 출신, 직업을 말하는 문장을 연습해요."],
    ["첫 대화 따라잡기", "알렉스와 미나의 대화를 직접 완성해요."],
    ["귀로 익히는 인사", "듣고 받아쓰며 인사 표현을 몸에 익혀요."],
    ["실전: 처음 만난 사람", "새로운 사람과 6문장 대화를 이끌어 봐요."]
  ]
},
{
  id: "b2", no: 2, emoji: "⏰", title: "일상 루틴", titleEn: "Daily Routine", cefr: "A1",
  desc: "기상부터 취침까지, 내 하루를 영어로 설명해요.",
  goal: "내 아침 루틴을 5문장으로 말하기",
  vocab: [
    ["wake up at seven", "7시에 일어나요"],
    ["brush my teeth", "이를 닦아요"],
    ["have breakfast", "아침을 먹어요"],
    ["commute to work", "출근해요"],
    ["check emails", "이메일을 확인해요"],
    ["take a short break", "잠깐 쉬어요"],
    ["work out", "운동해요"],
    ["do the laundry", "빨래해요"],
    ["go to bed early", "일찍 자요"],
    ["set an alarm", "알람을 맞춰요"],
    ["stay up late", "늦게까지 깨어 있어요"],
    ["get ready", "준비해요"]
  ],
  patterns: [
    ["I usually wake up at seven.", "저는 보통 7시에 일어나요.", "usually = 보통"],
    ["I don't have time for breakfast.", "아침 먹을 시간이 없어요.", "don't have time for + 명사"],
    ["How long does it take to get to work?", "출근하는 데 얼마나 걸려요?", "It takes + 시간"],
    ["I'm too tired to cook tonight.", "오늘 밤은 너무 피곤해서 요리 못 해요.", "too + 형용사 + to"],
    ["I try to exercise three times a week.", "일주일에 세 번 운동하려고 해요.", "three times a week = 주 3회"],
    ["What time do you usually get up?", "보통 몇 시에 일어나요?", "get up = 일어나다"]
  ],
  dialogues: [
    { title: "Morning routine", ko: "아침 루틴", lines: [
      ["Emma", "What time do you usually wake up?", "보통 몇 시에 일어나?"],
      ["Jin", "Around seven. Then I walk my dog for twenty minutes.", "7시쯤. 그리고 20분 동안 강아지랑 산책해."],
      ["Emma", "Wow, that's early. Do you have breakfast?", "와, 일찍 일어나네. 아침은 먹어?"],
      ["Jin", "Just coffee and toast. I'm always in a hurry.", "그냥 커피랑 토스트. 항상 서둘러."],
      ["Emma", "I see. How do you get to work?", "그렇구나. 출근은 어떻게 해?"],
      ["Jin", "By subway. It takes about forty minutes.", "지하철로. 40분 정도 걸려."]
    ]},
    { title: "After work", ko: "퇴근 후", lines: [
      ["Emma", "You look tired. Rough day?", "피곤해 보여. 힘든 하루였어?"],
      ["Jin", "Yeah, I stayed up late last night.", "응, 어젯밤에 늦게까지 깨어 있었어."],
      ["Emma", "You should go to bed early tonight.", "오늘은 일찍 자는 게 좋겠다."],
      ["Jin", "I will. I just want to order something for dinner.", "그럴게. 그냥 저녁은 배달시키고 싶어."],
      ["Emma", "Good idea. Don't skip your workout tomorrow.", "좋은 생각이야. 내일 운동은 거르지 마."],
      ["Jin", "I'll try. See you.", "노력해 볼게. 봐."]
    ]}
  ],
  lessons: [
    ["하루를 여는 단어들", "기상부터 출근까지 아침 루틴 표현을 배워요."],
    ["빈도와 습관 말하기", "usually, always로 내 습관을 설명해요."],
    ["아침 대화 완성", "루틴을 묻고 답하는 대화를 연습해요."],
    ["듣기: 하루 일과", "일과를 듣고 핵심 정보를 잡아내요."],
    ["실전: 나의 하루 소개", "내 하루를 영어로 5문장 말해 봐요."]
  ]
},
{
  id: "b3", no: 3, emoji: "☕", title: "음식과 카페", titleEn: "Food & Café", cefr: "A1",
  desc: "주문하고, 추천받고, 계산하는 식당 영어를 익혀요.",
  goal: "카페에서 원하는 음료를 정확히 주문하기",
  vocab: [
    ["order a latte", "라테를 주문해요"],
    ["for here or to go", "매장에서 드세요, 포장이세요?"],
    ["a table for two", "두 명 자리"],
    ["the check, please", "계산서 주세요"],
    ["spicy", "매운"],
    ["medium rare", "미디엄 레어"],
    ["refill", "리필"],
    ["be allergic to", "~에 알레르기가 있어요"],
    ["recommend", "추천해요"],
    ["delicious", "맛있는"],
    ["split the bill", "각자 계산해요"],
    ["I'd like", "~을 주세요"]
  ],
  patterns: [
    ["Can I get a large iced americano?", "큰 아이스 아메리카노 하나 주세요.", "Can I get + 명사"],
    ["Could we have the menu, please?", "메뉴판 좀 주시겠어요?", "Could we + 동사원형"],
    ["I'm allergic to nuts.", "저는 견과류 알레르기가 있어요.", "be allergic to + 명사"],
    ["How spicy is this dish?", "이 음식은 얼마나 매워요?", "How + 형용사"],
    ["Let's split the bill.", "각자 계산해요.", "split = 나누다"],
    ["It's on me.", "제가 낼게요.", "친한 사이에서 쓰는 표현"]
  ],
  dialogues: [
    { title: "At the café", ko: "카페에서", lines: [
      ["Staff", "Hi, what can I get for you?", "안녕하세요, 뭐 드릴까요?"],
      ["Sora", "Can I get a large iced latte, please?", "큰 아이스 라테 하나 주세요."],
      ["Staff", "Sure. Would you like it for here or to go?", "네. 매장에서 드시나요, 포장인가요?"],
      ["Sora", "To go, please. And could I have a blueberry muffin?", "포장이요. 그리고 블루베리 머핀도 주시겠어요?"],
      ["Staff", "Of course. That's eight dollars fifty.", "물론이죠. 8달러 50센트입니다."],
      ["Sora", "Here you go. Can I pay by card?", "여기요. 카드로 계산할 수 있나요?"]
    ]},
    { title: "At the restaurant", ko: "식당에서", lines: [
      ["Sora", "Do you have a table for two?", "두 명 자리 있나요?"],
      ["Staff", "Sure, right this way. Here's the menu.", "네, 이쪽으로 오세요. 메뉴판입니다."],
      ["Sora", "Thank you. What do you recommend?", "고마워요. 뭐 추천하세요?"],
      ["Staff", "The grilled salmon is very popular.", "구운 연어가 아주 인기예요."],
      ["Sora", "Is it spicy? I'm not good with spicy food.", "매워요? 저는 매운 음식을 잘 못 먹어요."],
      ["Staff", "Not at all. It comes with a lemon butter sauce.", "전혀 안 매워요. 레몬 버터 소스와 함께 나옵니다."],
      ["Sora", "Perfect. I'll have that. And we'd like to split the bill.", "좋네요. 그걸로 할게요. 그리고 각자 계산할게요."]
    ]}
  ],
  lessons: [
    ["카페에서 쓰는 말", "주문하고 결제하는 기본 표현을 익혀요."],
    ["정중하게 부탁하기", "Could I, I'd like로 공손하게 말해요."],
    ["레스토랑 대화", "예약부터 계산까지 식당 대화를 연습해요."],
    ["듣기: 주문 받아쓰기", "주문 문장을 듣고 정확히 받아써요."],
    ["실전: 카페에서 주문", "실제 상황처럼 주문을 완성해요."]
  ]
},
{
  id: "b4", no: 4, emoji: "🧭", title: "길 찾기와 교통", titleEn: "Directions & Transport", cefr: "A1–A2",
  desc: "낯선 도시에서 길을 묻고 목적지까지 찾아가요.",
  goal: "호텔에서 박물관까지 길을 설명하기",
  vocab: [
    ["turn left", "왼쪽으로 도세요"],
    ["go straight", "쭉 가세요"],
    ["take the subway", "지하철을 타요"],
    ["transfer", "환승해요"],
    ["platform", "승강장"],
    ["next stop", "다음 역"],
    ["get off", "내려요"],
    ["across from", "~ 건너편에"],
    ["around the corner", "모퉁이를 돌면"],
    ["ticket", "표"],
    ["fare", "요금"],
    ["exit", "출구"]
  ],
  patterns: [
    ["How do I get to the station?", "역에 어떻게 가나요?", "get to + 장소"],
    ["It's a five-minute walk from here.", "여기서 걸어서 5분 거리예요.", "five-minute walk = 도보 5분"],
    ["You need to transfer at City Hall.", "시청역에서 환승해야 해요.", "transfer at + 역"],
    ["Which line goes to the airport?", "공항으로 가는 노선이 뭐예요?", "Which line = 어느 노선"],
    ["Is this seat taken?", "이 자리 주인 있나요?", "지하철·버스에서 자주 써요."],
    ["I missed my stop.", "지하철역을 지나쳤어요.", "miss = 놓치다"]
  ],
  dialogues: [
    { title: "Asking for directions", ko: "길 묻기", lines: [
      ["Tom", "Excuse me, how do I get to the National Museum?", "실례합니다, 국립박물관에 어떻게 가나요?"],
      ["Jin", "Go straight for two blocks, then turn left at the bank.", "두 블록 직진하고, 은행에서 왼쪽으로 도세요."],
      ["Tom", "Is it far from here?", "여기서 먼가요?"],
      ["Jin", "No, it's about a ten-minute walk.", "아니요, 걸어서 10분 정도예요."],
      ["Tom", "Great. Can I take a bus?", "좋네요. 버스를 타도 되나요?"],
      ["Jin", "Yes, the number 12 stops right in front of it.", "네, 12번 버스가 바로 앞에 서요."]
    ]},
    { title: "On the subway", ko: "지하철에서", lines: [
      ["Tom", "Which line goes to the airport?", "공항에 가는 노선이 뭐예요?"],
      ["Jin", "You need to take line 1 and transfer at Seoul Station.", "1호선을 타고 서울역에서 환승해야 해요."],
      ["Tom", "How many stops is that?", "몇 정거장이에요?"],
      ["Jin", "About five stops. The airport express is at platform four.", "다섯 정거장 정도요. 공항철도는 4번 승강장에 있어요."],
      ["Tom", "Thanks. Do I need a different ticket?", "고마워요. 다른 표가 필요한가요?"],
      ["Jin", "Yes, you can buy one at the machine over there.", "네, 저기 기계에서 살 수 있어요."]
    ]}
  ],
  lessons: [
    ["방향을 나타내는 말", "turn left, go straight로 길을 설명해요."],
    ["교통수단과 이동", "지하철, 버스, 환승 표현을 배워요."],
    ["길 묻고 답하기", "낯선 곳에서 길을 묻는 대화를 완성해요."],
    ["듣기: 안내 방송", "역 안내 문장을 듣고 위치를 파악해요."],
    ["실전: 목적지 찾기", "호텔에서 박물관까지 안내해 봐요."]
  ]
}
]);
