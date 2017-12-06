<template>
    <div class="sui-carousel-slider" :class="{'is-active': active}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'sui-carousel-slider',
        data() {
            return {
                active: false
            };
        },
        methods: {
            setActive(stat) {
                this.active = stat;
            }
        }
    };
</script>

<style lang="less">
    div.sui-carousel-slider {
        position: absolute;
        left: 0;
        top: 0;
        transform: translateX(-100%);
        width: 100%;
        height: 100%;
        display: none;
        &.is-active {
            display: block;
            transform: none;
        }
        &:nth-child(even) {
            background: #f0f0f0;
        }
        a, img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>