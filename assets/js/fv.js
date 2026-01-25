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
            vehicle.style.animation = `vehicleMove ${4 + index * 0.5}s ease-in-out infinite`;
            vehicle.style.animationDelay = `${index * 0.3}s`;
          }, 1000);
        }, 1500 + (index * 300)); // Start after people begin appearing
      }
    });
  };

  // Start animation after a short delay to ensure page is ready
  setTimeout(animateBuildings, 300);
  setTimeout(animateTrees, 500);
  setTimeout(animatePeopleAndVehicles, 600);
});
