/* DuoLang — lesson player */
window.DL = window.DL || {};

DL.lesson = (function () {
  var S = null;

  function icon(name) { return DL.icon ? DL.icon(name) : ""; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function go(screen) { DL.ui.screen = screen; if (DL.render) DL.render(); }
  function toast(msg) { if (DL.toast) DL.toast(msg); }

  function newSession(base) {
    return Object.assign({
      queue: [], total: 0, idx: 0, intro: false, answered: false, feedback: null,
      selected: null, built: [], draft: "", heard: "", mic: "idle", micError: "",
      firstTry: 0, answeredCount: 0, wrongCount: 0, wrongByUid: {}, retried: {},
      spoken: {}, srs: {}, scores: [], speaking: 0,
      start: Date.now(), xpFactor: 1, ignoreHearts: false, heartsBlocked: false,
      blocked: false, replay: false, rewarded: false, summary: null, mode: "lesson"
    }, base);
  }

  function startLesson(lessonId, opts) {
    opts = opts || {};
    var lesson = DL.lessonById[lessonId];
    if (!lesson) { go("home"); return; }
    var unit = DL.unitOf(lesson);
    var built = DL.ex.buildLesson(unit, lesson.index, DL.curriculum[lesson.level]);
    S = newSession({
      mode: "lesson", lesson: lesson, unit: unit,
      queue: built.exercises.slice(), total: built.exercises.length,
      words: built.words, intro: !opts.skipIntro, replay: !!opts.replay,
      title: lesson.title
    });
    DL.ui.screen = "lesson";
    DL.ui.modal = null;
    DL.speech.stop();
  }

  function startReview(items) {
    if (!items || !items.length) return;
    var ex = DL.ex.buildReview(items, 10);
    S = newSession({
      mode: "review", queue: ex, total: ex.length, words: [],
      intro: false, title: "오늘의 복습", reviewMode: true
    });
    DL.ui.screen = "lesson";
    DL.ui.modal = null;
    DL.speech.stop();
  }

  function startSpeaking(level) {
    var prompts = DL.speakingPrompts[level] || DL.speakingPrompts.beginner;
    var ex = DL.ex.speakSession(prompts);
    S = newSession({
      mode: "speaking", queue: ex, total: ex.length, words: [],
      intro: false, title: "말하기 연습", speakingMode: true
    });
    DL.ui.screen = "lesson";
    DL.ui.modal = null;
    DL.speech.stop();
  }

  function cur() { return S && S.queue[S.idx]; }

  /* ---------------- answer flow ---------------- */
  function finishAnswer(ok, chosen, extra) {
    if (!S || S.answered) return;
    var e = cur();
    e = e || {};
    S.answered = true;
    S.feedback = {
      ok: ok, chosen: chosen || "", answer: e.answer || e.target || "",
      answerKo: e.answerKo || "", explain: e.explain || "", note: e.note || "",
      score: extra && extra.score, heard: extra && extra.heard
    };
    S.feedback.heard = extra && extra.heard;
    S.feedback.score = extra && extra.score;

    if (!S.retried[e.uid]) {
      S.retried[e.uid] = true;
      S.answeredCount++;
      if (ok) S.firstTry++;
    }
    if (e.review && e.word && !S.srs[e.uid]) {
      S.srs[e.uid] = true;
      DL.store.reviewAnswer(e.word.id, ok);
    }
    if (ok) {
      DL.speech.sound("correct");
      if (e.type === "speak" && typeof S.feedback.score === "number") S.scores.push(S.feedback.score);
    } else {
      DL.speech.sound("wrong");
      S.wrongCount++;
      var wc = (S.wrongByUid[e.uid] || 0) + 1;
      S.wrongByUid[e.uid] = wc;
      if (e.type !== "speak" && S.mode !== "speaking" && wc <= 2) {
        S.queue.push(Object.assign({}, e));
      }
      if (S.mode !== "speaking") {
        var h = DL.store.loseHeart();
        if (DL.store.state.settings.heartsOn && h <= 0) S.heartsBlocked = true;
      }
    }
  }

  function selectOption(i) {
    if (!S || S.answered) return;
    var e = cur();
    if (!e || !e.options || !e.options[i]) return;
    S.selected = i;
    var ok = !!e.options[i].ok;
    finishAnswer(ok, e.options[i].text);
    DL.render();
  }

  function buildToken(i) {
    if (!S || S.answered) return;
    var e = cur();
    if (!e || e.type !== "build" || !e.tokens[i]) return;
    if (S.built.indexOf(i) >= 0) return;
    S.built.push(i);
    DL.speech.sound("tap");
    DL.render();
  }

  function unbuildToken(pos) {
    if (!S || S.answered) return;
    S.built.splice(pos, 1);
    DL.render();
  }

  function checkAnswer() {
    if (!S || S.answered) return;
    var e = cur();
    if (!e) return;
    if (e.type === "build") {
      var joined = S.built.map(function (i) { return e.tokens[i].t; }).join(" ");
      var ok = DL.ex.norm(joined) === DL.ex.norm(e.answer);
      finishAnswer(ok, joined);
    } else if (e.type === "dictation") {
      var val = String(S.draft || "").trim();
      var ok2 = DL.ex.norm(val) === DL.ex.norm(e.answer);
      if (!ok2 && val) ok2 = DL.speech.similarity(e.answer, val) >= 0.94;
      finishAnswer(ok2, val);
    } else if (e.type === "speak") {
      finishAnswer(true, "");
    }
    DL.render();
  }

  function selfPass() {
    if (!S || S.answered) return;
    var e = cur();
    if (!e || e.type !== "speak") return;
    finishAnswer(true, "(직접 판단)", { score: 1 });
    DL.render();
  }

  function startMic() {
    if (!S || S.answered) return;
    var e = cur();
    if (!e || e.type !== "speak") return;
    if (!DL.speech.canListen()) {
      S.micError = "unsupported";
      toast("이 브라우저는 음성 인식을 지원하지 않아요. 직접 판단해 주세요.");
      DL.render();
      return;
    }
    S.micError = "";
    DL.speech.listen({
      onStart: function () { if (S) { S.mic = "recording"; DL.render(); } },
      onResult: function (text) {
        if (!S || !cur()) return;
        S.mic = "idle";
        S.heard = text;
        var score = DL.speech.similarity(cur().target, text);
        S.speaking++;
        if (score >= 0.55) {
          finishAnswer(true, text, { score: score, heard: text });
        } else {
          finishAnswer(false, text, { score: score, heard: text });
        }
        DL.render();
      },
      onError: function (err) {
        if (!S) return;
        S.mic = "idle";
        S.micError = err;
        toast(err === "not-allowed" ? "마이크 권한을 허용하면 발음을 확인할 수 있어요." : "음성을 인식하지 못했어요. 다시 시도해 보세요.");
        DL.render();
      }
    });
  }

  function advance() {
    if (!S) return;
    if (S.heartsBlocked) { S.blocked = true; DL.render(); return; }
    S.idx++;
    S.answered = false;
    S.feedback = null;
    S.selected = null;
    S.built = [];
    S.draft = "";
    S.heard = "";
    S.mic = "idle";
    S.micError = "";
    if (S.idx >= S.queue.length) { complete(); return; }
    DL.render();
  }

  function refill() {
    if (!S) return;
    if (DL.store.refillHearts(150)) {
      S.heartsBlocked = false; S.blocked = false;
      toast("하트를 모두 충전했어요!");
      advance();
    } else {
      toast("보석이 부족해요. 학습으로 보석을 모아 보세요.");
      DL.render();
    }
  }

  function noHearts() {
    if (!S) return;
    S.ignoreHearts = true;
    S.xpFactor = 0.5;
    S.heartsBlocked = false;
    S.blocked = false;
    toast("하트 없이 계속해요. 획득 XP는 절반이에요.");
    advance();
  }

  /* ---------------- complete ---------------- */
  function complete() {
    if (!S) return;
    var elapsed = Math.max(0.2, (Date.now() - S.start) / 60000);
    var minutes = Math.round(elapsed * 10) / 10;
    var total = Math.max(1, S.total);
    var accuracy = Math.round(S.firstTry / total * 100);
    var perfect = S.wrongCount === 0;
    var stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
    var xp = 0, gems = 0, result = { achievements: [] };

    if (S.mode === "lesson") {
      var base = 10 + (perfect ? 5 : 0) + (stars === 3 ? 3 : 0);
      if (S.replay) base = Math.max(2, Math.round(base * 0.4));
      xp = Math.max(1, Math.round(base * S.xpFactor));
      gems = S.replay ? 1 : 5;
      result = DL.store.completeLesson(S.lesson, {
        stars: stars, accuracy: accuracy, xp: xp, gems: gems,
        answered: S.answeredCount, correct: S.firstTry, minutes: minutes,
        words: S.words, perfect: perfect, speaking: S.speaking
      });
    } else if (S.mode === "review") {
      xp = Math.max(2, Math.round(5 * S.xpFactor));
      gems = 2;
      result = DL.store.completeReview({
        xp: xp, gems: gems, answered: S.answeredCount, correct: S.firstTry, minutes: minutes
      });
    } else {
      xp = 10;
      gems = 3;
      result = DL.store.completeSpeaking({
        xp: xp, gems: gems, speaking: S.total, minutes: minutes
      });
    }

    var avgScore = S.scores.length
      ? Math.round(S.scores.reduce(function (a, b) { return a + b; }, 0) / S.scores.length * 100)
      : null;

    S.summary = {
      mode: S.mode, title: S.title, xp: xp, gems: gems, accuracy: accuracy,
      stars: stars, minutes: minutes, perfect: perfect,
      answered: S.answeredCount, correct: S.firstTry,
      newWords: result.newWords || [], achievements: result.achievements || [],
      lesson: S.lesson, unit: S.unit, avgScore: avgScore, total: S.total
    };
    S.finished = true;
    S.rewarded = true;
    DL.speech.sound("complete");
    DL.ui.screen = "result";
    DL.render();
    window.scrollTo(0, 0);
  }

  /* ---------------- views ---------------- */
  function heartsMini() {
    var s = DL.store.state;
    var on = s.settings.heartsOn;
    return '<div class="hearts-mini ' + (on ? "" : "off") + '">' + icon("heart") +
      (on ? s.hearts : "∞") + "</div>";
  }

  function topBar(pct) {
    return '<header class="lesson-top">' +
      '<button class="lesson-close" data-action="lesson:quit" aria-label="레슨 나가기">' + icon("close") + "</button>" +
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div>' +
      heartsMini() +
      "</header>";
  }

  function introHTML() {
    var u = S.unit;
    var items = [];
    if (S.lesson.focus === "vocab") items = u.vocab.slice(0, 4);
    else if (S.lesson.focus === "dialogue") {
      items = u.dialogues[0].lines.slice(0, 4).map(function (l) { return { en: l.en, ko: l.ko }; });
    } else items = u.patterns.slice(0, 4);
    var level = DL.levelInfo(S.lesson.level);
    return '<div class="lesson-shell">' + topBar(0) +
      '<main class="lesson-body">' +
      '<div class="lesson-tag"><span class="' + (level.color === "green" ? "" : "alt") + '">' + level.name + " · " + u.no + "주차</span><span class='alt'>" + DL.FOCUS_LABEL[S.lesson.focus] + "</span></div>" +
      '<h1 class="lesson-title">' + esc(S.lesson.title) + "</h1>" +
      '<p class="lesson-sub">' + esc(S.lesson.desc) + "</p>" +
      '<div class="unit-goal">' + icon("target") + " 이번 주 목표: " + esc(u.goal) + "</div>" +
      '<div class="intro-card"><h3>' + icon("sparkle") + " 오늘 배울 핵심 표현</h3><div class='intro-list'>" +
      items.map(function (it) {
        return '<div class="intro-item"><div class="en">' + esc(it.en) + '<span class="ko">' + esc(it.ko) + "</span></div>" +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(it.en) + '" aria-label="듣기">' + icon("speaker") + "</button></div>";
      }).join("") +
      "</div>" +
      '<div class="intro-note">문장은 소리 내어 따라 말할수록 오래 기억에 남아요. 마이크가 없어도 괜찮아요 — 직접 판단하며 진행할 수 있어요.<br><span style="opacity:.75">목소리와 말하기 속도는 프로필 → 설정에서 바꿀 수 있어요.</span></div>' +
      '<div class="intro-actions"><button class="btn primary big" data-action="lesson:begin">시작하기</button>' +
      '<button class="btn ghost big" data-action="lesson:quit">나가기</button></div>' +
      "</div></main></div>";
  }

  function optionsHTML(e) {
    return '<div class="options">' + e.options.map(function (o, i) {
      var cls = "";
      if (S.answered) {
        if (o.ok) cls = "correct";
        else if (S.selected === i) cls = "wrong";
      } else if (S.selected === i) cls = "selected";
      return '<button class="option ' + cls + '" data-action="lesson:option" data-i="' + i + '"' + (S.answered ? " disabled" : "") + ">" +
        '<span class="key">' + (i + 1) + "</span><span class='txt'>" + esc(o.text) + "</span></button>";
    }).join("") + "</div>";
  }

  function speakerBtn(text, cls) {
    return '<button class="speak-btn ' + (cls || "") + '" data-action="say" data-text="' + esc(text) + '" aria-label="영어로 듣기">' + icon("speaker") + "</button>";
  }

  function exerciseHTML(e) {
    var html = "";
    if (e.type === "choose") {
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      html += '<div class="ex-question ' + (e.question.length > 28 ? "small" : "") + '">' +
        '<div style="flex:1"><div class="q-text">' + esc(e.question) + "</div></div>" +
        (e.audio ? speakerBtn(e.question) : "") + "</div>";
      html += optionsHTML(e);
    } else if (e.type === "listen") {
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      html += '<div class="audio-badge">' + speakerBtn(e.audio) +
        '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span>' +
        '<button class="btn ghost sm" data-action="say" data-text="' + esc(e.audio) + '" data-slow="1">천천히</button></div>';
      html += optionsHTML(e);
    } else if (e.type === "blank") {
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      var shown = S.answered ? e.answer : "___";
      html += '<div class="ex-question"><div style="flex:1"><div class="blank-line">' + esc(e.before) +
        ' <span class="gap filled">' + esc(shown) + "</span> " + esc(e.after) + "</div>" +
        '<div class="hint-ko">' + esc(e.ko) + "</div></div>" + (e.audio ? speakerBtn(e.audio) : "") + "</div>";
      html += optionsHTML(e);
    } else if (e.type === "build") {
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      html += '<div class="ex-question small"><div class="q-text">' + esc(e.ko) + "</div>" + speakerBtn(e.answer) + "</div>";
      html += '<div class="answer-zone">' + (S.built.length
        ? S.built.map(function (pos, j) {
          return '<button class="token removable" data-action="lesson:unbuild" data-pos="' + j + '">' + esc(e.tokens[pos].t) + "</button>";
        }).join("")
        : '<span class="placeholder">아래 단어를 눌러 문장을 만드세요</span>') + "</div>";
      var used = {};
      S.built.forEach(function (i) { used[i] = 1; });
      html += '<div class="bank">' + e.tokens.map(function (t, i) {
        return '<button class="token' + (used[i] ? " used" : "") + '" data-action="lesson:build" data-i="' + i + '">' + esc(t.t) + "</button>";
      }).join("") + "</div>";
    } else if (e.type === "dictation") {
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      html += '<div class="audio-badge">' + speakerBtn(e.audio) +
        '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span>' +
        '<button class="btn ghost sm" data-action="say" data-text="' + esc(e.audio) + '" data-slow="1">천천히</button></div>';
      html += '<div class="hint-ko" style="margin-bottom:8px">뜻: ' + esc(e.ko) + "</div>";
      html += '<input id="dictationInput" class="answer-input" data-input="dictation" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="영어 문장을 입력하세요" value="' + esc(S.draft) + '" />';
      html += '<div class="typing-note">대소문자와 구두점은 채점에 영향을 주지 않아요.</div>';
    } else if (e.type === "roleplay") {
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      html += '<div class="bubbles">' + e.context.map(function (l) {
        return '<div class="bubble"><div class="avatar">' + esc(l.who.slice(0, 1)) + "</div>" +
          '<div class="body"><div class="name">' + esc(l.who) + '</div><div class="line">' + esc(l.en) + "</div>" +
          '<div class="ko">' + esc(l.ko) + "</div>" +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(l.en) + '" aria-label="듣기">' + icon("speaker") + "</button></div></div>";
      }).join("") + "</div>";
      html += '<div class="hint-ko" style="margin-bottom:8px">' + esc(e.dialogueTitle) + " — 이어질 말을 고르세요.</div>";
      html += optionsHTML(e);
    } else if (e.type === "speak") {
      var scoring = S.feedback && typeof S.feedback.score === "number" ? Math.round(S.feedback.score * 100) : null;
      html += '<p class="ex-prompt">' + esc(e.prompt) + "</p>";
      html += '<div class="speak-card"><div class="speak-target">' + esc(e.target) + "</div>" +
        '<div class="speak-ko">' + esc(e.ko) + "</div>" +
        '<div class="audio-badge" style="justify-content:center;margin-top:14px">' + speakerBtn(e.target) +
        '<button class="btn ghost sm" data-action="say" data-text="' + esc(e.target) + '" data-slow="1">천천히 듣기</button></div>' +
        '<div class="mic-zone"><button class="mic-btn ' + (S.mic === "recording" ? "recording" : "") + '" data-action="lesson:mic" aria-label="녹음 시작">' + icon("mic") + "</button>" +
        '<div class="mic-hint">' + (S.mic === "recording" ? "듣고 있어요… 또박또박 말해 보세요." :
          !DL.speech.canListen() ? "이 브라우저는 음성 인식을 지원하지 않아요. 위 버튼으로 듣고 직접 판단해 주세요." :
          "마이크 버튼을 누르고 문장을 따라 말해 보세요.") + "</div></div>" +
        (S.feedback && S.feedback.heard ? '<div class="speak-result ' + (S.feedback.ok ? "ok" : "bad") + '">' +
          (S.feedback.ok ? "잘했어요!" : "조금 더 또렷하게 말해 볼까요?") +
          (scoring != null ? " · 일치도 " + scoring + "%" : "") +
          '<span class="heard">인식된 문장: ' + esc(S.feedback.heard) + "</span></div>" : "") +
        (!S.answered ? '<div class="self-check"><button class="btn ghost sm" data-action="lesson:selfpass">직접 판단: 말했어요</button></div>' : "") +
        (e.hint ? '<div class="mic-hint" style="margin-top:8px">힌트: ' + esc(e.hint) + "</div>" : "") +
        "</div>";
    }
    return html;
  }

  function feedbackHTML(e) {
    if (!S.feedback) return "";
    var f = S.feedback;
    var title = f.ok ? (S.mode === "speaking" ? "좋아요!" : "정답이에요!") : "아쉬워요";
    var answer = f.answer;
    var html = '<div class="feedback ' + (f.ok ? "ok" : "bad") + '">' +
      '<div class="f-head">' + (f.ok ? icon("check") : icon("close")) + " " + title + "</div>";
    if (!f.ok) {
      html += '<div class="f-answer">정답: <b>' + esc(answer) + "</b>" + (f.answerKo ? " · " + esc(f.answerKo) : "") + "</div>";
      if (e.type === "dictation") html += '<div class="f-note">입력한 문장: ' + (esc(f.chosen) || "(없음)") + "</div>";
      if (e.explain) html += '<div class="f-note">' + esc(e.explain) + "</div>";
    } else {
      html += '<div class="f-answer">' + esc(e.explain || e.ko || "") + "</div>";
    }
    html += "</div>";
    return html;
  }

  function footerHTML(e) {
    if (S.blocked) return '<div class="heart-actions"><button class="btn soft wide" data-action="lesson:quit">홈으로</button></div>';
    if (S.answered) {
      return feedbackHTML(e) + '<button class="btn primary wide big" data-action="lesson:continue" id="continueBtn">계속하기</button>';
    }
    if (e.type === "build" || e.type === "dictation") {
      return '<button class="btn primary wide big" data-action="lesson:check" id="checkBtn" ' + (e.type === "build" ? (S.built.length ? "" : "disabled") : (String(S.draft).trim() ? "" : "disabled")) + ">정답 확인</button>";
    }
    if (e.type === "speak") {
      return '<div class="typing-note" style="text-align:center">말하기는 횟수 제한 없이 연습할 수 있어요.</div>';
    }
    return '<div class="typing-note" style="text-align:center">정답을 선택하면 바로 확인할 수 있어요.</div>';
  }

  function lessonHTML() {
    if (S.intro) return introHTML();
    var e = cur();
    if (!e) return "";
    if (S.blocked) return heartsBlockedHTML();
    var pct = Math.min(100, Math.round(S.idx / Math.max(1, S.queue.length) * 100));
    var modeTag = S.mode === "review" ? "복습" : S.mode === "speaking" ? "말하기 연습" : DL.FOCUS_LABEL[e.focus || ""] || "실전";
    return '<div class="lesson-shell">' + topBar(pct) +
      '<main class="lesson-body" id="lessonBody">' +
      '<div class="lesson-tag"><span class="alt">' + (S.mode === "lesson" ? DL.levelInfo(S.lesson.level).name + " · " + S.unit.no + "주차" : "DuoLang") + "</span>" +
      "<span>" + esc(modeTag) + "</span><span class='alt'>" + (S.idx + 1) + " / " + S.queue.length + "</span></div>" +
      '<h1 class="lesson-title" style="font-size:18px;margin-bottom:14px">' + esc(S.title) + "</h1>" +
      exerciseHTML(e) +
      "</main>" +
      '<footer class="lesson-foot"><div class="lesson-foot-inner">' + footerHTML(e) + "</div></footer></div>";
  }

  function heartsBlockedHTML() {
    var s = DL.store.state;
    return '<div class="overlay-screen"><div class="heart-panel">' +
      '<div class="big-heart">💔</div><h2>하트가 다 떨어졌어요</h2>' +
      "<p>150 보석으로 충전하거나, 하트 없이 계속할 수 있어요.<br>하트 없이 계속하면 획득 XP가 절반이 됩니다.</p>" +
      '<div class="heart-actions">' +
      '<button class="btn blue wide big" data-action="lesson:refill" ' + (s.gems < 150 ? "disabled" : "") + ">💎 150개로 충전하기 (보유 " + s.gems + ")</button>" +
      '<button class="btn ghost wide big" data-action="lesson:nohearts">하트 없이 계속하기</button>' +
      '<button class="btn soft wide" data-action="lesson:quit">그만두기</button>' +
      "</div>" +
      '<div class="heart-tip">' + esc(DL.store.heartTimerText()) + " · 복습을 완료하면 하트 1개를 회복해요.</div>" +
      "</div></div>";
  }

  function resultHTML() {
    var m = S.summary;
    var isLesson = m.mode === "lesson";
    var isReview = m.mode === "review";
    var badge = isLesson ? (m.perfect ? "🏆" : "⭐") : isReview ? "🔁" : "🎤";
    var title = isLesson ? "레슨 완료!" : isReview ? "복습 완료!" : "말하기 완료!";
    var sub = isLesson
      ? esc(m.unit.title) + " · " + esc(m.lesson.title)
      : isReview ? "잊어버릴 뻔한 표현을 다시 꺼냈어요." : "입으로 말한 문장은 오래 남아요.";
    var xpLabel = "+" + m.xp + " XP";
    var middleLabel = isLesson ? "정확도" : isReview ? "정답률" : "평균 점수";
    var middleValue = isReview ? m.accuracy + "%" : (m.avgScore != null ? m.avgScore + "%" : "—");
    if (isLesson) middleValue = m.accuracy + "%";
    var thirdLabel = isLesson ? "별점" : "완료";
    var thirdValue = isLesson ? "★".repeat(m.stars) + "☆".repeat(3 - m.stars) : m.total + "개";
    var streak = DL.store.streak();

    var confetti = "";
    var colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ce82ff", "#ff9600", "#ff4b4b"];
    for (var i = 0; i < 28; i++) {
      confetti += '<i style="left:' + Math.round(Math.random() * 100) + "%;background:" + colors[i % colors.length] +
        ";animation-duration:" + (2.4 + Math.random() * 2.2).toFixed(2) + "s;animation-delay:" + (Math.random() * 0.8).toFixed(2) + 's"></i>';
    }

    var wordsHTML = "";
    if (m.newWords && m.newWords.length) {
      wordsHTML = '<div class="result-words"><h3>새로 배운 표현 ' + m.newWords.length + "개</h3>" +
        m.newWords.slice(0, 6).map(function (w) {
          return '<div class="word-row"><div class="en">' + esc(w.en) + '</div><div class="ko">' + esc(w.ko) + "</div></div>";
        }).join("") + "</div>";
    }
    var achHTML = "";
    if (m.achievements && m.achievements.length) {
      achHTML = '<div class="result-words" style="margin-top:10px"><h3>새 업적을 달성했어요!</h3>' +
        m.achievements.map(function (a) {
          return '<div class="word-row"><div class="en">' + a.icon + " " + esc(a.name) + '</div><div class="ko">' + esc(a.desc) + "</div></div>";
        }).join("") + "</div>";
    }

    return '<div class="result-wrap"><div class="confetti">' + confetti + "</div>" +
      '<div class="result-card">' +
      '<div class="result-badge">' + badge + "</div>" +
      "<h1>" + title + "</h1>" +
      '<p class="sub">' + sub + (streak.count > 0 ? " · 🔥 " + streak.count + "일 연속" : "") + "</p>" +
      '<div class="result-stats">' +
      '<div class="result-stat"><div class="v">' + xpLabel + '</div><div class="l">XP</div></div>' +
      '<div class="result-stat"><div class="v">' + middleValue + '</div><div class="l">' + middleLabel + "</div></div>" +
      '<div class="result-stat"><div class="v">' + thirdValue + '</div><div class="l">' + thirdLabel + "</div></div>" +
      "</div>" +
      wordsHTML + achHTML +
      (m.mode === "lesson" ? '<div class="result-words" style="margin-top:10px"><h3>다음 걸음</h3><div class="word-row"><div class="en">' +
        esc(DL.store.streak().activeToday ? "오늘의 학습을 이어가요" : "오늘도 학습 완료!") + '</div><div class="ko">' +
        DL.store.todayXp() + " / " + DL.store.state.profile.dailyGoalXp + " XP</div></div></div>" : "") +
      '<div class="result-actions">' +
      (m.mode === "lesson" && DL.nextLessonInLevel(m.lesson)
        ? '<button class="btn primary wide big" data-action="result:next">다음 레슨 이어가기</button>'
        : m.mode === "review" && DL.store.dueWords(1).length
          ? '<button class="btn primary wide big" data-action="review:start">한 번 더 복습하기</button>'
          : m.mode === "speaking"
            ? '<button class="btn primary wide big" data-action="speaking:start">다시 말하기</button>'
            : "") +
      '<button class="btn ghost wide" data-action="result:home">홈으로</button>' +
      "</div></div></div>";
  }

  function view() {
    if (!S) return "";
    if (DL.ui.screen === "result" && S.summary) return resultHTML();
    if (S.intro) return introHTML();
    if (S.blocked) return heartsBlockedHTML();
    return lessonHTML();
  }

  /* ---------------- events ---------------- */
  function handle(action, ds) {
    switch (action) {
      case "lesson:begin": S.intro = false; DL.render(); return true;
      case "lesson:option": selectOption(+ds.i); return true;
      case "lesson:build": buildToken(+ds.i); return true;
      case "lesson:unbuild": unbuildToken(+ds.pos); return true;
      case "lesson:check": checkAnswer(); return true;
      case "lesson:continue": advance(); return true;
      case "lesson:mic": startMic(); return true;
      case "lesson:selfpass": selfPass(); return true;
      case "lesson:refill": refill(); return true;
      case "lesson:nohearts": noHearts(); return true;
      case "lesson:quit": quit(); return true;
      case "result:home": S = null; go("home"); return true;
      case "result:next":
        var next = S && S.summary && S.summary.lesson ? DL.nextLessonInLevel(S.summary.lesson) : null;
        if (next) { startLesson(next.id, { skipIntro: false }); DL.render(); }
        else go("home");
        return true;
      default: return false;
    }
  }

  function quit() {
    DL.speech.stop();
    S = null;
    go("home");
  }

  function afterRender() {
    if (!S || DL.ui.screen !== "lesson" || S.intro || S.answered || S.blocked) return;
    var e = cur();
    if (!e) return;
    var text = e.audio || (e.type === "roleplay" && e.context.length ? e.context[e.context.length - 1].en : null);
    if (!text) return;
    if (!DL.store.state.settings.autoAudio) return;
    var key = e.uid + "-auto";
    if (S.spoken[key]) return;
    S.spoken[key] = true;
    setTimeout(function () {
      if (S && !S.answered) DL.speech.say(text);
    }, 350);
  }

  function active() { return S; }

  return {
    startLesson: startLesson, startReview: startReview, startSpeaking: startSpeaking,
    view: view, handle: handle, afterRender: afterRender, active: active, quit: quit,
    get session() { return S; }
  };
})();
