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

    // Project tabs: jump straight to any project
    const tabs = document.createElement("div");
    tabs.className = "deck-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Choose a project");
    slides.forEach((d, i) => {
      const name = d.querySelector("summary .t").textContent.replace(/^Project:\s*/, "").replace(/\s*\(\d{4}\)\s*$/, "").replace(/-/g, " ");
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.textContent = name;
      b.onclick = () => go(i);
      tabs.append(b);
    });
    deck.before(tabs);

    let cur = 0, heightTimer = 0, first = true;
    const padV = () => { const c = getComputedStyle(deck); return ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"].reduce((t, k) => t + parseFloat(c[k]), 0); };
    function go(n) {
      const next = (n + slides.length) % slides.length;
      const from = deck.offsetHeight;
      deck.dataset.dir = n >= cur ? "next" : "prev";
      slides.forEach((s, i) => s.classList.toggle("active", i === next));
      [...dots.children].forEach((b, i) => b.classList.toggle("on", i === next));
      [...tabs.children].forEach((b, i) => { b.classList.toggle("on", i === next); b.setAttribute("aria-selected", i === next); });
      const on = tabs.children[next];
      if (on) tabs.scrollTo({ left: on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2, behavior: first ? "auto" : "smooth" });
      count.textContent = String(next + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
      cur = next;
      // Smoothly animate the card to the new project's height (no jump)
      if (!first && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const to = slides[next].offsetHeight + padV();
        deck.style.height = from + "px";
        deck.getBoundingClientRect();
        deck.style.height = to + "px";
        clearTimeout(heightTimer);
        heightTimer = setTimeout(() => { deck.style.height = ""; }, 650);
      }
      first = false;
    }
    addEventListener("resize", () => { deck.style.height = ""; });
    ctl.addEventListener("click", (e) => { const a = e.target.closest(".arrow"); a && go(cur + +a.dataset.d); });
    work.addEventListener("keydown", (e) => { if (e.target.closest("input, textarea, select")) return; if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
    let x0 = null;
    deck.addEventListener("pointerdown", (e) => (x0 = e.clientX));
    deck.addEventListener("pointerup", (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 60) go(cur + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    go(0);
    const sub = work.querySelector("h2 small");
    if (sub) sub.textContent = "Selected portfolio demos. They are not real client sites. Pick a project below or use the arrows.";
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
      ? "Now playing. Tap to pause"
      : "Tap the ring to play music";
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

// ---- Mobile menu ----
(() => {
  const btn = document.getElementById("menu");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;
  const set = (open) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Close" : "Menu";
  };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => e.target.closest("a") && set(false));
  addEventListener("keydown", (e) => e.key === "Escape" && set(false));
})();

// ---- Project inquiry form ----
// SETUP: paste your Formspree endpoint here (see README), e.g. "https://formspree.io/f/abcdwxyz".
// While this is empty, the form opens a pre-filled email draft instead (nothing is sent automatically).
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "Jaypoem0@gmail.com";
// SETUP: paste your scheduling link (Calendly, Cal.com, etc.) to turn on "Book a Discovery Call". While empty, it opens an email request instead.
const SCHEDULING_URL = "";

(() => {
  const form = document.getElementById("inquiry");
  if (!form) return;
  const status = document.getElementById("form-status");
  const send = document.getElementById("send");
  const dateEl = form.elements.date;
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  dateEl.min = today;

  // "Request a Quote" buttons pre-select the website type
  document.querySelectorAll("a[data-type]").forEach((a) =>
    a.addEventListener("click", () => { form.elements.type.value = a.dataset.type; }),
  );

  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your full name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."),
    type: (v) => (v ? "" : "Please choose the type of website you need."),
    date: (v) => (v && v < today ? "Please choose today or a future date." : ""),
    message: (v) => (v.trim().length < 20 ? "Please describe your project in at least 20 characters." : ""),
  };
  const check = (name) => {
    const el = form.elements[name], msg = rules[name](el.value);
    document.getElementById("e-" + name).textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    msg ? el.setAttribute("aria-describedby", "e-" + name) : el.removeAttribute("aria-describedby");
    return msg;
  };
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener("blur", () => check(n)));
  const say = (text, kind) => { status.textContent = text; status.className = "form-status " + kind; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = ""; status.className = "form-status";
    const bad = Object.keys(rules).filter((n) => check(n));
    if (bad.length) {
      form.elements[bad[0]].focus();
      return say("Please fix the " + (bad.length > 1 ? bad.length + " fields" : "field") + " marked above and try again.", "bad");
    }
    if (form.elements._gotcha.value) return; // spam bot

    const f = Object.fromEntries(new FormData(form));
    if (!FORM_ENDPOINT) {
      const body = ["Name: " + f.name, "Email: " + f.email, "Business: " + (f.company || "-"), "Website type: " + f.type, "Budget: " + (f.budget || "-"), "Desired completion date: " + (f.date || "-"), "", f.message].join("\n");
      location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Website project inquiry from " + f.name) + "&body=" + encodeURIComponent(body);
      return say("Your email app should open with your inquiry filled in. Nothing has been sent yet: press Send in your email app. If nothing opened, email " + CONTACT_EMAIL + " directly.", "ok");
    }

    send.disabled = true; send.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(f) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      say("Thank you! Your inquiry was sent. I'll reply to " + f.email + " soon.", "ok");
    } catch {
      say("Your inquiry could not be sent. Please try again, or email " + CONTACT_EMAIL + " directly.", "bad");
    } finally {
      send.disabled = false; send.textContent = "Send inquiry";
    }
  });
})();

