/* DuoLang — course model */
window.DL = window.DL || {};

DL.levels = [
  {
    id: "beginner", name: "초급", cefr: "A1–A2", emoji: "🌱", color: "green",
    months: "1–2개월차", weeks: "1–8주", short: "생활 영어의 첫걸음",
    desc: "인사, 카페, 길 찾기처럼 매일 쓰는 표현을 짧은 문장으로 익혀요."
  },
  {
    id: "intermediate", name: "중급", cefr: "B1–B2", emoji: "🚀", color: "blue",
    months: "3–4개월차", weeks: "9–16주", short: "일상 대화를 내 것으로",
    desc: "업무, 건강, 감정, 문제 해결까지 — 내 생각을 길게 말하는 연습을 해요."
  },
  {
    id: "advanced", name: "고급", cefr: "C1", emoji: "🏆", color: "purple",
    months: "5–6개월차", weeks: "17–24주", short: "유창함과 설득의 기술",
    desc: "협상, 발표, 토론, 갈등 해결까지. 뉘앙스를 살려 설득하는 영어를 완성해요."
  }
];

DL.LEVEL_IDS = DL.levels.map(function (l) { return l.id; });
DL.FOCUS = ["vocab", "patterns", "dialogue", "listening", "mission"];
DL.FOCUS_LABEL = {
  vocab: "새 표현", patterns: "문장 만들기", dialogue: "대화",
  listening: "듣기", mission: "실전 미션"
};
DL.FOCUS_ICON = { vocab: "book", patterns: "build", dialogue: "chat", listening: "headphones", mission: "trophy" };

function normalizeLine(line) {
  return { who: line[0], en: line[1], ko: line[2] };
}

function normalizeUnit(level, u, levelOrder) {
  var unit = {
    id: u.id, level: level, no: u.no, emoji: u.emoji,
    title: u.title, titleEn: u.titleEn, cefr: u.cefr, desc: u.desc, goal: u.goal,
    vocab: u.vocab.map(function (v, i) {
      return { id: u.id + "-v" + i, en: v[0], ko: v[1], unitId: u.id, level: level };
    }),
    patterns: u.patterns.map(function (p, i) {
      return { id: u.id + "-p" + i, en: p[0], ko: p[1], note: p[2] || "", unitId: u.id };
    }),
    dialogues: u.dialogues.map(function (d, i) {
      return { id: u.id + "-d" + i, title: d.title, ko: d.ko, lines: d.lines.map(normalizeLine) };
    }),
    lessons: []
  };
  unit.lessons = u.lessons.map(function (l, i) {
    return {
      id: u.id + ".l" + (i + 1), unitId: u.id, unit: unit, level: level,
      index: i, focus: DL.FOCUS[i], title: l[0], desc: l[1],
      week: u.no, month: levelOrder * 2 + (u.no <= 4 ? 1 : 2),
      globalWeek: levelOrder * 8 + u.no
    };
  });
  return unit;
}

DL.curriculum = {};
DL.levelIndex = { beginner: 0, intermediate: 1, advanced: 2 };

DL.LEVEL_IDS.forEach(function (levelId, levelOrder) {
  var raw = (DL.raw && DL.raw[levelId]) || [];
  DL.curriculum[levelId] = raw.map(function (u) { return normalizeUnit(levelId, u, levelOrder); });
});

/* flat lookups */
DL.units = [];
DL.lessons = [];
DL.LEVEL_IDS.forEach(function (levelId) {
  DL.curriculum[levelId].forEach(function (unit) {
    DL.units.push(unit);
    unit.lessons.forEach(function (lesson) { DL.lessons.push(lesson); });
  });
});
DL.totalLessons = DL.lessons.length;
DL.lessonById = {};
DL.lessonOrder = {};
DL.unitById = {};
DL.units.forEach(function (u) { DL.unitById[u.id] = u; });
DL.lessons.forEach(function (l, i) { DL.lessonById[l.id] = l; DL.lessonOrder[l.id] = i; });

DL.levelLessons = function (levelId) {
  var out = [];
  (DL.curriculum[levelId] || []).forEach(function (u) { out = out.concat(u.lessons); });
  return out;
};
DL.levelInfo = function (levelId) {
  return DL.levels.filter(function (l) { return l.id === levelId; })[0] || DL.levels[0];
};
DL.unitOf = function (lesson) { return lesson.unit || DL.unitById[lesson.unitId]; };
DL.prevLesson = function (lesson) {
  var list = DL.levelLessons(lesson.level);
  var idx = list.indexOf(lesson);
  return idx > 0 ? list[idx - 1] : null;
};
DL.nextLessonInLevel = function (lesson) {
  var list = DL.levelLessons(lesson.level);
  var idx = list.indexOf(lesson);
  return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
};
DL.unitLessons = function (unitId) {
  var u = DL.unitById[unitId];
  return u ? u.lessons : [];
};

