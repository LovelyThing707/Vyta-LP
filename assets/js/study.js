const swiper = new Swiper(".mySwiper", {
  loop: true,
  centeredSlides: true,
  speed: 3500000, // Lower speed for smoother, slower slide transition
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    reverseDirection: false
  },
  freeMode: true,
  freeModeMomentum: false,
  allowTouchMove: false,
  grabCursor: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    375: { slidesPerView: 2, spaceBetween: 0 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 20 },
    1440: { slidesPerView: 5, spaceBetween: 20 }
  }
});

// Add scale-up on hover for each swiper-slide, and stop autoplay when hovering a slide
document.addEventListener('DOMContentLoaded', function () {
  // Inject smooth scaling on hover
  const style = document.createElement("style");
  style.innerHTML = `
    .mySwiper .swiper-slide {
      transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .mySwiper .swiper-slide:hover {
      transform: scale(1.1);
      z-index: 2;
    }
  `;
  document.head.appendChild(style);

  // Stop autoplay when hovering any swiper-slide, resume on mouse leave
  const slides = document.querySelectorAll('.mySwiper .swiper-slide');
  slides.forEach(slide => {
    slide.addEventListener('mouseenter', function () {
      if (swiper.autoplay) swiper.autoplay.stop();
    });
    slide.addEventListener('mouseleave', function () {
      if (swiper.autoplay) swiper.autoplay.start();
    });
  });

  // Because swiper might update/replace slides (e.g., with loop, navigation), delegate events from container
  const swiperContainer = document.querySelector('.mySwiper');
  if (swiperContainer) {
    swiperContainer.addEventListener('mouseover', function(e) {
      if (e.target.classList.contains('swiper-slide')) {
        if (swiper.autoplay) swiper.autoplay.stop();
      }
    });
    swiperContainer.addEventListener('mouseout', function(e) {
      if (e.target.classList.contains('swiper-slide')) {
        if (swiper.autoplay) swiper.autoplay.start();
      }
    });
  }
});