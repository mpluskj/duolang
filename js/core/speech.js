/* DuoLang — speech (TTS + recognition + sound effects) */
window.DL = window.DL || {};

DL.speech = (function () {
  var synth = window.speechSynthesis || null;
  var voicesLoaded = false;
  var audioCtx = null;
  var recognition = null;
  var listening = false;
  var sayToken = 0;
  var onlineAudio = null;

  var ONLINE_URI = "__online__";

  /* Higher score = more natural / better suited for learning English. */
  function voiceScore(v) {
    var n = String(v.name || "").toLowerCase();
    var lang = String(v.lang || "").toLowerCase();
    var s = 0;
    if (/natural|neural/.test(n)) s += 120;
    if (/online/.test(n)) s += 50;
    if (/google/.test(n)) s += 45;
    if (/aria|jenny|sonia|libby|ava|andrew|emma|brian|guy|christopher|eric|michelle|samantha|karen|daniel|moira|tessa|serena|allison|susan|nicky|aaron|alex/.test(n)) s += 25;
    if (/^en-us/.test(lang)) s += 15;
    else if (/^en-gb/.test(lang)) s += 8;
    else if (/^en-au/.test(lang)) s += 4;
    if (/desktop|compact|espeak|festival|pico|robot/.test(n)) s -= 40;
    return s;
  }

  function englishVoices() {
    if (!synth) return [];
    var voices = (synth.getVoices() || []).filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ""); });
    return voices.sort(function (a, b) { return voiceScore(b) - voiceScore(a); });
  }

  function chosenURI() {
    return (DL.store && DL.store.state.settings.voiceURI) || "";
  }

  function pickVoice() {
    var voices = englishVoices();
    if (!voices.length) return null;
    var chosen = voices.filter(function (v) { return v.voiceURI === chosenURI(); })[0];
    if (chosen) return chosen;
    return voices[0] || null;
  }

  /* Auto prefers a natural/Google device voice, then the online voice. */
  function engineFor() {
    var chosen = chosenURI();
    if (chosen === ONLINE_URI) return "online";
    if (chosen) return "device";
    var top = englishVoices()[0];
    if (!top) return onlineAvailable() ? "online" : "device";
    return voiceScore(top) >= 35 || !onlineAvailable() ? "device" : "online";
  }

  function onlineAvailable() {
    if (typeof Audio === "undefined" || !window.URL) return false;
    return /^https?:$/.test(window.location.protocol);
  }

  function ready() {
    if (!synth) return false;
    if (!voicesLoaded) {
      voicesLoaded = !!(synth.getVoices() || []).length;
    }
    return true;
  }

  function onVoicesChanged() {
    voicesLoaded = true;
    try {
      window.dispatchEvent(new CustomEvent("dl:voices"));
    } catch (e) {}
  }

  if (synth) {
    ready();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", onVoicesChanged);
    } else {
      synth.onvoiceschanged = onVoicesChanged;
    }
  }

  function available() { return !!(synth || onlineAvailable()); }

  function voiceName(v) {
    if (!v) return "";
    return String(v.name || "").replace(/^Microsoft\s+/i, "").replace(/\s*Online\s*\(Natural\)/i, "");
  }

  function voiceTag(v) {
    if (!v) return "";
    if (/natural|neural|online/i.test(v.name || "")) return "자연 음성";
    if (/google/i.test(v.name || "")) return "Google";
    return "기본";
  }

  function voiceOptions() {
    return englishVoices().map(function (v) {
      var region = /^en[-_]US/i.test(v.lang) ? "US" : /^en[-_]GB/i.test(v.lang) ? "UK" : /^en[-_]AU/i.test(v.lang) ? "AU" : String(v.lang || "").replace(/^en[-_]?/i, "").toUpperCase();
      return {
        uri: v.voiceURI,
        name: voiceName(v),
        lang: v.lang,
        region: region,
        tag: voiceTag(v),
        natural: /natural|neural|online/i.test(v.name || ""),
        label: voiceName(v) + " · " + (region || "EN") + " · " + voiceTag(v)
      };
    });
  }

  function bestVoiceLabel() {
    var chosen = chosenURI();
    if (chosen === ONLINE_URI) return "온라인 자연 음성 · Google";
    var v = pickVoice();
    if (chosen && v) return voiceName(v) + " · " + voiceTag(v);
    if (engineFor() === "online") return "온라인 자연 음성 · Google";
    return v ? voiceName(v) + " · " + voiceTag(v) : "브라우저 기본 음성";
  }

  function stopOnline() {
    if (!onlineAudio) return;
    var a = onlineAudio;
    onlineAudio = null;
    try {
      a.onended = null;
      a.onerror = null;
      a.pause();
      a.currentTime = 0;
    } catch (e) {}
  }

  function speakDevice(clean, opts, token) {
    if (!synth) return;
    /* A short gap avoids Chrome cutting off the first syllable after cancel(). */
    setTimeout(function () {
      if (token !== sayToken) return;
      var u = new SpeechSynthesisUtterance(clean);
      var v = opts.voice || pickVoice();
      u.lang = (v && v.lang) || "en-US";
      u.rate = opts.rate || (DL.store && DL.store.state.settings.rate) || 0.95;
      u.pitch = opts.pitch || 1;
      u.volume = 1;
      if (v) u.voice = v;
      if (opts.onend) u.onend = opts.onend;
      if (opts.onstart) u.onstart = opts.onstart;
      try {
        synth.speak(u);
        if (synth.paused) synth.resume();
      } catch (e) {}
    }, 45);
  }

  function speakOnline(clean, opts, token) {
    if (!onlineAvailable()) return false;
    stopOnline();
    var rate = Math.max(0.6, Math.min(1.4, opts.rate || (DL.store && DL.store.state.settings.rate) || 0.95));
    var url = "/api/tts?lang=en&speed=1&text=" + encodeURIComponent(clean);
    var audio = new Audio(url);
    onlineAudio = audio;
    audio.preload = "auto";
    try {
      audio.preservesPitch = true;
      audio.webkitPreservesPitch = true;
      audio.playbackRate = rate;
    } catch (e) {}
    var settled = false;
    function fallback() {
      if (settled || token !== sayToken) return;
      settled = true;
      if (onlineAudio === audio) onlineAudio = null;
      speakDevice(clean, opts, token);
    }
    audio.onended = function () {
      settled = true;
      if (onlineAudio === audio) onlineAudio = null;
      if (opts.onend) opts.onend();
    };
    audio.onerror = fallback;
    try {
      var p = audio.play();
      if (p && p.catch) p.catch(fallback);
    } catch (e) {
      fallback();
    }
    return true;
  }

  function say(text, opts) {
    opts = opts || {};
    if (!text) return;
    var clean = String(text).replace(/\s+/g, " ").trim();
    if (!clean) return;
    var token = ++sayToken;
    try { if (synth) synth.cancel(); } catch (e) {}
    stopOnline();
    stopUserVoice();
    if (engineFor() === "online" && speakOnline(clean, opts, token)) return;
    speakDevice(clean, opts, token);
  }

  function stop() {
    sayToken++;
    stopOnline();
    stopUserVoice();
    if (synth) { try { synth.cancel(); } catch (e) {} }
    stopListening();
  }

  function canListen() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function needsHttps() {
    if (window.isSecureContext) return false;
    var host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") return false;
    return true;
  }

  var mediaRecorder = null;
  var recordedChunks = [];
  var lastUserAudioUrl = null;
  var micStream = null;

  function initMediaRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      micStream = stream;
      recordedChunks = [];
      try {
        var mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" :
                   MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
        mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (e) {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.start();
      } catch (err) {}
    }).catch(function () {});
  }

  function finishMediaRecording(cb) {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.onstop = function () {
        var mime = (mediaRecorder && mediaRecorder.mimeType) || "audio/webm";
        var blob = new Blob(recordedChunks, { type: mime });
        if (lastUserAudioUrl) {
          try { URL.revokeObjectURL(lastUserAudioUrl); } catch (e) {}
        }
        lastUserAudioUrl = URL.createObjectURL(blob);
        if (micStream) {
          try { micStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
          micStream = null;
        }
        if (cb) cb(lastUserAudioUrl);
      };
      try { mediaRecorder.stop(); } catch (e) { if (cb) cb(null); }
    } else {
      if (micStream) {
        try { micStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        micStream = null;
      }
      if (cb) cb(lastUserAudioUrl);
    }
  }

  var currentUserAudio = null;

  function stopUserVoice() {
    if (currentUserAudio) {
      try {
        currentUserAudio.pause();
        currentUserAudio.currentTime = 0;
        currentUserAudio.onended = null;
      } catch (e) {}
      currentUserAudio = null;
    }
  }

  function playUserVoice(onEnd) {
    if (!lastUserAudioUrl) return false;
    stop(); // stop any TTS
    stopUserVoice();
    var a = new Audio(lastUserAudioUrl);
    currentUserAudio = a;
    a.onended = function () {
      currentUserAudio = null;
      if (onEnd) onEnd();
    };
    a.play().catch(function () {});
    return true;
  }

  function hasUserVoice() {
    return !!lastUserAudioUrl;
  }

  function listen(handlers) {
    handlers = handlers || {};
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) { if (handlers.onUnsupported) handlers.onUnsupported(); return false; }
    stopListening();
    initMediaRecording();
    try {
      recognition = new Rec();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;
      listening = true;
      var done = false;

      recognition.onstart = function () { if (handlers.onStart) handlers.onStart(); };
      recognition.onresult = function (ev) {
        var best = "";
        try {
          var res = ev.results[0];
          for (var i = 0; i < res.length; i++) {
            if (!best || (res[i].confidence || 0) > (res[0].confidence || 0)) best = res[i].transcript;
          }
          if (!best) best = res[0][0].transcript;
        } catch (e) {}
        done = true;
        listening = false;
        finishMediaRecording(function () {
          if (handlers.onResult) handlers.onResult(best || "");
        });
      };
      recognition.onerror = function (ev) {
        done = true; listening = false;
        finishMediaRecording(function () {
          if (handlers.onError) handlers.onError(ev && ev.error ? ev.error : "error");
        });
      };
      recognition.onend = function () {
        listening = false;
        finishMediaRecording(function () {
          if (!done && handlers.onEnd) handlers.onEnd();
          if (handlers.onDone) handlers.onDone();
        });
      };
      recognition.start();
      setTimeout(function () {
        if (listening) { try { recognition.stop(); } catch (e) {} }
      }, 9000);
      return true;
    } catch (e) {
      listening = false;
      finishMediaRecording();
      if (handlers.onError) handlers.onError("not-allowed");
      return false;
    }
  }

  function stopListening() {
    if (recognition && listening) {
      try { recognition.abort(); } catch (e) {}
    }
    listening = false;
    finishMediaRecording();
  }

  function isListening() { return listening; }

  /* similarity 0..1 — token LCS weighted with character overlap */
  function normalize(s) {
    return String(s || "").toLowerCase()
      .replace(/[\u2019']/g, "'")
      .replace(/[^a-z0-9'\s]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  function similarity(target, heard) {
    var a = normalize(target).split(" ").filter(Boolean);
    var b = normalize(heard).split(" ").filter(Boolean);
    if (!a.length || !b.length) return 0;
    var dp = [];
    for (var i = 0; i <= a.length; i++) { dp.push(new Array(b.length + 1).fill(0)); }
    for (i = 1; i <= a.length; i++) {
      for (var j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    var lcs = dp[a.length][b.length] / a.length;
    var charsA = normalize(target).replace(/\s/g, "");
    var charsB = normalize(heard).replace(/\s/g, "");
    var charScore = 0;
    if (charsA && charsB) {
      var setB = {};
      for (var k = 0; k < charsB.length; k++) setB[charsB[k]] = (setB[charsB[k]] || 0) + 1;
      var hit = 0;
      for (k = 0; k < charsA.length; k++) {
        if (setB[charsA[k]]) { hit++; setB[charsA[k]]--; }
      }
      charScore = hit / charsA.length;
    }
    return Math.min(1, lcs * 0.75 + charScore * 0.25);
  }

  function editDistance(a, b) {
    if (a === b) return 0;
    var d = [];
    for (var i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (var j = 0; j <= b.length; j++) { d[0][j] = j; }
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }
    return d[a.length][b.length];
  }

  function compareWords(target, heard) {
    var rawWords = String(target || "").trim().split(/\s+/).filter(Boolean);
    var normTarget = rawWords.map(function (w) { return normalize(w); });
    var normHeard = normalize(heard).split(" ").filter(Boolean);

    if (!normHeard.length) {
      return rawWords.map(function (w) { return { word: w, status: "miss" }; });
    }

    var heardUsed = new Array(normHeard.length).fill(false);
    var results = new Array(rawWords.length);

    for (var i = 0; i < normTarget.length; i++) {
      var tw = normTarget[i];
      for (var j = 0; j < normHeard.length; j++) {
        if (!heardUsed[j] && normHeard[j] === tw) {
          heardUsed[j] = true;
          results[i] = { word: rawWords[i], status: "match" };
          break;
        }
      }
    }

    for (i = 0; i < normTarget.length; i++) {
      if (results[i]) continue;
      tw = normTarget[i];
      var bestIdx = -1;
      var bestDist = 999;
      for (j = 0; j < normHeard.length; j++) {
        if (!heardUsed[j]) {
          var dist = editDistance(tw, normHeard[j]);
          var threshold = tw.length >= 5 ? 2 : 1;
          if (dist <= threshold && dist < bestDist) {
            bestDist = dist;
            bestIdx = j;
          }
        }
      }
      if (bestIdx !== -1) {
        heardUsed[bestIdx] = true;
        results[i] = { word: rawWords[i], status: "close" };
      } else {
        results[i] = { word: rawWords[i], status: "miss" };
      }
    }
    return results;
  }

  /* tiny synth SFX */
  function ctx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") { try { audioCtx.resume(); } catch (e) {} }
    return audioCtx;
  }

  function tone(freq, start, dur, gain, type) {
    var c = ctx();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, c.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.03);
  }

  function sound(name) {
    if (DL.store && !DL.store.state.settings.sound) return;
    try {
      if (name === "correct") { tone(660, 0, 0.12, 0.09); tone(880, 0.09, 0.18, 0.08); }
      else if (name === "wrong") { tone(180, 0, 0.2, 0.08, "triangle"); tone(140, 0.12, 0.22, 0.06, "triangle"); }
      else if (name === "complete") { tone(523, 0, 0.14, 0.09); tone(659, 0.12, 0.14, 0.09); tone(784, 0.24, 0.24, 0.09); }
      else if (name === "tap") { tone(420, 0, 0.05, 0.04); }
      else if (name === "tick") { tone(720, 0, 0.035, 0.04); }
    } catch (e) {}
  }

  function unlockAudio() {
    var c = ctx();
    if (c && c.state === "suspended") {
      try { c.resume(); } catch (e) {}
    }
    if (synth && synth.getVoices) {
      try { synth.getVoices(); } catch (e) {}
    }
  }

  return {
    available: available, say: say, stop: stop, canListen: canListen, needsHttps: needsHttps,
    listen: listen, stopListening: stopListening, isListening: isListening,
    playUserVoice: playUserVoice, hasUserVoice: hasUserVoice,
    similarity: similarity, compareWords: compareWords, normalize: normalize, sound: sound,
    voiceOptions: voiceOptions, bestVoiceLabel: bestVoiceLabel,
    onlineAvailable: onlineAvailable, ONLINE_URI: ONLINE_URI, unlockAudio: unlockAudio
  };
})();
