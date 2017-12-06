import Vue from 'vue';
import Router from 'vue-router';
import BaseDemo from '@/components/BaseDemo';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Base',
            component: BaseDemo
        }
    ]
});
