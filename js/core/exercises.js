/* DuoLang — exercise generator */
window.DL = window.DL || {};

DL.ex = (function () {
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/[\u2019']/g, "'")
      .replace(/[^a-z0-9'\s]/g, " ")
      .replace(/\s+/g, " ").trim();
  }
  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) {
      var k = x && x.id ? x.id : norm(x);
      if (!seen[k]) { seen[k] = 1; out.push(x); }
    });
    return out;
  }

  function key(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function makePools(levelUnits) {
    var vocab = [], patterns = [], lines = [];
    levelUnits.forEach(function (u) {
      vocab = vocab.concat(u.vocab);
      patterns = patterns.concat(u.patterns);
      u.dialogues.forEach(function (d) { lines = lines.concat(d.lines); });
    });
    return { vocab: vocab, patterns: patterns, lines: lines };
  }

  function pickTexts(list, correct, n, rnd, mapFn) {
    var seen = {};
    seen[key(correct)] = 1;
    var out = [];
    var pool = shuffle(list, rnd);
    for (var i = 0; i < pool.length && out.length < n; i++) {
      var t = mapFn ? mapFn(pool[i]) : pool[i];
      if (!t) continue;
      var k = key(t);
      if (seen[k]) continue;
      seen[k] = 1;
      out.push(t);
    }
    return out;
  }

  function makeOptions(correct, distractors, rnd) {
    var opts = [{ text: correct, ok: true }];
    distractors.forEach(function (d) { opts.push({ text: d, ok: false }); });
    return shuffle(opts, rnd);
  }

  function chooseEnKo(item, pools, rnd) {
    var d = pickTexts(pools.vocab.concat(pools.patterns), item.ko, 3, rnd, function (x) { return x.ko; });
    return {
      type: "choose", kind: "en-ko", word: item,
      prompt: "다음 표현의 뜻을 고르세요.",
      question: item.en,
      audio: item.en,
      options: makeOptions(item.ko, d, rnd),
      answer: item.ko,
      explain: item.en + "  ·  " + item.ko
    };
  }

  function chooseKoEn(item, pools, rnd) {
    var d = pickTexts(pools.vocab.concat(pools.patterns), item.en, 3, rnd, function (x) { return x.en; });
    return {
      type: "choose", kind: "ko-en", word: item,
      prompt: "다음 뜻에 맞는 영어 표현을 고르세요.",
      question: item.ko,
      audio: null,
      options: makeOptions(item.en, d, rnd),
      answer: item.en,
      explain: item.en + "  ·  " + item.ko
    };
  }

  function listenEx(item, pools, rnd) {
    var d = pickTexts(pools.vocab.concat(pools.patterns), item.en, 3, rnd, function (x) { return x.en; });
    return {
      type: "listen", word: item,
      prompt: "들리는 문장을 고르세요.",
      audio: item.en,
      question: null,
      options: makeOptions(item.en, d, rnd),
      answer: item.en,
      explain: item.ko
    };
  }

  var STOP = { "the": 1, "and": 1, "from": 1, "with": 1, "that": 1, "this": 1, "have": 1, "your": 1, "you": 1, "for": 1, "are": 1, "but": 1 };

  function makeBlank(pattern, pools, rnd) {
    var words = pattern.en.split(" ");
    var best = -1, bestLen = 0;
    for (var i = 1; i < words.length; i++) {
      var clean = norm(words[i]);
      if (!clean || STOP[clean]) continue;
      if (clean.length > bestLen) { bestLen = clean.length; best = i; }
    }
    if (best < 0) best = Math.min(1, words.length - 1);
    var answer = words[best];
    var before = words.slice(0, best).join(" ");
    var after = words.slice(best + 1).join(" ");
    var pool = [];
    pools.vocab.concat(pools.patterns).forEach(function (x) {
      x.en.split(" ").forEach(function (w) {
        var c = norm(w);
        if (c.length >= 3 && !STOP[c]) pool.push(w.replace(/[.,!?]+$/, ""));
      });
    });
    var d = pickTexts(pool, norm(answer), 3, rnd);
    return {
      type: "blank",
      prompt: "빈칸에 알맞은 말을 고르세요.",
      before: before, after: after,
      audio: pattern.en,
      ko: pattern.ko,
      options: makeOptions(answer, d, rnd),
      answer: answer,
      explain: pattern.en + "  ·  " + pattern.ko,
      note: pattern.note
    };
  }

  function buildEx(pattern, pools, rnd) {
    var answer = pattern.en;
    var tokens = answer.split(" ");
    var distract = pickTexts(pools.vocab.concat(pools.patterns), "", 4, rnd, function (x) {
      var w = x.en.split(" ").filter(function (t) { return norm(t).length > 2; });
      return w[Math.floor(rnd() * w.length)] || null;
    }).map(function (t) { return t.replace(/[.,!?]+$/, ""); });
    var extras = [];
    var seen = {};
    tokens.forEach(function (t) { seen[norm(t)] = 1; });
    distract.forEach(function (t) {
      if (seen[norm(t)]) return;
      if (extras.length >= 3) return;
      seen[norm(t)] = 1;
      extras.push(t);
    });
    var bank = shuffle(tokens.map(function (t, i) { return { t: t, i: i }; }).concat(extras.map(function (t, i) { return { t: t, i: tokens.length + i }; })), rnd);
    return {
      type: "build",
      prompt: "다음 뜻을 영어로 만드세요.",
      ko: pattern.ko,
      answer: answer,
      tokens: bank,
      note: pattern.note,
      explain: answer + "  ·  " + pattern.ko
    };
  }

  function dictationEx(pattern, rnd) {
    return {
      type: "dictation",
      prompt: "듣고 그대로 입력하세요.",
      audio: pattern.en,
      ko: pattern.ko,
      answer: pattern.en,
      explain: pattern.en + "  ·  " + pattern.ko
    };
  }

  function speakEx(target, ko, hint) {
    return {
      type: "speak",
      prompt: "큰 소리로 따라 말해 보세요.",
      target: target, ko: ko, hint: hint || "",
      explain: target + "  ·  " + ko
    };
  }

  function roleplayEx(dialogue, at, pools, rnd) {
    var lines = dialogue.lines;
    var k = Math.max(2, Math.min(at, lines.length - 1));
    var context = lines.slice(0, k);
    var correct = lines[k];
    var d = pickTexts(pools.lines, correct.en, 3, rnd, function (x) { return x.en; });
    return {
      type: "roleplay",
      prompt: "대화의 흐름에 맞는 말을 고르세요.",
      dialogueTitle: dialogue.title,
      context: context,
      options: makeOptions(correct.en, d, rnd),
      answer: correct.en,
      answerKo: correct.ko,
      explain: correct.who + ": " + correct.en + "  ·  " + correct.ko
    };
  }

  function comprehensionEx(line, pools, rnd) {
    var d = pickTexts(pools.lines, line.ko, 3, rnd, function (x) { return x.ko; });
    return {
      type: "choose", kind: "en-ko",
      prompt: "대화 속 문장의 뜻을 고르세요.",
      question: line.en,
      audio: line.en,
      options: makeOptions(line.ko, d, rnd),
      answer: line.ko,
      explain: line.who + ": " + line.en + "  ·  " + line.ko
    };
  }

  function buildLesson(unit, index, levelUnits) {
    var rnd = rng(hash(unit.id + ":l" + index));
    var pools = makePools(levelUnits);
    var focus = DL.FOCUS[index] || "mission";
    var out = [];

    if (focus === "vocab") {
      unit.vocab.slice(0, 3).forEach(function (w) { out.push(chooseEnKo(w, pools, rnd)); });
      unit.vocab.slice(0, 3).forEach(function (w) { out.push(listenEx(w, pools, rnd)); });
      unit.vocab.slice(3, 5).forEach(function (w) { out.push(chooseKoEn(w, pools, rnd)); });
      out.push(speakEx(unit.vocab[0].en, unit.vocab[0].ko, "천천히 또박또박 말해 보세요."));
    } else if (focus === "patterns") {
      unit.patterns.slice(0, 3).forEach(function (p) { out.push(buildEx(p, pools, rnd)); });
      unit.patterns.slice(3, 5).forEach(function (p) { out.push(makeBlank(p, pools, rnd)); });
      out.push(chooseEnKo(unit.patterns[5] || unit.patterns[0], pools, rnd));
      out.push(speakEx(unit.patterns[2].en, unit.patterns[2].ko, unit.patterns[2].note));
    } else if (focus === "dialogue") {
      var dia = unit.dialogues[0];
      out.push(roleplayEx(dia, Math.min(3, dia.lines.length - 2), pools, rnd));
      [1, 2].forEach(function (i) {
        if (dia.lines[i]) out.push(comprehensionEx(dia.lines[i], pools, rnd));
      });
      var targets = [dia.lines[dia.lines.length - 2], dia.lines[dia.lines.length - 1]].filter(Boolean);
      targets.forEach(function (line) {
        out.push({
          type: "build", prompt: "대화 속 문장을 완성하세요.",
          ko: line.ko, answer: line.en,
          tokens: shuffle(line.en.split(" ").map(function (t, i) { return { t: t, i: i }; }).concat(
            pickTexts(pools.patterns, line.en, 2, rnd, function (p) {
              var ws = p.en.split(" ").filter(function (w) { return norm(w).length > 3; });
              return ws[Math.floor(rnd() * ws.length)] || null;
            }).map(function (t) { return { t: t.replace(/[.,!?]+$/, ""), i: 100 + rnd() }; })
          ), rnd),
          explain: line.en + "  ·  " + line.ko
        });
      });
      var sp = dia.lines[Math.min(2, dia.lines.length - 1)];
      out.push(speakEx(sp.en, sp.ko, "대화의 억양을 흉내 내 보세요."));
    } else if (focus === "listening") {
      unit.patterns.slice(0, 3).forEach(function (p) { out.push(dictationEx(p, rnd)); });
      unit.vocab.slice(0, 3).forEach(function (w) { out.push(listenEx(w, pools, rnd)); });
      out.push(makeBlank(unit.patterns[3] || unit.patterns[0], pools, rnd));
    } else {
      var d2 = unit.dialogues[1] || unit.dialogues[0];
      out.push(roleplayEx(d2, Math.min(2, d2.lines.length - 2), pools, rnd));
      unit.patterns.slice(4, 6).forEach(function (p) { out.push(buildEx(p, pools, rnd)); });
      unit.vocab.slice(6, 8).forEach(function (w) { out.push(chooseEnKo(w, pools, rnd)); });
      out.push(listenEx(unit.patterns[1], pools, rnd));
      var sp2 = unit.dialogues[1] ? unit.dialogues[1].lines[1] : unit.patterns[3];
      out.push(speakEx(sp2.en, sp2.ko, "실제 상황이라고 생각하고 말해 보세요."));
    }

    var uid = 0;
    out.forEach(function (e) { e.uid = unit.id + "-l" + index + "-e" + (uid++); });
    var words = uniq(out.filter(function (e) { return e.word; }).map(function (e) { return e.word; }));
    return { exercises: out, words: words };
  }

  function buildReview(words, cap) {
    cap = cap || 10;
    var pools = makePools(DL.units);
    var rnd = rng(hash(words.map(function (w) { return w.id; }).join("|") + Date.now()));
    var out = [];
    words.forEach(function (w) {
      out.push(chooseEnKo(w, pools, rnd));
      out.push(chooseKoEn(w, pools, rnd));
    });
    out = shuffle(out, rnd).slice(0, cap);
    out.forEach(function (e, i) { e.uid = "rv-" + i + "-" + e.type; e.review = true; });
    return out;
  }

  function speakSession(prompts) {
    return prompts.map(function (p, i) {
      var e = speakEx(p.en, p.ko, p.hint);
      e.uid = "sp-" + i;
      e.free = true;
      return e;
    });
  }

  return {
    buildLesson: buildLesson, buildReview: buildReview, speakSession: speakSession,
    norm: norm, hash: hash, rng: rng, shuffle: shuffle, uniq: uniq
  };
})();
