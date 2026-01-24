document.addEventListener("DOMContentLoaded", () => {
  const interBubble = document.querySelector(".interactive");
  let curX = 0;
  let curY = 0;
  let tgX = 0;
  let tgY = 0;

  const move = () => {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interBubble.style.transform = `translate(${Math.round(
      curX
    )}px, ${Math.round(curY)}px)`;
    requestAnimationFrame(move);
  };

  window.addEventListener("mousemove", (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
  });

  move();

  // Building pop-up animation
  const animateBuildings = () => {
    const buildings = [
      document.querySelectorAll('.homeOne')[0], // First homeOne
      document.querySelectorAll('.homeOne')[1], // Second homeOne
      document.querySelector('.homeTwo'),
      document.querySelector('.homeThree'),
      document.querySelector('.homeFour'),
      document.querySelector('.bigHome'), // Big home last for emphasis
    ];

    buildings.forEach((building, index) => {
      if (building) {
        setTimeout(() => {
          building.classList.add('pop-up');
        }, index * 150); // 150ms delay between each building
      }
    });

    // Calculate total animation time: initial delay + (number of buildings * delay per building) + extra delay
    const totalBuildings = buildings.filter(b => b !== null).length;
    const totalAnimationTime = 300 + (totalBuildings * 150) + 200; // 200ms extra delay before header appears

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

  // Start animation after a short delay to ensure page is ready
  setTimeout(animateBuildings, 300);
});
