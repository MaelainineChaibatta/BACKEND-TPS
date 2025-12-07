
import {createRouter ,createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import CreatePostView from '../views/CreatePostView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import EditPostView from  '../views/EditPostView.vue';

const routes = [
    {path:'/',component:Home },
    {path:'/create',component:CreatePostView },
    {path: '/post/:id', component: PostDetailView },
    {path:'/edit/:id',component:EditPostView },

];

export default createRouter({
    history:createWebHistory(),
    routes
});
