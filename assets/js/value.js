// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const valueSection = document.querySelector(".value");
  if (!valueSection) return;

  const valueItems = document.querySelectorAll(".value-item");
  const triIcons = document.querySelectorAll(".tri-icon");

  if (valueItems.length === 0) return;

  // =============================
  // CONFIG — TUNE SPEED HERE
  // =============================
  const SCROLL_PER_ITEM = 250; // vh per item (200–300 = smooth & premium)
  const SCRUB_SMOOTHNESS = 2; // higher = more inertia

  // =============================
  // INITIAL STATES
  // =============================
  valueItems.forEach((item) => {
    const number = item.querySelector(".value-item-number");
    const content = item.querySelector(".value-item-content");

    gsap.set(item, {
      opacity: 0,
    });

    gsap.set(number, {
      scale: 0.3,
      y: 200,
      opacity: 0,
    });

    gsap.set(content, {
      opacity: 0,
      y: 30,
    });
  });

  triIcons.forEach((icon) => {
    gsap.set(icon, {
      opacity: 0,
      scale: 0.5,
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
      anticipatePin: 100,
      invalidateOnRefresh: true,
    },
  });

  // =============================
  // ANIMATIONS
  // =============================
  valueItems.forEach((item, index) => {
    const number = item.querySelector(".value-item-number");
    const content = item.querySelector(".value-item-content");

    const triIcon = triIcons[index] || null;
    const prevItem = index > 0 ? valueItems[index - 1] : null;
    const prevNumber = prevItem
      ? prevItem.querySelector(".value-item-number")
      : null;
    const prevContent = prevItem
      ? prevItem.querySelector(".value-item-content")
      : null;
    const prevTriIcon = index > 0 ? triIcons[index - 1] : null;

    // Timeline positions (relative to full scroll)
    const itemStart = index / valueItems.length;
    const contentStart = itemStart + 0.15;
    const triIconStart = itemStart + 0.35;

    // Show current item
    masterTl.to(
      item,
      {
        opacity: 1,
        duration: 0.2,
        ease: "none",
      },
      itemStart
    );

    // Number animation
    masterTl.to(
      number,
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      },
      itemStart
    );

    // Content animation
    masterTl.to(
      content,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      contentStart
    );

    // Tri-icon animation
    if (triIcon && index < valueItems.length - 1) {
      masterTl.to(
        triIcon,
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        },
        triIconStart
      );
    }

    // Fade out previous item
    if (prevItem && prevNumber && prevContent) {
      const fadeOutStart = itemStart;

      masterTl.to(
        prevContent,
        {
          opacity: 0,
          y: -40,
          duration: 0.4,
          ease: "power3.in",
        },
        fadeOutStart
      );

      masterTl.to(
        prevNumber,
        {
          scale: 0.3,
          y: 200,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        },
        fadeOutStart
      );

      masterTl.to(
        prevItem,
        {
          opacity: 0,
          duration: 0.2,
          ease: "none",
        },
        fadeOutStart + 0.3
      );

      if (prevTriIcon && index > 1) {
        masterTl.to(
          prevTriIcon,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power3.in",
          },
          fadeOutStart
        );
      }
    }
  });

  // =============================
  // FINAL STATE LOCK
  // =============================
  const lastItem = valueItems[valueItems.length - 1];
  const lastNumber = lastItem.querySelector(".value-item-number");
  const lastContent = lastItem.querySelector(".value-item-content");
  const lastTriIcon = triIcons[triIcons.length - 1];

  masterTl.to(
    {},
    {
      duration: 0.01,
      onComplete: () => {
        gsap.set(lastItem, { opacity: 1 });
        gsap.set(lastNumber, { scale: 1, y: 0, opacity: 1 });
        gsap.set(lastContent, { opacity: 1, y: 0 });
        if (lastTriIcon) {
          gsap.set(lastTriIcon, { opacity: 1, scale: 1 });
        }
      },
    },
    "+=0.2"
  );
});
