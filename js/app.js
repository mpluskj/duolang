/* DuoLang — app bootstrap, router, events */
window.DL = window.DL || {};

(function () {
  var app = document.getElementById("app");
  var toastRoot = document.getElementById("toast-root");
  var installPrompt = null;
  DL.hasInstallPrompt = function () { return !!installPrompt; };

  DL.ui = {
    screen: DL.store.state.profile.onboarded ? "home" : "welcome",
    modal: null,
    onboard: { goal: 30, recommended: null },
    placement: { idx: 0, score: 0, answered: false, selected: null, done: false },
    vocab: { query: "", filter: "all", limit: 30 },
    dismissInstallBanner: false
  };

  function applyTheme() {
    var s = DL.store.state.settings;
    document.body.setAttribute("data-theme", s.theme === "dark" ? "dark" : "light");
    document.body.classList.toggle("reduce-motion", !!s.reduceMotion);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", s.theme === "dark" ? "#15202b" : "#58cc02");
  }

  function toast(msg) {
    if (!toastRoot) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    toastRoot.appendChild(el);
    setTimeout(function () {
      el.style.transition = "opacity .3s, transform .3s";
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      setTimeout(function () { el.remove(); }, 320);
    }, 2400);
  }

  function render() {
    applyTheme();
    DL.store.syncHearts();
    var screen = DL.ui.screen;
    var html = "";
    if (screen === "lesson" || screen === "result") {
      html = DL.lesson.view();
      if (!html) { DL.ui.screen = "home"; html = DL.views.home(); }
    } else if (typeof DL.views[screen] === "function") {
      html = DL.views[screen]();
    } else {
      html = DL.views.home();
      DL.ui.screen = "home";
    }
    html += DL.views.modal();
    app.innerHTML = html;
    if (screen === "lesson" || screen === "result") {
      DL.lesson.afterRender();
    }
  }

  function go(screen) {
    DL.ui.screen = screen;
    DL.ui.modal = null;
    DL.speech.stop();
    window.scrollTo(0, 0);
    render();
  }

  function startLesson(id, replay) {
    var lesson = DL.lessonById[id];
    if (!lesson) return;
    if (!DL.store.isUnlocked(lesson) && !DL.store.isComplete(id)) {
      toast("이전 레슨을 먼저 완료하면 열려요.");
      return;
    }
    DL.lesson.startLesson(id, { replay: !!replay });
    window.scrollTo(0, 0);
    render();
  }

  function startCurrentLesson() {
    var lesson = DL.store.nextLesson(DL.store.state.profile.level);
    if (!lesson) return;
    startLesson(lesson.id, DL.store.isComplete(lesson.id));
  }

  function startReview(words) {
    if (!words || !words.length) { toast("지금은 복습할 표현이 없어요."); return; }
    DL.lesson.startReview(words);
    window.scrollTo(0, 0);
    render();
  }

  function startSpeaking() {
    DL.lesson.startSpeaking(DL.store.state.profile.level);
    window.scrollTo(0, 0);
    render();
  }

  function placementReset() {
    DL.ui.placement = { idx: 0, score: 0, answered: false, selected: null, done: false };
    DL.ui.onboard.recommended = null;
  }

  function scrollAiChat() {
    setTimeout(function () {
      var el = document.getElementById("aiStream");
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  function startAiSession(scenarioId) {
    if (!DL.gemini || !DL.gemini.hasKey()) {
      toast("Gemini API 키를 먼저 등록해 주세요.");
      DL.ui.modal = { type: "geminiKeys" };
      render();
      return;
    }
    var scenarios = DL.gemini.SCENARIOS;
    var scen = scenarios.filter(function (s) { return s.id === scenarioId; })[0] || scenarios[0];
    DL.aiSession = {
      scenario: scen,
      stage: 1,
      history: [],
      messages: [],
      loading: true,
      draft: "",
      mic: "idle"
    };
    DL.ui.screen = "aichat";
    render();
    scrollAiChat();

    DL.gemini.generateReply(DL.aiSession, "Let's start our conversation! Please introduce yourself and kick off stage 1.", function (res) {
      if (!DL.aiSession) return;
      DL.aiSession.loading = false;
      if (res.ok && res.data) {
        DL.aiSession.messages.push({
          role: "model",
          en: res.data.en,
          ko: res.data.ko,
          correction: res.data.correction,
          suggestedReplies: res.data.suggestedReplies,
          showKo: false
        });
        render();
        scrollAiChat();
        if (DL.store.state.settings.autoAudio) DL.speech.say(res.data.en);
      } else {
        toast(res.message || "답변을 불러오지 못했습니다.");
        render();
      }
    });
  }

  function sendAiMessage(text) {
    if (!DL.aiSession || DL.aiSession.loading) return;
    text = (text || DL.aiSession.draft || "").trim();
    if (!text) return;

    DL.aiSession.draft = "";
    DL.aiSession.messages.push({ role: "user", text: text });
    DL.aiSession.loading = true;
    render();
    scrollAiChat();

    DL.gemini.generateReply(DL.aiSession, text, function (res) {
      if (!DL.aiSession) return;
      DL.aiSession.loading = false;
      if (res.ok && res.data) {
        DL.aiSession.messages.push({
          role: "model",
          en: res.data.en,
          ko: res.data.ko,
          correction: res.data.correction,
          suggestedReplies: res.data.suggestedReplies,
          showKo: false
        });
        render();
        scrollAiChat();
        if (DL.store.state.settings.autoAudio) DL.speech.say(res.data.en);
      } else {
        toast(res.message || "Gemini 응답 실패");
        render();
      }
    });
  }

  function handle(action, ds, el) {
    if (DL.lesson.handle(action, ds)) return;

    switch (action) {
      case "nav":
        if (ds.screen) go(ds.screen);
        return;

      case "say":
        DL.speech.say(ds.text, { rate: ds.slow ? 0.62 : undefined });
        return;

      case "modal:close":
        DL.ui.modal = null;
        render();
        return;

      case "onboard:start":
        DL.ui.screen = "goal";
        render();
        return;

      case "onboard:back":
        if (DL.ui.screen === "placement") { DL.ui.screen = "levelPick"; render(); return; }
        if (DL.ui.screen === "levelPick") { DL.ui.screen = "goal"; render(); return; }
        DL.ui.screen = "welcome";
        render();
        return;

      case "onboard:goal":
        DL.ui.onboard.goal = +ds.xp || 30;
        DL.ui.screen = "levelPick";
        render();
        return;

      case "onboard:level":
        DL.store.finishOnboarding(ds.level, DL.ui.onboard.goal, DL.ui.placement ? DL.ui.placement.score : null);
        DL.ui.screen = "home";
        render();
        toast(DL.levelInfo(ds.level).name + " 과정을 시작해요! 매일 조금씩이면 충분해요.");
        return;

      case "placement:start":
        placementReset();
        DL.ui.screen = "placement";
        render();
        return;

      case "placement:answer": {
        var p = DL.ui.placement;
        if (p.answered || p.done) return;
        var q = DL.placement[p.idx];
        p.selected = +ds.i;
        p.answered = true;
        if (p.selected === q.answer) p.score++;
        render();
        return;
      }

      case "placement:next": {
        var p2 = DL.ui.placement;
        if (!p2.answered) return;
        if (p2.idx >= DL.placement.length - 1) {
          p2.done = true;
          DL.ui.onboard.recommended = DL.placementLevel(p2.score);
        } else {
          p2.idx++;
          p2.answered = false;
          p2.selected = null;
        }
        window.scrollTo(0, 0);
        render();
        return;
      }

      case "placement:back": {
        var p3 = DL.ui.placement;
        if (p3.idx > 0 && !p3.answered) { p3.idx--; p3.selected = null; render(); }
        else { DL.ui.screen = "levelPick"; render(); }
        return;
      }

      case "placement:restart":
        placementReset();
        render();
        return;

      case "level:modal":
        DL.ui.modal = { type: "level" };
        render();
        return;

      case "level:set":
        DL.store.setLevel(ds.level);
        DL.ui.modal = null;
        DL.ui.screen = "home";
        toast(DL.levelInfo(ds.level).name + " 과정으로 이동했어요.");
        render();
        return;

      case "guide:open":
        DL.ui.modal = { type: "guide", unitId: ds.unit };
        render();
        return;

      case "guide:start":
        DL.ui.modal = null;
        startLesson(ds.id, DL.store.isComplete(ds.id));
        return;

      case "lesson:start":
        startLesson(ds.id, ds.replay === "1");
        return;

      case "lesson:next":
        startCurrentLesson();
        return;

      case "review:start":
        startReview(DL.store.dueWords(10));
        return;

      case "review:weak":
        startReview(DL.store.weakWords(10));
        return;

      case "speaking:start":
        startSpeaking();
        return;

      case "roleplay:start":
        DL.lesson.startRoleplay(ds.id);
        window.scrollTo(0, 0);
        render();
        return;

      case "rapid:start":
        DL.lesson.startRapidDrill(ds.level || DL.store.state.profile.level);
        window.scrollTo(0, 0);
        render();
        return;

      case "ai:start":
        startAiSession(ds.id);
        return;

      case "ai:send":
        sendAiMessage();
        return;

      case "ai:reply-chip":
        sendAiMessage(ds.text);
        return;

      case "ai:toggle-ko": {
        var m = DL.aiSession && DL.aiSession.messages && DL.aiSession.messages[+ds.idx];
        if (m) { m.showKo = !m.showKo; render(); }
        return;
      }

      case "ai:mic": {
        if (!DL.aiSession) return;
        if (DL.aiSession.mic === "recording") {
          DL.speech.stopListening();
          DL.aiSession.mic = "idle";
          render();
          return;
        }
        DL.aiSession.mic = "recording";
        render();
        DL.speech.listen({
          onInterim: function (text) {
            if (DL.aiSession) {
              DL.aiSession.draft = text;
              var inp = document.getElementById("aiInput");
              if (inp) inp.value = text;
            }
          },
          onFinal: function (text) {
            if (DL.aiSession) {
              DL.aiSession.mic = "idle";
              DL.aiSession.draft = text;
              render();
              sendAiMessage(text);
            }
          },
          onError: function () {
            if (DL.aiSession) { DL.aiSession.mic = "idle"; render(); }
          }
        });
        return;
      }

      case "ai:finish": {
        var count = DL.aiSession ? DL.aiSession.messages.length : 0;
        DL.aiSession = null;
        DL.store.completeSpeaking({ xp: 25, gems: 5, speaking: count, minutes: 3, aiChat: true });
        DL.speech.sound("complete");
        toast("AI 프리토킹 완주! +25 XP 🎉");
        DL.ui.screen = "practice";
        render();
        return;
      }

      case "ai:quit":
        DL.speech.stop();
        DL.aiSession = null;
        DL.ui.screen = "practice";
        render();
        return;

      case "ai:key-modal":
        DL.ui.modal = { type: "geminiKeys" };
        render();
        return;

      case "ai:save-keys": {
        var ta = document.getElementById("geminiKeyTextarea");
        var val = (ta && ta.value) || "";
        var keys = val.split(/[\n,;]+/).map(function (k) { return k.trim(); }).filter(Boolean);
        DL.store.setSetting("geminiKeys", keys);
        DL.ui.modal = null;
        toast(keys.length + "개의 Gemini API 키를 저장했어요.");
        render();
        return;
      }

      case "ai:test-key": {
        var ta2 = document.getElementById("geminiKeyTextarea");
        var val2 = (ta2 && ta2.value) || "";
        var keys2 = val2.split(/[\n,;]+/).map(function (k) { return k.trim(); }).filter(Boolean);
        if (!keys2.length) { toast("테스트할 키가 없습니다."); return; }
        toast("첫 번째 키 테스트 중…");
        DL.gemini.testKey(keys2[0], function (ok, msg) { toast(msg); });
        return;
      }

      case "profile:reset":
        DL.ui.modal = { type: "reset" };
        render();
        return;

      case "profile:reset-confirm":
        DL.ui.modal = null;
        DL.store.reset();
        DL.ui.screen = "welcome";
        DL.ui.placement = { idx: 0, score: 0, answered: false, selected: null, done: false };
        render();
        toast("학습 기록을 초기화했어요.");
        return;

      case "setting:toggle": {
        var key = ds.key;
        var val = DL.store.toggleSetting(key);
        toast((key === "heartsOn" ? "하트 " : key === "sound" ? "효과음 " : "자동 오디오 ") + (val ? "켜짐" : "꺼짐"));
        render();
        return;
      }

      case "setting:theme":
        DL.store.setSetting("theme", DL.store.state.settings.theme === "dark" ? "light" : "dark");
        render();
        return;

      case "setting:goal":
        DL.store.setGoal(+ds.xp);
        toast("하루 목표를 " + ds.xp + " XP로 설정했어요.");
        render();
        return;

      case "setting:rate":
        DL.store.setSetting("rate", +ds.rate);
        toast(+ds.rate < 0.9 ? "조금 천천히 읽어 줄게요." : +ds.rate > 1 ? "조금 빠르게 읽어 줄게요." : "자연스러운 속도로 읽어 줄게요.");
        render();
        DL.speech.say("This is how your English voice sounds. Let's practice together.");
        return;

      case "setting:rate-cycle": {
        var curRate = +DL.store.state.settings.rate || 0.95;
        var nextRate = curRate < 0.85 ? 1.0 : curRate < 1.1 ? 1.2 : 0.8;
        DL.store.setSetting("rate", nextRate);
        toast("음성 속도: " + nextRate.toFixed(1) + "x" + (nextRate === 0.8 ? " (천천히)" : nextRate === 1.0 ? " (보통)" : " (빠르게)"));
        render();
        DL.speech.say("Speed " + nextRate.toFixed(1) + "x");
        return;
      }

      case "vocab:filter":
        DL.ui.vocab = DL.ui.vocab || { query: "", filter: "all", limit: 30 };
        DL.ui.vocab.filter = ds.filter;
        DL.ui.vocab.limit = 30;
        render();
        return;

      case "vocab:more":
        DL.ui.vocab = DL.ui.vocab || { query: "", filter: "all", limit: 30 };
        DL.ui.vocab.limit = (DL.ui.vocab.limit || 30) + 30;
        render();
        return;

      case "word:toggle-star": {
        var isStarred = DL.store.toggleStar(ds.id);
        toast(isStarred ? "⭐ 단어장에 북마크했어요." : "북마크를 해제했어요.");
        render();
        return;
      }

      case "vocab:review-filtered": {
        var vState = DL.ui.vocab || { query: "", filter: "all" };
        var all = DL.store.allWordsList();
        var q = (vState.query || "").trim().toLowerCase();
        var filter = vState.filter || "all";
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
        if (!filtered.length) { toast("복습할 표현이 없어요."); return; }
        startReview(filtered.slice(0, 15));
        return;
      }

      case "setting:voice-preview":
        DL.speech.say("Hi! Nice to meet you. Let's practice English together.");
        return;

      case "app:dismiss-install":
        DL.ui.dismissInstallBanner = true;
        render();
        return;

      case "app:install":
        if (installPrompt) {
          var promptEvent = installPrompt;
          installPrompt = null;
          promptEvent.prompt();
          if (promptEvent.userChoice && promptEvent.userChoice.then) {
            promptEvent.userChoice.then(function (choice) {
              if (choice && choice.outcome === "accepted") toast("홈 화면에 추가했어요. 이제 앱처럼 열 수 있어요.");
            });
          }
        } else if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
          toast("이미 앱처럼 실행 중이에요.");
        } else {
          DL.ui.modal = { type: "installGuide" };
          render();
        }
        return;

      case "profile:export": {
        var backup = JSON.stringify(DL.store.exportData(), null, 2);
        var blob = new Blob([backup], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "duolang-backup-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        toast("학습 기록을 파일로 저장했어요.");
        return;
      }

      case "profile:import": {
        var input = document.getElementById("importFile");
        if (input) input.click();
        return;
      }

      default:
        return;
    }
  }

  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
    if (!el) return;
    var action = el.getAttribute("data-action");
    if (!action) return;
    e.preventDefault();
    handle(action, el.dataset, el);
  });

  document.addEventListener("input", function (e) {
    var el = e.target;
    if (!el || !el.getAttribute) return;
    var kind = el.getAttribute("data-input");
    if (kind === "dictation") {
      var S = DL.lesson.session;
      if (S) {
        S.draft = el.value;
        var btn = document.getElementById("checkBtn");
        if (btn) btn.disabled = !String(el.value).trim();
      }
      return;
    }
    if (kind === "vocab-search") {
      DL.ui.vocab = DL.ui.vocab || { query: "", filter: "all", limit: 30 };
      DL.ui.vocab.query = el.value;
      var pos = el.selectionStart;
      render();
      var inputAgain = document.querySelector('[data-input="vocab-search"]');
      if (inputAgain) {
        inputAgain.focus();
        try { inputAgain.setSelectionRange(pos, pos); } catch (_) {}
      }
      return;
    }
    if (kind === "setting-rate") {
      var r = parseFloat(el.value);
      DL.store.setSetting("rate", r);
      var display = document.getElementById("rateDisplay");
      if (display) display.textContent = r.toFixed(2) + "x";
      return;
    }
    if (kind === "ai-draft") {
      if (DL.aiSession) DL.aiSession.draft = el.value;
      return;
    }
  });

  document.addEventListener("change", function (e) {
    var el = e.target;
    if (!el) return;

    if (el.getAttribute && el.getAttribute("data-input") === "setting-rate") {
      var r = parseFloat(el.value);
      DL.store.setSetting("rate", r);
      render();
      DL.speech.say("Speed " + r.toFixed(2) + "x");
      return;
    }

    if (el.id === "importFile") {
      var file = el.files && el.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var ok = DL.store.importData(String(reader.result || ""));
        if (ok) {
          DL.ui.screen = "profile";
          DL.ui.modal = null;
          render();
          toast("학습 기록을 불러왔어요.");
        } else {
          toast("이 파일은 올바른 DuoLang 백업 파일이 아니에요.");
        }
        el.value = "";
      };
      reader.onerror = function () {
        toast("파일을 읽지 못했어요.");
        el.value = "";
      };
      reader.readAsText(file);
      return;
    }

    if (!el.getAttribute) return;
    if (el.getAttribute("data-input") === "voice") {
      DL.store.setSetting("voiceURI", el.value);
      var label = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text.replace(/^[\s✨🌐]+/, "") : "자동 선택";
      toast("목소리를 " + label + "로 설정했어요.");
      DL.speech.say("Hi! Nice to meet you. Let's practice English together.");
    }
  });

  window.addEventListener("dl:voices", function () {
    if (DL.ui.screen === "profile") render();
  });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea";

    if (e.key === "Escape") {
      if (DL.ui.modal) { DL.ui.modal = null; render(); e.preventDefault(); }
      return;
    }

    if (DL.ui.screen === "placement" && !typing) {
      var p = DL.ui.placement;
      if (!p.done) {
        if (/^[1-4]$/.test(e.key) && !p.answered) {
          handle("placement:answer", { i: String(+e.key - 1) });
          e.preventDefault();
        } else if (e.key === "Enter" && p.answered) {
          handle("placement:next", {});
          e.preventDefault();
        }
      }
      return;
    }

    if (DL.ui.screen === "aichat") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
      }
      return;
    }

    if (DL.ui.screen !== "lesson" && DL.ui.screen !== "result") return;
    if (typing && e.key !== "Enter") return;
    var S = DL.lesson.session;
    if (!S) return;

    if (DL.ui.screen === "result") {
      if (e.key === "Enter") {
        var actionBtn = document.querySelector(".result-actions .btn.primary") || document.querySelector(".result-actions .btn");
        if (actionBtn) {
          actionBtn.click();
          e.preventDefault();
        }
      }
      return;
    }

    if (DL.ui.screen === "lesson") {
      if (S.intro) {
        if (e.key === "Enter") { handle("lesson:start", {}); e.preventDefault(); }
        return;
      }

      if (S.mode === "roleplay") {
        var line = S.queue[S.idx];
        if (e.key === "Enter") {
          e.preventDefault();
          if (line && line.speaker === "partner") handle("lesson:continue", {});
          else if (S.answered) handle("lesson:continue", {});
          return;
        }
        if (e.key === " " && !typing && line && line.speaker === "user" && !S.answered) {
          e.preventDefault();
          handle("lesson:mic", {});
          return;
        }
        return;
      }

      if (S.mode === "rapid") {
        if (e.key === "Enter") {
          e.preventDefault();
          if (S.answered) handle("lesson:continue", {});
          return;
        }
        if (e.key === " " && !typing && !S.answered) {
          e.preventDefault();
          handle("lesson:mic", {});
          return;
        }
        return;
      }

      var cur = S.queue[S.idx];
      if (typing && e.key === "Enter") {
        e.preventDefault();
        if (S.answered) handle("lesson:continue", {});
        else handle("lesson:check", {});
        return;
      }
      if (/^[1-4]$/.test(e.key) && !S.answered && cur && cur.options) {
        handle("lesson:option", { i: String(+e.key - 1) });
        e.preventDefault();
        return;
      }
      if (e.key === " " && !typing && cur && cur.type === "speak" && !S.answered) {
        e.preventDefault();
        handle("lesson:mic", {});
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (S.answered) handle("lesson:continue", {});
        else if (cur && (cur.type === "build" || cur.type === "dictation")) handle("lesson:check", {});
        return;
      }
    }
  });

  // Mobile AudioContext & TTS warmup on first user interaction
  var audioUnlocked = false;
  function unlockAudioOnce() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (DL.speech && DL.speech.unlockAudio) DL.speech.unlockAudio();
  }
  window.addEventListener("pointerdown", unlockAudioOnce, { once: true, passive: true });
  window.addEventListener("keydown", unlockAudioOnce, { once: true, passive: true });

  window.addEventListener("beforeunload", function () { DL.store.save(); });

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installPrompt = e;
    if (DL.ui.screen === "profile" || DL.ui.screen === "home") render();
  });

  window.addEventListener("appinstalled", function () {
    installPrompt = null;
    toast("DuoLang을 홈 화면에 추가했어요.");
  });

  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) DL.store.syncHearts();
  });

  DL.render = render;
  DL.toast = toast;
  DL.go = go;
  DL.handleAction = handle;

  render();
})();
