const swiper = new Swiper(".mySwiper", {
  loop: true,
  centeredSlides: true,
  speed: 3500000,
  autoplay: { delay: 0, disableOnInteraction: false },
  freeMode: true,
  freeModeMomentum: false,
  allowTouchMove: false,
  grabCursor: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    375: { slidesPerView: 2 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 20 },
    1440: { slidesPerView: 5, spaceBetween: 20 }
  }
});

// Hover scale + pause autoplay (event delegation)
const style = document.createElement("style");
style.textContent = `
  .mySwiper .swiper-slide {
    transition: transform .28s cubic-bezier(.34,1.56,.64,1);
  }
  .mySwiper .swiper-slide:hover {
    transform: scale(1.1);
    z-index: 2;
  }
`;
document.head.appendChild(style);

const container = document.querySelector(".mySwiper");
container?.addEventListener("mouseover", e => {
  if (e.target.closest(".swiper-slide")) swiper.autoplay?.stop();
});
container?.addEventListener("mouseout", e => {
  if (e.target.closest(".swiper-slide")) swiper.autoplay?.start();
});
