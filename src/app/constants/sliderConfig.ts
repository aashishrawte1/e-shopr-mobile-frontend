import { SwiperOptions } from 'swiper';

export const DETAIL_PAGE_SLIDER_CONFIG = {
  slidesPerView: 1,
  allowTouchMove: true,
  zoom: false,
};

export const HOME_PAGE_FEATURED_SLIDER_CONFIG = {
  spaceBetween: 20,
  slidesPerView: 1,
  autoplay: true,
  speed: 100,
  zoom: false,
};

export const HOME_PAGE_POPULAR_ITEMS_SLIDER_CONFIG = {
  spaceBetween: 10,
  zoom: false,
  slidesPerView: 'auto',
};

export const CATEGORY_SLIDER_CONFIG: SwiperOptions = {
  spaceBetween: 15,
  virtual: true,
  slidesPerView: 'auto',
  loop: false,
  zoom: false,
};

export const VIRTUAL_SCROLL_SWIPER_CONFIG: SwiperOptions = {
  allowTouchMove: true,
  slidesPerView: 3,
  direction: 'vertical',
  centeredSlides: true,
  spaceBetween: 30,
  zoom: false,
};
