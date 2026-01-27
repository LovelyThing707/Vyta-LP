gsap.registerPlugin(ScrollTrigger);

// Image slider animation
const images = gsap.utils.toArray(".about-content-img img");

const SLIDE_TIME = 0.5; // fast slide
const HOLD_TIME = 2;   // pause time
const OFFSET = 120;   // slide distance in %

const tl = gsap.timeline({
  repeat: -1
});

// Set initial positions
images.forEach(img => {
  gsap.set(img, {
    xPercent: OFFSET,
    opacity: 0
  });
});

// Animation loop
images.forEach((img, i) => {
  tl.to(img, {
    xPercent: 0,
    opacity: 1,
    duration: SLIDE_TIME,
    ease: "power3.out"
  })
  .to(img, {
    duration: HOLD_TIME
  })
  .to(img, {
    xPercent: -OFFSET,
    opacity: 0,
    duration: SLIDE_TIME,
    ease: "power3.in"
  });
});

// ==========================
// ABOUT TEXT ANIMATIONS
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize title text animations (both mobile and desktop versions)
  initTitleAnimations();
  
  // Initialize description and company info animations
  initContentAnimations();
});

// Split text into individual characters and wrap them in spans
function splitTextIntoLetters(element) {
  const text = element.textContent;
  const letters = text.split('');
  element.innerHTML = '';
  
  letters.forEach((letter, index) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = letter === ' ' ? '\u00A0' : letter; // Non-breaking space for regular spaces
    span.style.opacity = '0';
    element.appendChild(span);
  });
  
  return element.querySelectorAll('.letter');
}

// Initialize title text animations
function initTitleAnimations() {
  // Handle both mobile and desktop versions
  const titleContainers = document.querySelectorAll('.about-content-txt-title-container');
  
  titleContainers.forEach(container => {
    const titleParagraphs = container.querySelectorAll('.about-content-txt-title');
    
    titleParagraphs.forEach((paragraph, pIndex) => {
      // Split text into letters
      const letters = splitTextIntoLetters(paragraph);
      
      // Create background element for left-to-right animation
      const bgElement = document.createElement('span');
      bgElement.className = 'title-bg-animation';
      
      // Ensure paragraph has proper positioning
      if (getComputedStyle(paragraph).position === 'static') {
        paragraph.style.position = 'relative';
      }
      
      // Insert background as first child so it's behind the letters
      paragraph.insertBefore(bgElement, paragraph.firstChild);
      
      // Set initial state for background
      gsap.set(bgElement, {
        width: '0%'
      });
      
      // Create timeline for this paragraph's animation
      const paragraphTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
      
      // Step 1: Animate background from left to right
      paragraphTimeline.to(bgElement, {
        width: '100%',
        duration: 0.8,
        ease: 'power2.out'
      });
      
      // Step 2: Fade in letters one by one (starts after background completes)
      letters.forEach((letter, lIndex) => {
        paragraphTimeline.to(letter, {
          opacity: 1,
          duration: 0.1,
          ease: 'none'
        }, 0.8 + (lIndex * 0.03)); // Start after background, stagger each letter
      });
    });
  });
}

// Initialize description and company info animations
function initContentAnimations() {
  const descriptionSection = document.querySelector('.about-content-txt-description');
  if (!descriptionSection) return;
  
  const descriptionText = descriptionSection.querySelector('.about-content-txt-description-text');
  const companyInfo = descriptionSection.querySelector('.about-content-company-info');
  
  // Set initial states
  if (descriptionText) {
    gsap.set(descriptionText, {
      opacity: 0,
      y: 30
    });
  }
  
  if (companyInfo) {
    const tableRows = companyInfo.querySelectorAll('tr');
    tableRows.forEach((row, index) => {
      gsap.set(row, {
        opacity: 0,
        x: -20
      });
    });
  }
  
  // Create ScrollTrigger for description section
  ScrollTrigger.create({
    trigger: descriptionSection,
    start: 'top 80%',
    onEnter: () => {
      // Animate description text
      if (descriptionText) {
        gsap.to(descriptionText, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
      
      // Animate company info table rows
      if (companyInfo) {
        const tableRows = companyInfo.querySelectorAll('tr');
        tableRows.forEach((row, index) => {
          gsap.to(row, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: 0.4 + (index * 0.1), // Stagger each row
            ease: 'power2.out'
          });
        });
      }
    }
  });
}
