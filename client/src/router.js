import Vue from 'vue'
import Router from 'vue-router'
import Appointments from './views/Appointments.vue'
import UserProfile from './views/UserProfile.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: Appointments
    },
    {
      path: '/userProfile',
      name: 'userProfile',
      component: UserProfile
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
