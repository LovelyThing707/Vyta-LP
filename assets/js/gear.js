document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("rotatingCircle");
  const gear = document.getElementById("centerGear");
  const wrapper =
    document.querySelector(".flow-scroll-container .page-wrapper") ||
    document.querySelector(".page-wrapper");

  const sections = wrapper?.querySelectorAll(".content-section") || [];
  const markers = document.querySelectorAll(".step-marker");
  const markerText = document.querySelectorAll(".marker-content");
  const flowText = document.querySelector(".bg-flow-text");
  const title = document.querySelector(".section-title");
  const flow = document.querySelector(".flow-scroll-container");

  if (!circle || !gear || !wrapper) return;

  const STEP = 60;
  const GEAR = 45;
  let started = false;

  // =====================
  // SPLIT TITLES
  // =====================
  document.querySelectorAll(".step-title").forEach(t => {
    const sub = t.querySelector(".step-sub");
    const text = t.textContent.trim();
    t.innerHTML = "";
    [...text].forEach(c => {
      const s = document.createElement("span");
      s.className = "char-reveal";
      s.textContent = c;
      t.appendChild(s);
    });
    sub && t.appendChild(sub);
  });

  // =====================
  // OPENING
  // =====================
  function start() {
    if (started) return;
    started = true;

    [circle, gear].forEach(el => {
      el.style.opacity = 1;
      el.classList.add("opening-animation");
    });

    setTimeout(() => {
      [circle, gear].forEach(el => {
        el.classList.remove("opening-animation");
        el.classList.add("interactive");
        el.style.transform = "translate(-50%, -50%) rotate(0deg)";
      });
      update();
    }, 20);
  }

  new IntersectionObserver(
    ([e]) => e.isIntersecting && start(),
    { threshold: 0.1, rootMargin: "100px" }
  ).observe(wrapper);

  // =====================
  // SCROLL ENGINE
  // =====================
  function getIndex() {
    if (!flow) return 0;

    const h = flow.offsetHeight - innerHeight;
    if (h <= 0) return 0;

    const y = Math.max(0, Math.min(-flow.getBoundingClientRect().top, h));
    return Math.min(5, Math.floor((y / h) * 8));
  }

  function update() {
    if (!started) return;

    const i = getIndex();
    const rot = -(i * STEP);

    circle.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    gear.style.transform = `translate(-50%, -50%) rotate(${-(i * GEAR)}deg)`;

    const base = [0, 60, 120, 180, 240, 300];
    markerText.forEach((m, idx) => {
      m.style.transform = `rotate(${-rot - base[idx]}deg)`;
    });

    markers.forEach((m, idx) => {
      m.classList.toggle("active-marker", idx === i);
      sections[idx]?.classList.toggle("animate-trigger", idx === i);
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  // =====================
  // FLOW TEXT VISIBILITY
  // =====================
  new IntersectionObserver(([e]) => {
    flowText?.classList.toggle("is-visible", e.isIntersecting);
    title?.classList.toggle("is-visible", e.isIntersecting);
  }, { threshold: 0.1 }).observe(wrapper);
});