/* placement test */
DL.placement = [
  { q: "다음 문장의 뜻은?", sentence: "Nice to meet you.", options: ["만나서 반가워요.", "내일 봐요.", "얼마예요?", "어디에 있어요?"], answer: 0, tag: "기초 인사" },
  { q: "다음 문장의 뜻은?", sentence: "How much is this?", options: ["몇 시예요?", "이거 얼마예요?", "무슨 일을 하세요?", "어디에서 왔어요?"], answer: 1, tag: "쇼핑 표현" },
  { q: "다음 문장의 뜻은?", sentence: "I usually go to work by bus.", options: ["저는 보통 걸어서 퇴근해요.", "저는 오늘 버스를 놓쳤어요.", "저는 보통 버스로 출근해요.", "저는 지하철을 좋아해요."], answer: 2, tag: "습관 말하기" },
  { q: "다음 문장의 뜻은?", sentence: "Could you send me the file by Friday?", options: ["금요일에 회의를 취소할까요?", "금요일은 시간이 안 돼요.", "파일을 어디에 저장했나요?", "금요일까지 파일을 보내 주시겠어요?"], answer: 3, tag: "업무 요청" },
  { q: "다음 문장의 뜻은?", sentence: "I'd rather stay home tonight.", options: ["오늘 밤은 집에 있는 게 좋겠어요.", "오늘 밤은 밖에서 먹고 싶어요.", "어젯밤에 집에 늦게 들어갔어요.", "오늘 밤에 영화를 볼까요?"], answer: 0, tag: "의견 말하기" },
  { q: "다음 문장의 뜻은?", sentence: "It's easier said than done.", options: ["말보다 행동이 중요해요.", "말은 쉽지만 실행은 어려워요.", "쉬운 일부터 시작해요.", "그것은 제 취향이 아니에요."], answer: 1, tag: "관용표현" },
  { q: "다음 문장의 뜻은?", sentence: "We need to find some common ground.", options: ["우리는 결정을 미뤄야 해요.", "우리는 서로 연락을 끊었어요.", "우리는 공통점을 찾아야 해요.", "우리는 조건을 다시 협상해요."], answer: 2, tag: "갈등 해결" },
  { q: "다음 문장의 뜻은?", sentence: "That argument doesn't hold up.", options: ["그 가격은 예산을 넘어요.", "그 기사는 편향되어 있어요.", "그 계획은 하루아침에 이뤄져요.", "그 주장은 설득력이 없어요."], answer: 3, tag: "토론" },
  { q: "다음 문장의 뜻은?", sentence: "The transition won't happen overnight.", options: ["전환 비용은 예상보다 낮아요.", "국제적 공조가 이미 끝났어요.", "전환은 하루아침에 이뤄지지 않아요.", "영향은 모든 나라에서 같아요."], answer: 2, tag: "글로벌 이슈" }
];

DL.placementLevel = function (score) {
  if (score <= 3) return "beginner";
  if (score <= 6) return "intermediate";
  return "advanced";
};

/* free speaking prompts */
DL.speakingPrompts = {
  beginner: [
    { en: "Introduce yourself: name, city, and job.", ko: "이름, 사는 곳, 직업을 넣어 자기소개를 해 보세요.", hint: "My name is ___ and I live in ___. I'm a ___." },
    { en: "Describe your morning routine in three sentences.", ko: "아침 루틴을 세 문장으로 말해 보세요.", hint: "I usually wake up at ___. I have ___ for breakfast." },
    { en: "Order a coffee and ask how much it is.", ko: "커피를 주문하고 가격을 물어보세요.", hint: "Can I get ___, please? How much is it?" },
    { en: "Ask how to get to the nearest station.", ko: "가장 가까운 역까지 가는 길을 물어보세요.", hint: "Excuse me, how do I get to ___?" }
  ],
  intermediate: [
    { en: "Describe a problem you solved at work or school.", ko: "일이나 학교에서 해결한 문제를 설명해 보세요.", hint: "The biggest issue was ___. I decided to ___." },
    { en: "Invite a friend to dinner and suggest a time and place.", ko: "친구를 저녁에 초대하고 시간과 장소를 제안하세요.", hint: "Are you free ___? How about ___?" },
    { en: "Give advice to a friend who feels stressed.", ko: "스트레스를 받는 친구에게 조언해 보세요.", hint: "You should ___. Have you tried ___?" },
    { en: "Compare living in the city with living in the countryside.", ko: "도시 생활과 시골 생활을 비교해 보세요.", hint: "On the one hand, ___. On the other hand, ___." }
  ],
  advanced: [
    { en: "Present your idea in one minute with three key points.", ko: "세 가지 핵심으로 1분 발표를 해 보세요.", hint: "Today I'll walk you through ___. To sum up, ___." },
    { en: "Negotiate a deadline with your manager.", ko: "매니저와 마감일을 협상해 보세요.", hint: "If we ___, could we ___? I'm afraid ___." },
    { en: "Argue for and against remote work.", ko: "재택근무의 찬성과 반대를 모두 말해 보세요.", hint: "That's a valid point, but ___. On the other hand, ___." },
    { en: "Explain a global issue and propose a solution.", ko: "글로벌 이슈를 설명하고 해결책을 제안하세요.", hint: "The impact varies, but ___. We need a coordinated ___." }
  ]
};
