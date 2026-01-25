const swiper = new Swiper(".mySwiper", {
    slidesPerView: 10,
    spaceBetween: 30,
    loop: true,
    centeredSlides: true,
    speed: 1000,
  
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
  
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true
    },
  
    breakpoints: {
      300: {
        slidesPerView: 1,
        spaceBetween: 50
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1660: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  });
  