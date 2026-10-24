/* DuoLang — app bootstrap, router, events */
window.DL = window.DL || {};

(function () {
  var app = document.getElementById("app");
  var toastRoot = document.getElementById("toast-root");

  DL.ui = {
    screen: DL.store.state.profile.onboarded ? "home" : "welcome",
    modal: null,
    onboard: { goal: 30, recommended: null },
    placement: { idx: 0, score: 0, answered: false, selected: null, done: false }
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

      case "setting:voice-preview":
        DL.speech.say("Hi! Nice to meet you. Let's practice English together.");
        return;

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
    }
  });

  document.addEventListener("change", function (e) {
    var el = e.target;
    if (!el || !el.getAttribute) return;
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

    if (DL.ui.screen !== "lesson" && DL.ui.screen !== "result") return;
    if (typing && e.key !== "Enter") return;
    var S = DL.lesson.session;
    if (!S) return;

    if (DL.ui.screen === "lesson") {
      if (S.intro) {
        if (e.key === "Enter") { handle("lesson:start", {}); e.preventDefault(); }
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
      if (e.key === "Enter") {
        e.preventDefault();
        if (S.answered) handle("lesson:continue", {});
        else if (cur && (cur.type === "build" || cur.type === "dictation")) handle("lesson:check", {});
        return;
      }
    }
  });

  window.addEventListener("beforeunload", function () { DL.store.save(); });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) DL.store.syncHearts();
  });

  DL.render = render;
  DL.toast = toast;
  DL.go = go;
  DL.handleAction = handle;

  render();
})();
