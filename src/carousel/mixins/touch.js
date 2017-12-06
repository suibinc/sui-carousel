import { once } from '../utils/event';

const EVENTS = {
    ON_TOUCH_START: 'ontouchstart',
    TOUCH_START: 'touchstart',
    TOUCH_MOVE: 'touchmove',
    TOUCH_END: 'touchend',
    MOUSE_DOWN: 'mousedown',
    MOUSE_MOVE: 'mousemove',
    MOUSE_UP: 'mouseup',
    MOUSE_LEAVE: 'mouseleave'
};
const TOWARDS = {
    LAST: 'last',
    NEXT: 'next'
};

export default {
    props: {
        loop: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            touchConfig: {
                allowed: true,
                prevent: false,
                animating: false, // 动画执行状态
                dragging: false, // 拖动状态
                userScrolling: false
            },
            dragState: {}
        };
    },
    mounted() {
        if (!this.$isServer && this.touchConfig.allowed) {
            console.log('touch module loading');
            if (EVENTS.ON_TOUCH_START in window) {
                this.$el.addEventListener(EVENTS.TOUCH_START, this.handleTouchStart);
                this.$el.addEventListener(EVENTS.TOUCH_MOVE, this.handleTouchMove);
                this.$el.addEventListener(EVENTS.TOUCH_END, this.handleTouchEnd);
            } else {
                this.$el.addEventListener(EVENTS.MOUSE_DOWN, this.handleTouchStart);
                this.$el.addEventListener(EVENTS.MOUSE_MOVE, this.handleTouchMove);
                this.$el.addEventListener(EVENTS.MOUSE_UP, this.handleTouchEnd);
                this.$el.addEventListener(EVENTS.MOUSE_LEAVE, this.handleTouchEnd);
            }
        }
    },
    methods: {
        handleTouchStart(event) {
            if (this.touchConfig.prevent) {
                event.preventDefault();
            }
            if (this.touchConfig.dragging) return;
            this.touchConfig.dragging = true;

            let element = this.$el;
            let dragState = this.dragState;
            let target = (event.touches && event.touches[0]) || event;
            dragState.startTime = new Date();
            dragState.startLeft = target.pageX;
            dragState.startTop = target.pageY;
            dragState.startTopAbsolute = target.clientY;
            dragState.sliderWidth = element.offsetWidth;
            dragState.sliderHeight = element.offsetHeight;

            // 初始化拖动的前一个组件，当前组件，下一个组件
            let lastSlider = this.$children[this.active - 1];
            let currSlider = this.$children[this.active];
            let nextSlider = this.$children[this.active + 1];
            if (this.loop && this.$children.length > 1) {
                if (!lastSlider) {
                    lastSlider = this.$children[this.$children.length - 1];
                }
                if (!nextSlider) {
                    nextSlider = this.$children[0];
                }
            }
            dragState.lastSlider = lastSlider ? lastSlider.$el : null;
            dragState.currSlider = currSlider ? currSlider.$el : null;
            dragState.nextSlider = nextSlider ? nextSlider.$el : null;
            if (dragState.lastSlider) {
                dragState.lastSlider.style.display = 'block';
            }
            if (dragState.nextSlider) {
                dragState.nextSlider.style.display = 'block';
            }
        },
        handleTouchMove(event) {
            if (!this.touchConfig.dragging) return;

            let dragState = this.dragState;
            let target = (event.touches && event.touches[0]) || event;
            dragState.currentLeft = target.pageX;
            dragState.currentTop = target.pageY;
            dragState.currentTopAbsolute = target.clientY;
            let offsetLeft = dragState.currentLeft - dragState.startLeft;
            let offsetTop = dragState.currentTopAbsolute - dragState.startTopAbsolute;
            let distanceX = Math.abs(offsetLeft);
            let distanceY = Math.abs(offsetTop);
            if (distanceX < 10 || (distanceX >= 10 && distanceY >= 1.73 * distanceX)) {
                this.touchConfig.userScrolling = true;
                return;
            } else {
                this.touchConfig.userScrolling = false;
                event.preventDefault();
            }

            // 判断是往左拖动还是往右拖动
            offsetLeft = Math.min(Math.max(-dragState.sliderWidth + 1, offsetLeft), dragState.sliderWidth - 1);
            let towards = offsetLeft < 0 ? TOWARDS.NEXT : TOWARDS.LAST;
            if (dragState.lastSlider && towards === TOWARDS.LAST) {
                this.translate(dragState.lastSlider, offsetLeft - dragState.sliderWidth);
            }
            this.translate(dragState.currSlider, offsetLeft);
            if (dragState.nextSlider && towards === TOWARDS.NEXT) {
                this.translate(dragState.nextSlider, offsetLeft + dragState.sliderWidth);
            }
        },
        handleTouchEnd() {
            this.touchConfig.dragging = false;

            let dragState = this.dragState;
            let dragDuration = new Date() - dragState.startTime;
            let towards = null;
            let offsetLeft = dragState.currentLeft - dragState.startLeft;
            let offsetTop = dragState.currentTop - dragState.startTop;
            let sliderWidth = dragState.sliderWidth;
            let active = this.active;
            let length = this.$children.length;
            if (dragDuration < 300) {
                if (isNaN(offsetLeft) || isNaN(offsetTop)) {
                    this.$children[this.active].$emit('tap');
                }
            }
            if (dragDuration < 300 && dragState.currentLeft === undefined) return;
            if (dragDuration < 300 || Math.abs(offsetLeft) > sliderWidth / 2) {
                towards = offsetLeft < 0 ? TOWARDS.NEXT : TOWARDS.LAST;
            }
            if (!this.loop) {
                if ((active === 0 && towards === TOWARDS.LAST) || (active === length - 1 && towards === TOWARDS.NEXT)) {
                    towards = null;
                }
            }
            if (length < 2) towards = null;

            this.slideTo(towards, {
                offsetLeft: offsetLeft,
                sliderWidth: dragState.sliderWidth,
                lastSlider: dragState.lastSlider,
                currSlider: dragState.currSlider,
                nextSlider: dragState.nextSlider
            });
            this.dragState = {};
        },
        translate(element, offset, duration, callback) {
            if (!element) return;
            if (!duration) {
                element.style.webkitTransition = '';
                element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
                return;
            }
            this.touchConfig.animating = true;
            element.style.webkitTransition = '-webkit-transform ' + duration + 'ms ease-in-out';
            setTimeout(() => {
                element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
            }, 50);
            let called = false;
            let transitionEndCallback = () => {
                if (called) return;
                called = true;
                this.animating = false;
                element.style.webkitTransition = '';
                element.style.webkitTransform = '';
                if (callback) {
                    callback.apply(this, arguments);
                }
            };
            once(element, 'webkitTransitionEnd', transitionEndCallback);
            // 以防万一webkitTransitionEnd不触发，所以设置timeout
            setTimeout(transitionEndCallback, duration + 100);
        }
    }
};