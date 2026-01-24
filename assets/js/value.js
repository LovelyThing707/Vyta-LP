// // Register ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger);

// document.addEventListener("DOMContentLoaded", () => {
//   const valueSection = document.querySelector(".value");
//   if (!valueSection) return;

//   const valueItems = document.querySelectorAll(".value-item");
//   const triIcons = document.querySelectorAll(".tri-icon");

//   if (valueItems.length === 0) return;

//   // =============================
//   // CONFIG — TUNE SPEED HERE
//   // =============================
//   const SCROLL_PER_ITEM = 1000; // vh per item
//   const SCRUB_SMOOTHNESS = 2; // higher = more inertia
//   const NUMBER_SPACING = -100; // px spacing between fixed numbers at top
//   const BOTTOM_OFFSET = 150; // px from bottom for initial positioning
//   const TOP_OFFSET = 50; // px from top for fixed numbers

//   // =============================
//   // INITIAL STATES
//   // =============================
//   // All items start at the bottom, arranged sequentially
//   valueItems.forEach((item, index) => {
//     const number = item.querySelector(".value-item-number");
//     const content = item.querySelector(".value-item-content");

//     // Item starts visible at bottom, positioned sequentially
//     // Override CSS positioning (top: 50%, transform: translateY(-50%))
//     const bottomPosition = BOTTOM_OFFSET + (index * -80);
//     const viewportHeight = window.innerHeight;
    
//     gsap.set(item, {
//       opacity: 1,
//       x: 0,
//       top: "auto",
//       bottom: `${bottomPosition}px`,
//       left: 0,
//       transform: "none", // Override translateY(-50%)
//     });

//     // Number starts at normal size, positioned within item
//     gsap.set(number, {
//       scale: 0.5,
//       x: 0,
//       y: 0,
//       opacity: 1,
//       position: "relative",
//     });

//     // Content is present but invisible (opacity 0)
//     gsap.set(content, {
//       opacity: 0,
//     });
//   });

//   // Hide tri-icons initially
//   triIcons.forEach((icon) => {
//     gsap.set(icon, {
//       opacity: 1,
//     });
//   });

//   // =============================
//   // MASTER TIMELINE
//   // =============================
//   const scrollDistance = valueItems.length * SCROLL_PER_ITEM;

//   const masterTl = gsap.timeline({
//     scrollTrigger: {
//       trigger: valueSection,
//       start: "top top",
//       end: `+=${scrollDistance}vh`,
//       scrub: SCRUB_SMOOTHNESS,
//       pin: true,
//       anticipatePin: 1,
//       invalidateOnRefresh: true,
//     },
//   });

//   // =============================
//   // ANIMATIONS
//   // =============================
//   valueItems.forEach((item, index) => {
//     const number = item.querySelector(".value-item-number");
//     const content = item.querySelector(".value-item-content");

//     // Calculate timeline positions (each item gets 1/3 of the scroll)
//     const itemStart = index / valueItems.length;
//     const itemEnd = (index + 1) / valueItems.length;
//     const animationDuration = itemEnd - itemStart;

//     // Calculate final position for number at top
//     // First item at top, second 100px below, third 200px below
//     const topYPosition = TOP_OFFSET + (index * NUMBER_SPACING);

//     // Get initial bottom position of item
//     const initialBottom = BOTTOM_OFFSET + (index * 120);
//     const viewportHeight = window.innerHeight;
    
//     // Calculate Y distance: number needs to move from bottom to top
//     // Item is positioned at bottom, number is inside item
//     // We need to move number up significantly to reach top
//     // Rough calculation: from bottom area (viewportHeight - initialBottom) to top (topYPosition)
//     // Since we'll use fixed positioning after, we just need a large upward movement
//     const approximateCurrentY = viewportHeight - initialBottom - 100; // Approximate number Y position
//     const targetY = topYPosition + 55; // topYPosition + half of scaled number height (110 * 0.5 / 2)
//     const yDistance = -(approximateCurrentY - targetY); // Negative Y moves up

