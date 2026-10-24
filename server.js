/* Tiny static server for DuoLang: node server.js */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const port = Number(process.env.PORT) || 5173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

/* Natural English TTS proxy (Google Translate voice) with in-memory cache. */
const ttsCache = new Map();
const TTS_LIMIT = 400;

function fetchTts(text, lang, speed, hosts, done) {
  const host = hosts[0];
  const q = encodeURIComponent(text);
  const target = "https://" + host + "/translate_tts?ie=UTF-8&client=" +
    (host.indexOf("googleapis") >= 0 ? "gtx" : "tw-ob") +
    "&tl=" + encodeURIComponent(lang) + "&ttsspeed=" + encodeURIComponent(speed) + "&q=" + q;
  const req = https.get(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept": "audio/mpeg,audio/*;q=0.9,*/*;q=0.5",
      "Referer": "https://translate.google.com/"
    },
    timeout: 8000
  }, (r) => {
    if (r.statusCode !== 200) {
      r.resume();
      if (hosts.length > 1) return fetchTts(text, lang, speed, hosts.slice(1), done);
      return done(new Error("TTS upstream " + r.statusCode));
    }
    const chunks = [];
    r.on("data", (c) => chunks.push(c));
    r.on("end", () => {
      const buf = Buffer.concat(chunks);
      if (!buf.length) return done(new Error("TTS empty"));
      done(null, buf);
    });
  });
  req.on("timeout", () => req.destroy(new Error("TTS timeout")));
  req.on("error", (e) => {
    if (hosts.length > 1) return fetchTts(text, lang, speed, hosts.slice(1), done);
    done(e);
  });
}

http.createServer((req, res) => {
  const parsed = new URL(req.url || "/", "http://localhost");
  const url = decodeURIComponent(parsed.pathname);

  if (url === "/api/tts") {
    const text = String(parsed.searchParams.get("text") || "").trim().slice(0, 300);
    const lang = String(parsed.searchParams.get("lang") || "en").toLowerCase().replace(/[^a-z-]/g, "").slice(0, 8) || "en";
    const rawSpeed = Number(parsed.searchParams.get("speed") || 0.95);
    const speed = Math.min(1.4, Math.max(0.6, isFinite(rawSpeed) ? rawSpeed : 0.95)).toFixed(2);
    if (!text) { res.writeHead(400); res.end("Missing text"); return; }

    const key = lang + "|" + speed + "|" + text;
    const send = (buf) => {
      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": buf.length,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(buf);
    };
    const hit = ttsCache.get(key);
    if (hit) { send(hit); return; }

    fetchTts(text, lang, speed, ["translate.googleapis.com", "translate.google.com"], (err, buf) => {
      if (err || !buf) {
        console.warn("[tts] " + (err ? err.message : "failed") + " — " + text.slice(0, 60));
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("TTS unavailable");
        return;
      }
      if (ttsCache.size >= TTS_LIMIT) ttsCache.delete(ttsCache.keys().next().value);
      ttsCache.set(key, buf);
      send(buf);
    });
    return;
  }

  const rel = url === "/" ? "index.html" : url.replace(/^\/+/, "");
  const file = path.join(root, rel);
  if (!file.startsWith(root)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found: " + rel);
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => {
  console.log("DuoLang running: http://localhost:" + port);
});

