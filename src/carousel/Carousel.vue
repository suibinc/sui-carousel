<template>
    <div class="sui-carousel">
        <div class="sui-carousel-wrap" ref="carousel">
            <slot></slot>
        </div>
        <slot name="pagination"></slot>
    </div>
</template>

<script>
    import autoPlayModule from './mixins/autoplay';
    import touchModule from './mixins/touch';

    const TOWARDS = {
        LAST: 'last',
        NEXT: 'next'
    };

    export default {
        name: 'carousel',
        data() {
            return {
                active: 0,
                duration: 300, // 动画时间
                defaultConfig: {
                    FIRST_PAGE: 0
                }
            };
        },
        mixins: [
            autoPlayModule,
            touchModule
        ],
        mounted() {
            this.initial();
        },
        methods: {
            initial() {
                let children = this.$children;

                if (children) {
                    children.forEach((child, index) => {
                        child.setActive(index === this.defaultConfig.FIRST_PAGE);
                    });
                }
            },
            next() {
                this.slideTo(TOWARDS.NEXT);
            },
            last() {
                this.slideTo(TOWARDS.LAST);
            },
            slideTo(towards, options) {
                if (this.$children.length === 0) return;
                if (!options && this.$children.length < 2) return;
                let lastSlider, nextSlider, currSlider, sliderWidth, offsetLeft;
                let duration = this.duration || 300;
                let active = this.active;
                if (!options) {
                    sliderWidth = this.$el.clientWidth;
                    lastSlider = this.$children[active - 1];
                    currSlider = this.$children[active].$el;
                    nextSlider = this.$children[active + 1];
                    if (this.loop && this.$children.length > 1) {
                        if (!lastSlider) {
                            lastSlider = this.$children[this.$children.length - 1];
                        }
                        if (!nextSlider) {
                            nextSlider = this.$children[0];
                        }
                    }
                    if (lastSlider) {
                        lastSlider = lastSlider.$el;
                        lastSlider.style.display = 'block';
                        this.translate(lastSlider, -sliderWidth);
                    }
                    if (nextSlider) {
                        nextSlider = nextSlider.$el;
                        nextSlider.style.display = 'block';
                        this.translate(nextSlider, sliderWidth);
                    }
                } else {
                    lastSlider = options.lastSlider;
                    currSlider = options.currSlider;
                    nextSlider = options.nextSlider;
                    sliderWidth = options.sliderWidth;
                    offsetLeft = options.offsetLeft;
                }
                let newActive;
                let oldSlider = this.$children[active];
                if (towards === TOWARDS.LAST) {
                    if (active > 0) {
                        newActive = active - 1;
                    }
                    if (this.loop && active === 0) {
                        newActive = this.$children.length - 1;
                    }
                } else if (towards === TOWARDS.NEXT) {
                    if (active < this.$children.length - 1) {
                        newActive = active + 1;
                    }
                    if (this.loop && active === this.$children.length - 1) {
                        newActive = 0;
                    }
                }
                let callback = () => {
                    if (newActive !== undefined) {
                        let newSlider = this.$children[newActive];
                        oldSlider.setActive(false);
                        newSlider.setActive(true);
                        this.active = newActive;
                    }
                    if (lastSlider) {
                        lastSlider.style.display = '';
                    }
                    if (nextSlider) {
                        nextSlider.style.display = '';
                    }
                };
                setTimeout(() => {
                    if (towards === TOWARDS.NEXT) {
                        this.translate(currSlider, -sliderWidth, duration, callback);
                        if (nextSlider) {
                            this.translate(nextSlider, 0, duration);
                        }
                    } else if (towards === TOWARDS.LAST) {
                        this.translate(currSlider, sliderWidth, duration, callback);
                        if (lastSlider) {
                            this.translate(lastSlider, 0, duration);
                        }
                    } else {
                        this.translate(currSlider, 0, duration, callback);
                        if (typeof offsetLeft !== 'undefined') {
                            if (lastSlider && offsetLeft > 0) {
                                this.translate(lastSlider, -sliderWidth, duration);
                            }
                            if (nextSlider && offsetLeft < 0) {
                                this.translate(nextSlider, sliderWidth, duration);
                            }
                        } else {
                            if (lastSlider) {
                                this.translate(lastSlider, -sliderWidth, duration);
                            }
                            if (nextSlider) {
                                this.translate(nextSlider, sliderWidth, duration);
                            }
                        }
                    }
                }, 10);
            }
        },
        destroyed() {
        }
    };
</script>

<style lang="less">
    .sui-carousel {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-shadow: 0 0 10px #ccc;
        .sui-carousel-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }
</style>