import { ref } from 'vue';
import postData from '../assets/data.json';

export default function getPosts() {
  const posts = ref([]);

  function fetchPosts() {
    posts.value = postData.posts || [];
  }

  return { posts, fetchPosts };
}