// ---- Discovery call button ----
(() => {
  const a = document.getElementById("call");
  if (a && SCHEDULING_URL) { a.href = SCHEDULING_URL; a.target = "_blank"; a.rel = "noopener"; }
})();

// ---- Plan Your Website ----
(() => {
  const f = document.getElementById("planner-form");
  if (!f) return;
  const TYPES = ["Business website", "Landing page", "Portfolio website", "Product showcase", "Online store", "Restaurant or café website", "Booking website", "Website redesign", "Other"];
  const FEATS = ["About and services sections", "Product or service gallery", "Contact form", "Booking or appointment feature", "Blog", "Online payments", "Customer accounts", "Admin dashboard"];
  const MAP = { "Portfolio website": "Business website", "Restaurant or café website": "Business website", "Product showcase": "Product showcase website", "Online store": "Product showcase website", "Booking website": "Something else / not sure yet", "Other": "Something else / not sure yet" };
  const opt = (t, n, name, i) => `<label><input type="${t}" name="${name}" value="${n}" ${i}/> ${n}</label>`;
  document.getElementById("o-type").innerHTML = TYPES.map((n) => opt("radio", n, "ptype", "")).join("");
  document.getElementById("o-feat").innerHTML = FEATS.map((n) => opt("checkbox", n, "pfeat", "")).join("");

  const steps = [...f.querySelectorAll(".pl-step")];
  const back = document.getElementById("pl-back"), next = document.getElementById("pl-next");
  const status = document.getElementById("pl-status");
  const v = (n) => f.elements[n].value.trim();
  const picked = (n) => [...f.querySelectorAll(`[name="${n}"]:checked`)].map((e) => e.value);
  const bad = (id, msg) => { document.getElementById(id).textContent = msg; return !!msg; };
  const checks = [
    () => [bad("pe-company", v("pcompany") ? "" : "Enter your business or company name."), bad("pe-btype", v("pbtype") ? "" : "Enter your business type.")].some(Boolean),
    () => bad("pe-type", picked("ptype").length ? "" : "Choose the type of website you need."),
    () => false,
    () => [bad("pe-budget", v("pbudget") ? "" : "Choose a budget range."), bad("pe-time", v("ptime") ? "" : "Enter a timeframe or date.")].some(Boolean),
  ];
  const summary = () => {
    const feats = picked("pfeat").concat(v("pother") ? ["Other: " + v("pother")] : []);
    return ["WEBSITE PROJECT SUMMARY (draft, not a quotation)", "",
      "Business: " + v("pcompany"), "Business type: " + v("pbtype"), "Industry: " + (v("pindustry") || "-"), "Location: " + (v("ploc") || "-"), "",
      "Website type: " + picked("ptype")[0], "Features: " + (feats.join(", ") || "None selected yet"), "",
      "Estimated budget range: " + v("pbudget"), "Desired timeframe: " + v("ptime"), "Additional notes: " + (v("pnotes") || "-"), "",
      "Final scope, price, and schedule require review by Jaypee."].join("\n");
  };
  let cur = 0;
  const show = (n) => {
    cur = n;
    steps.forEach((s, i) => (s.hidden = i !== n));
    document.getElementById("pl-prog").textContent = "Step " + (n + 1) + " of 5";
    document.getElementById("pl-bar").value = n + 1;
    back.disabled = n === 0;
    next.hidden = n === 4;
    status.textContent = ""; status.className = "form-status";
    if (n === 4) document.getElementById("pl-summary").textContent = summary();
    if (n > 0 || f.dataset.started) steps[n].focus({ preventScroll: true });
    f.dataset.started = "1";
  };
  next.addEventListener("click", () => { if (!checks[cur]()) show(cur + 1); });
  back.addEventListener("click", () => cur > 0 && show(cur - 1));
  f.addEventListener("submit", (e) => { e.preventDefault(); next.click(); });
  const say = (t, k) => { status.textContent = t; status.className = "form-status " + k; };

  document.getElementById("pl-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(summary()); say("Summary copied.", "ok"); }
    catch { say("Copy was blocked by your browser. Select the summary text above and copy it manually.", "bad"); }
  });
  document.getElementById("pl-dl").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([summary()], { type: "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "website-project-summary.txt" });
    document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    say("Summary downloaded as website-project-summary.txt.", "ok");
  });
  document.getElementById("pl-send").addEventListener("click", () => {
    const q = document.getElementById("inquiry").elements;
    q.company.value = v("pcompany");
    q.type.value = MAP[picked("ptype")[0]] || picked("ptype")[0];
    q.budget.value = v("pbudget");
    q.message.value = summary();
    document.getElementById("inquiry").scrollIntoView({ behavior: "smooth" });
    q.name.focus({ preventScroll: true });
    document.getElementById("form-status").textContent = "Your planner answers are filled in below. Add your name and email, then send the inquiry.";
    document.getElementById("form-status").className = "form-status ok";
  });
  show(0);
})();

