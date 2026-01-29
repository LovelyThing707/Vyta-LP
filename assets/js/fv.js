document.addEventListener("DOMContentLoaded", () => {
  const interBubble = document.querySelector(".interactive");
  let curX = 0;
  let curY = 0;
  let tgX = 0;
  let tgY = 0;

  const move = () => {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    if (interBubble) {
      interBubble.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
    }
    requestAnimationFrame(move);
  };

  window.addEventListener("mousemove", (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
  });

  // Start mouse tracking immediately (this doesn't affect visual animations)
  move();

  // Building pop-up animation
  const animateBuildings = () => {
    const buildings = [
      document.querySelectorAll('.bigHome')[0], // First homeOne
      // document.querySelectorAll('.homeOne')[1], // Second homeOne
      document.querySelector('.homeTwo'),
      document.querySelector('.homeThree'),
      document.querySelector('.homeFour'),
      document.querySelectorAll('.homeOne')[0],
      document.querySelectorAll('.homeOne')[1],
    ];

    buildings.forEach((building, index) => {
      if (building) {
        setTimeout(() => {
          building.classList.add('pop-up');
        }, index * 600); // 150ms delay between each building
      }
    });

    // Calculate total animation time: initial delay + (number of buildings * delay per building) + extra delay
    const totalBuildings = buildings.filter(b => b !== null).length;
    const totalAnimationTime = 300 + (totalBuildings * 150) + 800; // 200ms extra delay before header appears

    // Animate header after all buildings have appeared
    setTimeout(() => {
      const header = document.querySelector('header');
      if (header) {
        header.classList.add('header-visible');

        // Animate title section after header animation completes (600ms header animation + 200ms delay)
        setTimeout(() => {
          const fvTxt = document.querySelector('.fv-txt');
          if (fvTxt) {
            fvTxt.classList.add('fade-in-up');
          }
        }, 600 + 200); // Wait for header animation (600ms) + small delay (200ms)
      }
    }, totalAnimationTime);
  };

  // Animate trees
  const animateTrees = () => {
    const trees = [
      document.querySelector('.treeOne'),
      document.querySelector('.treeTwo'),
    ];

    // Animate trees with fade-in and gentle swaying
    trees.forEach((tree, index) => {
      if (tree) {
        // Initial state: invisible and slightly offset
        tree.style.opacity = '0';
        tree.style.transform = 'translateY(15px) scale(0.9)';
        tree.style.transition = 'opacity 1s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';

        // Animate in with delay
        setTimeout(() => {
          tree.style.opacity = '1';
          tree.style.transform = 'translateY(0) scale(1)';

          // Add gentle swaying animation after fade-in
          setTimeout(() => {
            tree.style.animation = `treeSway ${5 + index * 0.8}s ease-in-out infinite`;
            tree.style.animationDelay = `${index * 0.4}s`;
          }, 1000);
        }, 800 + (index * 250)); // Start early, before people/vehicles
      }
    });
  };

  // Animate streetlights
  const animateStreetlights = () => {
    const streetlights = [
      document.querySelector('.fv-img-box img:nth-of-type(16)'),
      document.querySelector('.fv-img-box img:nth-of-type(17)'),
    ];

    // Animate streetlights with fade-in and gentle glow effect
    streetlights.forEach((light, index) => {
      if (light) {
        // Initial state: invisible and slightly offset
        light.style.opacity = '0';
        light.style.transform = 'translateY(10px) scale(0.95)';
        light.style.transition = 'opacity 1s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';

        // Animate in with delay
        setTimeout(() => {
          light.style.opacity = '0.5';
          light.style.transform = 'translateY(0) scale(1)';

          // Add gentle glow animation after fade-in
          setTimeout(() => {
            light.style.animation = `streetlightGlow ${4 + index * 0.6}s ease-in-out infinite`;
            light.style.animationDelay = `${index * 0.3}s`;
          }, 1000);
        }, 1000 + (index * 200)); // Start after trees, staggered
      }
    });
  };

  // Animate people and vehicles
  const animatePeopleAndVehicles = () => {
    // People elements
    const people = [
      document.querySelector('.manOne'),
      document.querySelector('.manTwo'),
      document.querySelector('.manThree'),
      document.querySelector('.manFour'),
      document.querySelector('.manFive'),
    ];

    // Vehicle elements
    const vehicles = [
      document.querySelector('.truckOne'),
      document.querySelector('.truckTwo'),
    ];

    // Animate people with staggered fade-in and subtle movement
    people.forEach((person, index) => {
      if (person) {
        // Initial state: invisible and slightly offset
        person.style.opacity = '0';
        person.style.transform = 'translateY(20px)';
        person.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

        // Animate in with delay
        setTimeout(() => {
          person.style.opacity = '1';
          person.style.transform = 'translateY(0)';

          // Add subtle floating/walking animation after fade-in
          setTimeout(() => {
            person.style.animation = `personFloat ${3 + index * 0.5}s ease-in-out infinite`;
            person.style.animationDelay = `${index * 0.2}s`;
          }, 800);
        }, 1200 + (index * 200)); // Start after buildings, staggered
      }
    });

    // Animate vehicles with fade-in and horizontal movement
    vehicles.forEach((vehicle, index) => {
      if (vehicle) {
        // Initial state: invisible and offset
        vehicle.style.opacity = '0';
        vehicle.style.transform = 'translateX(-30px)';
        vehicle.style.transition = 'opacity 1s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';

        // Animate in with delay
        setTimeout(() => {
          vehicle.style.opacity = '1';
          vehicle.style.transform = 'translateX(0)';

          // Add subtle driving animation after fade-in
          setTimeout(() => {
            vehicle.style.animation = `vehicleMove ${2 + index * 0.5}s ease-in-out infinite`;
            vehicle.style.animationDelay = `${index * 0.3}s`;
          }, 1000);
        }, 1500 + (index * 300)); // Start after people begin appearing
      }
    });
  };

  // Wait for loading screen to start fading before beginning FV animations
  // This ensures the FV animation starts as the loading screen fades out
  window.addEventListener('loadingFadeStart', () => {
    // Start FV animations when loading fade begins
    setTimeout(animateBuildings, 300);
    setTimeout(animateTrees, 500);
    setTimeout(animateStreetlights, 700);
    setTimeout(animatePeopleAndVehicles, 600);
  }, { once: true }); // Use once: true so it only fires once
});



