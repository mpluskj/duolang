/* DuoLang — Gemini AI Free-talking with Multi-Key Rotation & Context Memory */
window.DL = window.DL || {};

DL.gemini = (function () {
  var DEFAULT_MODEL = "gemini-1.5-flash";
  var API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

  var activeKeyIndex = 0;
  var keyStats = {}; // { [key]: { calls: 0, tokens: 0, errors: 0, lastUsed: 0 } }

  function getKeys() {
    var raw = (DL.store && DL.store.state.settings.geminiKeys) || [];
    if (typeof raw === "string") {
      return raw.split(/[\n,;]+/).map(function (k) { return k.trim(); }).filter(Boolean);
    }
    return Array.isArray(raw) ? raw.map(function (k) { return String(k).trim(); }).filter(Boolean) : [];
  }

  function hasKey() {
    return getKeys().length > 0;
  }

  function getActiveKey() {
    var keys = getKeys();
    if (!keys.length) return null;
    if (activeKeyIndex >= keys.length) activeKeyIndex = 0;
    return keys[activeKeyIndex];
  }

  function rotateKey() {
    var keys = getKeys();
    if (keys.length <= 1) return null;
    var prev = activeKeyIndex;
    activeKeyIndex = (activeKeyIndex + 1) % keys.length;
    return { prevIndex: prev, newIndex: activeKeyIndex, key: keys[activeKeyIndex] };
  }

  function recordUsage(key, tokenCount, isError) {
    if (!key) return;
    var masked = key.slice(0, 4) + "..." + key.slice(-4);
    if (!keyStats[masked]) {
      keyStats[masked] = { calls: 0, tokens: 0, errors: 0, lastUsed: Date.now() };
    }
    keyStats[masked].calls++;
    keyStats[masked].tokens += (tokenCount || 0);
    keyStats[masked].lastUsed = Date.now();
    if (isError) keyStats[masked].errors++;
  }

  function getStats() {
    return keyStats;
  }

  /* 4-stage Conversation Framework */
  var STAGES = [
    { no: 1, name: "오프닝 & 스몰토크", desc: "편안한 인사와 오늘의 기분, 가벼운 근황 나누기" },
    { no: 2, name: "주제 탐구 & 핵심 대화", desc: "상황에 몰입하여 구체적인 생각과 의견 표현하기" },
    { no: 3, name: "심화 & 돌발 상황", desc: "예상치 못한 질문이나 문제 상황에 유연하게 대처하기" },
    { no: 4, name: "마무리 & 맞춤 피드백", desc: "대화 요약, 칭찬, 더 자연스러운 표현 팁 받기" }
  ];

  var SCENARIOS = [
    {
      id: "daily",
      emoji: "☕",
      title: "자유 일상 & 취미 스몰토크",
      desc: "오늘 하루, 취미, 주말 계획에 대해 친구와 수다 떨듯 대화해요.",
      role: "Friendly American Friend (Emma)",
      stageGoal: "편안하게 감정과 일상 공유하기"
    },
    {
      id: "travel",
      emoji: "✈️",
      title: "해외여행 돌발 상황 해결",
      desc: "공항 수하물 분실, 호텔 룸 체인지 등 여행 중 돌발 상황을 해결해요.",
      role: "Airport/Hotel Staff & Local Guide (Alex)",
      stageGoal: "돌발 상황에서 원하는 바를 정확히 요구하기"
    },
    {
      id: "business",
      emoji: "💼",
      title: "글로벌 비즈니스 & 의견 조율",
      desc: "프로젝트 진행 상황, 일정 조율, 의견 제안을 프로페셔널하게 연습해요.",
      role: "Global Project Manager (David)",
      stageGoal: "격식 있는 어조로 명확하고 정중하게 설득하기"
    },
    {
      id: "interview",
      emoji: "🎯",
      title: "영어 면접 & 자기소개",
      desc: "강점, 경험, 위기 극복 스토리를 조리 있게 답변하는 인터뷰 훈련.",
      role: "Interviewer (Sarah)",
      stageGoal: "핵심 성과와 역량을 자신감 있게 어필하기"
    },
    {
      id: "debate",
      emoji: "🔥",
      title: "찬반 토론 & 생각 표현하기",
      desc: "AI 기술, 원격 근무 등 흥미로운 이슈에 대해 내 주장을 논리적으로 펴요.",
      role: "Debate Partner (Leo)",
      stageGoal: "상대방 의견을 존중하며 근거를 들어 반론하기"
    }
  ];

  function buildSystemInstruction(scenario, level) {
    var lvlDesc = level === "beginner" ? "A1-A2 (Use simple, clear sentences with friendly vocabulary. Keep responses under 2-3 sentences.)"
      : level === "intermediate" ? "B1-B2 (Use natural conversational idioms and compound sentences. 3-4 sentences.)"
      : "C1 (Use sophisticated vocabulary, natural transitions, and authentic nuances.)";

    return "You are DuoLang AI Tutor, an encouraging and world-class English conversation partner. " +
      "Role: " + scenario.role + " in topic '" + scenario.title + "'. " +
      "Learner's English Level: " + lvlDesc + ".\n\n" +
      "CRITICAL RESPONSE FORMAT RULES (Follow STRICTLY):\n" +
      "1. Respond in natural, warm spoken English matching the learner's level.\n" +
      "2. Advance the conversation according to the current stage (1: Warmup -> 2: Topic -> 3: Twist/Challenge -> 4: Wrap-up).\n" +
      "3. If the user made notable grammar/vocabulary mistakes or could say something much more naturally, provide a brief tip in JSON block at the very end.\n" +
      "4. Format your entire output as valid JSON:\n" +
      "{\n" +
      '  "en": "Your spoken English reply here",\n' +
      '  "ko": "자연스러운 한국어 번역",\n' +
      '  "correction": "사용자가 말한 문장에 대한 팁 (있을 경우: 더 자연스러운 표현 / 교정, 없을 경우 null)",\n' +
      '  "suggestedReplies": ["학습자가 말할 수 있는 추천 답변 1", "추천 답변 2"],\n' +
      '  "stage": 1 to 4\n' +
      "}";
  }

  /* Core API Request with Auto-rotation */
  function generateReply(session, userMessage, cb) {
    var keys = getKeys();
    if (!keys.length) {
      if (cb) cb({ error: "no_keys", message: "Gemini API 키를 먼저 등록해 주세요." });
      return;
    }

    var level = (DL.store && DL.store.state.profile.level) || "beginner";
    var systemPrompt = buildSystemInstruction(session.scenario, level);

    // Append user message to history
    session.history.push({ role: "user", parts: [{ text: userMessage }] });

    // Format contents for Gemini REST API
    var contents = session.history.map(function (h) {
      return {
        role: h.role === "user" ? "user" : "model",
        parts: h.parts
      };
    });

    var attempt = 0;
    var maxAttempts = keys.length;

    function trySend() {
      var currentKey = getActiveKey();
      var url = API_BASE + DEFAULT_MODEL + ":generateContent?key=" + encodeURIComponent(currentKey);

      var payload = {
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      };

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (res.status === 429 || res.status === 403) {
          // Quota exceeded or permission issue -> rotate
          recordUsage(currentKey, 0, true);
          var rot = rotateKey();
          attempt++;
          if (attempt < maxAttempts && rot) {
            if (DL.toast) DL.toast("⚡ API 키 #" + (rot.prevIndex + 1) + " 쿼터 소진 → #" + (rot.newIndex + 1) + "키로 자동 전환!");
            trySend();
            return;
          } else {
            throw new Error("모든 API 키의 쿼터가 소진되었거나 유효하지 않습니다.");
          }
        }
        if (!res.ok) {
          throw new Error("Gemini API 오류 (HTTP " + res.status + ")");
        }
        return res.json();
      })
      .then(function (data) {
        var tokenCount = data.usageMetadata ? data.usageMetadata.totalTokenCount : 0;
        recordUsage(currentKey, tokenCount, false);

        var candidate = data.candidates && data.candidates[0];
        var text = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;
        if (!text) throw new Error("Gemini로부터 응답을 받지 못했습니다.");

        var parsed;
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          parsed = {
            en: text,
            ko: "번역을 생성하지 못했습니다.",
            correction: null,
            suggestedReplies: [],
            stage: session.stage || 1
          };
        }

        // Add model reply to session history
        session.history.push({ role: "model", parts: [{ text: text }] });
        if (parsed.stage) session.stage = Math.max(session.stage || 1, parsed.stage);

        if (cb) cb({ ok: true, data: parsed, tokenCount: tokenCount, keyIndex: activeKeyIndex });
      })
      .catch(function (err) {
        attempt++;
        if (attempt < maxAttempts && keys.length > 1) {
          var rot = rotateKey();
          if (rot && DL.toast) DL.toast("⚠️ 오류 발생 → 다음 API 키(#" + (rot.newIndex + 1) + ")로 재시도합니다.");
          trySend();
        } else {
          if (cb) cb({ error: "request_failed", message: err.message || "요청에 실패했습니다." });
        }
      });
    }

    trySend();
  }

  /* Test an API key */
  function testKey(key, cb) {
    if (!key) { if (cb) cb(false, "키를 입력해 주세요."); return; }
    var url = API_BASE + DEFAULT_MODEL + ":generateContent?key=" + encodeURIComponent(key);
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Hello! Answer with 'OK' only." }] }]
      })
    })
    .then(function (res) {
      if (res.ok) return res.json();
      throw new Error("HTTP " + res.status);
    })
    .then(function () {
      if (cb) cb(true, "유효한 API 키입니다! 정상 동작을 확인했어요.");
    })
    .catch(function (err) {
      if (cb) cb(false, "키 확인 실패: " + err.message);
    });
  }

  return {
    getKeys: getKeys,
    hasKey: hasKey,
    getActiveKey: getActiveKey,
    rotateKey: rotateKey,
    getStats: getStats,
    STAGES: STAGES,
    SCENARIOS: SCENARIOS,
    generateReply: generateReply,
    testKey: testKey
  };
})();
