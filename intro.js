/*!
 * Intro Splash – a short, skippable full-screen welcome for your portfolio.
 * Add  <script src="intro-splash.js"></script>  in <head> (no defer) or at the top of <body>
 * so it covers the page immediately. Shows once per browser session.
 * Add ?intro to the URL to force it to play again while testing.
 */
(function () {
  "use strict";

  /* ---------- 1. CONFIG (edit me) ---------- */
  var CONFIG = {
    name: "Kritika",
    role: "I build backend systems, integrations and smart tools.",
    bootLines: [
      { t: "booting portfolio...", ok: false },
      { t: "loading skills: Node.js, Python, SQL", ok: true },
      { t: "connecting APIs", ok: true },
      { t: "bugs found: 0 (so far)", ok: true }
    ],
    question: "What brings you here?",
    /* action: "link" scrolls/jumps to href, "quiz" opens the Spot the Bug game, "close" just enters */
    choices: [
      { label: "I'm hiring", action: "link", href: "#projects" },
      { label: "I have a project", action: "link", href: "#contact" },
      { label: "Challenge me", action: "quiz" },
      { label: "Just exploring", action: "close" }
    ],
    charMs: 22,          // typing speed
    lineGapMs: 260
  };

  /* ---------- 2. SHOW-ONCE LOGIC ---------- */
  function safe(fn) { try { return fn(); } catch (e) { return null; } }
  var force = /[?&]intro\b/.test(location.search);
  if (!force && safe(function () { return sessionStorage.getItem("intro-seen"); })) return;

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 3. STYLES ---------- */
  var CSS = "\
.isp{--a:#7aa2ff;--ok:#5fd3a1;--bg:#0c0e16;--text:#e8e9f0;--muted:#9aa0b4;\
position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg);color:var(--text);\
font-family:inherit;overflow:auto;transition:transform .7s cubic-bezier(.7,0,.2,1),opacity .7s}\
.isp *{box-sizing:border-box}\
.isp.out{transform:translateY(-100%);opacity:.4;pointer-events:none}\
.isp::before{content:'';position:absolute;inset:0;pointer-events:none;\
background-image:linear-gradient(rgba(122,162,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(122,162,255,.07) 1px,transparent 1px);background-size:44px 44px;\
mask-image:radial-gradient(circle 360px at var(--mx,50%) var(--my,40%),#000,transparent);-webkit-mask-image:radial-gradient(circle 360px at var(--mx,50%) var(--my,40%),#000,transparent)}\
.isp::after{content:'';position:absolute;width:520px;height:520px;left:calc(var(--mx,50%) - 260px);top:calc(var(--my,40%) - 260px);border-radius:50%;pointer-events:none;\
background:radial-gradient(circle,rgba(122,162,255,.16),transparent 65%)}\
.isp-in{position:relative;z-index:1;width:100%;max-width:640px}\
.isp-skip{position:fixed;top:16px;right:18px;z-index:2;padding:8px 14px;border:1px solid #2c3146;border-radius:999px;background:transparent;color:var(--muted);font:14px/1 inherit;font-family:inherit;cursor:pointer}\
.isp-skip:hover{color:var(--text);border-color:var(--a)}\
.isp button:focus-visible{outline:3px solid #fff;outline-offset:2px}\
.isp-term{min-height:112px;margin:0 0 28px;font:15px/1.8 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--muted)}\
.isp-term .ok{color:var(--ok)}\
.isp-term .caret{display:inline-block;width:8px;height:16px;margin-left:3px;vertical-align:-2px;background:var(--a);animation:isp-blink 1s steps(1) infinite}\
@keyframes isp-blink{50%{opacity:0}}\
.isp-hero{opacity:0;transform:translateY(14px);transition:opacity .7s,transform .7s}\
.isp-hero.on{opacity:1;transform:none}\
.isp-hero h1{margin:0 0 10px;font-size:clamp(38px,9vw,68px);line-height:1.05;color:var(--text);letter-spacing:-.02em}\
.isp-hero p{margin:0;font-size:clamp(16px,2.6vw,20px);line-height:1.5;color:var(--muted);max-width:30em}\
.isp-ask{margin:30px 0 12px;font-size:15px;color:var(--muted);opacity:0;transition:opacity .5s}\
.isp-choices{display:flex;flex-wrap:wrap;gap:10px;opacity:0;transform:translateY(8px);transition:opacity .5s .1s,transform .5s .1s}\
.isp-ask.on,.isp-choices.on{opacity:1;transform:none}\
.isp-choices button{padding:12px 20px;border:1px solid #343a54;border-radius:10px;background:#161a28;color:var(--text);font:600 15px/1 inherit;font-family:inherit;cursor:pointer;transition:.2s}\
.isp-choices button:hover{border-color:var(--a);background:#1d2338;transform:translateY(-2px)}\
@media (prefers-reduced-motion:reduce){.isp,.isp-hero,.isp-ask,.isp-choices{transition:none!important}.caret{animation:none!important}}";

  /* ---------- 4. HELPERS ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- 5. BUILD ---------- */
  function build() {
    var style = el("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = el("div", "isp");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Welcome");
    var inner = el("div", "isp-in");

    var skip = el("button", "isp-skip", "Skip intro");
    skip.type = "button";

    var term = el("div", "isp-term");
    var hero = el("div", "isp-hero");
    hero.appendChild(el("h1", null, "Hi, I'm " + CONFIG.name + "."));
    hero.appendChild(el("p", null, CONFIG.role));
    var ask = el("div", "isp-ask", CONFIG.question);
    var choices = el("div", "isp-choices");

    inner.appendChild(term); inner.appendChild(hero); inner.appendChild(ask); inner.appendChild(choices);
    root.appendChild(skip); root.appendChild(inner);
    document.body.appendChild(root);
    document.body.style.overflow = "hidden";

    var finished = false, closed = false;

    function close(after) {
      if (closed) return;
      closed = true;
      safe(function () { sessionStorage.setItem("intro-seen", "1"); });
      document.removeEventListener("keydown", onKey);
      root.classList.add("out");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
        if (typeof after === "function") after();
      }, reduce ? 0 : 700);
    }

    function goTo(href) {
      var t = href && href.charAt(0) === "#" ? document.querySelector(href) : null;
      if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      else if (href) location.href = href;
    }

    choices.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var c = CONFIG.choices[+b.getAttribute("data-i")];
      close(function () {
        if (c.action === "link") goTo(c.href);
        else if (c.action === "quiz") {
          var q = document.querySelector(".stb-launch");
          if (q) q.click();
        }
      });
    });

    CONFIG.choices.forEach(function (c, i) {
      var b = el("button", null, c.label);
      b.type = "button";
      b.setAttribute("data-i", i);
      choices.appendChild(b);
    });

    function showEnd() {
      if (finished) return;
      finished = true;
      term.innerHTML = "";
      CONFIG.bootLines.forEach(function (l) {
        var d = el("div");
        d.textContent = "> " + l.t + (l.ok ? "  " : "");
        if (l.ok) d.appendChild(el("span", "ok", "[ok]"));
        term.appendChild(d);
      });
      hero.classList.add("on"); ask.classList.add("on"); choices.classList.add("on");
      var first = choices.querySelector("button");
      if (first) first.focus({ preventScroll: true });
    }

    skip.addEventListener("click", function () { close(); });

    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") { // keep focus inside intro
        var f = root.querySelectorAll("button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    }
    document.addEventListener("keydown", onKey);

    root.addEventListener("pointermove", function (e) {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    });

    /* typed boot sequence */
    (async function typeBoot() {
      if (reduce) { showEnd(); return; }
      for (var i = 0; i < CONFIG.bootLines.length && !finished; i++) {
        var l = CONFIG.bootLines[i];
        var row = el("div");
        var txt = document.createTextNode("> ");
        var caret = el("span", "caret");
        row.appendChild(txt); row.appendChild(caret);
        term.appendChild(row);
        for (var k = 1; k <= l.t.length && !finished; k++) {
          txt.nodeValue = "> " + l.t.slice(0, k);
          await wait(CONFIG.charMs);
        }
        if (finished) return;
        caret.remove();
        if (l.ok) { row.appendChild(document.createTextNode("  ")); row.appendChild(el("span", "ok", "[ok]")); }
        await wait(CONFIG.lineGapMs);
      }
      showEnd();
    })();
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();