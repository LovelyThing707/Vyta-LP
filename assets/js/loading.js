document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loading");
  if (!loader) return;

  document.body.classList.add("loading-active");

  setTimeout(() => {
    // Notify other animations
    window.dispatchEvent(new CustomEvent("loadingFadeStart"));

    // Fade out loader
    loader.classList.add("hidden");

    // Re-enable scroll
    setTimeout(() => {
      document.body.classList.remove("loading-active");
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 800);
  }, 1500);
});
