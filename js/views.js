/* DuoLang — screens */
window.DL = window.DL || {};

DL.esc = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

(function () {
  var PATHS = {
    flame: '<path d="M12 22c4.2 0 6.6-2.6 6.6-6.3 0-4-3.5-5.8-4-9.9-.1-1-1.4-1.3-2-.4-1 1.6-1.8 3.4-2 5.2-1-.6-1.7-1.6-2-2.7-.3-.9-1.5-1-2-.2-1.2 1.8-1.7 4.2-1.1 6.4C6.1 17.4 9 22 12 22z"/>',
    gem: '<path d="M6.5 3h11l3.3 6.2L12 21 3.2 9.2 6.5 3z"/><path d="M3.2 9.2h17.6M9 3l-1.4 6.2L12 21l4.4-11.8L15 3"/>',
    heart: '<path d="M12 21.2s-7.3-4.7-9.5-8.6C.6 9.4 2.3 5.6 6 5.6c2.1 0 3.5 1.2 4.2 2.4h3.6c.7-1.2 2.1-2.4 4.2-2.4 3.7 0 5.4 3.8 3.5 7-2.2 3.9-9.5 8.6-9.5 8.6z"/>',
    star: '<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9L12 2.6z"/>',
    home: '<path d="M3.8 11.4 12 4l8.2 7.4"/><path d="M5.8 10v10.2h12.4V10"/>',
    review: '<path d="M20.2 12a8.2 8.2 0 1 1-2.4-5.8"/><path d="M20.2 4.2v5h-5"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.7-4 3.8-6.2 7.5-6.2s6.8 2.2 7.5 6.2"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
    check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    speaker: '<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5M9 21.5h6"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M18.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19"/>',
    chat: '<path d="M4 5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-14z"/><path d="M8.5 8.5h7M8.5 11.5h4.5"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13.5" width="4" height="7" rx="2"/><rect x="17" y="13.5" width="4" height="7" rx="2"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4v2.5A3.5 3.5 0 0 0 7.5 12M17 6h3v2.5A3.5 3.5 0 0 1 16.5 12"/><path d="M12 14v4M8 21h8l-1-3H9l-1 3z"/>',
    build: '<rect x="3.5" y="4" width="7" height="7" rx="2"/><rect x="13.5" y="4" width="7" height="7" rx="2"/><rect x="3.5" y="14" width="7" height="6" rx="2"/><rect x="13.5" y="14" width="7" height="6" rx="2"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5v-15z"/>',
    arrow: '<path d="M9 4.5l7.5 7.5L9 19.5"/>',
    crown: '<path d="M3.5 8l4.2 3L12 4.5 16.3 11l4.2-3-1.6 10.5H5.1L3.5 8z"/><path d="M5.1 18.5h13.8"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.7 5.3 3.7 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.7-5.3-3.7-8.5S9.6 5.8 12 3.5z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.2 2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.1a2 2 0 1 1 4 0A1.7 1.7 0 0 0 16.9 5.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 0z"/>'
  };
  var FILLED = { flame: 1, gem: 1, heart: 1, star: 1 };

  DL.icon = function (name, cls) {
    var p = PATHS[name] || PATHS.sparkle;
    var filled = FILLED[name];
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" ' +
      (filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"') +
      ">" + p + "</svg>";
  };
})();

DL.views = (function () {
  var esc = DL.esc;
  var icon = DL.icon;

  function statChip(name, value, cls) {
    return '<span class="stat-chip ' + (cls || "") + '">' + icon(name) + "<span>" + value + "</span></span>";
  }

  function dueCount() { return DL.store.dueWords(99).length; }

  function rail() {
    var due = dueCount();
    var screen = DL.ui.screen;
    var lp = DL.store.levelProgress(DL.store.state.profile.level);
    return '<aside class="rail">' +
      '<div class="brand"><div class="brand-mark">D</div><div><div class="brand-name">Duo<span>Lang</span></div><div class="brand-tag">6개월 영어회화</div></div></div>' +
      '<nav class="nav-list" aria-label="주 메뉴">' +
      '<button class="nav-item ' + (screen === "home" || screen === "lesson" || screen === "result" ? "active" : "") + '" data-action="nav" data-screen="home">' + icon("home") + "학습</button>" +
      '<button class="nav-item ' + (screen === "practice" ? "active" : "") + '" data-action="nav" data-screen="practice">' + icon("review") + "복습" + (due ? '<span class="nav-badge">' + due + "</span>" : "") + "</button>" +
      '<button class="nav-item ' + (screen === "profile" ? "active" : "") + '" data-action="nav" data-screen="profile">' + icon("profile") + "프로필</button>" +
      "</nav>" +
      '<div class="rail-foot">' +
      '<div class="rail-card"><b>' + DL.store.state.profile.name + " · " + DL.levelInfo(DL.store.state.profile.level).name + "</b>" +
      "6개월 코스 " + lp.pct + "% 진행 중" +
      '<div class="bar" style="margin-top:8px;height:8px"><i style="width:' + lp.pct + '%"></i></div></div>' +
      '<div class="rail-card"><b>❤️ ' + (DL.store.state.settings.heartsOn ? DL.store.state.hearts + " / 5" : "무제한") + "</b>" + esc(DL.store.heartTimerText()) + "</div>" +
      "</div></aside>";
  }

  function statsStrip() {
    var s = DL.store.state;
    return '<div class="top-stats">' +
      statChip("flame", DL.store.streak().count, "flame") +
      statChip("gem", s.gems, "gem") +
      (s.settings.heartsOn ? statChip("heart", s.hearts, "heart") : statChip("heart", "∞", "muted")) +
      "</div>";
  }

  function mobileTop() {
    return '<header class="mobile-top">' +
      '<button class="brand" style="padding:0;gap:8px" data-action="nav" data-screen="home">' +
      '<div class="brand-mark" style="width:36px;height:36px;border-radius:11px;font-size:18px">D</div>' +
      '<div class="brand-name" style="font-size:19px">Duo<span>Lang</span></div></button>' +
      statsStrip() + "</header>";
  }

  function bottomNav() {
    var due = dueCount();
    var screen = DL.ui.screen;
    return '<nav class="bottom-nav" aria-label="하단 메뉴">' +
      '<button class="nav-item ' + (screen === "home" || screen === "lesson" || screen === "result" ? "active" : "") + '" data-action="nav" data-screen="home">' + icon("home") + "학습</button>" +
      '<button class="nav-item ' + (screen === "practice" ? "active" : "") + '" data-action="nav" data-screen="practice">' + icon("review") + "복습" + (due ? '<span class="nav-badge">' + due + "</span>" : "") + "</button>" +
      '<button class="nav-item ' + (screen === "profile" ? "active" : "") + '" data-action="nav" data-screen="profile">' + icon("profile") + "프로필</button>" +
      "</nav>";
  }

  function shell(content) {
    return '<div class="app-shell">' + rail() +
      '<main class="main"><div class="main-inner">' + mobileTop() + '<div class="screen">' + content + "</div></div></main>" +
      bottomNav() + "</div>";
  }

  /* ---------------- onboarding ---------------- */
  function welcome() {
    return '<div class="onboard-wrap"><div class="onboard">' +
      '<div class="onboard-brand"><div class="brand-mark">D</div>Duo<span style="color:var(--green)">Lang</span></div>' +
      "<h1>6개월이면,<br><span>영어로 대화</span>할 수 있어요</h1>" +
      '<p class="lead">매일 15분. 초급부터 고급까지<br>120개 레슨으로 듣고, 말하고, 직접 문장을 만들어요.</p>' +
      '<ul class="feature-list">' +
      '<li><span class="fi">🗓️</span>24주 커리큘럼 · 급수별 8개 유닛</li>' +
      '<li><span class="fi">🗣️</span>실제 상황 대화와 말하기 연습</li>' +
      '<li><span class="fi">🔁</span>망각 곡선에 맞춘 스마트 복습</li>' +
      '<li><span class="fi">🔥</span>연속 학습·XP·업적으로 매일 습관</li>' +
      "</ul>" +
      '<button class="btn primary wide big" data-action="onboard:start">시작하기</button>' +
      '<p class="tiny">홈 화면에 추가하면 앱처럼 열려요.<br>진행 상황은 이 기기에 자동 저장됩니다.</p>' +
      "</div></div>";
  }

  function goal() {
    return '<div class="onboard-wrap"><div class="onboard">' +
      '<div class="onboard-progress"><i class="on"></i><i></i><i></i></div>' +
      "<h2>하루에 얼마나<br>학습할까요?</h2>" +
      '<p class="sub">목표는 언제든 프로필에서 바꿀 수 있어요. 작게 시작해도 괜찮아요.</p>' +
      '<div class="goal-options">' +
      '<button class="goal-option" data-action="onboard:goal" data-xp="20"><span class="em">🌱</span><span><span class="nm">가볍게</span><span class="ds">하루 10분 · 레슨 2개</span></span><span class="xp">20 XP</span></button>' +
      '<button class="goal-option" data-action="onboard:goal" data-xp="40"><span class="em">🚀</span><span><span class="nm">꾸준하게</span><span class="ds">하루 20분 · 레슨 4개</span></span><span class="xp">40 XP</span></button>' +
      '<button class="goal-option" data-action="onboard:goal" data-xp="60"><span class="em">🔥</span><span><span class="nm">진하게</span><span class="ds">하루 30분 · 레슨 6개</span></span><span class="xp">60 XP</span></button>' +
      "</div>" +
      '<p class="tiny">1레슨은 약 4~6분이면 끝나요.</p>' +
      "</div></div>";
  }

  function levelPick() {
    var score = DL.ui.placement ? DL.ui.placement.score : null;
    var rec = DL.ui.onboard ? DL.ui.onboard.recommended : null;
    return '<div class="onboard-wrap"><div class="onboard">' +
      '<div class="onboard-progress"><i class="on"></i><i class="on"></i><i></i></div>' +
      "<h2>어디서 시작할까요?</h2>" +
      '<p class="sub">' + (rec ? "테스트 결과 <b>" + DL.levelInfo(rec).name + "</b>을 추천해요. 언제든 급수를 바꿀 수 있어요." : "지금 실력에 맞는 급수를 고르세요. 언제든 바꿀 수 있어요.") + "</p>" +
      '<div class="level-cards">' +
      DL.levels.map(function (l, i) {
        return '<button class="level-card ' + (l.color === "green" ? "" : l.color) + '" data-action="onboard:level" data-level="' + l.id + '">' +
          '<span class="badge">' + l.emoji + "</span>" +
          "<span><span class='nm'>" + l.name + " " + (rec === l.id ? "· 추천" : "") + "</span>" +
          "<span class='ds'>" + l.desc + "</span></span>" +
          '<span class="cefr">' + l.cefr + "</span></button>";
      }).join("") +
      "</div>" +
      '<div class="onboard-actions">' +
      '<button class="btn ghost wide" data-action="placement:start">🤔 잘 모르겠어요 · 레벨 테스트 (3분)</button>' +
      '<button class="btn soft wide" data-action="onboard:back">이전</button>' +
      "</div></div></div>";
  }

  function placement() {
    var p = DL.ui.placement || { idx: 0, score: 0, answered: false, selected: null };
    if (p.done) {
      var recommended = DL.placementLevel(p.score);
      var info = DL.levelInfo(recommended);
      return '<div class="onboard-wrap"><div class="onboard"><div class="quiz-wrap placement-result">' +
        '<div class="em">' + info.emoji + "</div>" +
        "<h2>" + info.name + "부터 시작하면 좋겠어요</h2>" +
        '<p class="score">9문제 중 ' + p.score + "문제 정답 · 추천 레벨 " + info.cefr + "</p>" +
        '<div class="unit-goal" style="justify-content:center;margin-top:16px">' + icon("target") + " " + info.desc + "</div>" +
        '<div class="onboard-actions">' +
        '<button class="btn primary wide big" data-action="onboard:level" data-level="' + recommended + '">' + info.name + "으로 시작하기</button>" +
        '<button class="btn ghost wide" data-action="placement:restart">다시 테스트하기</button>' +
        '<button class="btn soft wide" data-action="onboard:back">레벨 직접 고르기</button>' +
        "</div></div></div></div>";
    }
    var q = DL.placement[p.idx];
    return '<div class="onboard-wrap"><div class="onboard"><div class="quiz-wrap">' +
      '<div class="quiz-progress"><button class="icon-btn" data-action="placement:back" aria-label="이전">' + icon("arrow") + "</button>" +
      '<div class="bar"><i style="width:' + Math.round((p.idx + (p.answered ? 1 : 0)) / DL.placement.length * 100) + '%"></i></div>' +
      "<small>" + (p.idx + 1) + " / " + DL.placement.length + "</small></div>" +
      '<div class="quiz-card">' +
      '<div class="pill blue" style="margin-bottom:10px">' + esc(q.tag) + "</div>" +
      '<div class="quiz-q">' + esc(q.q) + "</div>" +
      '<div class="quiz-sentence">' + esc(q.sentence) + "</div>" +
      '<div class="options">' + q.options.map(function (o, i) {
        var cls = "";
        if (p.answered) {
          if (i === q.answer) cls = "correct";
          else if (i === p.selected) cls = "wrong";
        } else if (p.selected === i) cls = "selected";
        return '<button class="option ' + cls + '" data-action="placement:answer" data-i="' + i + '"' + (p.answered ? " disabled" : "") + ">" +
          '<span class="key">' + (i + 1) + "</span><span class='txt'>" + esc(o) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="quiz-foot">' +
      '<span class="tiny" style="margin:0;text-align:left">정답을 고르면 바로 다음 문제로 넘어갈 수 있어요.</span>' +
      (p.answered ? '<button class="btn primary" data-action="placement:next">' + (p.idx === DL.placement.length - 1 ? "결과 보기" : "다음") + "</button>" : "") +
      "</div></div></div></div></div>";
  }

  /* ---------------- home ---------------- */
  function goalCard() {
    var s = DL.store.state;
    var goal = s.profile.dailyGoalXp || 30;
    var xp = DL.store.todayXp();
    var pct = Math.min(100, Math.round(xp / goal * 100));
    var C = 2 * Math.PI * 26;
    var off = C * (1 - pct / 100);
    var week = DL.store.week();
    return '<div class="card dash-card">' +
      '<div class="card-title">' + icon("target") + " 오늘의 목표</div>" +
      '<div class="goal-row">' +
      '<svg class="ring" viewBox="0 0 64 64" role="img" aria-label="오늘 목표 ' + pct + '%">' +
      '<circle class="track" cx="32" cy="32" r="26" fill="none" stroke-width="7"/>' +
      '<circle class="prog" cx="32" cy="32" r="26" fill="none" stroke-width="7" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      "</svg>" +
      "<div><div class='goal-amount'>" + xp + "<small> / " + goal + " XP</small></div>" +
      '<div class="goal-sub">' + (pct >= 100 ? "🎉 오늘 목표 달성!" : pct + "% 달성 · " + (goal - xp) + " XP 남았어요") + "</div></div>" +
      "</div>" +
      '<div class="week-dots">' + week.map(function (d) {
        return '<div class="week-dot ' + (d.on ? "on " : "") + (d.today ? "today" : "") + '"><i></i>' + d.label + "</div>";
      }).join("") + "</div>" +
      "</div>";
  }

  function reviewCard() {
    var due = DL.store.dueWords(99);
    return '<div class="card dash-card">' +
      '<div class="card-title">' + icon("review") + " 복습 대기</div>" +
      '<div class="quick-review"><div class="num">' + due.length + "</div><div class='lbl'>개의 표현이<br>기다리고 있어요</div></div>" +
      (due.length
        ? '<button class="btn blue sm wide" data-action="review:start">복습 시작</button>'
        : '<button class="btn ghost sm wide" data-action="nav" data-screen="practice">복습 센터</button>') +
      "</div>";
  }

  function streakCard() {
    var s = DL.store.state;
    var st = DL.store.streak();
    return '<div class="card dash-card">' +
      '<div class="card-title">' + icon("flame") + " 연속 학습</div>" +
      '<div class="quick-review"><div class="num" style="color:var(--orange-d)">' + st.count + '</div><div class="lbl">일 연속<br>' + (st.activeToday ? "오늘도 학습 완료!" : "오늘 학습하면 이어져요") + "</div></div>" +
      '<div class="goal-sub" style="margin-top:10px">❤️ ' + (s.settings.heartsOn ? s.hearts + " / 5 · " + esc(DL.store.heartTimerText()) : "하트 무제한") + "</div>" +
      "</div>";
  }

  function hero() {
    var s = DL.store.state;
    var level = s.profile.level;
    var info = DL.levelInfo(level);
    var pos = DL.store.currentPosition(level);
    var lp = DL.store.levelProgress(level);
    var overall = DL.store.overall();
    var nameLine = DL.store.streak().activeToday ? "오늘도 왔네요!" : "오늘의 영어 한 스푼";
    return '<section class="hero">' +
      '<div class="hero-chips"><span class="pill">' + info.emoji + " " + info.name + " · " + info.cefr + "</span>" +
      '<span class="pill">6개월 코스 · ' + pos.month + "개월차 " + pos.week + "주차</span></div>" +
      "<h1>" + nameLine + "<br>영어가 편해지는 중이에요</h1>" +
      "<p>" + info.short + " · 지금은 <b>" + esc(pos.unit ? pos.unit.title : "") + "</b>를 배우고 있어요.</p>" +
      '<div class="hero-meta"><span>레벨 진행 ' + lp.done + "/" + lp.total + "</span><div class='bar'><i style='width:" + lp.pct + "%'></i></div><span>전체 " + overall.pct + "%</span></div>" +
      '<div class="hero-actions">' +
      '<button class="btn primary big" data-action="lesson:next">' + (lp.done ? "이어서 학습하기" : "첫 레슨 시작하기") + "</button>" +
      (pos.unit ? '<button class="btn ghost big" data-action="guide:open" data-unit="' + pos.unit.id + '">' + icon("book") + " 단원 가이드</button>" : "") +
      "</div></section>";
  }

  function nodeIcon(lesson) { return icon(DL.FOCUS_ICON[lesson.focus] || "book"); }

  function path() {
    var s = DL.store.state;
    var level = s.profile.level;
    var info = DL.levelInfo(level);
    var units = DL.curriculum[level] || [];
    var current = DL.store.nextLesson(level);
    var offsets = [0, 46, 74, 26, -22];
    var html = '<section class="path" aria-label="학습 경로">';
    units.forEach(function (unit) {
      var up = DL.store.unitProgress(unit);
      var uclass = "unit-card " + info.color + (up.done === up.total ? " complete" : "");
      html += '<div class="unit-block">' +
        '<div class="' + uclass + '">' +
        '<div class="unit-head"><div><div class="unit-kicker">Unit ' + unit.no + " · " + unit.cefr + " · " + info.months + "</div>" +
        "<h3>" + esc(unit.title) + "</h3><p>" + esc(unit.desc) + "</p></div>" +
        '<div class="unit-emoji">' + unit.emoji + "</div></div>" +
        '<div class="unit-progress"><div class="bar"><i style="width:' + up.pct + '%"></i></div><small>' + up.done + " / " + up.total + " 완료</small>" +
        '<button class="icon-btn" style="width:32px;height:32px;border-radius:9px" data-action="guide:open" data-unit="' + unit.id + '" aria-label="단원 가이드">' + icon("book") + "</button></div>" +
        "</div>" +
        '<div class="node-list">';
      unit.lessons.forEach(function (lesson, i) {
        var done = DL.store.isComplete(lesson.id);
        var unlocked = DL.store.isUnlocked(lesson);
        var isCurrent = current && current.id === lesson.id && !done;
        var rec = DL.store.lessonRecord(lesson.id);
        var cls = "node-row " + (info.color === "green" ? "" : info.color) +
          (done ? " done" : "") + (isCurrent ? " current" : "") + (!unlocked && !done ? " locked" : "");
        var x = offsets[i % offsets.length];
        html += '<div class="' + cls + '" style="--x:' + x + 'px">' +
          '<div class="node-wrap">' +
          (isCurrent ? '<div class="start-bubble">여기서 시작!</div>' : "") +
          '<button class="node" data-action="lesson:start" data-id="' + lesson.id + '" data-replay="' + (done ? 1 : 0) + '"' +
          (!unlocked && !done ? " disabled" : "") + ' aria-label="' + esc(lesson.title) + (done ? " 다시 학습" : unlocked ? " 시작" : " 잠김") + '">' +
          (done ? icon("check") : !unlocked ? icon("lock") : nodeIcon(lesson)) + "</button>" +
          '<div class="node-stars">' + (done
            ? [1, 2, 3].map(function (n) { return icon("star", rec && rec.stars >= n ? "on" : ""); }).join("")
            : "") + "</div>" +
          '<div class="node-tag">' + esc(lesson.title) + "</div>" +
          "</div></div>";
      });
      html += "</div></div>";
    });

    var idx = DL.LEVEL_IDS.indexOf(level);
    var next = DL.levels[idx + 1];
    if (next) {
      html += '<div class="level-next"><h3>' + next.emoji + " 다음 급수 · " + next.name + " " + next.cefr + "</h3>" +
        "<p>" + next.desc + " (" + next.months + ")</p>" +
        '<div class="row"><span class="pill ' + next.color + '">' + next.weeks + " · " + DL.levelLessons(next.id).length + "레슨</span>" +
        '<button class="btn ghost sm" data-action="level:modal">급수 변경</button></div></div>';
    } else {
      html += '<div class="level-next"><h3>' + icon("crown") + " 6개월 코스의 마지막 급수예요</h3>" +
        "<p>고급을 완주하면 협상, 발표, 토론까지 영어로 해낼 수 있어요. 지금까지의 기록은 프로필에서 확인하세요.</p>" +
        '<div class="row"><span class="pill purple">C1 · 유창함</span><button class="btn ghost sm" data-action="level:modal">급수 변경</button></div></div>';
    }
    html += "</section>";
    return html;
  }

  function home() {
    var lp = DL.store.levelProgress(DL.store.state.profile.level);
    var current = DL.store.nextLesson(DL.store.state.profile.level);
    return shell(hero() +
      '<div class="dash-grid">' + goalCard() + reviewCard() + streakCard() + "</div>" +
      '<div class="section-head" style="margin-top:26px"><h2>학습 경로</h2><span class="sub">' + lp.done + " / " + lp.total + " 레슨 완료</span></div>" +
      path() +
      '<div class="home-foot">' + (current ? "다음 레슨: " + esc(current.title) + " · " + DL.FOCUS_LABEL[current.focus] : "모든 레슨을 완료했어요!") + "<br>" +
      "DuoLang · 24주 영어회화 커리큘럼 · 학습 기록은 이 브라우저에 저장됩니다.</div>");
  }

  function vocabNotebookHTML() {
    var vState = DL.ui.vocab || (DL.ui.vocab = { query: "", filter: "all", limit: 30 });
    var all = DL.store.allWordsList();
    var q = (vState.query || "").trim().toLowerCase();
    var filter = vState.filter || "all";
    var curRate = (+DL.store.state.settings.rate || 0.95).toFixed(1);

    var filtered = all.filter(function (w) {
      if (filter === "starred" && !w.starred) return false;
      if (filter === "weak" && !(w.wrong > 0)) return false;
      if (filter === "due" && !(w.due && w.due <= DL.store.today())) return false;
      if (filter === "learned" && !w.seen) return false;
      if (q) {
        var en = (w.en || "").toLowerCase();
        var ko = (w.ko || "").toLowerCase();
        if (en.indexOf(q) === -1 && ko.indexOf(q) === -1) return false;
      }
      return true;
    });

    var counts = {
      all: all.length,
      starred: all.filter(function (w) { return !!w.starred; }).length,
      weak: all.filter(function (w) { return (w.wrong || 0) > 0; }).length,
      due: all.filter(function (w) { return w.due && w.due <= DL.store.today(); }).length,
      learned: all.filter(function (w) { return (w.seen || 0) > 0; }).length
    };

    var limit = vState.limit || 30;
    var displayed = filtered.slice(0, limit);
    var hasMore = filtered.length > limit;

    var tabs = [
      { id: "all", label: "전체 (" + counts.all + ")" },
      { id: "starred", label: "⭐ 북마크 (" + counts.starred + ")" },
      { id: "weak", label: "⚠️ 오답/약점 (" + counts.weak + ")" },
      { id: "due", label: "🔁 복습 대기 (" + counts.due + ")" },
      { id: "learned", label: "✅ 학습 완료 (" + counts.learned + ")" }
    ];

    var tabsHTML = '<div class="vocab-tabs">' + tabs.map(function (t) {
      return '<button class="vocab-tab ' + (filter === t.id ? "active" : "") + '" data-action="vocab:filter" data-filter="' + t.id + '">' + t.label + '</button>';
    }).join("") + '</div>';

    var cardsHTML = "";
    if (!displayed.length) {
      cardsHTML = '<div style="text-align:center;padding:32px 16px;color:var(--text-soft);grid-column:1/-1">' +
        '<div style="font-size:32px;margin-bottom:8px">' + (filter === "starred" ? "⭐" : "🔍") + '</div>' +
        '<div style="font-weight:800;font-size:15px">' +
        (filter === "starred" ? "아직 북마크한 표현이 없어요." : filter === "weak" ? "오답 기록이 없어요! 아주 훌륭해요." : "검색 결과가 없어요.") +
        '</div>' +
        '<div style="font-size:12px;margin-top:4px">' +
        (filter === "starred" ? "표현 카드의 별(☆) 아이콘을 누르면 나만의 단어장에 저장돼요." : "다른 검색어로 찾아보세요.") +
        '</div></div>';
    } else {
      cardsHTML = displayed.map(function (w) {
        var wrongBadge = w.wrong > 0 ? '<span class="pill-badge wrong">오답 ' + w.wrong + '회</span>' : '';
        var statusBadge = w.seen > 0 ? '<span class="pill-badge ok">학습완료 Lv.' + (w.box + 1) + '</span>' : '<span class="pill-badge muted">미학습</span>';
        var unitBadge = w.unitTitle ? '<span class="pill-badge">' + (w.unitEmoji || '📖') + ' ' + esc(w.unitTitle) + '</span>' : '';
        return '<div class="vocab-card">' +
          '<button class="star-btn ' + (w.starred ? "on" : "") + '" data-action="word:toggle-star" data-id="' + esc(w.id) + '" aria-label="북마크">' +
          (w.starred ? "⭐" : "☆") + '</button>' +
          '<div class="vocab-content">' +
          '<div class="vocab-en-row">' +
          '<span class="vocab-en">' + esc(w.en) + '</span>' +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(w.en) + '" aria-label="듣기">' + icon("speaker") + '</button>' +
          '</div>' +
          '<div class="vocab-ko">' + esc(w.ko) + '</div>' +
          '<div class="vocab-badges">' + unitBadge + statusBadge + wrongBadge + '</div>' +
          '</div></div>';
      }).join("");
    }

    var reviewFilteredBtn = "";
    if (displayed.length > 0 && (filter === "starred" || filter === "weak" || filter === "due" || q)) {
      reviewFilteredBtn = '<button class="btn soft sm wide" style="margin-bottom:12px" data-action="vocab:review-filtered">🎯 현재 목록 ' + filtered.length + '개 집중 복습하기</button>';
    }

    var moreBtn = hasMore
      ? '<div style="text-align:center;margin-top:14px"><button class="btn ghost sm" data-action="vocab:more">더 보기 (' + (filtered.length - limit) + '개 남음)</button></div>'
      : '';

    return '<section class="vocab-section">' +
      '<div class="section-head" style="margin-bottom:4px"><h2>📖 나의 단어장 & 오답 노트</h2><span class="sub">총 ' + all.length + '개 표현</span></div>' +
      '<p style="margin:0 0 10px;font-size:13px;color:var(--text-soft)">자주 헷갈리는 표현은 별(⭐)을 눌러 북마크하고, 오답/약점 표현을 언제든 검색해 1:1로 복습할 수 있어요.</p>' +
      '<div class="vocab-search-wrap">' +
      '<div class="vocab-search-box">' +
      '<span class="vocab-search-icon">🔍</span>' +
      '<input type="search" class="vocab-search-input" data-input="vocab-search" placeholder="영어 단어, 문장 또는 한국어 검색..." value="' + esc(vState.query || "") + '" />' +
      '</div>' +
      '<button class="rate-badge" data-action="setting:rate-cycle" title="클릭하여 재생 속도 변경 (0.8x ➔ 1.0x ➔ 1.2x)">⚡ ' + curRate + 'x</button>' +
      '</div>' +
      tabsHTML +
      reviewFilteredBtn +
      '<div class="vocab-card-list">' + cardsHTML + '</div>' +
      moreBtn +
      '</section>';
  }

  function aiFreeTalkSectionHTML() {
    var hasKeys = DL.gemini && DL.gemini.hasKey();
    var keyCount = DL.gemini ? DL.gemini.getKeys().length : 0;
    var scenarios = DL.gemini ? DL.gemini.SCENARIOS : [];

    var scenCardsHTML = scenarios.map(function (scen) {
      return '<button class="ai-scen-card" data-action="ai:start" data-id="' + scen.id + '">' +
        '<div style="font-size:26px;flex:none">' + scen.emoji + '</div>' +
        '<div style="flex:1"><div style="font-size:15px;font-weight:900;color:var(--text)">' + esc(scen.title) + '</div>' +
        '<div style="font-size:12px;font-weight:700;color:var(--text-soft);margin-top:3px">' + esc(scen.desc) + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-top:8px">' +
        '<span class="pill-badge" style="background:rgba(139,92,246,0.15);color:#7c3aed">' + esc(scen.role) + '</span>' +
        '<span class="pill-badge">' + esc(scen.stageGoal) + '</span>' +
        '</div></div>' +
        icon("arrow") + '</button>';
    }).join("");

    return '<section class="section-block">' +
      '<div class="ai-banner-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg, #8b5cf6, #ec4899);color:#fff;display:grid;place-items:center;font-size:24px;box-shadow:0 3px 0 #7c3aed;flex:none">🤖</div>' +
      '<div><div style="font-size:18px;font-weight:900;color:var(--text)">Gemini AI 1:1 자유 회화 (프리토킹)</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--text-soft);margin-top:3px">정해진 대본 없이 자유롭게 영어로 대화하세요. 4단계 코칭과 실시간 문법 팁을 제공합니다.</div>' +
      '</div></div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<span class="ai-key-status ' + (hasKeys ? "active" : "warning") + '">' +
      (hasKeys ? "🟢 " + keyCount + "개 키 활성 (자동 교체)" : "⚠️ API 키 등록 필요") +
      '</span>' +
      '<button class="btn ghost sm" data-action="ai:key-modal">🔑 키 설정</button>' +
      '</div></div>' +
      '<div class="ai-scenario-grid">' + scenCardsHTML + '</div>' +
      '</div></section>';
  }

  function practice() {
    var due = DL.store.dueWords(99);
    var weak = DL.store.weakWords(6);
    var level = DL.store.state.profile.level;
    var prompts = DL.speakingPrompts[level] || [];
    var lp = DL.store.overall();
    var sits = DL.situations || [];

    var dueHTML = '<div class="card practice-card review-highlight">' +
      '<div class="card-title">' + icon("review") + " 오늘의 복습</div>" +
      '<div class="review-big" style="margin-top:10px">' + due.length + " <small>개 표현</small></div>" +
      '<div class="card-sub">' + (due.length ? "잊어버리기 전에 다시 꺼내 볼 시간이에요." : "복습할 표현이 없어요. 레슨을 완료하면 여기에 쌓여요.") + "</div>" +
      (due.length ? '<ul class="review-list">' + due.slice(0, 3).map(function (w) {
        return "<li>" + icon("check") + esc(w.en) + "</li>";
      }).join("") + "</ul>" : "") +
      '<button class="btn ' + (due.length ? "blue" : "ghost") + ' wide" style="margin-top:12px" data-action="' + (due.length ? "review:start" : "nav") + '"' + (due.length ? "" : ' data-screen="home"') + ">" +
      (due.length ? "복습 시작하기" : "학습하러 가기") + "</button></div>";

    var weakHTML = '<div class="card practice-card">' +
      '<div class="card-title">' + icon("target") + " 약점 노트</div>" +
      '<div class="card-sub">' + (weak.length ? "틀렸던 표현을 다시 확인해 보세요." : "아직 약점 기록이 없어요. 훌륭해요!") + "</div>" +
      (weak.length ? '<div class="weak-list">' + weak.slice(0, 4).map(function (w) {
        return '<div class="weak-row"><div><div class="en">' + esc(w.en) + '</div><div class="ko">' + esc(w.ko) + "</div></div>" +
          '<span class="count">' + w.wrong + "회</span>" +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(w.en) + '" aria-label="듣기">' + icon("speaker") + "</button></div>";
      }).join("") + "</div>" +
        '<button class="btn soft sm wide" style="margin-top:10px" data-action="review:weak">약점만 모아 복습</button>' : "") +
      "</div>";

    var sitCardsHTML = sits.map(function (s) {
      return '<button class="sit-card" data-action="roleplay:start" data-id="' + s.id + '">' +
        '<div class="sit-emoji">' + s.emoji + '</div>' +
        '<div style="flex:1"><div class="sit-title">' + esc(s.title) + '</div>' +
        '<div class="sit-sub">' + esc(s.desc) + '</div>' +
        '<div class="sit-meta"><span class="sit-badge">' + s.level + '</span>' +
        '<span class="sit-badge" style="background:var(--green-t);color:var(--green-d)">' + esc(s.partner.name) + ' (' + esc(s.partner.role) + ')</span></div>' +
        '</div>' + icon("arrow") + '</button>';
    }).join("");

    return shell('<div class="page-head"><div class="page-kicker">Speaking & Review</div><h1>회화 & 복습 센터</h1>' +
      "<p>원어민과 핑퐁 대화를 나누고, 3초 순발력 드릴로 입에 영어를 붙여요. 배운 표현은 SRS로 자동 복습됩니다.</p></div>" +
      '<div class="practice-grid">' + dueHTML + weakHTML + "</div>" +
      vocabNotebookHTML() +
      aiFreeTalkSectionHTML() +

      '<section class="section-block">' +
      '<div class="card" style="border:2px solid var(--orange);background:linear-gradient(135deg, var(--bg-card), rgba(255,150,0,0.06));padding:18px 20px;border-radius:20px">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<div style="width:48px;height:48px;border-radius:14px;background:var(--orange);color:#fff;display:grid;place-items:center;font-size:24px;box-shadow:0 3px 0 var(--orange-d);flex:none">⚡</div>' +
      '<div style="flex:1"><div style="font-size:17px;font-weight:900;color:var(--text)">3초 순발력 스피킹 드릴</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--text-soft);margin-top:3px">한국어 상황을 보고 3초 안에 입으로 영어가 바로 튀어나오게 훈련해요.</div>' +
      '</div></div>' +
      '<button class="btn primary wide big" style="background:var(--orange);border-color:var(--orange-d);box-shadow:0 4px 0 var(--orange-d);margin-top:14px" data-action="rapid:start">⚡ 3초 드릴 도전하기 (6문장)</button>' +
      '</div></section>' +

      '<section class="section-block"><div class="section-head"><h2>🎭 실전 핑퐁 롤플레잉</h2><span class="sub">' + sits.length + '개 테마 시뮬레이션</span></div>' +
      "<p>원어민 캐릭터와 실제 대화하듯 음성으로 티키타카를 주고받아요. 대사 힌트와 원어민 발음, 내 목소리 다시 듣기를 지원해요.</p>" +
      '<div class="situation-grid">' + sitCardsHTML + "</div></section>" +

      '<section class="section-block"><div class="section-head"><h2>말하기 연습</h2><span class="sub">' + DL.levelInfo(level).name + " · " + prompts.length + "개 주제</span></div>" +
      "<p>" + (DL.speech.needsHttps && DL.speech.needsHttps()
        ? "지금 주소(HTTP)에서는 마이크를 쓸 수 없어요. 직접 판단하며 연습하거나 HTTPS 주소로 접속해 보세요."
        : "마이크로 말하면 단어별 발음 일치도(초록/주황/빨강)와 내 발음 다시 듣기가 제공됩니다.") + "</p>" +
      '<div class="speak-prompts">' + prompts.map(function (p, i) {
        return '<button class="prompt-row" data-action="speaking:start"><span class="no">' + (i + 1) + "</span>" +
          '<span style="flex:1"><span class="en">' + esc(p.en) + '</span><span class="ko">' + esc(p.ko) + "</span></span>" +
          '<span class="go">' + icon("arrow") + "</span></button>";
      }).join("") + "</div>" +
      '<button class="btn primary wide big" style="margin-top:12px" data-action="speaking:start">🎤 말하기 연습 시작 (4문장)</button>' +
      "</section>" +

      '<section class="section-block"><div class="section-head"><h2>표현 가이드</h2><span class="sub">전체 ' + lp.pct + '% 진행</span></div>' +
      "<p>유닛별 핵심 표현을 모아 두었어요. 잠깐씩 열어 소리 내어 읽어 보세요.</p>" +
      '<div class="phrase-units">' + DL.curriculum[level].map(function (u) {
        return '<button class="phrase-unit" data-action="guide:open" data-unit="' + u.id + '">' +
          '<span class="u-emoji">' + u.emoji + "</span>" +
          '<span style="flex:1"><span class="u-title">' + esc(u.title) + '</span><span class="u-sub">' + esc(u.titleEn) + "</span></span>" +
          '<span class="u-count">' + u.patterns.length + "문장</span>" + icon("arrow") + "</button>";
      }).join("") + "</div></section>");
  }

  /* ---------------- profile ---------------- */
  function profile() {
    var s = DL.store.state;
    var level = s.profile.level;
    var lp = DL.store.levelProgress(level);
    var overall = DL.store.overall();
    var st = DL.store.streak();
    var minutes = Math.round(s.stats.minutes || 0);

    var levelBtns = DL.levels.map(function (l) {
      return '<button class="level-chip ' + (l.color === "green" ? "" : l.color) + (l.id === level ? " on" : "") + '" data-action="level:set" data-level="' + l.id + '">' +
        l.emoji + " " + l.name + "</button>";
    }).join("");

    return shell('<div class="page-head"><div class="page-kicker">My Journey</div><h1>프로필</h1>' +
      "<p>6개월 코스에서 지금 어디쯤 왔는지 확인해 보세요.</p></div>" +

      '<div class="profile-hero"><div class="avatar-big">' + esc(s.profile.name.slice(0, 1)) + "</div>" +
      "<div style='flex:1'><h1>" + esc(s.profile.name) + "</h1>" +
      '<div class="meta">' + DL.levelInfo(level).emoji + " " + DL.levelInfo(level).name + " " + DL.levelInfo(level).cefr + " · 전체 " + overall.pct + "% 완료</div>" +
      '<div class="level-switch">' + levelBtns + "</div></div></div>" +

      '<div class="stat-box"><div class="v">' + s.xp + '</div><div class="l">총 XP</div></div>' +
      '<div class="stat-box"><div class="v">' + overall.done + '</div><div class="l">완료 레슨</div></div>' +
      '<div class="stat-box"><div class="v">' + DL.store.learnedWords() + '</div><div class="l">학습 표현</div></div>' +
      '<div class="stat-box"><div class="v">' + DL.store.accuracy() + '%</div><div class="l">정확도</div></div>' +
      '<div class="stat-box"><div class="v">' + st.count + '</div><div class="l">연속 일수</div></div>' +
      '<div class="stat-box"><div class="v">' + (s.stats.roleplays || 0) + '</div><div class="l">롤플레잉 완주</div></div>' +
      '<div class="stat-box"><div class="v">' + (s.stats.rapid || 0) + '</div><div class="l">3초 순발력 드릴</div></div>' +
      '<div class="stat-box"><div class="v">' + (s.stats.speaking || 0) + '</div><div class="l">말하기 횟수</div></div>' +
      '<div class="stat-box"><div class="v">' + (s.stats.aiChats || 0) + '</div><div class="l">AI 프리토킹</div></div>' +
      "</div>" +

      '<div class="card calendar-card"><div class="cal-head"><div class="card-title">' + icon("clock") + " 최근 5주</div>" +
      '<div class="cal-legend"><i></i>0 <i class="lv1"></i>1 <i class="lv2"></i>30 <i class="lv3"></i>70+</div></div>' +
      '<div class="cal-grid">' + DL.store.calendar(35).map(function (d) {
        return '<div class="cal-cell ' + (d.lv ? "lv" + d.lv : "") + (d.today ? " today" : "") + '" title="' + d.key + " · " + d.xp + ' XP">' + d.day + "</div>";
      }).join("") + "</div></div>" +

      '<section class="section-block"><div class="section-head"><h2>업적</h2><span class="sub">' +
      Object.keys(s.achievements).length + " / " + DL.store.achievementsView().length + ' 달성</span></div>' +
      '<div class="ach-grid">' + DL.store.achievementsView().map(function (a) {
        return '<div class="ach ' + (a.on ? "on" : "") + '"><div class="ico">' + a.icon + '</div><div class="nm">' + esc(a.name) + '</div><div class="ds">' + esc(a.desc) + "</div></div>";
      }).join("") + "</div></section>" +

      '<section class="section-block"><div class="section-head"><h2>6개월 로드맵</h2><span class="sub">24주 · 120레슨</span></div>' +
      '<div class="roadmap">' + DL.levels.map(function (l) {
        var p = DL.store.levelProgress(l.id);
        var dots = DL.curriculum[l.id].map(function (u) {
          var up = DL.store.unitProgress(u);
          return '<span class="rm-dot ' + (up.done === up.total ? "on " + (l.color === "green" ? "" : l.color) : "") + '" title="' + esc(u.title) + '"></span>';
        }).join("");
        return '<div class="rm-level"><div class="rm-top"><span>' + l.emoji + '</span><span class="nm">' + l.name + " " + l.cefr + "</span>" +
          '<span class="mo">' + l.months + " · " + p.pct + '%</span></div>' +
          '<div class="bar ' + (l.color === "green" ? "" : l.color) + '" style="margin-top:10px;height:10px"><i style="width:' + p.pct + '%"></i></div>' +
          '<div class="rm-dots">' + dots + "</div>" +
          '<div class="card-sub" style="margin-top:8px">' + p.done + " / " + p.total + " 레슨 · " + l.short + "</div></div>";
      }).join("") + "</div></section>" +

      '<section class="section-block"><div class="section-head"><h2>설정</h2><span class="sub">이 기기에 저장됨</span></div>' +
      '<div class="card"><div class="settings-list">' +
      settingRow("효과음", "정답·오답 소리를 재생해요", "sound") +
      settingRow("하트 사용", "틀리면 하트가 줄어들어요", "heartsOn") +
      settingRow("오디오 자동 재생", "문제가 나오면 문장을 읽어 줘요", "autoAudio") +
      voiceSettingRow(s) +
      '<div class="setting-row" style="flex-direction:column;align-items:stretch"><div style="display:flex;justify-content:space-between;align-items:center"><div class="s-body"><div class="s-title">말하기 속도 미세 조절</div><div class="s-sub">슬라이더나 프리셋으로 속도를 세밀하게 조절하세요</div></div>' +
      '<span class="rate-value-pill" id="rateDisplay">' + (+s.settings.rate || 0.95).toFixed(2) + 'x</span></div>' +
      '<div class="rate-slider-wrap">' +
      '<span style="font-size:11px;font-weight:800;color:var(--text-soft)">0.6x</span>' +
      '<input type="range" class="rate-slider" min="0.6" max="1.4" step="0.05" value="' + (+s.settings.rate || 0.95) + '" data-input="setting-rate" aria-label="말하기 속도 슬라이더" />' +
      '<span style="font-size:11px;font-weight:800;color:var(--text-soft)">1.4x</span>' +
      '</div>' +
      '<div class="seg" style="margin-top:10px">' + [["0.75", "0.75x 초보"], ["0.9", "0.9x 편안"], ["1.0", "1.0x 보통"], ["1.15", "1.15x 자연"], ["1.3", "1.3x 원어민"]].map(function (p) {
        var on = Math.abs(+s.settings.rate - +p[0]) < 0.04;
        return '<button class="' + (on ? "on" : "") + '" data-action="setting:rate" data-rate="' + p[0] + '">' + p[1] + "</button>";
      }).join("") + "</div></div>" +
      '<div class="setting-row"><div class="s-body"><div class="s-title">하루 목표</div><div class="s-sub">' + s.profile.dailyGoalXp + ' XP · ' + (s.profile.dailyGoalXp <= 20 ? "가볍게" : s.profile.dailyGoalXp <= 40 ? "꾸준하게" : "진하게") + '</div></div>' +
      '<div class="seg">' + [20, 40, 60].map(function (xp) {
        return '<button class="' + (s.profile.dailyGoalXp === xp ? "on" : "") + '" data-action="setting:goal" data-xp="' + xp + '">' + xp + "</button>";
      }).join("") + "</div></div>" +
      '<div class="setting-row"><div class="s-body"><div class="s-title">테마</div><div class="s-sub">눈이 편한 다크 모드</div></div>' +
      '<button class="btn ghost sm" data-action="setting:theme">' + (s.settings.theme === "dark" ? "🌙 다크" : "☀️ 라이트") + "</button></div>" +
      '<div class="setting-row"><div class="s-body"><div class="s-title">Gemini AI API 키</div>' +
      '<div class="s-sub">' + (DL.gemini && DL.gemini.hasKey() ? DL.gemini.getKeys().length + "개의 키 등록됨 · 쿼터 소진 시 자동 로테이션" : "등록된 키 없음 · 무료 키를 등록해 무제한 프리토킹") + '</div></div>' +
      '<button class="btn ghost sm" data-action="ai:key-modal">키 관리</button></div>' +
      '<div class="setting-row"><div class="s-body"><div class="s-title">앱처럼 사용</div><div class="s-sub">홈 화면에 추가하면 전체 화면으로 열려요.</div></div>' +
      '<button class="btn ghost sm" data-action="app:install">추가</button></div>' +
      '<div class="setting-row backup-row"><div class="s-body"><div class="s-title">학습 기록 백업</div><div class="s-sub">JSON 파일로 저장하거나 불러올 수 있어요.</div></div>' +
      '<div class="backup-actions"><button class="btn ghost sm" data-action="profile:export">저장</button>' +
      '<button class="btn ghost sm" data-action="profile:import">불러오기</button></div></div>' +
      "</div>" +
      '<input type="file" id="importFile" accept="application/json,.json" class="hidden" />' +
      '<button class="danger-link" data-action="profile:reset">학습 기록 초기화</button>' +
      '<div class="card-sub" style="margin-top:8px">' + (DL.store.memoryOnly ? "⚠️ 브라우저가 저장을 막아 이번 세션에만 기록됩니다." : "진행 상황은 localStorage에 저장됩니다.") + "</div>" +
      "</div></section>" +

      '<div class="home-foot">DuoLang · 6개월 영어회화 코스<br>매일 조금씩, 말할 수 있는 영어로.</div>');
  }

  function settingRow(title, sub, key) {
    var on = !!DL.store.state.settings[key];
    return '<div class="setting-row"><div class="s-body"><div class="s-title">' + title + '</div><div class="s-sub">' + sub + "</div></div>" +
      '<button class="switch ' + (on ? "on" : "") + '" role="switch" aria-checked="' + on + '" aria-label="' + title + '" data-action="setting:toggle" data-key="' + key + '"></button></div>';
  }

  function voiceSettingRow(s) {
    var list = DL.speech.voiceOptions ? DL.speech.voiceOptions() : [];
    var auto = DL.speech.bestVoiceLabel ? DL.speech.bestVoiceLabel() : "브라우저 기본 음성";
    var chosen = s.settings.voiceURI || "";
    var online = DL.speech.onlineAvailable ? DL.speech.onlineAvailable() : false;
    var options = '<option value="">✨ 자동 선택 — ' + esc(auto) + "</option>" +
      '<option value="' + esc(DL.speech.ONLINE_URI) + '"' + (chosen === DL.speech.ONLINE_URI ? " selected" : "") + ">🌐 온라인 자연 음성 · Google</option>" +
      list.map(function (v) {
        return '<option value="' + esc(v.uri) + '"' + (v.uri === chosen ? " selected" : "") + ">" +
          (v.natural ? "✨ " : "") + esc(v.label) + "</option>";
      }).join("");
    var hint;
    if (!online) hint = "온라인 음성은 node server.js로 실행할 때 사용할 수 있어요. 지금은 기기에 설치된 음성을 사용해요.";
    else if (!list.length) hint = "기기에 영어 음성이 없어 온라인 자연 음성을 자동으로 사용해요. 인터넷 연결이 필요해요.";
    else hint = "기기 음성이 기계적으로 들리면 ‘온라인 자연 음성’을 선택해 보세요. 인터넷 연결이 필요해요. Edge의 Natural 음성도 추천해요.";
    return '<div class="voice-setting"><div class="s-body"><div class="s-title">목소리</div>' +
      '<div class="s-sub">문장을 읽어 주는 음성을 고르세요.</div></div>' +
      '<div class="voice-controls"><select class="voice-select" data-input="voice" aria-label="음성 선택"' + (list.length || online ? "" : " disabled") + ">" + options + "</select>" +
      '<button class="btn ghost sm" data-action="setting:voice-preview">미리 듣기</button></div>' +
      '<div class="voice-note">' + esc(hint) + "</div></div>";
  }

  /* ---------------- modals ---------------- */
  function modalHTML() {
    var m = DL.ui.modal;
    if (!m) return "";
    var inner = "";
    if (m.type === "guide") inner = guideModal(m.unitId);
    else if (m.type === "level") inner = levelModal();
    else if (m.type === "geminiKeys") inner = geminiKeysModal();
    else if (m.type === "reset") {
      inner = '<div class="modal-top"><div><h2>학습 기록 초기화</h2><p>이 작업은 되돌릴 수 없어요.</p></div>' +
        '<button class="icon-btn" data-action="modal:close" aria-label="닫기">' + icon("close") + "</button></div>" +
        '<div class="card-sub" style="margin-top:14px">XP, 연속 학습, 완료한 레슨, 학습한 표현, 업적이 모두 사라집니다. 정말 초기화할까요?</div>' +
        '<div class="heart-actions"><button class="btn danger wide" data-action="profile:reset-confirm">모두 지우고 처음부터</button>' +
        '<button class="btn ghost wide" data-action="modal:close">취소</button></div>';
    }
    return '<div class="modal-root"><div class="modal-backdrop" data-action="modal:close"></div><div class="modal-card">' + inner + "</div></div>";
  }

  function geminiKeysModal() {
    var rawKeys = DL.gemini ? DL.gemini.getKeys() : [];
    var stats = DL.gemini ? DL.gemini.getStats() : {};
    var keysText = rawKeys.join("\n");
    var statsKeys = Object.keys(stats);
    var statsHTML = statsKeys.map(function (k) {
      var s = stats[k];
      return '<div style="display:flex;justify-content:space-between;font-size:11.5px;padding:4px 0;border-bottom:1px solid var(--line)">' +
        '<span><code>' + k + '</code></span>' +
        '<span style="color:var(--text-soft)">' + s.calls + '회 호출 · ' + s.tokens + ' 토큰' + (s.errors ? ' · <span style="color:#ef4444">' + s.errors + ' 오류</span>' : '') + '</span>' +
        '</div>';
    }).join("");

    return '<div class="modal-top"><div><div class="unit-kicker" style="color:#8b5cf6">Gemini Multi-Key Failover</div>' +
      '<h2>🤖 Gemini API 키 관리</h2>' +
      '<p>무료 API 키를 여러 개 등록하면, 쿼터 소진 시 자동으로 다음 키로 교체되어 끊김 없이 무제한으로 대화할 수 있어요.</p></div>' +
      '<button class="icon-btn" data-action="modal:close" aria-label="닫기">' + icon("close") + '</button></div>' +
      '<div style="margin-top:14px">' +
      '<label style="display:block;font-size:13px;font-weight:900;color:var(--text);margin-bottom:6px">API 키 목록 (한 줄에 하나씩 입력):</label>' +
      '<textarea id="geminiKeyTextarea" class="key-textarea" placeholder="AIzaSy... (첫 번째 키)&#10;AIzaSy... (두 번째 키)&#10;AIzaSy... (세 번째 키)">' + esc(keysText) + '</textarea>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px">' +
      '<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="font-size:12px;font-weight:800;color:#8b5cf6;text-decoration:none">🔗 Google AI Studio에서 무료 키 발급받기 →</a>' +
      '<button class="btn ghost sm" data-action="ai:test-key">🧪 첫 번째 키 테스트</button>' +
      '</div></div>' +
      (statsHTML ? '<div style="margin-top:16px;background:var(--bg-soft);padding:10px 14px;border-radius:12px"><div style="font-size:12px;font-weight:800;color:var(--text-soft);margin-bottom:6px">키별 사용 통계:</div>' + statsHTML + '</div>' : '') +
      '<div class="heart-actions" style="margin-top:16px">' +
      '<button class="btn primary wide big" style="background:#8b5cf6;border-color:#7c3aed;box-shadow:0 4px 0 #7c3aed" data-action="ai:save-keys">저장하기</button>' +
      '<button class="btn ghost wide" data-action="modal:close">닫기</button></div>';
  }

  function aiChatView() {
    var sess = DL.aiSession;
    if (!sess) return '<div class="lesson-shell" style="padding:40px;text-align:center">대화 세션이 없습니다.<br><button class="btn primary" style="margin-top:14px" data-action="nav" data-screen="practice">회화 센터로 돌아가기</button></div>';

    var scen = sess.scenario;
    var stages = DL.gemini.STAGES;
    var currentStage = sess.stage || 1;
    var curRate = (+DL.store.state.settings.rate || 0.95).toFixed(1);

    var stepperHTML = '<div class="stage-stepper">' + stages.map(function (st) {
      return '<div class="stage-step ' + (st.no === currentStage ? "active" : "") + '" title="' + esc(st.desc) + '">' +
        st.no + '. ' + esc(st.name.split(" ")[0]) + '</div>';
    }).join("") + '</div>';

    var messagesHTML = sess.messages.map(function (msg, idx) {
      if (msg.role === "user") {
        return '<div class="ai-bubble user">' +
          '<div class="ai-msg">' + esc(msg.text) + '</div>' +
          '<div class="ai-avatar" style="background:var(--blue);box-shadow:0 2px 0 var(--blue-d)">👤</div>' +
          '</div>';
      } else {
        var correctionHTML = msg.correction
          ? '<div class="correction-box">💡 <b>피드백 팁:</b> ' + esc(msg.correction) + '</div>'
          : '';
        var chipsHTML = (msg.suggestedReplies && msg.suggestedReplies.length)
          ? '<div class="suggested-chips">' + msg.suggestedReplies.map(function (r) {
              return '<button class="suggested-chip" data-action="ai:reply-chip" data-text="' + esc(r) + '">💬 ' + esc(r) + '</button>';
            }).join("") + '</div>'
          : '';
        var koHTML = msg.showKo && msg.ko
          ? '<div style="margin-top:6px;font-size:12.5px;color:var(--text-soft);font-weight:700">' + esc(msg.ko) + '</div>'
          : '';

        return '<div class="ai-bubble">' +
          '<div class="ai-avatar">🤖</div>' +
          '<div class="ai-msg">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px">' +
          '<span>' + esc(msg.en) + '</span>' +
          '<div style="display:flex;gap:4px;flex:none">' +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(msg.en) + '" aria-label="듣기">' + icon("speaker") + '</button>' +
          '<button class="speak-btn plain" style="font-size:11px;font-weight:900" data-action="ai:toggle-ko" data-idx="' + idx + '" title="한국어 번역 토글">' + (msg.showKo ? "한" : "번역") + '</button>' +
          '</div></div>' +
          koHTML + correctionHTML + chipsHTML +
          '</div></div>';
      }
    }).join("");

    var loadingHTML = sess.loading
      ? '<div class="ai-bubble"><div class="ai-avatar">🤖</div>' +
        '<div class="ai-msg" style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:12px;color:var(--text-soft);font-weight:800">답변을 생각하고 있어요</span>' +
        '<div class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>' +
        '</div></div>'
      : '';

    return '<div class="ai-chat-shell">' +
      '<div class="ai-chat-top">' +
      '<button class="lesson-close" data-action="ai:quit" aria-label="나가기">' + icon("close") + '</button>' +
      stepperHTML +
      '<button class="rate-badge" data-action="setting:rate-cycle" title="배속 변경">⚡ ' + curRate + 'x</button>' +
      '</div>' +

      '<div class="ai-stream" id="aiStream">' +
      '<div style="text-align:center;padding:10px 0 16px">' +
      '<div style="font-size:24px">' + scen.emoji + '</div>' +
      '<div style="font-size:16px;font-weight:900;color:var(--text);margin-top:2px">' + esc(scen.title) + '</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--text-soft);margin-top:2px">파트너: ' + esc(scen.role) + ' · 4단계 프리토킹</div>' +
      '</div>' +
      messagesHTML + loadingHTML +
      '</div>' +

      '<div class="ai-foot-bar">' +
      '<div class="ai-input-wrap">' +
      '<button class="mic-btn ' + (sess.mic === "recording" ? "recording" : "") + '" style="width:44px;height:44px;flex:none" data-action="ai:mic" aria-label="음성으로 말하기">' + icon("mic") + '</button>' +
      '<input type="text" id="aiInput" class="ai-text-input" placeholder="' + (sess.mic === "recording" ? "듣고 있어요… 영어로 말씀하세요!" : "영어로 메시지를 입력하거나 마이크를 누르세요...") + '" value="' + esc(sess.draft || "") + '" data-input="ai-draft" />' +
      '<button class="btn primary" style="background:#8b5cf6;border-color:#7c3aed;box-shadow:0 3px 0 #7c3aed;padding:0 18px;height:44px;flex:none" data-action="ai:send">전송</button>' +
      (sess.messages.length >= 4 ? '<button class="btn soft sm" style="height:44px;flex:none" data-action="ai:finish">완료 🎉</button>' : '') +
      '</div></div></div>';
  }

  function guideModal(unitId) {
    var u = DL.unitById[unitId];
    if (!u) return "";
    var info = DL.levelInfo(u.level);
    var up = DL.store.unitProgress(u);
    var firstIncomplete = u.lessons.filter(function (l) { return !DL.store.isComplete(l.id); })[0] || u.lessons[0];
    return '<div class="modal-top"><div><div class="unit-kicker" style="color:var(--text-soft)">Unit ' + u.no + " · " + info.name + " " + u.cefr + " · " + up.done + "/5 완료</div>" +
      "<h2>" + u.emoji + " " + esc(u.title) + "</h2><p>" + esc(u.desc) + "</p></div>" +
      '<button class="icon-btn" data-action="modal:close" aria-label="닫기">' + icon("close") + "</button></div>" +
      '<div class="unit-goal" style="margin-top:12px">' + icon("target") + " 목표: " + esc(u.goal) + "</div>" +
      '<div class="guide-section"><h3>핵심 문장 <span>' + u.patterns.length + "개</span></h3><div class='guide-phrases'>" +
      u.patterns.map(function (p) {
        return '<div class="guide-phrase"><div class="en">' + esc(p.en) + '<span class="ko">' + esc(p.ko) + "</span></div>" +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(p.en) + '" aria-label="듣기">' + icon("speaker") + "</button></div>";
      }).join("") + "</div></div>" +
      '<div class="guide-section"><h3>중요 표현 <span>' + u.vocab.length + "개</span></h3><div class='guide-phrases'>" +
      u.vocab.slice(0, 6).map(function (v) {
        return '<div class="guide-phrase"><div class="en">' + esc(v.en) + '<span class="ko">' + esc(v.ko) + "</span></div>" +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(v.en) + '" aria-label="듣기">' + icon("speaker") + "</button></div>";
      }).join("") + "</div></div>" +
      '<div class="guide-section"><h3>대화 미리보기 <span>' + esc(u.dialogues[0].ko) + "</span></h3>" +
      '<div class="guide-dialog"><div class="g-title">' + esc(u.dialogues[0].title) + "</div>" +
      u.dialogues[0].lines.map(function (l) {
        return '<div class="g-line"><b>' + esc(l.who) + "</b><span>" + esc(l.en) + "<em>" + esc(l.ko) + "</em></span>" +
          '<button class="speak-btn plain" style="padding:4px;border:0;background:none" data-action="say" data-text="' + esc(l.en) + '" aria-label="듣기">' + icon("speaker") + "</button></div>";
      }).join("") + "</div></div>" +
      '<div class="heart-actions" style="margin-top:20px;padding-bottom:14px">' +
      '<button class="btn blue wide" style="font-size:15px;padding:14px 16px" data-action="roleplay:start" data-id="' + u.id + '-d0">🎭 이 대화로 롤플레잉 시작하기</button>' +
      '<button class="btn primary wide big" data-action="guide:start" data-id="' + firstIncomplete.id + '">' +
      (up.done ? (up.done === up.total ? "이 유닛 다시 학습하기" : "이어서 학습하기") : "이 유닛 시작하기") + "</button>" +
      '<button class="btn ghost wide" data-action="modal:close">닫기</button></div>';
  }

  function levelModal() {
    var current = DL.store.state.profile.level;
    return '<div class="modal-top"><div><h2>급수 변경</h2><p>진행 상황은 급수별로 따로 저장돼요.</p></div>' +
      '<button class="icon-btn" data-action="modal:close" aria-label="닫기">' + icon("close") + "</button></div>" +
      '<div class="pick-grid">' + DL.levels.map(function (l) {
        var p = DL.store.levelProgress(l.id);
        return '<button class="pick-card" data-action="level:set" data-level="' + l.id + '"><span class="em">' + l.emoji + "</span>" +
          "<span style='flex:1'><span class='nm'>" + l.name + " " + l.cefr + "</span><span class='ds'>" + l.desc + "</span></span>" +
          '<span class="pr">' + (l.id === current ? "현재 · " : "") + p.pct + "%</span></button>";
      }).join("") + "</div>" +
      '<div class="card-sub" style="margin-top:14px">급수를 바꾸면 학습 탭의 경로가 해당 급수로 바뀝니다. 기록은 사라지지 않아요.</div>' +
      '<button class="btn ghost wide" style="margin-top:12px" data-action="modal:close">닫기</button>';
  }

  return {
    welcome: welcome, goal: goal, levelPick: levelPick, placement: placement,
    home: home, practice: practice, profile: profile, aichat: aiChatView,
    modal: modalHTML
  };
})();
