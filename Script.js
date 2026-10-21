(() => {
  const root = document.documentElement;
  const safe = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
  };

  // Theme: saved choice > system preference
  const saved = safe(() => localStorage.getItem("theme"));
  if (saved) root.dataset.theme = saved;
  const themeBtn = document.getElementById("theme");
  const isDark = () =>
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  const label = () => {
    themeBtn.textContent = isDark() ? "Light" : "Dark";
    themeBtn.setAttribute(
      "aria-label",
      isDark() ? "Switch to light theme" : "Switch to dark theme",
    );
  };
  label();
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    safe(() => localStorage.setItem("theme", root.dataset.theme));
    label();
  });

  // Copy email
  const copyBtn = document.getElementById("copy");
  const mail = document.getElementById("mail");
  copyBtn.addEventListener("click", async () => {
    const text = mail.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied";
    } catch {
      copyBtn.textContent = "Press Ctrl+C on the email above";
    }
    setTimeout(() => (copyBtn.textContent = "Copy email"), 2000);
  });

  // Footer year
  document.getElementById("yr").textContent = new Date().getFullYear();

  // The one playful moment: name gets heavier as the pointer moves across it
  const h1 = document.getElementById("name");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (h1 && !still && matchMedia("(pointer: fine)").matches) {
    h1.addEventListener("pointermove", (e) => {
      const r = h1.getBoundingClientRect();
      h1.style.setProperty(
        "--w",
        Math.round(300 + 500 * ((e.clientX - r.left) / r.width)),
      );
    });
    h1.addEventListener("pointerleave", () => h1.style.setProperty("--w", 300));
  }

  // Tracklist: one project at a time, arrows to browse
  const slides = [...document.querySelectorAll("#work details")];
  const work = document.getElementById("work");
  if (slides.length > 1) {
    const deck = document.createElement("div");
    deck.className = "deck";
    slides[0].before(deck);
    slides.forEach((d, i) => { d.style.setProperty("--n", '"0' + (i + 1) + '"'); d.open = true; d.classList.add("slide"); deck.append(d); d.querySelector("summary").addEventListener("click", (e) => e.preventDefault()); });
    const ctl = document.createElement("div");
    ctl.className = "deck-ctl";
    ctl.innerHTML = '<button type="button" class="arrow" data-d="-1" aria-label="Previous project">←</button><div class="dots" role="tablist"></div><span class="count" aria-live="polite"></span><button type="button" class="arrow" data-d="1" aria-label="Next project">→</button>';
    deck.after(ctl);
    const dots = ctl.querySelector(".dots"), count = ctl.querySelector(".count");
    slides.forEach((_, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Project " + (i + 1)); b.onclick = () => go(i); dots.append(b); });
    let cur = 0;
    function go(n) {
      const next = (n + slides.length) % slides.length;
      deck.dataset.dir = n >= cur ? "next" : "prev";
      slides.forEach((s, i) => s.classList.toggle("active", i === next));
      [...dots.children].forEach((b, i) => b.classList.toggle("on", i === next));
      count.textContent = String(next + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
      cur = next;
    }
    ctl.addEventListener("click", (e) => { const a = e.target.closest(".arrow"); a && go(cur + +a.dataset.d); });
    work.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
    let x0 = null;
    deck.addEventListener("pointerdown", (e) => (x0 = e.clientX));
    deck.addEventListener("pointerup", (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 60) go(cur + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    go(0);
    const sub = work.querySelector("h2 small");
    if (sub) sub.textContent = "Selected work. Use the arrows to browse.";
  }
})();

// Music: click the record to play or pause
(() => {
  const rec = document.getElementById("rec");
  const cap = document.getElementById("recCap");
  const audio = document.getElementById("music");
  if (!rec || !audio) return;

  audio.volume = 0.3;

  const setState = (on) => {
    rec.classList.toggle("playing", on);
    rec.setAttribute("aria-pressed", on);
    rec.setAttribute("aria-label", on ? "Pause music" : "Play music");
    cap.textContent = on
      ? "Now playing. Press to pause"
      : "Press the record to play";
  };

  rec.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return setState(false);
    }
    try {
      await audio.play();
      setState(true);
    } catch {
      cap.textContent = "Music file not found. Add audio/theme.mp3";
    }
  });

  audio.addEventListener("pause", () => setState(false));
})();

// ---- v2: smooth motion ----
(() => {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.getElementById("bar");
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const d = document.documentElement;
      bar.style.transform = `scaleX(${d.scrollTop / Math.max(1, d.scrollHeight - innerHeight)})`;
      tick = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const links = [...document.querySelectorAll("nav a.hide")];
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.hash); s && spy.observe(s); });

  const stage = document.querySelector(".stage");
  if (stage && !still && matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      stage.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      stage.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener("pointerleave", () => { stage.style.setProperty("--px", 0); stage.style.setProperty("--py", 0); });
  }
})();
