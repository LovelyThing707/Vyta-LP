document.addEventListener("DOMContentLoaded", () => {
  const rotatingCircle = document.getElementById("rotatingCircle");
  const centerGear = document.getElementById("centerGear");
  const pageWrapper = document.querySelector(".flow-scroll-container .page-wrapper") || document.querySelector(".page-wrapper");
  const sections = pageWrapper ? pageWrapper.querySelectorAll(".content-section") : document.querySelectorAll(".content-section");
  const markers = document.querySelectorAll(".step-marker");
  const markerContents = document.querySelectorAll(".marker-content");

  const stepAngle = 60; // 外円のステップ角度 (360/6)
  const gearStepAngle = 45; // ギアのステップ角度 (360/8)

  let isOpening = true;
  let hasStarted = false; // Track if animation has started

  // Check if elements exist
  if (!rotatingCircle || !centerGear || !pageWrapper) return;

  // Initially hide elements (remove opening-animation class)
  rotatingCircle.classList.remove("opening-animation");
  centerGear.classList.remove("opening-animation");
  rotatingCircle.style.opacity = "0";
  centerGear.style.opacity = "0";

  // --- 1. タイトル文字の分割処理 ---
  document.querySelectorAll(".step-title").forEach((title) => {
    const subSpan = title.querySelector(".step-sub");
    let text = "";
    Array.from(title.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue;
      }
    });
    text = text.trim();

    title.innerHTML = "";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "char-reveal";
      span.style.transitionDelay = `${0.6 + i * 0.05}s`;
      title.appendChild(span);
    });
    if (subSpan) {
      title.appendChild(subSpan);
    }
  });

  // --- 2. Intersection Observer to detect when section enters viewport ---
  const observerOptions = {
    root: null,
    rootMargin: "100px", // Start animation slightly before section is fully visible
    threshold: 0.1,
  };

  const startAnimation = () => {
    if (hasStarted) return;
    hasStarted = true;

    // Reset opacity and add opening animation
    rotatingCircle.style.opacity = "1";
    centerGear.style.opacity = "1";
    rotatingCircle.classList.add("opening-animation");
    centerGear.classList.add("opening-animation");

    // --- オープニング終了監視 ---
    setTimeout(() => {
      isOpening = false;
      // 外円のアニメーション終了処理
      rotatingCircle.classList.remove("opening-animation");
      rotatingCircle.classList.add("interactive");
      rotatingCircle.style.transform = `translate(-50%, -50%) rotate(0deg)`;

      // ギアのアニメーション終了処理
      centerGear.classList.remove("opening-animation");
      centerGear.classList.add("interactive");
      centerGear.style.transform = `translate(-50%, -50%) rotate(0deg)`;

      // マーカーのアニメーションリセット
      markerContents.forEach((el) => {
        el.style.animation = "none";
      });

      updateAnimation();
    }, 20);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasStarted) {
        startAnimation();
      }
    });
  }, observerOptions);

  observer.observe(pageWrapper);

  // --- 3. アニメーション制御関数 ---
  const flowContainer = document.querySelector(".flow-scroll-container");
  const isFlowInView = () => {
    if (!flowContainer) return false;
    const rect = flowContainer.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const updateAnimation = () => {
    // Visibility: flow container in view (single 100vh page-wrapper)
    const inView = pageWrapper.closest(".flow-scroll-container")
      ? isFlowInView()
      : pageWrapper.getBoundingClientRect().bottom > 0 && pageWrapper.getBoundingClientRect().top < window.innerHeight;

    if (!inView) {
      const rp = document.querySelector(".flow-scroll-container .right-panel");
      if (rp) rp.style.paddingBottom = "0px";
      return;
    }

    if (isOpening || !hasStarted) return;

    const windowHeight = window.innerHeight;
    const sectionHeight = windowHeight;

    // Use flow container scroll progress when inside flow-scroll-container (single 100vh; sections stacked)
    let floatIndex = 0;
    let activeIndex = 0;
    if (flowContainer && pageWrapper.closest(".flow-scroll-container")) {
      const rect = flowContainer.getBoundingClientRect();
      const scrollHeight = flowContainer.offsetHeight - windowHeight;
      if (scrollHeight > 0) {
        const scrolled = Math.max(0, Math.min(-rect.top, scrollHeight));
        floatIndex = (scrolled / scrollHeight) * 6; // 6 sections
      }
      activeIndex = Math.min(5, Math.max(0, Math.floor(floatIndex))); // scroll-driven only
    } else {
      const wrapperTop = pageWrapper.offsetTop;
      const relativeScroll = Math.max(0, window.scrollY - wrapperTop);
      floatIndex = Math.max(0, relativeScroll / sectionHeight);
      sections.forEach((section, index) => {
        const r = section.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(windowHeight / 2 - center);
        if (center > 0 && center < windowHeight && dist < windowHeight / 3) {
          activeIndex = index;
        }
      });
    }

      // 外円の回転 (反時計回り)
      const currentCircleRotation = -(floatIndex * stepAngle);
      rotatingCircle.style.transform = `translate(-50%, -50%) rotate(${currentCircleRotation}deg)`;

      // ギアの回転 (反時計回り・8歯ペース)
      const currentGearRotation = -(floatIndex * gearStepAngle);
      centerGear.style.transform = `translate(-50%, -50%) rotate(${currentGearRotation}deg)`;

      // マーカー数字の正立補正
      const initialAngles = [0, 60, 120, 180, 240, 300];
      markerContents.forEach((content, index) => {
        const counterRotation = -currentCircleRotation - initialAngles[index];
        content.style.transform = `rotate(${counterRotation}deg)`;
      });

      // クラス付与

      markers.forEach((marker, index) => {
        if (index === activeIndex) {
          marker.classList.add("active-marker");
          sections[index].classList.add("animate-trigger");
        } else {
          marker.classList.remove("active-marker");
          sections[index].classList.remove("animate-trigger");
        }
      });
  };

  window.addEventListener("scroll", updateAnimation);
  window.addEventListener("resize", updateAnimation);

  // Initialize first section after opening animation completes
  setTimeout(() => {
    if (hasStarted && !isOpening) {
      sections[0].classList.add("animate-trigger");
      markers[0].classList.add("active-marker");
    }
  }, 5000);
});

const flowText = document.querySelector(".flow-scroll-container .bg-flow-text") || document.querySelector(".bg-flow-text");
const sectionTitle = document.querySelector(".flow-scroll-container .section-title") || document.querySelector(".section-title");
const wrapper = document.querySelector(".flow-scroll-container .page-wrapper") || document.querySelector(".page-wrapper");

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      if (flowText) flowText.classList.add("is-visible");
      if (sectionTitle) sectionTitle.classList.add("is-visible");
    } else {
      if (flowText) flowText.classList.remove("is-visible");
      if (sectionTitle) sectionTitle.classList.remove("is-visible");
    }
  },
  {
    threshold: 0.1, // Show when at least 10% of wrapper is visible
  }
);

if (wrapper) {
  observer.observe(wrapper);
}
