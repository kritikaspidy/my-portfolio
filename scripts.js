// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (follows system by default, remembers manual choice)
const root = document.documentElement;
const isDark = () =>
  root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Highlight the nav link for the section in view
const links = document.querySelectorAll(".nav a[href^='#']");
const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => s && observer.observe(s));


// Typing effect on the designation
(function () {
  const el = document.getElementById("typed");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const words = ["Full stack developer", "Software developer"];
  let w = 0, i = words[0].length, deleting = true; // starts fully typed, then cycles

  function tick() {
    const word = words[w];
    el.textContent = word.slice(0, i);
    let delay = deleting ? 40 : 90;

    if (!deleting && i === word.length) { deleting = true; delay = 1800; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
    else { i += deleting ? -1 : 1; }

    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
})();

// Contact form (EmailJS)
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const btn = document.getElementById("send-btn");
  const status = document.getElementById("form-status");

  if (window.emailjs) emailjs.init({ publicKey: "HvzKH6rXLSuwvNAPM" });

  const say = (msg, type) => { status.textContent = msg; status.className = "form__status " + (type || ""); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!window.emailjs) { say("Email service didn't load. Please email me directly.", "err"); return; }

    btn.disabled = true; btn.textContent = "Sending…"; say("");
    try {
      await emailjs.send("service_06g5u91", "template_wafq7p1", {
        name: form.elements["name"].value,
        email: form.elements["email"].value,
        subject: form.elements["subject"].value,
        message: form.elements["message"].value,
      });
      say("Message sent. Thanks, I'll reply soon.", "ok");
      form.reset();
    } catch (err) {
      console.error("EmailJS failed:", err);
      say("Couldn't send. Please email me directly instead.", "err");
    } finally {
      btn.disabled = false; btn.textContent = "Send message";
    }
  });
})();
