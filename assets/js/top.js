// ------------ CONCEPT ------------
document.addEventListener("DOMContentLoaded", () => {
  const sliderWrap = document.querySelector(".concept-slider-wrap");
  
  if (sliderWrap) {
    // Clone all slides to create seamless loop
    const slides = sliderWrap.querySelectorAll(".concept-slide");
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      sliderWrap.appendChild(clone);
    });
  }

  // Duplicate tip text for seamless loop
  const tipP = document.querySelector(".tip p");
  if (tipP) {
    const tipText = tipP.textContent;
    tipP.textContent = tipText + " " + tipText;
  }

  // Trigger fall-down animation when concept-main comes into view
  const conceptMain = document.querySelector(".concept-main");
  if (conceptMain) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            // Unobserve after animation is triggered to prevent re-triggering
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -100px 0px", // Trigger slightly before it's fully in view
      }
    );

    observer.observe(conceptMain);
  }
});