//     // Move item to the right
//     masterTl.to(
//       item,
//       {
//         x: 0, // Move to the right
//         duration: animationDuration * 0.5,
//         ease: "power2.out",
//       },
//       itemStart
//     );
    
//     masterTl.to(
//       content,
//       {
//         x: 0, // Move to the right
//         duration: animationDuration * 0.5,
//         ease: "power2.out",
//         opacity: 1,
//         y: yDistance + 300,
//       },
//       itemStart
//     );
//     // Animate number: scale to 0.5 and move to top
//     masterTl.to(
//       number,
//       {
//         scale: 1,
//         y: yDistance + 300, // Move up to top position
//         duration: animationDuration * 0.5,
//         ease: "power2.out",
//       },
//       itemStart
//     );

//     // After animation, fix number position at top using fixed positioning
//     // Clear GSAP transforms and use CSS for positioning and scale
//     masterTl.set(
//       number,
//       {
//         clearProps: "all", // Clear all GSAP properties
//         position: "fixed",
//         top: `${topYPosition}px`,
//         right: "250px", // Match the padding-right of value section
//         transform: "scale(0.5)", // Apply scale via CSS transform
//         zIndex: 10, // Ensure numbers are on top
//       },
//       itemStart + animationDuration * 0.5
//     );

//     // For first two items: content opacity stays at 0
//     // For third item: content opacity goes to 1
//     if (index === valueItems.length - 1) {
//       // Last item: content becomes visible
//       masterTl.to(
//         content,
//         {
//           opacity: 1,
//           duration: animationDuration * 0.3,
//           ease: "power2.out",
//         },
//         itemStart + animationDuration * 0.5
//       );
//     } else {
//       // First two items: ensure content stays invisible
//       masterTl.set(
//         content,
//         {
//           opacity: 0,
//         },
//         itemStart
//       );
//     }
//   });

//   // =============================
//   // FINAL STATE LOCK
//   // =============================
//   masterTl.to(
//     {},
//     {
//       duration: 0.01,
//       onComplete: () => {
//         // Ensure final states are locked
//         valueItems.forEach((item, index) => {
//           const number = item.querySelector(".value-item-number");
//           const content = item.querySelector(".value-item-content");
//           const topYPosition = TOP_OFFSET + (index * NUMBER_SPACING);

//           gsap.set(item, { opacity: 1, x: 0 });
//           // Use CSS for final state to match the animation
//           number.style.cssText = `
//             top: ${topYPosition}px;
//             right: 250px;
//             transform: scale(0.5);
//             opacity: 1;
//             z-index: 10;
//           `;


//           if (index === valueItems.length - 1) {
//             gsap.set(content, { opacity: 1 });
//           } else {
//             gsap.set(content, { opacity: 0 });
//           }
//         });
//       },
//     },
//     "+=0.2"
//   );

// });

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const valueSection = document.querySelector(".value");
  if (!valueSection) return;

  const valueItems = document.querySelectorAll(".value-item");
  const triIcons = document.querySelectorAll(".tri-icon");

  if (valueItems.length === 0) return;

  // =============================
  // CONFIG — TUNE FEEL HERE
  // =============================
  const SCROLL_PER_ITEM = 1000; // vh per item
  const SCRUB_SMOOTHNESS = 2; // higher = smoother
  const NUMBER_SPACING = -100; // px spacing between stacked numbers
  const BOTTOM_OFFSET = 150; // px from bottom start
  const TOP_OFFSET = 50; // px from top lock position
  const RIGHT_OFFSET = 250; // px from right when fixed
  const LEFT_OFFSET = 370; // px from left when fixed

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
      scale: 0.5,
      y: 0,
      opacity: 1,
      position: "fixed",
      left: LEFT_OFFSET,
    });

    gsap.set(content, {
      opacity: 0,
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
        y: yDistance + 300,
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
        y: yDistance + 300,
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
        y: -250,
        opacity: 1,
        scale: 0.5,
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

    masterTl.to(
      content,
      {
        opacity: 1,
        y: yDistance + 300,
        duration: animationDuration * 0.5,
        ease: "power2.out",
      },
      itemStart
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

