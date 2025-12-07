
import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'   
import {auth} from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:'/',
            name:'home',
            component:HomeView,
            meta:{requiresAuth:true}
        } ,
        {
            path:'/login',
            name:'login',
            component:LoginView,
        }
    ]
});

// Check auth state once
let currentUser = null;
onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

// Navigation guard
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !currentUser) {
        next('/login');
    } else if(to.path === '/login' && currentUser) {
        next('/');
    } else {
        next();
    }
});

export default router;
