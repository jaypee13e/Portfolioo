:root {
  --h: 265;
  --bg: oklch(97% 0.008 var(--h));
  --ink: oklch(24% 0.05 var(--h));
  --mute: oklch(46% 0.03 var(--h));
  --line: oklch(86% 0.02 var(--h));
  --accent: oklch(52% 0.2 var(--h));
  --accent-ink: oklch(98% 0.01 var(--h));
  --panel: oklch(93% 0.015 var(--h));

  --font:
    "Bricolage Grotesque",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;

  box-sizing: border-box;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* =========================
   Dark Mode
========================= */

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: oklch(19% 0.03 var(--h));
    --ink: oklch(94% 0.015 var(--h));
    --mute: oklch(72% 0.03 var(--h));
    --line: oklch(32% 0.035 var(--h));
    --accent: oklch(76% 0.15 var(--h));
    --accent-ink: oklch(20% 0.04 var(--h));
    --panel: oklch(24% 0.035 var(--h));
  }
}

:root[data-theme="dark"] {
  --bg: oklch(19% 0.03 var(--h));
  --ink: oklch(94% 0.015 var(--h));
  --mute: oklch(72% 0.03 var(--h));
  --line: oklch(32% 0.035 var(--h));
  --accent: oklch(76% 0.15 var(--h));
  --accent-ink: oklch(20% 0.04 var(--h));
  --panel: oklch(24% 0.035 var(--h));
}

/* =========================
   Global
========================= */

html {
  scroll-padding-top: env(safe-area-inset-top, 0px);
  scroll-behavior: smooth;
  interpolate-size: allow-keywords;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  font-size: 1.0625rem;
  line-height: 1.6;
  font-variation-settings: "opsz" 14;
  -webkit-font-smoothing: antialiased;
  transition:
    background-color 0.5s ease,
    color 0.5s ease;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

button {
  font: inherit;
  cursor: pointer;
}

/* =========================
   Layout
========================= */

.wrap {
  max-width: 68rem;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 5vw, 3rem);
}

/* =========================
   Header
========================= */

header.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
}

header.top b {
  font-weight: 700;
  letter-spacing: -0.01em;
}

nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  color: var(--mute);
  font-weight: 500;
  text-decoration: none;
  background:
    linear-gradient(var(--accent), var(--accent))
    0 100% / 0 2px no-repeat;
  padding-bottom: 0.15rem;
  transition:
    background-size 0.4s var(--ease),
    color 0.3s ease;
}

nav a:hover {
  color: var(--ink);
  background-size: 100% 2px;
}

nav a.hide {
  display: inline;
}

/* =========================
   Buttons
========================= */

.icon-btn {
  background: none;
  border: 1px solid var(--line);
  color: var(--ink);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease;
}

.icon-btn:hover {
  border-color: var(--accent);
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.4rem;
  border: 0;
  border-radius: 0.6rem;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 600;
  text-decoration: none;
  transition:
    filter 0.3s ease,
    transform 0.4s var(--ease),
    background-color 0.5s ease;
}

.btn:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn.alt {
  background: none;
  color: var(--ink);
  border: 1px solid var(--line);
  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease;
}

/* =========================
   Hero
========================= */

.hero {
  padding: clamp(3rem, 10vw, 7rem) 0 clamp(3rem, 8vw, 5rem);
}

.hero h1 {
  margin: 0;
  font-size: clamp(3.4rem, 13.5vw, 10.5rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  font-weight: 300;
  font-stretch: 75%;
  font-variation-settings:
    "opsz" 96,
    "wdth" 75,
    "wght" var(--w, 300);
  cursor: default;
}

.hero h1 span {
  display: block;
}

.hero .lede {
  max-width: 34rem;
  margin: 2rem 0 0;
  font-size: clamp(1.15rem, 2.2vw, 1.45rem);
  line-height: 1.45;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 2rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--mute);
  font-size: 0.95rem;
  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease;
}

.status i {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2.4s ease-out infinite;
}

