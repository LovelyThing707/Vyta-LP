// Loading animation handler
document.addEventListener('DOMContentLoaded', () => {
  const loadingSection = document.querySelector('.loading');
  const body = document.body;

  if (!loadingSection) return;

  // Prevent scrolling initially
  body.classList.add('loading-active');

  // Wait for the animation to complete
  // The longest animation is the move animation (100s), but we can trigger earlier
  // Adjust this duration based on when you want the fade-out to start
  const animationDuration = 0; // 100 seconds (matching the move animation)
  const transitionDelay = 5000; // 0.5 second buffer for smooth transition
  const totalDuration = animationDuration + transitionDelay;

  setTimeout(() => {
    // Dispatch custom event to signal that loading fade-out is starting
    // This allows other animations (like FV) to start synchronously
    const fadeStartEvent = new CustomEvent('loadingFadeStart', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(fadeStartEvent);

    // Add hidden class to trigger fade-out
    loadingSection.classList.add('hidden');

    // Remove scroll prevention after fade-out completes
    setTimeout(() => {
      body.classList.remove('loading-active');
      // Smooth scroll to top to ensure we're at the beginning
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 800); // Match the CSS transition duration (0.8s)
  }, totalDuration);
});
