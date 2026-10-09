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

  // Opening one project closes the others
  const items = document.querySelectorAll("#work details");
  items.forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) items.forEach((o) => o !== d && (o.open = false));
    }),
  );
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
