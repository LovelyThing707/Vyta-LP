const swiper = new Swiper(".mySwiper", {
  loop: true,
  centeredSlides: true,

  // This controls how slow/smooth the movement is
  speed: 8000, // higher = slower, smoother

  autoplay: {
    delay: 0, // must be 0 for continuous motion
    disableOnInteraction: false
  },

  allowTouchMove: true, // still draggable
  grabCursor: true,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },

  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 0
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20
    },
    1440: {
      slidesPerView: 5,
      spaceBetween: 20
    }
  }
});
