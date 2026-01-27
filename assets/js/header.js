document.addEventListener("DOMContentLoaded", () => {
  const hamBtn = document.querySelector(".ham-btn");
  const hamList = document.querySelector(".ham-list");
  const body = document.body;
  const hNav = document.querySelector(".h-nav");

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "ham-overlay";
  body.appendChild(overlay);

  const toggleMenu = (isOpen) => {
    if (isOpen) {
      hamList.classList.add("active");
      overlay.classList.add("active");
      body.style.overflow = "hidden";
    } else {
      hamList.classList.remove("active");
      overlay.classList.remove("active");
      body.style.overflow = "";
    }
  };

  if (hamBtn && hamList) {
    hamBtn.addEventListener("click", () => {
      const isActive = hamList.classList.contains("active");
      toggleMenu(!isActive);
    });

    // Close menu when clicking on overlay
    overlay.addEventListener("click", () => {
      toggleMenu(false);
    });

    // Close menu when clicking on a link
    const hamLinks = hamList.querySelectorAll("a");
    hamLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggleMenu(false);
      });
    });
  }

  // Show h-nav after scrolling 100vh
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    if (hNav) {
      if (scrollY >= viewportHeight) {
        hNav.classList.add("h-nav-visible");
      } else {
        hNav.classList.remove("h-nav-visible");
      }
    }
  };

  // Check on initial load
  handleScroll();

  // Listen to scroll events
  window.addEventListener("scroll", handleScroll);
});
