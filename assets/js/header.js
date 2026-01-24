document.addEventListener("DOMContentLoaded", () => {
  const hamBtn = document.querySelector(".ham-btn");
  const hamList = document.querySelector(".ham-list");
  const body = document.body;

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
});
