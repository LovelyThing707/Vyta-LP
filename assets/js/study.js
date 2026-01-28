const swiper = new Swiper(".mySwiper", {
  loop: true,
  centeredSlides: true,
  speed: 10000,
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