import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Store from '@/components/Store'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/store/:id',
            name: 'Store',
            component: Store,
            props: true
        }
    ]
})
