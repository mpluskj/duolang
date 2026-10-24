/* DuoLang — persistent state */
window.DL = window.DL || {};

DL.store = (function () {
  var KEY = "duolang.state.v1";
  var HEART_MS = 8 * 60 * 1000;
  var INTERVALS = [1, 2, 4, 8, 16, 32];
  var WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function dateKey(d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function parseKey(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function defaultState() {
    return {
      version: 1,
      profile: { name: "학습자", level: "beginner", dailyGoalXp: 30, onboarded: false, placementScore: null, startedAt: dateKey() },
      xp: 0,
      gems: 120,
      hearts: 5,
      heartsUpdatedAt: Date.now(),
      days: {},
      lessons: {},
      words: {},
      achievements: {},
      settings: { sound: true, heartsOn: true, rate: 0.95, theme: "light", autoAudio: true, reduceMotion: false, voiceURI: "" },
      stats: { correct: 0, answered: 0, minutes: 0, speaking: 0, reviews: 0, perfectLessons: 0, lessonsDone: 0 }
    };
  }

  function merge(base, saved) {
    if (!saved || typeof saved !== "object") return base;
    var out = base;
    ["profile", "settings", "stats"].forEach(function (k) {
      if (saved[k]) Object.keys(saved[k]).forEach(function (kk) { out[k][kk] = saved[k][kk]; });
    });
    ["xp", "gems", "hearts", "heartsUpdatedAt", "version"].forEach(function (k) {
      if (typeof saved[k] === "number") out[k] = saved[k];
    });
    ["days", "lessons", "words", "achievements"].forEach(function (k) {
      if (saved[k] && typeof saved[k] === "object") out[k] = saved[k];
    });
    return out;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return merge(defaultState(), JSON.parse(raw));
    } catch (e) { return defaultState(); }
  }

  var state = load();
  var memoryOnly = false;

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { memoryOnly = true; }
  }

  function today() { return dateKey(); }
  function todayXp() { return state.days[today()] || 0; }

  function syncHearts() {
    if (state.hearts >= 5) { state.hearts = 5; state.heartsUpdatedAt = Date.now(); return; }
    var elapsed = Date.now() - (state.heartsUpdatedAt || Date.now());
    var gain = Math.floor(elapsed / HEART_MS);
    if (gain > 0) {
      state.hearts = Math.min(5, state.hearts + gain);
      state.heartsUpdatedAt = state.hearts >= 5 ? Date.now() : state.heartsUpdatedAt + gain * HEART_MS;
      save();
    }
  }

  function loseHeart() {
    if (!state.settings.heartsOn) return state.hearts;
    syncHearts();
    if (state.hearts > 0) {
      if (state.hearts === 5) state.heartsUpdatedAt = Date.now();
      state.hearts = Math.max(0, state.hearts - 1);
      save();
    }
    return state.hearts;
  }

  function refillHearts(cost) {
    cost = cost || 150;
    if (state.gems < cost) return false;
    state.gems -= cost;
    state.hearts = 5;
    state.heartsUpdatedAt = Date.now();
    save();
    return true;
  }

  function heartTimerText() {
    if (!state.settings.heartsOn) return "하트 무제한";
    if (state.hearts >= 5) return "가득 참";
    var next = state.heartsUpdatedAt + HEART_MS - Date.now();
    var m = Math.max(1, Math.ceil(next / 60000));
    return m + "분 후 1개 회복";
  }

  function isComplete(lessonId) { return !!state.lessons[lessonId]; }
  function lessonRecord(lessonId) { return state.lessons[lessonId] || null; }

  function isUnlocked(lesson) {
    var list = DL.levelLessons(lesson.level);
    var idx = list.indexOf(lesson);
    if (idx <= 0) return true;
    return isComplete(list[idx - 1].id);
  }

  function nextLesson(level) {
    var list = DL.levelLessons(level || state.profile.level);
    for (var i = 0; i < list.length; i++) {
      if (!isComplete(list[i].id)) return list[i];
    }
    return list[list.length - 1];
  }

  function completedCount(level) {
    return DL.levelLessons(level).filter(function (l) { return isComplete(l.id); }).length;
  }

  function levelProgress(level) {
    var total = DL.levelLessons(level).length;
    return { done: completedCount(level), total: total, pct: total ? Math.round(completedCount(level) / total * 100) : 0 };
  }

  function unitProgress(unit) {
    var done = unit.lessons.filter(function (l) { return isComplete(l.id); }).length;
    var stars = unit.lessons.reduce(function (a, l) { var r = lessonRecord(l.id); return a + (r ? r.stars || 0 : 0); }, 0);
    return { done: done, total: unit.lessons.length, pct: Math.round(done / unit.lessons.length * 100), stars: stars };
  }

  function overall() {
    var done = DL.lessons.filter(function (l) { return isComplete(l.id); }).length;
    return { done: done, total: DL.totalLessons, pct: Math.round(done / DL.totalLessons * 100) };
  }

  function currentPosition(level) {
    var lesson = nextLesson(level);
    var unit = DL.unitOf(lesson);
    return {
      lesson: lesson, unit: unit,
      month: unit ? unit.lessons[0].month : 1,
      week: unit ? unit.no : 1,
      globalWeek: unit ? unit.lessons[0].globalWeek : 1
    };
  }

  function streak() {
    var count = 0;
    var d = new Date();
    if (!(state.days[dateKey(d)] > 0)) d = addDays(d, -1);
    while (count < 400 && state.days[dateKey(d)] > 0) {
      count++;
      d = addDays(d, -1);
    }
    return {
      count: count,
      activeToday: (state.days[today()] || 0) > 0,
      todayXp: todayXp()
    };
  }

  function week() {
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var d = addDays(new Date(), -i);
      var k = dateKey(d);
      out.push({ key: k, label: WEEK_KO[d.getDay()], on: (state.days[k] || 0) > 0, today: i === 0, xp: state.days[k] || 0 });
    }
    return out;
  }

  function calendar(days) {
    days = days || 35;
    var out = [];
    for (var i = days - 1; i >= 0; i--) {
      var d = addDays(new Date(), -i);
      var k = dateKey(d);
      var xp = state.days[k] || 0;
      out.push({
        key: k, day: d.getDate(), xp: xp, today: i === 0,
        lv: xp <= 0 ? 0 : xp < 30 ? 1 : xp < 70 ? 2 : 3
      });
    }
    return out;
  }

  function addXp(n) {
    n = Math.max(0, Math.round(n));
    state.xp += n;
    var k = today();
    state.days[k] = (state.days[k] || 0) + n;
    save();
    return n;
  }

  function addGems(n) {
    state.gems = Math.max(0, state.gems + Math.round(n));
    save();
  }

  function addWord(word, correct) {
    if (!word || !word.id) return false;
    var existing = state.words[word.id];
    var isNew = !existing;
    if (isNew) {
      state.words[word.id] = {
        id: word.id, en: word.en, ko: word.ko, unitId: word.unitId,
        box: 0, due: dateKey(addDays(new Date(), 1)), seen: 1,
        right: correct ? 1 : 0, wrong: correct ? 0 : 1, at: Date.now()
      };
    } else {
      existing.seen = (existing.seen || 0) + 1;
      existing.at = Date.now();
      if (correct) existing.right = (existing.right || 0) + 1;
      else existing.wrong = (existing.wrong || 0) + 1;
    }
    return isNew;
  }

  function completeLesson(lesson, summary) {
    var rec = state.lessons[lesson.id] || { stars: 0, accuracy: 0, plays: 0, at: Date.now() };
    rec.stars = Math.max(rec.stars, summary.stars);
    rec.accuracy = Math.max(rec.accuracy, summary.accuracy);
    rec.plays = (rec.plays || 0) + 1;
    rec.at = Date.now();
    state.lessons[lesson.id] = rec;

    state.stats.lessonsDone = Object.keys(state.lessons).length;
    if (summary.perfect) state.stats.perfectLessons = (state.stats.perfectLessons || 0) + 1;
    state.stats.answered += summary.answered || 0;
    state.stats.correct += summary.correct || 0;
    state.stats.minutes += summary.minutes || 0;
    state.stats.speaking += summary.speaking || 0;

    (summary.words || []).forEach(function (w) { addWord(w, summary.perfect); });
    (summary.reviewed || []).forEach(function (id) {
      var w = state.words[id]; if (w) { w.box = 1; w.due = dateKey(addDays(new Date(), 2)); }
    });

    var newWords = (summary.words || []).filter(function (w) {
      var rec2 = state.words[w.id];
      return rec2 && rec2.seen === 1;
    }).map(function (w) { return { en: w.en, ko: w.ko }; });

    addXp(summary.xp || 0);
    addGems(summary.gems || 0);
    state.hearts = Math.min(5, state.hearts);
    save();

    var unlocked = checkAchievements();
    return { newWords: newWords, achievements: unlocked };
  }

  function reviewAnswer(wordId, correct) {
    var w = state.words[wordId];
    if (!w) return null;
    if (correct) {
      w.box = Math.min(w.box + 1, INTERVALS.length - 1);
      w.right = (w.right || 0) + 1;
    } else {
      w.box = 0;
      w.wrong = (w.wrong || 0) + 1;
    }
    w.seen = (w.seen || 0) + 1;
    w.due = dateKey(addDays(new Date(), INTERVALS[w.box]));
    w.at = Date.now();
    state.stats.reviews = (state.stats.reviews || 0) + 1;
    state.stats.answered += 1;
    if (correct) state.stats.correct += 1;
    save();
    return w;
  }

  function dueWords(limit) {
    var k = today();
    var list = Object.keys(state.words).map(function (id) { return state.words[id]; })
      .filter(function (w) { return w.due <= k; })
      .sort(function (a, b) { return (a.due || "").localeCompare(b.due || "") || (a.at || 0) - (b.at || 0); });
    return limit ? list.slice(0, limit) : list;
  }

  function weakWords(limit) {
    var list = Object.keys(state.words).map(function (id) { return state.words[id]; })
      .filter(function (w) { return (w.wrong || 0) > 0; })
      .sort(function (a, b) { return (b.wrong - b.correct) - (a.wrong - a.correct) || b.wrong - a.wrong; });
    return limit ? list.slice(0, limit) : list;
  }

  function learnedWords() { return Object.keys(state.words).length; }

  function accuracy() {
    if (!state.stats.answered) return 0;
    return Math.round(state.stats.correct / state.stats.answered * 100);
  }

  var ACHIEVEMENTS = [
    { id: "first", icon: "🌱", name: "첫 걸음", desc: "첫 레슨 완료", test: function (s) { return Object.keys(s.lessons).length >= 1; } },
    { id: "perfect", icon: "✨", name: "완벽주의자", desc: "실수 없이 레슨 완료", test: function (s) { return s.stats.perfectLessons >= 1; } },
    { id: "streak3", icon: "🔥", name: "3일 연속", desc: "3일 연속 학습", test: function () { return streak().count >= 3; } },
    { id: "streak7", icon: "🔥", name: "일주일 개근", desc: "7일 연속 학습", test: function () { return streak().count >= 7; } },
    { id: "streak30", icon: "🏅", name: "한 달의 힘", desc: "30일 연속 학습", test: function () { return streak().count >= 30; } },
    { id: "words50", icon: "📚", name: "단어 수집가", desc: "표현 50개 학습", test: function () { return learnedWords() >= 50; } },
    { id: "words150", icon: "🧠", name: "어휘 부자", desc: "표현 150개 학습", test: function () { return learnedWords() >= 150; } },
    { id: "lessons10", icon: "🎯", name: "습관 형성", desc: "레슨 10개 완료", test: function (s) { return Object.keys(s.lessons).length >= 10; } },
    { id: "lessons50", icon: "🚀", name: "절반의 여정", desc: "레슨 50개 완료", test: function (s) { return Object.keys(s.lessons).length >= 50; } },
    { id: "unit1", icon: "🏁", name: "첫 유닛 정복", desc: "한 유닛의 5레슨 완료", test: function () { return DL.units.some(function (u) { return unitProgress(u).done === u.lessons.length; }); } },
    { id: "xp500", icon: "⚡", name: "500 XP", desc: "누적 500 XP", test: function (s) { return s.xp >= 500; } },
    { id: "levelup", icon: "🏆", name: "급수 완주", desc: "한 급수 40레슨 완료", test: function () { return DL.LEVEL_IDS.some(function (l) { return completedCount(l) === DL.levelLessons(l).length; }); } },
    { id: "speak10", icon: "🎤", name: "말문이 트이다", desc: "말하기 연습 10회", test: function (s) { return (s.stats.speaking || 0) >= 10; } },
    { id: "review25", icon: "🔁", name: "복습의 달인", desc: "복습 25회", test: function (s) { return (s.stats.reviews || 0) >= 25; } }
  ];

  function checkAchievements() {
    var unlocked = [];
    ACHIEVEMENTS.forEach(function (a) {
      if (state.achievements[a.id]) return;
      var ok = false;
      try { ok = a.test(state); } catch (e) { ok = false; }
      if (ok) {
        state.achievements[a.id] = Date.now();
        unlocked.push({ id: a.id, icon: a.icon, name: a.name, desc: a.desc });
        if (state.gems < 900) state.gems += 20;
      }
    });
    if (unlocked.length) save();
    return unlocked;
  }

  function achievementsView() {
    return ACHIEVEMENTS.map(function (a) {
      return { id: a.id, icon: a.icon, name: a.name, desc: a.desc, on: !!state.achievements[a.id] };
    });
  }

  function setLevel(level) {
    if (DL.LEVEL_IDS.indexOf(level) < 0) return;
    state.profile.level = level;
    save();
  }

  function setGoal(xp) {
    state.profile.dailyGoalXp = xp;
    save();
  }

  function finishOnboarding(level, goalXp, placementScore) {
    state.profile.onboarded = true;
    state.profile.level = level;
    state.profile.dailyGoalXp = goalXp;
    state.profile.placementScore = placementScore == null ? null : placementScore;
    save();
  }

  function toggleSetting(key) {
    state.settings[key] = !state.settings[key];
    save();
    return state.settings[key];
  }

  function setSetting(key, value) {
    state.settings[key] = value;
    save();
  }

  function completeReview(summary) {
    state.stats.minutes += summary.minutes || 0;
    state.hearts = Math.min(5, state.hearts + 1);
    state.heartsUpdatedAt = Date.now();
    addXp(summary.xp || 0);
    addGems(summary.gems || 2);
    save();
    return { achievements: checkAchievements() };
  }

  function completeSpeaking(summary) {
    state.stats.speaking += summary.speaking || 0;
    state.stats.minutes += summary.minutes || 0;
    addXp(summary.xp || 0);
    addGems(summary.gems || 3);
    save();
    return { achievements: checkAchievements() };
  }

  function reset() {
    state = defaultState();
    try { localStorage.removeItem(KEY); } catch (e) {}
    save();
  }

  syncHearts();

  return {
    get state() { return state; },
    save: save, today: today, todayXp: todayXp, syncHearts: syncHearts,
    loseHeart: loseHeart, refillHearts: refillHearts, heartTimerText: heartTimerText,
    isComplete: isComplete, lessonRecord: lessonRecord, isUnlocked: isUnlocked,
    nextLesson: nextLesson, completedCount: completedCount, levelProgress: levelProgress,
    unitProgress: unitProgress, overall: overall, currentPosition: currentPosition,
    streak: streak, week: week, calendar: calendar, addXp: addXp, addGems: addGems,
    completeLesson: completeLesson, addWord: addWord, reviewAnswer: reviewAnswer,
    completeReview: completeReview, completeSpeaking: completeSpeaking,
    dueWords: dueWords, weakWords: weakWords, learnedWords: learnedWords,
    accuracy: accuracy, achievementsView: achievementsView, checkAchievements: checkAchievements,
    setLevel: setLevel, setGoal: setGoal, finishOnboarding: finishOnboarding,
    toggleSetting: toggleSetting, setSetting: setSetting, reset: reset,
    heartInterval: HEART_MS, intervals: INTERVALS,
    get memoryOnly() { return memoryOnly; }
  };
})();