// ---- Clients & reviews ----
// Reviews shown on the page come from reviews.js (window.CLIENT_REVIEWS).
(() => {
  const grid = document.getElementById("rv-grid");
  if (!grid) return;
  const list = (Array.isArray(window.CLIENT_REVIEWS) ? window.CLIENT_REVIEWS : [])
    .filter((r) => r && r.name && r.quote && r.work && r.rating >= 1 && r.rating <= 5);

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const stars = (n) => {
    const s = el("span", "stars", "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n)));
    s.setAttribute("role", "img");
    s.setAttribute("aria-label", Math.round(n) + " out of 5 stars");
    return s;
  };

  // Cards (text is always set with textContent, never as HTML)
  list.forEach((r) => {
    const card = el("figure", "review");
    card.append(stars(r.rating));
    const q = el("blockquote", "", r.quote);
    const cap = el("figcaption");
    cap.append(el("b", "", r.name));
    if (r.business) cap.append(el("span", "", r.business));
    const work = el("span", "rv-work", "Worked on: " + r.work + (r.date ? " · " + r.date : ""));
    cap.append(work);
    if (r.url && /^https?:\/\//i.test(r.url)) {
      const a = el("a", "link", "View the website");
      a.href = r.url; a.target = "_blank"; a.rel = "noopener";
      cap.append(a);
    }
    card.append(q, cap);
    grid.append(card);
  });

  // Summary line or empty state
  const sum = document.getElementById("rv-summary");
  const empty = document.getElementById("rv-empty");
  if (list.length) {
    const avg = list.reduce((t, r) => t + r.rating, 0) / list.length;
    sum.textContent = avg.toFixed(1) + " out of 5 from " + list.length + (list.length === 1 ? " review" : " reviews");
    sum.hidden = false;
  } else {
    grid.hidden = true;
    empty.hidden = false;
  }

  // Review form
  const form = document.getElementById("review-form");
  const status = document.getElementById("r-status");
  const send = document.getElementById("r-send");
  const RATES = [[5, "Excellent"], [4, "Very good"], [3, "Good"], [2, "Fair"], [1, "Poor"]];
  document.getElementById("r-rating").innerHTML = RATES.map(([n, t]) =>
    `<label><input type="radio" name="rating" value="${n}" /> <span aria-hidden="true">${"★".repeat(n)}</span> ${t}</label>`).join("");

  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."),
    work: (v) => (v.trim().length < 3 ? "Please tell me what I built for you." : ""),
    rating: () => (form.querySelector('[name="rating"]:checked') ? "" : "Please choose a rating."),
    quote: (v) => (v.trim().length < 20 ? "Please write at least 20 characters." : ""),
    consent: () => (form.elements.consent.checked ? "" : "Please confirm that I may show your review."),
  };
  const check = (n) => {
    const msg = rules[n](form.elements[n] && form.elements[n].value !== undefined ? form.elements[n].value : "");
    document.getElementById("re-" + n).textContent = msg;
    const field = form.elements[n];
    if (field && field.setAttribute && field.type !== "checkbox") field.setAttribute("aria-invalid", msg ? "true" : "false");
    return msg;
  };
  Object.keys(rules).forEach((n) => {
    const field = form.elements[n];
    if (field && field.addEventListener) field.addEventListener("blur", () => check(n));
  });
  form.querySelectorAll('[name="rating"]').forEach((i) => i.addEventListener("change", () => check("rating")));
  form.elements.consent.addEventListener("change", () => check("consent"));
  const say = (t, k) => { status.textContent = t; status.className = "form-status " + k; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = ""; status.className = "form-status";
    const bad = Object.keys(rules).filter((n) => check(n));
    if (bad.length) {
      const first = bad[0] === "rating" ? form.querySelector('[name="rating"]') : form.elements[bad[0]];
      first.focus();
      return say("Please fix the " + (bad.length > 1 ? bad.length + " fields" : "field") + " marked above and try again.", "bad");
    }
    if (form.elements._gotcha.value) return; // spam bot

    const f = Object.fromEntries(new FormData(form));
    f.form = "client-review";
    if (!FORM_ENDPOINT) {
      const body = ["CLIENT REVIEW", "", "Name: " + f.name, "Email: " + f.email, "Business: " + (f.business || "-"), "Work done: " + f.work, "Rating: " + f.rating + " / 5", "", f.quote, "", "I agree my name, business and review may be shown on the website."].join("\n");
      location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Client review from " + f.name) + "&body=" + encodeURIComponent(body);
      return say("Your email app should open with your review filled in. Nothing has been sent yet: press Send in your email app. If nothing opened, email " + CONTACT_EMAIL + " directly.", "ok");
    }

    send.disabled = true; send.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(f) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      say("Thank you! Your review was sent. It will appear on this page after I check it.", "ok");
    } catch {
      say("Your review could not be sent. Please try again, or email " + CONTACT_EMAIL + " directly.", "bad");
    } finally {
      send.disabled = false; send.textContent = "Send review";
    }
  });
})();