document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.fv-scroll-container');
  const stickyWrapper = document.querySelector('.fv-sticky-wrapper');
  const slides = document.querySelectorAll('.fv-slide');
  const totalSlides = slides.length;

  function onScroll() {
    if (!scrollContainer || !stickyWrapper) return;

    // Container's position relative to viewport
    const rect = scrollContainer.getBoundingClientRect();

    // The container starts at the top of the page (usually), so rect.top starts at 0 and goes negative.
    // The scrollable distance effectively controlled by the sticky container is:
    // (Container Height - Viewport Height)
    const scrollHeight = scrollContainer.offsetHeight - window.innerHeight;

    // How many pixels have we scrolled past the start of the container?
    // -rect.top is the amount scrolled "into" the container because it's at the top.
    // We clamp it between 0 and scrollHeight.
    let scrolled = -rect.top;
    if (scrolled < 0) scrolled = 0;
    if (scrolled > scrollHeight) scrolled = scrollHeight;

    // Calculate progress 0 to 1
    const progress = scrolled / scrollHeight;

    // Determine which slide should be active
    // We map the progress (0 to 1) to the number of slides (0 to totalSlides - 1)
    // However, we want the last slide to stay visible until the very end, 
    // effectively naturally scrolling away or just finishing the sequence.

    // Let's divide the progress timeline such that each slide gets an equal share.
    let activeIndex = Math.floor(progress * totalSlides);

    // Clamp index to valid range (0 to length-1)
    if (activeIndex < 0) activeIndex = 0;
    if (activeIndex >= totalSlides) activeIndex = totalSlides - 1;

    // Update classes
    slides.forEach((slide, index) => {
      if (index === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // Initialize
  window.addEventListener('scroll', onScroll, { passive: true });
  // Trigger once on load
  onScroll();
});


document.addEventListener('DOMContentLoaded', () => {

  /**
   * Runs scroll-based slide animation for one block.
   * @param {HTMLElement} scrollContainer - Tall container (e.g. 400vh)
   * @param {NodeListOf<Element>} slides - Slide elements inside the sticky area
   */
  function updateScrollBlock(scrollContainer, slides) {
      if (!scrollContainer || !slides.length) return;

      const totalSlides = slides.length;
      const rect = scrollContainer.getBoundingClientRect();
      const scrollHeight = scrollContainer.offsetHeight - window.innerHeight;

      if (scrollHeight <= 0) return;

      let scrolled = -rect.top;
      if (scrolled < 0) scrolled = 0;
      if (scrolled > scrollHeight) scrolled = scrollHeight;

      const progress = scrolled / scrollHeight;
      let activeIndex = Math.floor(progress * totalSlides);
      if (activeIndex < 0) activeIndex = 0;
      if (activeIndex >= totalSlides) activeIndex = totalSlides - 1;

      slides.forEach((slide, index) => {
          slide.classList.toggle('active', index === activeIndex);
      });
  }

  function onScroll() {
      // FV section (existing)
      const fvContainer = document.querySelector('.fv-scroll-container');
      const fvSlides = document.querySelectorAll('.fv-slide');
      updateScrollBlock(fvContainer, fvSlides);

      // All generic scroll-animation sections (e.g. .concept)
      document.querySelectorAll('.scroll-animation-container').forEach((container) => {
          const slides = container.querySelectorAll('.scroll-animation-slide');
          updateScrollBlock(container, slides);
      });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
