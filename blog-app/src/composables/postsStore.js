import { ref } from 'vue';
import postData from '../assets/data.json';

// Ref partagée pour tous les posts (données initiales + nouveaux posts)
const posts = ref([]);

export function usePostsStore() {
  // Initialiser les posts une seule fois
  function initPosts() {
    if (posts.value.length === 0) {
      posts.value = [...(postData.posts || [])];
    }
  }

  // Ajouter un nouveau post
  function addPost(newPost) {
    const id = posts.value.length > 0 
      ? Math.max(...posts.value.map(p => p.id)) + 1 
      : 1;
    
    const post = {
      id,
      title: newPost.title,
      body: newPost.body,
      tags: newPost.tags.map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
    
    posts.value.unshift(post); // Ajouter au début
  }

  // Récupérer tous les posts
  function getPosts() {
    return posts.value;
  }

  return {
    posts,
    initPosts,
    addPost,
    getPosts
  };
}
