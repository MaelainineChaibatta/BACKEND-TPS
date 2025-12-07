
// src/composables/postStore.js
import { ref } from 'vue';
import postData from '../assets/data.json';

// Ref partagé dans toute l'application
const posts = ref([]);

// Initialiser les posts (JSON + nouveaux posts ajoutés)
function initPosts() {
  if (posts.value.length === 0) {
    posts.value = [...postData.posts];
  }
}

// Ajouter un post
function addPost(newPost) {
  const id =
    posts.value.length > 0
      ? Math.max(...posts.value.map(p => p.id)) + 1
      : 1;

  const post = {
    id,
    title: newPost.title,
    body: newPost.body,
    tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
  };

  posts.value.unshift(post);
}

// Récupérer tous les posts
function getPosts() {
  initPosts();
  return posts.value;
}

// Récupérer par ID
function getPostById(id) {
  initPosts();
  return posts.value.find(p => p.id === parseInt(id)) || null;
}

export default function usePostsStore() {
  return {
    posts,
    getPosts,
    addPost,
    getPostById
  };
}
