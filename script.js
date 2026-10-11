/* ===== SETTINGS ===== */
const DRIVE_FILE_ID = "1ydW67yD1VHnJ3FN62_5QSfa8cTPv_S2n";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/yoru5r2@gmail.com";
/* ==================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// ---------- Video embed ----------
if (DRIVE_FILE_ID) {
  const box = document.getElementById("video-box");
  box.innerHTML = "";
  const f = document.createElement("iframe");
  f.src = "https://drive.google.com/file/d/" + encodeURIComponent(DRIVE_FILE_ID) + "/preview";
  f.title = "TESORO POINT sales pitch video";
  f.allow = "autoplay; fullscreen";
  f.allowFullscreen = true;
  f.loading = "lazy";
  box.appendChild(f);
}

// ---------- Mobile menu ----------
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
btn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
});

// ---------- Scroll reveal ----------
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); } });
}, { threshold: .15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + "ms";
  revealObs.observe(el);
});

// ---------- Hero parallax ----------
const heroArt = document.querySelector(".hero-art");
if (heroArt && finePointer && !reduceMotion) {
  heroArt.closest(".hero").addEventListener("pointermove", e => {
    const r = heroArt.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    heroArt.querySelectorAll("[data-depth]").forEach(el => {
      const d = +el.dataset.depth;
      el.style.transform = `translate(${x * d}px, ${y * d}px)`;
    });
  });
}

// ---------- Card tilt ----------
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".cards article").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty("--ry", (x * 12) + "deg");
      card.style.setProperty("--rx", (-y * 12) + "deg");
    });
    card.addEventListener("pointerleave", () => { card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg"); });
  });
}

// ---------- Station process animation ----------
(function () {
  const tilt = document.getElementById("tilt");
  const ring = document.getElementById("ring");
  const item = document.getElementById("item");
  const toast = document.getElementById("toast");
  const list = document.getElementById("steplist");
  const lis = [...list.children];
  const pp = document.getElementById("playpause");
  const stage = document.getElementById("stage");
  const STEP_MS = 3600;

  // positions are percentages of the image
  const INPUT = [27.8, 31], SCREEN = [60, 21], SORT_START = [27, 52];
  const bins = [
    { c: "#2fbf6b", sx: 52.5, bx: 23.6, by: 74 },
    { c: "#2f7bf0", sx: 58.5, bx: 36.6, by: 75 },
    { c: "#f0b323", sx: 64.5, bx: 50.7, by: 77 },
    { c: "#9b5de5", sx: 71.0, bx: 66.7, by: 79 }
  ];

  let step = 0, loop = 0, timer = null, playing = !reduceMotion, visible = false;
  list.style.setProperty("--dur", STEP_MS / 1000 + "s");

  const put = (el, p) => { el.style.left = p[0] + "%"; el.style.top = p[1] + "%"; };

  function show(n) {
    step = n;
    const b = bins[loop % bins.length];
    item.style.setProperty("--c", b.c);
    lis.forEach((li, k) => {
      li.classList.toggle("on", k === n);
      li.classList.toggle("done", k < n);
      li.querySelector("button").setAttribute("aria-current", k === n ? "step" : "false");
    });
    toast.classList.toggle("on", n === 4);
    if (n === 0) { item.style.opacity = 0; put(item, [INPUT[0], INPUT[1] - 9]); requestAnimationFrame(() => requestAnimationFrame(() => { item.style.opacity = 1; put(item, INPUT); })); put(ring, INPUT); }
    if (n === 1) { item.style.opacity = 1; put(item, SORT_START); put(ring, SCREEN); }
    if (n === 2) { item.style.opacity = 1; put(item, [b.sx, 55]); put(ring, [b.sx, 55]); }
    if (n === 3) { item.style.opacity = 1; put(item, [b.bx, b.by]); put(ring, [b.bx, b.by]); }
    if (n === 4) { item.style.opacity = 0; put(ring, SCREEN); }
  }

  function next() {
    const n = (step + 1) % lis.length;
    if (n === 0) loop++;
    show(n);
  }
  function start() { stop(); if (playing && visible) timer = setInterval(next, STEP_MS); }
  function stop() { clearInterval(timer); timer = null; }

  lis.forEach((li, k) => li.querySelector("button").addEventListener("click", () => {
    if (k < step && k === 0) loop++;
    show(k); start();
  }));

  function setPlaying(v) {
    playing = v;
    stage.closest(".process").classList.toggle("paused", !v);
    pp.textContent = v ? "Pause animation" : "Play animation";
    pp.setAttribute("aria-pressed", String(!v));
    v ? start() : stop();
  }
  pp.addEventListener("click", () => setPlaying(!playing));
  setPlaying(playing);

  new IntersectionObserver(es => { visible = es[0].isIntersecting; start(); }, { threshold: .3 }).observe(stage);

  // 3D tilt on the machine
  if (finePointer && !reduceMotion) {
    stage.addEventListener("pointermove", e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    stage.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
  }

  show(0);
})();

// ---------- Contact form (FormSubmit) ----------
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const bad = !field.value.trim() || (field.type === "email" && !field.checkValidity());
    field.classList.toggle("invalid", bad);
    if (bad) valid = false;
  });

  if (!valid) {
    status.textContent = "Please complete all required fields correctly.";
    return;
  }

  const data = new FormData(form);
  const payload = {
    name: data.get("name"),
    email: data.get("email"),
    organization: data.get("org") || "Not provided",
    enquiry_type: data.get("type"),
    message: data.get("message"),
    _subject: "New TESORO POINT Website Enquiry"
  };

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  status.textContent = "Sending your enquiry...";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error("The form service rejected the submission.");
    }

    status.textContent = "Enquiry submitted. Please check your email for confirmation if requested.";
    form.reset();
    form.querySelectorAll(".invalid").forEach((f) => f.classList.remove("invalid"));
  } catch (error) {
    console.error("Enquiry submission failed:", error);
    status.textContent = "Unable to submit right now. Please try again later or email yoru5r2@gmail.com directly.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send enquiry";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
