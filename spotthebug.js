
(function () {
  "use strict";

  /* ---------- 1. CONFIG (edit me) ---------- */
  var CONFIG = {
    launcherLabel: "Spot the bug",
    teaser: "Think you can debug? 60-second game.",
    teaserDelayMs: 6000,           // show the little teaser once, after this delay
    contactHref: "#contact",       // where the "Let's work together" button goes
    resumeHref: "",                // e.g. "resume.pdf" (leave "" to hide the button)
    projectsHref: "#projects"      // set "" to hide
  };

  /* ---------- 2. QUESTIONS (edit me) ----------
     lines: the code shown. bug: index (0-based) of the buggy line.
     why: plain-English explanation so non-developers enjoy it too. */
  var QUESTIONS = [
    {
      lang: "SQL",
      ask: "This should list paid or pending orders for customer 42 over $100.",
      lines: [
        "SELECT * FROM orders",
        "WHERE customer_id = 42",
        "AND total > 100",
        "AND status = 'paid'",
        "OR status = 'pending';"
      ],
      bug: 4,
      why: "AND binds tighter than OR, so this returns every pending order from every customer. Wrap the two statuses in parentheses."
    },
    {
      lang: "JavaScript",
      ask: "This should return a user's data from an API.",
      lines: [
        "async function getUser(id) {",
        "  const res = fetch('/api/users/' + id);",
        "  const data = await res.json();",
        "  return data;",
        "}"
      ],
      bug: 1,
      why: "fetch() returns a promise. Without await, res is not the response yet, so res.json() blows up. Classic async slip."
    },
    {
      lang: "JavaScript",
      ask: "This should print each fruit in capitals.",
      lines: [
        "const fruits = ['apple', 'mango', 'kiwi'];",
        "for (let i = 0; i <= fruits.length; i++) {",
        "  console.log(fruits[i].toUpperCase());",
        "}"
      ],
      bug: 1,
      why: "<= runs one step too far. fruits[3] is undefined, so the last loop crashes. The loop should use < instead."
    },
    {
      lang: "Node.js",
      ask: "This endpoint looks up a user by id. One line is a security hole.",
      lines: [
        "app.get('/user', (req, res) => {",
        "  const id = req.query.id;",
        "  const sql = 'SELECT * FROM users WHERE id = ' + id;",
        "  db.query(sql, (err, rows) => res.json(rows));",
        "});"
      ],
      bug: 2,
      why: "Gluing user input into SQL allows SQL injection. Use a parameterized query: 'WHERE id = ?' and pass [id]."
    },
    {
      lang: "Python",
      ask: "Each shopping cart should start empty. Why do carts share items?",
      lines: [
        "def add_item(item, cart=[]):",
        "    cart.append(item)",
        "    return cart",
        "",
        "print(add_item('tea'))"
      ],
      bug: 0,
      why: "The default list is created once and reused by every call. Use cart=None and create a new list inside the function."
    }
  ];

  /* ---------- 3. RESULT TITLES ---------- */
  function resultFor(score, total) {
    var pct = score / total;
    if (pct === 1) return { icon: "🕵️", title: "Root Cause Detective", line: "Flawless. You trace problems to the source, just like I do." };
    if (pct >= 0.8) return { icon: "🏆", title: "Senior Bug Hunter", line: "Sharp eyes. Not much gets past you." };
    if (pct >= 0.6) return { icon: "🔧", title: "Solid Debugger", line: "Good instincts. You'd fit right in on a code review." };
    if (pct >= 0.4) return { icon: "🌱", title: "Bug in Training", line: "Respectable. Every great developer misses these at first." };
    return { icon: "🐛", title: "The Bug's Best Friend", line: "The bugs won this round. Come back and take revenge." };
  }

  /* ---------- 4. STYLES ---------- */
  var CSS = "\
.stb{--stb-accent:#7aa2ff;--stb-ok:#5fd3a1;--stb-bad:#ff6b81;--stb-bg:#14161f;--stb-panel:#1c1f2b;--stb-text:#e8e9f0;--stb-muted:#9aa0b4;--stb-radius:14px;\
font-family:inherit;}\
.stb *{box-sizing:border-box}\
.stb-launch{position:fixed;right:20px;bottom:20px;z-index:9998;display:flex;align-items:center;gap:8px;padding:12px 18px;border:0;border-radius:999px;\
background:var(--stb-accent);color:#0c1020;font:600 15px/1 inherit;font-family:inherit;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.28);transition:transform .2s}\
.stb-launch:hover{transform:translateY(-2px)}\
.stb-launch:focus-visible,.stb-btn:focus-visible,.stb-line:focus-visible,.stb-x:focus-visible{outline:3px solid #fff;outline-offset:2px}\
.stb-launch span{display:inline-block;animation:stb-wiggle 3.2s ease-in-out infinite;transform-origin:50% 60%}\
@keyframes stb-wiggle{0%,86%,100%{transform:rotate(0)}90%{transform:rotate(-14deg)}94%{transform:rotate(12deg)}97%{transform:rotate(-8deg)}}\
.stb-tease{position:fixed;right:20px;bottom:74px;z-index:9998;max-width:240px;padding:10px 14px;border-radius:12px;background:var(--stb-bg);color:var(--stb-text);\
font:14px/1.4 inherit;font-family:inherit;box-shadow:0 8px 24px rgba(0,0,0,.28);opacity:0;transform:translateY(6px);pointer-events:none;transition:.3s}\
.stb-tease.on{opacity:1;transform:none;pointer-events:auto}\
.stb-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(6,8,16,.7);backdrop-filter:blur(4px)}\
.stb-overlay.open{display:flex}\
.stb-card{width:100%;max-width:620px;max-height:calc(100vh - 32px);overflow:auto;border-radius:var(--stb-radius);background:var(--stb-bg);color:var(--stb-text);\
box-shadow:0 24px 70px rgba(0,0,0,.5);animation:stb-in .25s ease-out}\
@keyframes stb-in{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}\
.stb-head{display:flex;align-items:center;gap:12px;padding:16px 18px 0}\
.stb-bar{flex:1;height:6px;border-radius:6px;background:var(--stb-panel);overflow:hidden}\
.stb-bar i{display:block;height:100%;width:0;background:var(--stb-accent);transition:width .35s}\
.stb-count{font-size:13px;color:var(--stb-muted);min-width:44px;text-align:right}\
.stb-x{border:0;background:transparent;color:var(--stb-muted);font-size:24px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px}\
.stb-x:hover{color:var(--stb-text)}\
.stb-body{padding:16px 18px 20px}\
.stb-lang{display:inline-block;margin-bottom:6px;font-size:13px;color:var(--stb-accent);font-weight:600}\
.stb-ask{margin:0 0 14px;font-size:17px;line-height:1.45}\
.stb-code{margin:0 0 14px;padding:6px 0;border-radius:10px;background:var(--stb-panel);font:14px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-x:auto}\
.stb-line{display:flex;width:100%;gap:14px;align-items:center;padding:8px 14px;border:0;border-left:3px solid transparent;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;white-space:pre}\
.stb-line b{flex:none;width:18px;color:var(--stb-muted);font-weight:400;text-align:right;user-select:none}\
.stb-line:not(:disabled):hover{background:rgba(122,162,255,.12);border-left-color:var(--stb-accent)}\
.stb-line:disabled{cursor:default}\
.stb-line.ok{background:rgba(95,211,161,.16);border-left-color:var(--stb-ok)}\
.stb-line.bad{background:rgba(255,107,129,.16);border-left-color:var(--stb-bad);animation:stb-shake .35s}\
@keyframes stb-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}\
.stb-fb{min-height:20px;margin:0 0 14px;font-size:15px;line-height:1.5}\
.stb-fb strong{display:block;margin-bottom:2px}\
.stb-fb .ok{color:var(--stb-ok)}.stb-fb .bad{color:var(--stb-bad)}\
.stb-row{display:flex;flex-wrap:wrap;gap:10px}\
.stb-btn{display:inline-block;padding:11px 18px;border:1px solid var(--stb-accent);border-radius:10px;background:var(--stb-accent);color:#0c1020;font:600 15px/1 inherit;font-family:inherit;text-decoration:none;cursor:pointer}\
.stb-btn.ghost{background:transparent;color:var(--stb-text);border-color:#3a3f55}\
.stb-btn:hover{filter:brightness(1.1)}\
.stb-end{text-align:center;padding:10px 0 4px}\
.stb-end .icon{font-size:52px;line-height:1;animation:stb-pop .5s cubic-bezier(.2,1.6,.4,1)}\
@keyframes stb-pop{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}\
.stb-end h2{margin:10px 0 4px;font-size:26px;color:var(--stb-text)}\
.stb-end .score{margin:0 0 8px;color:var(--stb-accent);font-weight:600}\
.stb-end p{margin:0 0 18px;color:var(--stb-muted);line-height:1.5}\
.stb-end .stb-row{justify-content:center}\
@media (prefers-reduced-motion:reduce){.stb *,.stb-card{animation:none!important;transition:none!important}}\
@media (max-width:480px){.stb-launch{right:12px;bottom:12px;padding:11px 15px}.stb-tease{right:12px;bottom:66px}.stb-ask{font-size:16px}}";

  /* ---------- 5. HELPERS ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function safe(fn) { try { return fn(); } catch (e) { return null; } }

  /* ---------- 6. BUILD UI ---------- */
  function init() {
    var style = el("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = el("div", "stb");
    var launch = el("button", "stb-launch");
    launch.type = "button";
    launch.setAttribute("aria-haspopup", "dialog");
    launch.innerHTML = "<span aria-hidden='true'>🐛</span>";
    launch.appendChild(document.createTextNode(CONFIG.launcherLabel));
    var tease = el("div", "stb-tease", CONFIG.teaser);
    tease.setAttribute("role", "status");

    var overlay = el("div", "stb-overlay");
    var card = el("div", "stb-card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", "Spot the bug game");
    overlay.appendChild(card);

    root.appendChild(tease);
    root.appendChild(launch);
    root.appendChild(overlay);
    document.body.appendChild(root);

    var state = { i: 0, score: 0, answered: false, lastFocus: null };

    function open() {
      state.lastFocus = document.activeElement;
      state.i = 0; state.score = 0;
      tease.classList.remove("on");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      renderQuestion();
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
    }

    function header() {
      var h = el("div", "stb-head");
      var bar = el("div", "stb-bar");
      var fill = el("i");
      fill.style.width = (state.i / QUESTIONS.length * 100) + "%";
      bar.appendChild(fill);
      var count = el("span", "stb-count", Math.min(state.i + 1, QUESTIONS.length) + "/" + QUESTIONS.length);
      var x = el("button", "stb-x", "×");
      x.type = "button";
      x.setAttribute("aria-label", "Close game");
      x.addEventListener("click", close);
      h.appendChild(bar); h.appendChild(count); h.appendChild(x);
      return h;
    }

    function renderQuestion() {
      var q = QUESTIONS[state.i];
      state.answered = false;
      card.innerHTML = "";
      card.appendChild(header());

      var body = el("div", "stb-body");
      body.appendChild(el("span", "stb-lang", q.lang));
      body.appendChild(el("p", "stb-ask", q.ask));
      var hint = el("p", "stb-ask", "");
      hint.style.cssText = "font-size:14px;color:var(--stb-muted);margin-top:-6px";
      hint.textContent = "Tap the line with the bug.";
      body.appendChild(hint);

      var code = el("div", "stb-code");
      var btns = q.lines.map(function (text, idx) {
        var b = el("button", "stb-line");
        b.type = "button";
        b.appendChild(el("b", null, String(idx + 1)));
        b.appendChild(el("span", null, text === "" ? " " : text));
        b.addEventListener("click", function () { answer(idx); });
        code.appendChild(b);
        return b;
      });
      body.appendChild(code);

      var fb = el("div", "stb-fb");
      fb.setAttribute("aria-live", "polite");
      body.appendChild(fb);
      var row = el("div", "stb-row");
      body.appendChild(row);
      card.appendChild(body);
      btns[0].focus();

      function answer(idx) {
        if (state.answered) return;
        state.answered = true;
        var right = idx === q.bug;
        if (right) state.score++;
        btns.forEach(function (b) { b.disabled = true; });
        btns[q.bug].classList.add("ok");
        if (!right) btns[idx].classList.add("bad");

        var strong = el("strong", right ? "ok" : "bad", right ? "Found it." : "Not that one.");
        fb.appendChild(strong);
        fb.appendChild(document.createTextNode(q.why));

        var last = state.i === QUESTIONS.length - 1;
        var next = el("button", "stb-btn", last ? "See my result" : "Next bug");
        next.type = "button";
        next.addEventListener("click", function () {
          state.i++;
          if (last) renderEnd(); else renderQuestion();
        });
        row.appendChild(next);
        next.focus();
      }
    }

    function renderEnd() {
      var r = resultFor(state.score, QUESTIONS.length);
      card.innerHTML = "";
      state.i = QUESTIONS.length;
      card.appendChild(header());
      var body = el("div", "stb-body");
      var end = el("div", "stb-end");
      end.appendChild(el("div", "icon", r.icon));
      end.appendChild(el("h2", null, r.title));
      end.appendChild(el("div", "score", state.score + " of " + QUESTIONS.length + " bugs found"));
      end.appendChild(el("p", null, r.line + " If you like how I think, let's build something together."));
      var row = el("div", "stb-row");

      function link(text, href, ghost) {
        var a = el("a", "stb-btn" + (ghost ? " ghost" : ""), text);
        a.href = href;
        a.addEventListener("click", function () { if (href.charAt(0) === "#") close(); });
        row.appendChild(a);
        return a;
      }
      var first = link("Let's work together", CONFIG.contactHref);
      if (CONFIG.projectsHref) link("See my projects", CONFIG.projectsHref, true);
      if (CONFIG.resumeHref) link("Resume", CONFIG.resumeHref, true);
      var again = el("button", "stb-btn ghost", "Play again");
      again.type = "button";
      again.addEventListener("click", function () { state.i = 0; state.score = 0; renderQuestion(); });
      row.appendChild(again);

      end.appendChild(row);
      body.appendChild(end);
      card.appendChild(body);
      first.focus();
    }

    /* open / close wiring */
    launch.addEventListener("click", open);
    tease.addEventListener("click", open);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") { // keep focus inside the dialog
        var f = card.querySelectorAll("button:not(:disabled),a[href]");
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });

    /* one-time, dismissible teaser (never auto-opens the game) */
    if (!safe(function () { return sessionStorage.getItem("stb-teased"); })) {
      setTimeout(function () {
        if (overlay.classList.contains("open")) return;
        tease.classList.add("on");
        safe(function () { sessionStorage.setItem("stb-teased", "1"); });
        setTimeout(function () { tease.classList.remove("on"); }, 7000);
      }, CONFIG.teaserDelayMs);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();