@keyframes pulse {
  0% {
    box-shadow:
      0 0 0 0
      color-mix(in oklch, var(--accent) 60%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0.8rem transparent;
  }
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.6rem;
}

/* =========================
   Sections
========================= */

section {
  padding: clamp(3rem, 7vw, 5rem) 0;
  border-top: 1px solid var(--line);
  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease;
}

h2 {
  margin: 0 0 2rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  letter-spacing: -0.025em;
  line-height: 1.1;
  font-weight: 600;
  font-variation-settings: "opsz" 48;
}

/* =========================
   Projects
========================= */

details {
  border-bottom: 1px solid var(--line);
  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease;
}

details:first-of-type {
  border-top: 1px solid var(--line);
}

summary {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 1rem;
  padding: 1.4rem 0;
  list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

summary .t {
  font-size: clamp(1.4rem, 3.4vw, 2.2rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
  transition:
    transform 0.5s var(--ease),
    color 0.3s ease;
}

summary:hover .t {
  transform: translateX(0.5rem);
  color: var(--accent);
}

summary .y {
  color: var(--mute);
  font-variant-numeric: tabular-nums;
}

details[open] summary .t {
  color: var(--accent);
}

details::details-content {
  block-size: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    block-size 0.6s var(--ease),
    opacity 0.45s ease,
    content-visibility 0.6s allow-discrete;
}

details[open]::details-content {
  block-size: auto;
  opacity: 1;
}

.body {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);
  gap: 2rem;
  padding: 0 0 2rem;
}

.body p {
  max-width: 34rem;
  margin: 0 0 1rem;
}

.shot {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  padding: 1rem;
  border-radius: 0.8rem;
  background:
    linear-gradient(
      135deg,
      var(--accent),
      color-mix(in oklch, var(--accent) 30%, var(--panel))
    );
  color: var(--accent-ink);
  font-weight: 600;
  text-align: center;
}

img.shot {
  display: block;
  width: 100%;
  height: auto;
  object-fit: top;
  padding: 0;
  background: var(--panel);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 1rem 0 0;
  list-style: none;
}

.tags li {
  padding: 0.15rem 0.7rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--mute);
  font-size: 0.9rem;
  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease;
}

/* =========================
   Skills + About
========================= */

.cols {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(15rem, 1fr)
  );
  gap: 2rem;
}

.cols h3 {
  margin: 0 0 0.6rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.cols p {
  margin: 0;
  color: var(--mute);
}

.about {
  max-width: 40rem;
  font-size: 1.2rem;
  line-height: 1.6;
}

/* =========================
   Contact
========================= */

.mail {
  display: inline-block;
  font-size: clamp(1.6rem, 6vw, 3.6rem);
  letter-spacing: -0.03em;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  border-bottom: 3px solid var(--accent);
  word-break: break-all;
}

.mail:hover {
  color: var(--accent);
}

/* =========================
   Footer
========================= */

footer {
  padding: 2rem 0 5rem;
  color: var(--mute);
  font-size: 0.95rem;
}

/* =========================
   Accent Tuner
========================= */

.tune {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right, 0px));
  bottom: calc(
    1rem + env(safe-area-inset-bottom, 0px)
  );
  z-index: 5;

  display: flex;
  align-items: center;
  gap: 0.7rem;

  padding: 0.5rem 1rem;

  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 999px;

  font-size: 0.9rem;
  opacity: 0.75;

  transition:
    border-color 0.5s ease,
    background-color 0.5s ease,
    color 0.4s ease,
    opacity 0.3s ease;
}

.tune:hover,
.tune:focus-within {
  opacity: 1;
}

.tune input {
  width: 7rem;
  accent-color: var(--accent);
}

/* =========================
   Motion
========================= */

:root {
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.js .hero h1 span,
.js .hero .lede,
.js .hero .status,
.js .hero .cta {
  opacity: 0;
  transform: translateY(18px);
  animation: rise 1s var(--ease) forwards;
}

.js .hero h1 span:nth-child(2) {
  animation-delay: 0.1s;
}

.js .hero .lede {
  animation-delay: 0.25s;
}

.js .hero .status {
  animation-delay: 0.37s;
}

.js .hero .cta {
  animation-delay: 0.47s;
}

@keyframes rise {
  to {
    opacity: 1;
    transform: none;
  }
}

.js .reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.9s var(--ease),
    transform 0.9s var(--ease);
}

.js .reveal.in {
  opacity: 1;
  transform: none;
}

/* =========================
   Responsive
========================= */

@media (max-width: 42rem) {
  .body {
    grid-template-columns: 1fr;
  }

  nav a.hide {
    display: none;
  }

  .tune label span {
    display: none;
  }
}

/* =========================
   Reduced Motion
========================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }

  .js .hero *,
  .js .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
