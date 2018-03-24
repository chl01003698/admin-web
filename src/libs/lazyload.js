import Vue from 'vue';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
    preload: 1.3,
    loading: '@/images/ajax-loader.gif',
    attempt: 1
});
