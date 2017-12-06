<template>
    <div class="base-demo">
        <carousel :loop="true">
            <slider v-for="i in 4" :key="i">
                Slide {{i}} Content
            </slider>
        </carousel>
    </div>
</template>

<script>
    import { Carousel, Slider } from '../carousel/index.js';

    export default {
        name: 'baseDemo',
        components: {
            Carousel, Slider
        },
        data () {
            return {};
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .base-demo {
        width: 600px;
        height: 300px;
        margin: 60px auto;
    }
</style>
