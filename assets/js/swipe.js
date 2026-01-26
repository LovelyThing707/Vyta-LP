gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const solutionSection = document.querySelector(".solution");
  const solutionSlidAnimation = document.querySelector(".solution-slid-animation");
  
  if (!solutionSection || !solutionSlidAnimation) return;

  // Get items in order: item1, item2, item3
  const item1 = document.querySelector(".solution-slid-item1");
  const item2 = document.querySelector(".solution-slid-item2");
  const item3 = document.querySelector(".solution-slid-item3");
  const items = [item1, item2, item3].filter(item => item !== null);

  function getRightMargin() {
    const width = window.innerWidth;
  
    if (width >= 1440) {
      return [0, 100, 200];
    }  // Desktop
    if (width >= 1024) {
      return [0, 50, 100];
    };  // Desktop // Large mobile
    if (width >= 640) {
      return [0, 50, 100];
    }; 
    if (width >= 425)  {  // Large mobile
      return [0, 40, 80];           
    }         // Small mobile
    if (width >= 320)  {  // Large mobile
      return [0, 25, 50];           
    }         // Small mobile
    return [0, 0, 0];
  }

  const FINAL_RIGHT_MARGINS = getRightMargin();

  if (items.length === 0) return;

  // =============================
  // CONFIG
  // =============================
  const SCROLL_PER_ITEM = 1000; // vh per item
  const SCRUB_SMOOTHNESS = 2; // higher = smoother

  // Final right margin positions
  // const FINAL_RIGHT_MARGINS = [0, 100, 200]; // px: item1=0, item2=100, item3=200

  // =============================
  // INITIAL STATES
  // =============================
  // All items start off-screen at the bottom
  // Fixed width for all items (width doesn't change during animation)
  const FIXED_WIDTH = "100%";
  
  items.forEach((item, index) => {
    const finalRightMargin = FINAL_RIGHT_MARGINS[index];
    
    // Get viewport height for off-screen positioning
    const viewportHeight = window.innerHeight;
    // Start with top position that puts item completely off-screen at the bottom
    const startTop = viewportHeight; // Below the viewport
    
    gsap.set(item, {
      position: "absolute",
      left: "auto",
      right: `${finalRightMargin}px`, // Final right position (for overlapping effect)
      top: `${startTop}px`, // Off-screen at the bottom
      width: FIXED_WIDTH, // Fixed width for all items
      opacity: 1,
      zIndex: items.length - index, // Higher z-index for earlier items
    });
  });

  // =============================
  // MASTER TIMELINE
  // =============================
  const scrollDistance = items.length * SCROLL_PER_ITEM;

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: solutionSlidAnimation, // Only pin the animation container, not the entire section
      start: "top top",
      end: `+=${scrollDistance}vh`,
      scrub: SCRUB_SMOOTHNESS,
      pin: true,
      pinSpacing: true, // Ensure proper spacing
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // =============================
  // ANIMATIONS
  // =============================
  items.forEach((item, index) => {
    const itemStart = index / items.length;
    const itemEnd = (index + 1) / items.length;
    const animationDuration = itemEnd - itemStart;

    const finalRightMargin = FINAL_RIGHT_MARGINS[index];
    
    // Final top position (below top-part)
    const finalTop = 150; // 100px below top (below top-part)
    
    // Scroll item from bottom to top and stop at final position
    // Width is fixed, only animate top and right positions
    masterTl.to(
      item,
      {
        top: `${finalTop}px`, // Move from bottom to final top position
        right: `${finalRightMargin}px`, // Maintain right margin for overlapping
        duration: animationDuration * 0.6, // 60% of item's scroll time for animation
        ease: "power2.out",
      },
      itemStart
    );

    // Keep item at final position for the remaining scroll time
    masterTl.to(
      item,
      {
        top: `${finalTop}px`,
        right: `${finalRightMargin}px`,
        duration: animationDuration * 0.4, // Remaining 40% to hold position
        ease: "none",
      },
      itemStart + animationDuration * 0.6
    );
  });

  // =============================
  // WINDOW RESIZE HANDLER
  // =============================
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate initial positions on resize
      items.forEach((item, index) => {
        const finalRightMargin = FINAL_RIGHT_MARGINS[index];
        const viewportHeight = window.innerHeight;
        const startTop = viewportHeight; // Below the viewport
        
        // Only update if animation hasn't started yet
        const scrollTrigger = masterTl.scrollTrigger;
        if (scrollTrigger && scrollTrigger.progress < 0.01) {
          gsap.set(item, {
            top: `${startTop}px`,
          });
        }
      });
      
      ScrollTrigger.refresh();
    }, 150);
  });
});
