// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const valueSection = document.querySelector(".value");
  if (!valueSection) return;

  const valueItems = document.querySelectorAll(".value-item");
  const triIcons = document.querySelectorAll(".tri-icon");

  if (valueItems.length === 0) return;

  function getLeftOffset() {
    const width = window.innerWidth;
  
    if (width >= 1520) return 370;  // Desktop
    if (width >= 1280) return 10;  // Desktop
    if (width >= 1024) return 20;  // Small desktop
    if (width >= 640)  return 20;  // Tablet
    if (width >= 440)  return 10;  // Large mobile
    if (width >= 320)  return 10;  // Large mobile
    return 100;                    // Small mobile
  }
  
  let AUTO_LEFT_OFFSET = getLeftOffset();
  
  function getTopOffset() {
    const width = window.innerWidth;
    if (width >= 1520) return 300;  // Desktop
    if (width >= 1280) return 500;  // Desktop
    if (width >= 1024) return 20;  // Small desktop
    if (width >= 640)  return 20;  // Tablet
    if (width >= 440)  return 500;  // Large mobile
    if (width >= 320)  return 5;  // Large mobile
    return 300;                    // Small mobile
  }

  let AUTO_TOP_OFFSET = getTopOffset();

  function getInitialYPosition() {
    const width = window.innerWidth;
    if (width >= 1520) return 100;  // Desktop
    if (width >= 1280) return 100;  // Desktop
    if (width >= 1024) return 200;  // Small desktop
    if (width >= 640)  return 300;  // Tablet
    if (width >= 440)  return 300;  // Large mobile
    if (width >= 320)  return 400;  // Large mobile
  }

  let AUTO_INITIAL_Y_POSITION = getInitialYPosition();

  function animationDuration() {
    const width = window.innerWidth;
    if (width >= 1520) return 300;  // Desktop
    if (width >= 1280) return 300;  // Desktop
    if (width >= 1024) return 300;  // Small desktop
    if (width >= 640)  return 400;  // Tablet
    if (width >= 440)  return 1;  // Large mobile
    if (width >= 320)  return 450;  // Large mobile
  }

  let AUTO_ANIMATION_DURATION = animationDuration();

  function getFinalYPosition() {
    const width = window.innerWidth;
    if (width >= 1520) return -250;  // Desktop
    if (width >= 1280) return -250;  // Desktop
    if (width >= 1024) return -250;  // Small desktop
    if (width >= 640)  return -100;  // Tablet
    if (width >= 440)  return -100;  // Large mobile
    if (width >= 320)  return -50;  // Large mobile
  }

  let AUTO_FINAL_Y_POSITION = getFinalYPosition();

  function getScale() {
    const width = window.innerWidth;
    if (width >= 1020) return 0.5;  // Desktop
    if (width >= 320)  return 0.8;  // Large mobile
  }
  let AUTO_SCALE = getScale();
  // =============================
  // CONFIG — TUNE FEEL HERE
  // =============================
  const SCROLL_PER_ITEM = 1000; // vh per item
  const SCRUB_SMOOTHNESS = 2; // higher = smoother
  const NUMBER_SPACING = -100; // px spacing between stacked numbers
  const BOTTOM_OFFSET = 150; // px from bottom start
  const TOP_OFFSET = 50; // px from top lock position
  const RIGHT_OFFSET = 250; // px from right when fixed
  const LEFT_OFFSET = AUTO_LEFT_OFFSET; // px from left when fixed
  const INITIAL_Y_POSITION = AUTO_INITIAL_Y_POSITION;
  // =============================
  // INITIAL STATES
  // =============================
  valueItems.forEach((item, index) => {
    const number = item.querySelector(".value-item-number");
    const content = item.querySelector(".value-item-content");

    const bottomPosition = BOTTOM_OFFSET + index * -80;

    gsap.set(item, {
      opacity: 1,
      x: 0,
      top: "auto",
      bottom: `${bottomPosition}px`,
      left: 0,
      transform: "none",
    });

    gsap.set(number, {
      scale: AUTO_SCALE,
      y: INITIAL_Y_POSITION,
      opacity: 1,
      position: "fixed",
      left: LEFT_OFFSET,
    });

    gsap.set(content, {
      opacity: 0,
      y: INITIAL_Y_POSITION,
    });
  });

  triIcons.forEach((icon) => {
    gsap.set(icon, { 
      opacity: 0,
      left: LEFT_OFFSET + 55,
      y: -300,
      position: "fixed",
      zIndex: 10,
    });
  });

  // =============================
  // MASTER TIMELINE
  // =============================
  const scrollDistance = valueItems.length * SCROLL_PER_ITEM;

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: valueSection,
      start: "top top",
      end: `+=${scrollDistance}vh`,
      scrub: SCRUB_SMOOTHNESS,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // =============================
  // ANIMATIONS
  // =============================
  valueItems.forEach((item, index) => {
    const number = item.querySelector(".value-item-number");
    const content = item.querySelector(".value-item-content");

    const itemStart = index / valueItems.length;
    const itemEnd = (index + 1) / valueItems.length;
    const animationDuration = itemEnd - itemStart;

    const topYPosition = TOP_OFFSET + index * NUMBER_SPACING;

    const initialBottom = BOTTOM_OFFSET + index * 120;
    const viewportHeight = window.innerHeight;
    const approximateCurrentY = viewportHeight - initialBottom - 100;
    const targetY = topYPosition + 55;
    const yDistance = -(approximateCurrentY - targetY);

    // Move content & number upward
    masterTl.to(
      content,
      {
        opacity: 1,
        y: yDistance + AUTO_ANIMATION_DURATION,
        duration: animationDuration * 0.5,
        ease: "power2.out",
      },
      itemStart
    );

    masterTl.to(
      triIcons,
      {
        opacity: 1,
        y: yDistance + 700,
        duration: animationDuration * 0.5,
        ease: "power3.out",
      },
    );

    // -----------------------------
    // CONTENT FADE OUT @ 1.5x ITEM LENGTH
    // -----------------------------
    masterTl.to(
      content,
      {
        opacity: 0,
        duration: animationDuration * 0.3,
        ease: "power2.in",
      },
      itemStart + animationDuration * 0.8
    );

    masterTl.to(
      number,
      {
        scale: 1,
        y: yDistance + AUTO_ANIMATION_DURATION,
        duration: animationDuration * 0.5,
        ease: "power2.out",
      },
      itemStart
    );

    // Lock number at top (GSAP CONTROLLED — no clearProps)
    masterTl.to(
      number,
      {
        position: "fixed",
        // top: topYPosition,
        left: LEFT_OFFSET,
        y: AUTO_FINAL_Y_POSITION,
        opacity: 1,
        scale: AUTO_SCALE,
        zIndex: 10,
        duration: animationDuration * 1,
        ease: "power2.out",
      },
      itemStart + animationDuration * 1
    );

    masterTl.to(
      triIcons,
      {
        opacity: 1,
        y: yDistance + 800,
        duration: animationDuration * 0.5,
        ease: "power3.out",
      },
    );

  });

  // =============================
  // FADE OUT CONTENT AT END
  // =============================
  const fadeOutPoint = 0.92;

  valueItems.forEach((item) => {
    const content = item.querySelector(".value-item-content");

    masterTl.to(
      content,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      fadeOutPoint
    );
  });

  // =============================
  // FINAL STATE LOCK
  // =============================
  // masterTl.to(
  //   {},
  //   {
  //     duration: 0.01,
  //     onComplete: () => {
  //       valueItems.forEach((item, index) => {
  //         const number = item.querySelector(".value-item-number");
  //         const content = item.querySelector(".value-item-content");
  //         const topYPosition = TOP_OFFSET + index * NUMBER_SPACING;

  //         gsap.set(number, {
  //           position: "fixed",
  //           top: topYPosition,
  //           right: RIGHT_OFFSET,
  //           scale: 0.5,
  //           opacity: 1,
  //           y: 0,
  //           zIndex: 10,
  //         });

  //         gsap.set(content, { opacity: 0 });
  //       });
  //     },
  //   },
  //   "+=0.1"
  // );
});

