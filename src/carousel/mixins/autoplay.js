import { on, off } from '../utils/event';

export default {
    props: {
        autoplay: {
            type: Object,
            default: () => {
                return {
                    allowed: false,
                    interval: 3000,
                    pauseOnHover: true
                };
            }
        }
    },
    data() {
        return {
            autoPlayTimer: null
        };
    },
    destroyed() {
        if (!this.$isServer) {
            off(this.$el, 'mouseenter', this.autoPlayPause);
            off(this.$el, 'mouseleave', this.autoPlayStart);
        }
    },
    methods: {
        autoPlayPause() {
            if (this.autoPlayTimer) {
                this.autoPlayTimer = clearInterval(this.autoPlayTimer);
            }
        },
        autoPlayStart() {
            if (this.autoplay.allowed) {
                this.autoPlayTimer = setInterval(this.next, this.autoplay.interval);
            }
        }
    },
    mounted() {
        if (!this.$isServer && this.autoplay.allowed) {
            on(this.$el, 'mouseenter', this.autoPlayPause);
            on(this.$el, 'mouseleave', this.autoPlayStart);
            this.autoPlayStart();
        }
    }
};
