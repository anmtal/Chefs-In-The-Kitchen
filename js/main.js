/* ============================================================
   CHEFS IN THE KITCHEN — interactions (shared across all pages)
   Feature-detected, so this file runs safely on every page.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Business config — EDIT THESE --------------------------------- */
  const CONFIG = {
    email: "hello@chefsinthekitchen.ca",
    phone: "",
    facebook: "https://www.facebook.com/chefsinthekitchen.official/",
    website: "https://chefsinthekitchen.ca",
    endpoint: ""
  };
  window.CITK = CONFIG;

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);

  /* ---- HEADER ---- */
  const header = $("#header");
  if (header) {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 24);
      if (y > 320 && y > last) header.classList.add("hidden"); else header.classList.remove("hidden");
      last = y;
    };
    on(window, "scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- MOBILE DRAWER ---- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  const openD = () => { drawer && drawer.classList.add("open"); scrim && scrim.classList.add("show"); document.body.style.overflow = "hidden"; };
  const closeD = () => { drawer && drawer.classList.remove("open"); scrim && scrim.classList.remove("show"); document.body.style.overflow = ""; };
  on($("#menuToggle"), "click", openD);
  on($("#drawerClose"), "click", closeD);
  on(scrim, "click", closeD);
  $$("#drawer a").forEach(a => on(a, "click", closeD));
  on(document, "keydown", e => { if (e.key === "Escape") closeD(); });

  /* ---- SCROLL REVEAL (with failsafe) ---- */
  const revealEls = $$(".reveal, .reveal-scale");
  const revealAll = () => revealEls.forEach(el => el.classList.add("in"));
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
    setTimeout(() => { if (!document.querySelector(".reveal.in, .reveal-scale.in")) revealAll(); }, 1500);
  } else { revealAll(); }

  /* ---- COUNTERS ---- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = parseFloat(el.dataset.count);
        const dec = (el.dataset.count.split(".")[1] || "").length;
        const dur = 1600, t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toFixed(dec);
        };
        requestAnimationFrame(tick); cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---- TESTIMONIAL CAROUSEL ---- */
  const track = $("#tstTrack");
  if (track) {
    const slides = $$(".tst-slide", track), dotsWrap = $("#tstDots");
    let idx = 0, timer;
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "tst-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Go to review " + (i + 1));
      on(d, "click", () => go(i)); dotsWrap && dotsWrap.appendChild(d);
    });
    const dots = dotsWrap ? $$(".tst-dot", dotsWrap) : [];
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("active", k === idx));
      restart();
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    on($("#tstNext"), "click", () => go(idx + 1));
    on($("#tstPrev"), "click", () => go(idx - 1));
    restart();
  }

  /* ---- MENU FILTER ---- */
  const filterBtns = $$(".filter-btn");
  if (filterBtns.length) {
    const cards = $$(".menu-card"), empty = $("#menuEmpty");
    filterBtns.forEach(btn => on(btn, "click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter; let shown = 0;
      cards.forEach(card => {
        const match = cat === "all" || (card.dataset.cat || "").split(" ").includes(cat);
        card.classList.toggle("hide", !match);
        if (match) { shown++; card.style.animation = "fade 0.5s var(--ease)"; setTimeout(() => card.style.animation = "", 500); }
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    }));
  }

  /* ---- FAQ ACCORDION ---- */
  $$(".faq-item").forEach(item => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    on(q, "click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item").forEach(o => { o.classList.remove("open"); const oa = $(".faq-a", o); if (oa) oa.style.maxHeight = null; });
      if (!isOpen) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---- GALLERY LIGHTBOX ---- */
  const lb = $("#lightbox");
  if (lb) {
    const items = $$(".gal-item"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
    let ci = 0;
    const build = items.map(it => ({ src: $("img", it).getAttribute("src"), cap: it.dataset.cap || "" }));
    const show = (i) => { ci = (i + build.length) % build.length; lbImg.setAttribute("src", build[ci].src); lbCap.textContent = build[ci].cap; lb.classList.add("show"); document.body.style.overflow = "hidden"; };
    const hide = () => { lb.classList.remove("show"); document.body.style.overflow = ""; };
    items.forEach((it, i) => on(it, "click", () => show(i)));
    on($("#lbClose"), "click", hide);
    on($("#lbPrev"), "click", () => show(ci - 1));
    on($("#lbNext"), "click", () => show(ci + 1));
    on(lb, "click", e => { if (e.target === lb) hide(); });
    on(document, "keydown", e => { if (!lb.classList.contains("show")) return; if (e.key === "Escape") hide(); if (e.key === "ArrowRight") show(ci + 1); if (e.key === "ArrowLeft") show(ci - 1); });
  }

  /* ---- BACK TO TOP ---- */
  const toTop = $("#toTop");
  if (toTop) {
    on(window, "scroll", () => toTop.classList.toggle("show", window.scrollY > 600), { passive: true });
    on(toTop, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---- TOAST ---- */
  function toast(msg) {
    let wrap = $(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${msg}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 4200);
  }
  window.citkToast = toast;

  /* ---- BOOKING FORM ---- */
  const form = $("#quoteForm");
  if (form) {
    const steps = $$(".fstep", form), stepPips = $$(".stepper .st");
    let cur = 0;
    const perPerson = { dinner: 65, party: 95, mealprep: 40 };

    const showStep = (n) => {
      cur = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach((s, i) => s.classList.toggle("active", i === cur));
      stepPips.forEach((p, i) => { p.classList.toggle("active", i === cur); p.classList.toggle("done", i < cur); });
      const back = $("#fBack"), next = $("#fNext"), submit = $("#fSubmit");
      if (back) back.classList.toggle("hidden", cur === 0);
      if (next) next.style.display = cur === steps.length - 1 ? "none" : "inline-flex";
      if (submit) submit.style.display = cur === steps.length - 1 ? "inline-flex" : "none";
    };
    const validateStep = () => {
      const active = steps[cur];
      for (const f of $$("[required]", active)) {
        if (!f.value.trim()) { f.focus(); f.style.borderColor = "var(--red)"; toast("Please fill in the highlighted field."); return false; }
        f.style.borderColor = "";
      }
      if (cur === 0 && $$("input[name=eventType]:checked", form).length === 0) { toast("Tell us what you're planning."); return false; }
      return true;
    };
    on($("#fNext"), "click", () => { if (validateStep()) showStep(cur + 1); });
    on($("#fBack"), "click", () => showStep(cur - 1));

    const guestInput = $("#guests"), guestOuts = $$("#guestVal, #guestValLabel");
    const estOut = $("#estAmount"), estPer = $("#estPer");
    const getPkg = () => { const c = $("input[name=pkg]:checked", form); return c ? c.value : "dinner"; };
    const updateEstimate = () => {
      const g = parseInt(guestInput ? guestInput.value : 4, 10) || 0;
      guestOuts.forEach(o => o.textContent = g);
      const pp = perPerson[getPkg()] || 65;
      const low = Math.round(g * pp / 10) * 10;
      const high = Math.round(g * pp * 1.28 / 10) * 10;
      if (estOut) estOut.textContent = g ? `$${low.toLocaleString()}–$${high.toLocaleString()}` : "—";
      if (estPer) estPer.textContent = "$" + pp;
    };
    on(guestInput, "input", updateEstimate);
    $$("input[name=pkg]", form).forEach(r => on(r, "change", updateEstimate));
    updateEstimate();

    $$("[data-pkg]").forEach(btn => on(btn, "click", (e) => {
      const r = $(`input[name=pkg][value="${btn.dataset.pkg}"]`, form);
      if (r) { r.checked = true; updateEstimate(); }
      const q = $("#quote"); if (q) { e.preventDefault(); q.scrollIntoView({ behavior: "smooth", block: "start" }); }
      toast("Great choice — a few details and we'll be in touch.");
    }));

    on(form, "submit", async (e) => {
      e.preventDefault();
      if (!validateStep()) return;
      if (form.companyWebsite && form.companyWebsite.value) return; // honeypot
      const data = Object.fromEntries(new FormData(form).entries());
      const prefs = $$("input[name=dishes]:checked", form).map(d => d.value).join(", ");
      const g = guestInput ? guestInput.value : "";
      const lead = {
        source: "citk-website", name: data.name, email: data.email, phone: data.phone || "",
        eventType: data.eventType, eventDate: data.eventDate || "TBD", guests: g,
        experience: getPkg(), preferences: prefs, message: data.message || "", submittedAt: new Date().toISOString()
      };
      const btn = $("#fSubmit"), orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

      if (CONFIG.endpoint) {
        try { await fetch(CONFIG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }); } catch (_) {}
      }

      const subject = encodeURIComponent(`Private chef inquiry — ${lead.eventType} for ${lead.guests} guests`);
      const bodyLines = [
        "Hi Chefs in the Kitchen, I'd love to book a chef.", "",
        `Occasion: ${lead.eventType}`, `Preferred date: ${lead.eventDate}`, `Guests: ${lead.guests}`,
        `Experience: ${lead.experience}`, `Preferences: ${prefs || "open to the chef's suggestions"}`, "",
        `Name: ${lead.name}`, `Email: ${lead.email}`, `Phone: ${lead.phone || "—"}`, "",
        `Notes: ${lead.message || "—"}`
      ];
      const mailto = `mailto:${CONFIG.email}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\r\n"))}`;

      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = orig;
        const body = form.querySelector(".form-body"); if (body) body.style.display = "none";
        const success = $("#formSuccess"), emailBtn = $("#successEmail");
        if (emailBtn) emailBtn.setAttribute("href", mailto);
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        toast("Your request is ready — one tap to send it to the chef.");
      }, 700);
    });

    showStep(0);
  }

  /* ---- FOOTER YEAR ---- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
