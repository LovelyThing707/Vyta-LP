gsap.registerPlugin();

const images = gsap.utils.toArray(".about-content-img img");

const SLIDE_TIME = 0.5; // fast slide
const HOLD_TIME = 2;   // pause time
const OFFSET = 120;   // slide distance in %

const tl = gsap.timeline({
  repeat: -1
});

// Set initial positions
images.forEach(img => {
  gsap.set(img, {
    xPercent: OFFSET,
    opacity: 0
  });
});

// Animation loop
images.forEach((img, i) => {
  tl.to(img, {
    xPercent: 0,
    opacity: 1,
    duration: SLIDE_TIME,
    ease: "power3.out"
  })
  .to(img, {
    duration: HOLD_TIME
  })
  .to(img, {
    xPercent: -OFFSET,
    opacity: 0,
    duration: SLIDE_TIME,
    ease: "power3.in"
  });
});
