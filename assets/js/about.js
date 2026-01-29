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
  // Single trigger: title and description appear at the same time
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

// Build title animation timeline (no ScrollTrigger; added to master timeline)
function buildTitleTimeline(masterTl) {
  const titleContainers = document.querySelectorAll('.about-content-txt-title-container');
  
  titleContainers.forEach(container => {
    const titleParagraphs = container.querySelectorAll('.about-content-txt-title');
    
    titleParagraphs.forEach((paragraph) => {
      const letters = splitTextIntoLetters(paragraph);
      const bgElement = document.createElement('span');
      bgElement.className = 'title-bg-animation';
      
      if (getComputedStyle(paragraph).position === 'static') {
        paragraph.style.position = 'relative';
      }
      paragraph.insertBefore(bgElement, paragraph.firstChild);
      gsap.set(bgElement, { width: '0%' });
      
      // Add to master at same start time (position 0)
      masterTl.to(bgElement, {
        width: '100%',
        duration: 0.8,
        ease: 'power2.out'
      }, 0);
      
      letters.forEach((letter, lIndex) => {
        masterTl.to(letter, {
          opacity: 1,
          duration: 0.1,
          ease: 'none'
        }, 0.8 + (lIndex * 0.03));
      });
    });
  });
}

// Build description + company info animation (same start time as title)
function buildContentTimeline(masterTl) {
  const descriptionSection = document.querySelector('.about-content-txt-description');
  if (!descriptionSection) return;
  
  const descriptionText = descriptionSection.querySelector('.about-content-txt-description-text');
  const companyInfo = descriptionSection.querySelector('.about-content-company-info');
  
  if (descriptionText) {
    gsap.set(descriptionText, { opacity: 0, y: 30 });
    masterTl.to(descriptionText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0);
  }
  
  if (companyInfo) {
    const tableRows = companyInfo.querySelectorAll('tr');
    tableRows.forEach((row, index) => {
      gsap.set(row, { opacity: 0, x: -20 });
      masterTl.to(row, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out'
      }, 0);
    });
  }
}

function initContentAnimations() {
  const aboutTxt = document.querySelector('.about-content-txt');
  if (!aboutTxt) return;
  
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutTxt,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
  
  // Title and description start at the same time (position 0)
  buildTitleTimeline(masterTl);
  buildContentTimeline(masterTl);
}
