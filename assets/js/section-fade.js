// Section Fade-In/Fade-Out Animation
// Applies smooth fade transitions to all main sections based on scroll

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Define all sections that should have fade-in/fade-out
  const sections = [
    { selector: ".concept", id: "canva" }, // CONCEPT (main content, not the title-box slide)
    { selector: ".value", id: "value" },
    { selector: ".solution", id: "solution" },
    { selector: ".study", id: "case-study" },
    { selector: ".flow", id: "flow" },
    { selector: ".about", id: "about" },
    { selector: ".contact_download", id: null } // No ID, use class
  ];

  sections.forEach((section, index) => {
    const element = document.querySelector(section.selector);
    if (!element) return;

    // Set initial opacity to 0
    gsap.set(element, { opacity: 0 });

    // Create fade-in animation
    const fadeIn = gsap.to(element, {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%", // Start fading in when section is 80% down the viewport
        end: "top 20%",   // Complete fade-in when section reaches 20% from top
        toggleActions: "play none none reverse", // Fade in on enter, fade out on leave (reverse)
        // Optional: add markers for debugging (remove in production)
        // markers: true
      }
    });

    // Optional: Add a slight fade-out when scrolling past the section
    // This creates a smoother transition between sections
    ScrollTrigger.create({
      trigger: element,
      start: "bottom top", // When bottom of section hits top of viewport
      end: "bottom -50%",   // End point
      onEnter: () => {
        gsap.to(element, {
          opacity: 0.3, // Slightly fade out (not fully invisible)
          duration: 0.8,
          ease: "power2.in"
        });
      },
      onLeaveBack: () => {
        gsap.to(element, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    });
  });
});

// Custom timing per section (optional)
const sectionConfig = {
    ".concept#canva": { duration: 1.2, start: "top 80%" },
    ".value#value": { duration: 1.0, start: "top 75%" },
    ".solution#solution": { duration: 1.4, start: "top 85%" },
    ".study#case-study": { duration: 1.2, start: "top 80%" },
    ".flow#flow": { duration: 1.0, start: "top 75%" },
    ".about#about": { duration: 1.2, start: "top 80%" },
    ".contact_download": { duration: 0.8, start: "top 90%" }
  };