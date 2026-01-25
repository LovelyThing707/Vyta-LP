gsap.registerPlugin(ScrollTrigger);

const flowItems = gsap.utils.toArray('.flow-item');
const imgT = document.querySelector('.img-t');

// Set initial rotation for .flow-item elements
flowItems.forEach(item => {
  gsap.set(item, {
    rotate: parseFloat(item.dataset.baseRotate || 0)
  });
});

// Set initial rotation for .img-t element
if (imgT) {
  gsap.set(imgT, {
    rotate: parseFloat(imgT.dataset.baseRotate || 0)
  });
}

// Animate rotation on scroll for .flow-item elements
gsap.to(flowItems, {
  rotate: (i, el) => {
    const base = parseFloat(el.dataset.baseRotate || 0);
    return base - 360;
  },
  ease: "none",
  scrollTrigger: {
    trigger: ".flow",
    start: "top top",
    end: "+=3600",
    scrub: true
  }
});

// Animate rotation on scroll for .img-t element (treat base as 0)
if (imgT) {
  gsap.to(imgT, {
    rotate: -360,
    ease: "none",
    scrollTrigger: {
      trigger: ".flow",
      start: "top top",
      end: "+=3600",
      scrub: true
    }
  });
}