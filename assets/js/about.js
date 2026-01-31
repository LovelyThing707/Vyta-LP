gsap.registerPlugin(ScrollTrigger);

// ==========================
// IMAGE SLIDER
// ==========================

const images = gsap.utils.toArray(".about-content-img img");
const SLIDE = 0.5;
const HOLD = 2;
const OFFSET = 120;

const sliderTl = gsap.timeline({ repeat: -1 });

gsap.set(images, { xPercent: OFFSET, opacity: 0 });

images.forEach(img => {
  sliderTl
    .to(img, { xPercent: 0, opacity: 1, duration: SLIDE, ease: "power3.out" })
    .to(img, { duration: HOLD })
    .to(img, { xPercent: -OFFSET, opacity: 0, duration: SLIDE, ease: "power3.in" });
});

// ==========================
// TEXT ANIMATIONS
// ==========================

document.addEventListener("DOMContentLoaded", initAnimations);

function splitText(el) {
  const text = el.textContent;
  el.innerHTML = "";
  return [...text].map(char => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.opacity = 0;
    el.appendChild(span);
    return span;
  });
}

function initAnimations() {
  const section = document.querySelector(".about-content-txt");
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true
    }
  });

  // TITLE
  document.querySelectorAll(".about-content-txt-title").forEach(title => {
    const letters = splitText(title);

    const bg = document.createElement("span");
    bg.className = "title-bg-animation";
    title.style.position = "relative";
    title.prepend(bg);

    tl.to(bg, { width: "100%", duration: 0.8, ease: "power2.out" }, 0);
    tl.to(letters, {
      opacity: 1,
      stagger: 0.03,
      duration: 0.1
    }, 0.8);
  });

  // DESCRIPTION
  tl.from(".about-content-txt-description-text", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power2.out"
  }, 0);

  // TABLE ROWS
  tl.from(".about-content-company-info tr", {
    opacity: 0,
    x: -20,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out"
  }, 0);
}
