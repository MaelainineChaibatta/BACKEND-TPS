// Importing packages
import {createRouter ,createWebHistory } from "vue-router";
import { auth } from "../firebase/firebaseConfig";
import Home from "../components/Home.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import DiscussionsView from "../views/DiscussionsView.vue";
import DiscussionDetailView from "../views/DiscussionDetailView.vue";
import NewDiscussionView from "../views/NewDiscussionView.vue";
import ProfileView from "../views/ProfileView.vue";
import CategoryView from "../views/CategoryView.vue"

const routes = [
    { path: "/login", component: LoginView, meta: { requiresGuest: true } },
    { path: "/register" ,component: RegisterView, meta: { requiresGuest: true } },
    { path: "/forgot-password" ,component: ForgotPasswordView, meta: { requiresGuest: true } },
    { path: "/", component: Home, meta: { requiresAuth: true } },
    { path: "/discussions" ,component: DiscussionsView, meta: { requiresAuth: true } },
    { path: "/discussion/:id" ,component: DiscussionDetailView, meta: { requiresAuth: true } },
    { path: "/new" ,component: NewDiscussionView, meta: { requiresAuth: true } },
    { path: "/profile" ,component: ProfileView, meta: { requiresAuth: true } },
    { path: "/category/:id" ,component: CategoryView, meta: { requiresAuth: true } },
    { path: "/:pathMatch(.*)*", redirect: "/login" }
];

// Creating the router
const router = createRouter({
    history : createWebHistory(), 
    routes
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
    const currentUser = auth.currentUser;
    
    // If route requires authentication
    if (to.meta.requiresAuth && !currentUser) {
        next("/login");
        return;
    }
    
    // If route is for guests only (login/register)
    if (to.meta.requiresGuest && currentUser) {
        next("/");
        return;
    }
    
    // If user is not logged in and trying to access home, redirect to login
    if (to.path === "/" && !currentUser) {
        next("/login");
        return;
    }
    
    next();
});

export default router;


