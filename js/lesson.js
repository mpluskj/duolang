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

  function startRoleplay(scenario) {
    var sit = null;
    if (typeof scenario === "string") {
      sit = (DL.situations || []).filter(function (s) { return s.id === scenario; })[0];
      if (!sit) {
        var allUnits = (DL.curriculum.beginner || []).concat(DL.curriculum.intermediate || []).concat(DL.curriculum.advanced || []);
        allUnits.forEach(function (u) {
          (u.dialogues || []).forEach(function (d, di) {
            if (u.id + "-d" + di === scenario || d.title === scenario) {
              sit = {
                id: scenario,
                emoji: "🎭",
                title: d.title + " (" + d.ko + ")",
                titleEn: d.title,
                desc: u.title + " 유닛 대화",
                partner: { name: d.lines[0][0], role: "대화 상대", avatar: "👤" },
                userRole: d.lines.length > 1 ? d.lines[1][0] : "나",
                lines: d.lines.map(function (l, li) {
                  return {
                    speaker: li % 2 === 0 ? "partner" : "user",
                    en: l[1],
                    ko: l[2],
                    hint: l[1].split(" ").slice(0, 3).join(" ") + "..."
                  };
                })
              };
            }
          });
        });
      }
    } else {
      sit = scenario;
    }
    if (!sit && DL.situations && DL.situations.length) sit = DL.situations[0];
    if (!sit) return;

    S = newSession({
      mode: "roleplay",
      scenario: sit,
      queue: sit.lines.slice(),
      total: sit.lines.length,
      idx: 0,
      history: [],
      peek: false,
      title: sit.title,
      speakingMode: true,
      partnerDone: false
    });
    DL.ui.screen = "lesson";
    DL.ui.modal = null;
    DL.speech.stop();
  }

  function startRapidDrill(level) {
    level = level || (DL.store && DL.store.state.profile.level) || "beginner";
    var units = DL.curriculum[level] || DL.curriculum.beginner || [];
    var allPatterns = [];
    units.forEach(function (u) {
      (u.patterns || []).forEach(function (p) {
        allPatterns.push({
          target: p[0],
          ko: p[1],
          hint: p[2] || (p[0].split(" ").slice(0, 2).join(" ") + "...")
        });
      });
    });
    var chosen = DL.ex.shuffle(allPatterns, DL.ex.rng(Date.now())).slice(0, 6);
    if (!chosen.length) {
      chosen = [
        { target: "Nice to meet you, too.", ko: "저도 만나서 반가워요.", hint: "too는 문장 끝에 붙여요." },
        { target: "Where are you from?", ko: "어디에서 왔어요?", hint: "be from + 장소" },
        { target: "Could I get a coffee, please?", ko: "커피 한 잔 주시겠어요?", hint: "Could I get..." }
      ];
    }
    chosen.forEach(function (c, ci) {
      c.type = "speak";
      c.prompt = "⚡ 3초 순발력: 한국어를 보고 영어로 바로 말해 보세요!";
      c.uid = "rapid-" + ci;
    });

    S = newSession({
      mode: "rapid",
      queue: chosen,
      total: chosen.length,
      idx: 0,
      title: "3초 순발력 스피킹",
      speakingMode: true,
      timerSec: 3,
      speedBonusCount: 0
    });
    DL.ui.screen = "lesson";
    DL.ui.modal = null;
    DL.speech.stop();
  }

  function cur() { return S && S.queue && S.queue[S.idx]; }

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
    S.speaking++;
    if (S.mode === "rapid" && S.timerSec > 0) {
      S.speedBonus = true;
      S.speedBonusCount = (S.speedBonusCount || 0) + 1;
    }
    finishAnswer(true, "(직접 판단)", { score: 1 });
    DL.render();
  }

  function toggleMic() {
    if (!S || S.answered) return;
    if (S.mic === "recording") {
      DL.speech.stopListening();
      S.mic = "idle";
      DL.render();
      return;
    }
    startMic();
  }

  function startMic() {
    if (!S || S.answered) return;
    var e = cur();
    if (!e) return;
    var targetText = e.target || (S.mode === "roleplay" ? e.en : "");
    if (!targetText && e.type !== "speak" && S.mode !== "roleplay" && S.mode !== "rapid") return;
    if (DL.speech.needsHttps && DL.speech.needsHttps()) {
      S.micError = "insecure";
      toast("마이크는 HTTPS 주소에서 사용할 수 있어요. 직접 판단으로 진행해 주세요.");
      DL.render();
      return;
    }
    if (!DL.speech.canListen()) {
      S.micError = "unsupported";
      toast("이 브라우저는 음성 인식을 지원하지 않아요. 직접 판단해 주세요.");
      DL.render();
      return;
    }
    S.micError = "";
    DL.speech.listen({
      target: targetText,
      onStart: function () {
        if (S) {
          S.mic = "recording";
          S.heard = "";
          DL.render();
        }
      },
      onInterim: function (text) {
        if (S && S.mic === "recording") {
          S.heard = text;
          var hintEl = document.querySelector(".mic-hint");
          if (hintEl) {
            hintEl.textContent = '인식 중: "' + text + '"';
          }
        }
      },
      onResult: function (text) {
        if (!S || !cur()) return;
        S.mic = "idle";
        S.heard = text;
        var score = DL.speech.similarity(targetText, text);
        S.speaking++;
        if (S.mode === "rapid" && S.timerSec > 0) {
          S.speedBonus = true;
          S.speedBonusCount = (S.speedBonusCount || 0) + 1;
        }
        if (score >= 0.55 || S.mode === "roleplay") {
          finishAnswer(true, text, { score: score, heard: text });
        } else {
          finishAnswer(false, text, { score: score, heard: text });
        }
        DL.render();
      },
      onNoSpeech: function () {
        if (!S) return;
        S.mic = "idle";
        toast("음성이 들리지 않았어요. 마이크 버튼을 누르고 다시 말해 보세요.");
        DL.render();
      },
      onEnd: function () {
        if (S && S.mic === "recording") {
          S.mic = "idle";
          DL.render();
        }
      },
      onError: function (err) {
        if (!S) return;
        S.mic = "idle";
        S.micError = err;
        if (err === "no-speech") {
          toast("음성이 감지되지 않았어요. 다시 시도해 보세요.");
        } else if (err === "not-allowed") {
          toast("마이크 권한을 허용하면 발음을 확인할 수 있어요.");
        } else {
          toast("음성을 인식하지 못했어요. 다시 시도해 보세요.");
        }
        DL.render();
      }
    });
  }

  function advance() {
    if (!S) return;
    if (DL.speech && DL.speech.unlockAudio) DL.speech.unlockAudio();
    if (S.heartsBlocked) { S.blocked = true; DL.render(); return; }
    if (S.mode === "roleplay") {
      var prev = cur();
      if (prev) S.history.push(prev);
      S.peek = false;
      S.partnerDone = false;
    }
    if (S.mode === "rapid") {
      S.timerSec = 3;
      S.speedBonus = false;
    }
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
    clearRapidTimer();
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
    } else if (S.mode === "roleplay") {
      xp = 25 + (perfect ? 5 : 0);
      gems = 4;
      result = DL.store.completeSpeaking({
        xp: xp, gems: gems, speaking: S.total, minutes: minutes, roleplay: true
      });
    } else if (S.mode === "rapid") {
      xp = 20 + ((S.speedBonusCount || 0) * 2);
      gems = 4;
      result = DL.store.completeSpeaking({
        xp: xp, gems: gems, speaking: S.total, minutes: minutes, rapid: true
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
      html += '<input id="dictationInput" class="answer-input" data-input="dictation" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="영어 문장을 입력하세요" value="' + esc(S.draft) + '" />';
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
          DL.speech.needsHttps && DL.speech.needsHttps() ? "마이크는 HTTPS 주소에서만 사용할 수 있어요. 지금은 직접 판단으로 연습해 보세요." :
          !DL.speech.canListen() ? "이 브라우저는 음성 인식을 지원하지 않아요. 위 버튼으로 듣고 직접 판단해 주세요." :
          "마이크 버튼을 누르고 문장을 따라 말해 보세요.") + "</div></div>" +
        (S.feedback && S.feedback.heard ? '<div class="speak-result ' + (S.feedback.ok ? "ok" : "bad") + '">' +
          (S.feedback.ok ? "잘했어요!" : "조금 더 또렷하게 말해 볼까요?") +
          (scoring != null ? " · 일치도 " + scoring + "%" : "") +
          '<span class="heard">인식된 문장: ' + esc(S.feedback.heard) + "</span></div>" +
          '<div class="word-chips">' + DL.speech.compareWords(e.target, S.feedback.heard).map(function (c) {
            return '<span class="word-chip ' + c.status + '">' + esc(c.word) + '</span>';
          }).join("") + '</div>' : "") +
        (S.feedback && DL.speech.hasUserVoice() ? '<div class="voice-compare-bar">' +
          '<button class="btn soft sm" data-action="lesson:play-voice">🎧 내 발음 다시 듣기</button>' +
          '<button class="btn ghost sm" data-action="say" data-text="' + esc(e.target) + '">원어민 발음</button>' +
          '</div>' : "") +
        (!S.answered ? '<div class="self-check" style="margin-top:10px"><button class="btn ghost sm" data-action="lesson:selfpass">직접 판단: 말했어요</button></div>' : "") +
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

  function roleplaySessionHTML() {
    var sit = S.scenario;
    var line = cur();
    var pct = Math.min(100, Math.round(S.idx / Math.max(1, S.total) * 100));

    var historyHTML = S.history.map(function (h) {
      if (h.speaker === "partner") {
        return '<div class="chat-row partner"><div class="chat-avatar">' + sit.partner.avatar + '</div>' +
          '<div class="chat-msg"><div class="c-en">' + esc(h.en) +
          '<button class="speak-btn plain" data-action="say" data-text="' + esc(h.en) + '" aria-label="듣기">' + icon("speaker") + '</button></div>' +
          '<div class="c-ko">' + esc(h.ko) + '</div></div></div>';
      } else {
        return '<div class="chat-row user"><div class="chat-msg"><div class="c-en">' + esc(h.en) +
          '<button class="speak-btn plain" style="color:#fff" data-action="say" data-text="' + esc(h.en) + '" aria-label="듣기">' + icon("speaker") + '</button></div>' +
          '<div class="c-ko">' + esc(h.ko) + '</div></div>' +
          '<div class="chat-avatar">👤</div></div>';
      }
    }).join("");

    var currentTurnHTML = "";
    if (!line) {
      currentTurnHTML = "";
    } else if (line.speaker === "partner") {
      currentTurnHTML = '<div class="chat-row partner" style="animation: turn-pop 0.25s ease both"><div class="chat-avatar">' + sit.partner.avatar + '</div>' +
        '<div class="chat-msg" style="border-color:var(--blue)"><div class="c-en">' + esc(line.en) +
        '<button class="speak-btn plain" data-action="say" data-text="' + esc(line.en) + '" aria-label="듣기">' + icon("speaker") + '</button></div>' +
        '<div class="c-ko">' + esc(line.ko) + '</div></div></div>' +
        '<div style="text-align:center;margin-top:14px"><button class="btn blue wide" data-action="lesson:continue">내 차례로 계속하기 →</button></div>';
    } else {
      var scoring = S.feedback && typeof S.feedback.score === "number" ? Math.round(S.feedback.score * 100) : null;
      var chipsHTML = "";
      if (S.feedback && S.feedback.heard) {
        var chips = DL.speech.compareWords(line.en, S.feedback.heard);
        chipsHTML = '<div class="word-chips">' + chips.map(function (c) {
          return '<span class="word-chip ' + c.status + '">' + esc(c.word) + '</span>';
        }).join("") + '</div>';
      }

      currentTurnHTML = '<div class="turn-box">' +
        '<div class="turn-kicker">🗣️ 내 차례예요 (역할: ' + esc(sit.userRole) + ')</div>' +
        '<div class="turn-prompt">' + esc(line.ko) + '</div>' +
        (line.hint ? '<div class="turn-hint">힌트: ' + esc(line.hint) + '</div>' : '') +
        (S.peek ? '<div class="turn-peek"><b>영어 대사:</b> ' + esc(line.en) + '</div>' : '') +
        '<div class="turn-actions">' +
        '<button class="btn ghost sm" data-action="roleplay:peek">' + (S.peek ? '대사 숨기기' : '👁️ 영어 대사 보기') + '</button>' +
        '<button class="btn ghost sm" data-action="say" data-text="' + esc(line.en) + '">🔊 원어민 발음</button>' +
        '</div>' +
        '<div class="mic-zone" style="margin-top:14px">' +
        '<button class="mic-btn ' + (S.mic === "recording" ? "recording" : "") + '" data-action="lesson:mic" aria-label="말하기 시작">' + icon("mic") + '</button>' +
        '<div class="mic-hint">' + (S.mic === "recording" ? "듣고 있어요… 편안하게 말씀하세요." :
          DL.speech.needsHttps && DL.speech.needsHttps() ? "마이크는 HTTPS에서 가능해요. 직접 판단으로 진행할 수 있어요." :
          "마이크 버튼을 누르고 영어로 말해 보세요.") + '</div></div>' +
        (S.feedback && S.feedback.heard ? '<div class="speak-result ' + (S.feedback.ok ? "ok" : "bad") + '">' +
          (S.feedback.ok ? "티키타카 성공! 🎉" : "조금 더 또렷하게 말해 보세요.") +
          (scoring != null ? " · 일치도 " + scoring + "%" : "") +
          '<span class="heard">인식된 문장: ' + esc(S.feedback.heard) + '</span></div>' + chipsHTML : "") +
        (S.feedback && DL.speech.hasUserVoice() ? '<div class="voice-compare-bar">' +
          '<button class="btn soft sm" data-action="lesson:play-voice">🎧 내 발음 다시 듣기</button>' +
          '<button class="btn ghost sm" data-action="say" data-text="' + esc(line.en) + '">원어민 발음</button>' +
          '</div>' : "") +
        (!S.answered ? '<div class="self-check" style="margin-top:10px"><button class="btn ghost sm" data-action="lesson:selfpass">직접 판단: 말했어요</button></div>' : "") +
        '</div>';
    }

    return '<div class="lesson-top">' +
      '<button class="lesson-close" data-action="lesson:quit" aria-label="나가기">' + icon("close") + '</button>' +
      '<div class="progress-bar" role="progressbar" aria-valuenow="' + pct + '"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>' +
      '<div class="lesson-body">' +
      '<div class="roleplay-container">' +
      '<div class="roleplay-header">' +
      '<div class="partner-av">' + sit.partner.avatar + '</div>' +
      '<div><div class="p-name">' + esc(sit.partner.name) + '</div><div class="p-role">' + esc(sit.partner.role) + '</div></div>' +
      '<div class="user-badge">👤 ' + esc(sit.userRole) + '</div>' +
      '</div>' +
      '<div class="chat-stream">' + historyHTML + currentTurnHTML + '</div>' +
      '</div></div>' +
      '<div class="lesson-foot"><div class="lesson-foot-inner">' +
      (S.answered && line && line.speaker === "user" ? '<button class="btn primary wide big" data-action="lesson:continue">다음 대사로 이어가기 →</button>' :
        line && line.speaker === "partner" ? '<div class="typing-note" style="text-align:center">상대방의 대사를 듣고 내 차례로 넘어가세요.</div>' :
        '<div class="typing-note" style="text-align:center">마이크 버튼을 누르고 말씀하세요.</div>') +
      '</div></div>';
  }

  function rapidSessionHTML() {
    var e = cur();
    if (!e) return "";
    var pct = Math.min(100, Math.round((S.idx) / Math.max(1, S.total) * 100));
    var scoring = S.feedback && typeof S.feedback.score === "number" ? Math.round(S.feedback.score * 100) : null;
    var chipsHTML = "";
    if (S.feedback && S.feedback.heard) {
      var chips = DL.speech.compareWords(e.target, S.feedback.heard);
      chipsHTML = '<div class="word-chips">' + chips.map(function (c) {
        return '<span class="word-chip ' + c.status + '">' + esc(c.word) + '</span>';
      }).join("") + '</div>';
    }

    return '<div class="lesson-top">' +
      '<button class="lesson-close" data-action="lesson:quit" aria-label="나가기">' + icon("close") + '</button>' +
      '<div class="progress-bar" role="progressbar" aria-valuenow="' + pct + '"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>' +
      '<div class="lesson-body">' +
      '<div class="rapid-card">' +
      '<div class="rapid-kicker">⚡ 3초 순발력 스피킹 드릴 (' + (S.idx + 1) + '/' + S.total + ')</div>' +
      '<div class="rapid-timer-wrap">' +
      '<div id="rapidTimerCircle" class="rapid-timer-circle ' + (S.answered ? 'done' : S.timerSec <= 1 ? 'urgent' : '') + '">' +
      (S.answered ? '✓' : S.timerSec > 0 ? S.timerSec : '⏱️') +
      '</div></div>' +
      (S.speedBonus ? '<div class="rapid-bonus">⚡ 3초 순발력 성공! (+5 XP 보너스)</div>' : '') +
      '<div class="rapid-ko">' + esc(e.ko) + '</div>' +
      '<div class="rapid-hint">힌트: ' + esc(e.hint) + '</div>' +
      '<div class="audio-badge" style="justify-content:center;margin-top:10px">' +
      '<button class="btn ghost sm" data-action="say" data-text="' + esc(e.target) + '">🔊 원어민 발음 듣기</button>' +
      '</div>' +
      '<div class="mic-zone" style="margin-top:14px">' +
      '<button class="mic-btn ' + (S.mic === "recording" ? "recording" : "") + '" data-action="lesson:mic" aria-label="말하기 시작">' + icon("mic") + '</button>' +
      '<div class="mic-hint">' + (S.mic === "recording" ? "듣고 있어요… 어서 말해 보세요!" :
        "3초 안에 입으로 영어를 바로 내뱉어 보세요!") + '</div></div>' +
      (S.feedback && S.feedback.heard ? '<div class="speak-result ' + (S.feedback.ok ? "ok" : "bad") + '">' +
        (S.feedback.ok ? "훌륭해요!" : "조금 더 또렷하게 말해 보세요.") +
        (scoring != null ? " · 일치도 " + scoring + "%" : "") +
        '<span class="heard">인식된 문장: ' + esc(S.feedback.heard) + '</span></div>' + chipsHTML : "") +
      (S.feedback && DL.speech.hasUserVoice() ? '<div class="voice-compare-bar">' +
        '<button class="btn soft sm" data-action="lesson:play-voice">🎧 내 발음 다시 듣기</button>' +
        '<button class="btn ghost sm" data-action="say" data-text="' + esc(e.target) + '">원어민 발음</button>' +
        '</div>' : "") +
      (!S.answered ? '<div class="self-check" style="margin-top:10px"><button class="btn ghost sm" data-action="lesson:selfpass">직접 판단: 말했어요</button></div>' : "") +
      '</div></div>' +
      '<div class="lesson-foot"><div class="lesson-foot-inner">' +
      (S.answered ? '<button class="btn primary wide big" data-action="lesson:continue">다음 문제로 계속하기 →</button>' :
        '<div class="typing-note" style="text-align:center">시간이 지나도 계속 말씀하실 수 있어요.</div>') +
      '</div></div>';
  }

  function lessonHTML() {
    if (S.intro) return introHTML();
    if (S.blocked) return heartsBlockedHTML();
    if (S.mode === "roleplay") return '<div class="lesson-shell">' + roleplaySessionHTML() + '</div>';
    if (S.mode === "rapid") return '<div class="lesson-shell">' + rapidSessionHTML() + '</div>';
    var e = cur();
    if (!e) return "";
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
    var isRoleplay = m.mode === "roleplay";
    var isRapid = m.mode === "rapid";
    var badge = isLesson ? (m.perfect ? "🏆" : "⭐") :
                isReview ? "🔁" :
                isRoleplay ? "🎭" :
                isRapid ? "⚡" : "🎤";
    var title = isLesson ? "레슨 완료!" :
                isReview ? "복습 완료!" :
                isRoleplay ? "롤플레잉 완주!" :
                isRapid ? "3초 순발력 드릴 완료!" : "말하기 완료!";
    var sub = isLesson
      ? esc(m.unit.title) + " · " + esc(m.lesson.title)
      : isReview ? "잊어버릴 뻔한 표현을 다시 꺼냈어요." :
        isRoleplay ? "실전처럼 주고받은 핑퐁 대화로 회화 감각을 익혔어요." :
        isRapid ? "생각하기 전에 입이 먼저 반응하는 영어 순발력!" :
        "입으로 말한 문장은 오래 남아요.";
    var xpLabel = "+" + m.xp + " XP";
    var middleLabel = isLesson ? "정확도" : isReview ? "정답률" : "평균 점수";
    var middleValue = isReview ? m.accuracy + "%" : (m.avgScore != null ? m.avgScore + "%" : "—");
    if (isLesson) middleValue = m.accuracy + "%";
    var thirdLabel = isLesson ? "별점" : isRapid ? "순발력 성공" : "완료";
    var thirdValue = isLesson ? "★".repeat(m.stars) + "☆".repeat(3 - m.stars) :
                     isRapid ? (S.speedBonusCount || 0) + "회" : m.total + "개";
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
          : m.mode === "roleplay"
            ? '<button class="btn primary wide big" data-action="roleplay:start" data-id="' + (S.scenario && S.scenario.id || "") + '">다시 대화하기</button>'
            : m.mode === "rapid"
              ? '<button class="btn primary wide big" data-action="rapid:start">한 번 더 도전하기</button>'
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
      case "lesson:mic": toggleMic(); return true;
      case "lesson:selfpass": selfPass(); return true;
      case "lesson:play-voice": DL.speech.playUserVoice(); return true;
      case "roleplay:peek": S.peek = !S.peek; DL.render(); return true;
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

  var rapidTimerInterval = null;

  function clearRapidTimer() {
    if (rapidTimerInterval) {
      clearInterval(rapidTimerInterval);
      rapidTimerInterval = null;
    }
  }

  function startRapidTimer() {
    clearRapidTimer();
    if (!S || S.mode !== "rapid" || S.answered) return;
    rapidTimerInterval = setInterval(function () {
      if (!S || S.mode !== "rapid" || S.answered) {
        clearRapidTimer();
        return;
      }
      if (S.timerSec > 0) {
        S.timerSec--;
        DL.speech.sound("tick");
        var circle = document.getElementById("rapidTimerCircle");
        if (circle) {
          circle.textContent = S.timerSec;
          circle.classList.add("pulse");
          setTimeout(function () { if (circle) circle.classList.remove("pulse"); }, 200);
          if (S.timerSec === 1) circle.classList.add("urgent");
          if (S.timerSec === 0) {
            circle.classList.remove("urgent");
            circle.classList.add("done");
            circle.textContent = "⏱️";
          }
        }
      } else {
        clearRapidTimer();
      }
    }, 1000);
  }

  function quit() {
    clearRapidTimer();
    DL.speech.stop();
    S = null;
    go("home");
  }

  function afterRender() {
    if (!S || DL.ui.screen !== "lesson" || S.intro || S.answered || S.blocked) {
      clearRapidTimer();
      return;
    }
    if (S.mode === "rapid") {
      startRapidTimer();
      return;
    }
    clearRapidTimer();
    if (S.mode === "roleplay") {
      var line = cur();
      if (!line) return;
      if (line.speaker === "partner") {
        var key = "roleplay-" + S.idx;
        if (!S.spoken[key]) {
          S.spoken[key] = true;
          setTimeout(function () {
            if (S && cur() === line) DL.speech.say(line.en);
          }, 300);
        }
      }
      return;
    }

    var e = cur();
    if (!e) return;
    var text = e.audio || (e.type === "speak" ? e.target : null) || (e.type === "roleplay" && e.context && e.context.length ? e.context[e.context.length - 1].en : null);
    if (!text) return;
    if (!DL.store.state.settings.autoAudio) return;
    var key = e.uid + "-auto";
    if (S.spoken[key]) return;
    S.spoken[key] = true;
    setTimeout(function () {
      if (S && !S.answered) DL.speech.say(text);
    }, 200);
  }

  function active() { return S; }

  return {
    startLesson: startLesson, startReview: startReview, startSpeaking: startSpeaking,
    startRoleplay: startRoleplay, startRapidDrill: startRapidDrill,
    view: view, handle: handle, afterRender: afterRender, active: active, quit: quit,
    get session() { return S; }
  };
})();