// ---- Futuristic touch: soft spotlight that follows the pointer on cards ----
(() => {
  if (!matchMedia("(pointer: fine)").matches) return;
  const sel = ".cols > div, .cols > li, .review, .form, .deck";
  let raf = 0, last = null;
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest && e.target.closest(sel);
    if (!card) return;
    last = { card, x: e.clientX, y: e.clientY };
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = last.card.getBoundingClientRect();
      last.card.style.setProperty("--mx", last.x - r.left + "px");
      last.card.style.setProperty("--my", last.y - r.top + "px");
    });
  }, { passive: true });
})();

// ---- Reviews: hide the whole section until there is a real review ----
(() => {
  const sec = document.getElementById("clients");
  const link = document.getElementById("leave-review");
  if (!sec) return;
  const hasReviews = Array.isArray(window.CLIENT_REVIEWS) && window.CLIENT_REVIEWS.some((r) => r && r.name && r.quote);
  if (!hasReviews) sec.hidden = true;
  if (link) link.addEventListener("click", (e) => {
    if (!sec.hidden) return;            // section already visible: normal jump
    e.preventDefault();
    sec.hidden = false;
    sec.classList.add("in");
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  if (!hasReviews && link === null) return;
  // Visiting /#clients directly also opens it
  if (location.hash === "#clients") { sec.hidden = false; sec.classList.add("in"); }
})();


// ---- Forms: clicking a button must never be lost to a layout shift ----
// (When a field loses focus its message can appear or clear, which used to nudge the button
// away mid-click so the first click did nothing.)
(() => {
  document.querySelectorAll(".form button").forEach((b) => b.addEventListener("mousedown", (e) => e.preventDefault()));
})();
