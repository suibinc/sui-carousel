import Carousel from './Carousel.vue';
import Slider from './Slider.vue';

const install = Vue => {
    Vue.component('carousel', Carousel);
    Vue.component('slider', Slider);
};

export {
    Carousel,
    Slider,
    install
};