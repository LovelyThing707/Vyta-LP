document.addEventListener("DOMContentLoaded", () => {
  const hamButton = document.querySelector(".ham-button");
  const hamList = document.querySelector(".ham-list");
  const body = document.body;
  const hNav = document.querySelector(".h-nav");
  const blackHamBtn = document.querySelector(".black-btn");
  const whiteHamBtn = document.querySelector(".white-btn");
  const blackLogo = document.querySelector(".black-logo");
  const whiteLogo = document.querySelector(".white-logo");

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

  if (hamButton && hamList) {
    hamButton.addEventListener("click", () => {
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
    if (blackHamBtn) {
      if (scrollY >= viewportHeight) {
        blackHamBtn.classList.add("black-ham-btn-visible");
        whiteHamBtn.classList.add("white-ham-btn-visible");
      } else {
        blackHamBtn.classList.remove("black-ham-btn-visible");
        whiteHamBtn.classList.remove("white-ham-btn-visible");
      }
    }
    if (blackLogo) {
      if (scrollY >= viewportHeight) {
        blackLogo.classList.add("black-logo-visible");
        whiteLogo.classList.add("white-logo-visible");
      } else {
        blackLogo.classList.remove("black-logo-visible");
        whiteLogo.classList.remove("white-logo-visible");
      }
    }
  };

  // Check on initial load
  handleScroll();

  // Listen to scroll events
  window.addEventListener("scroll", handleScroll);
});
