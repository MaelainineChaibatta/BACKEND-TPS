<template>
  <div v-if="post && post.title">
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>

    <div v-if="post.tags && post.tags.length">
      <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <router-link to="/">Retour</router-link>
  </div>
  <div v-else>
    <p>Post not found</p>
    <router-link to="/">Retour</router-link>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import usePostsStore from '../composables/postStore';

export default {
  setup() {
    const route = useRoute();
    const post = ref(null);

    const { getPostById } = usePostsStore();

    onMounted(() => {
      post.value = getPostById(route.params.id);
    });

    return { post };
  }
};
</script>


<style scoped>
.tag {
  display: inline-block;
  background: #1e90ff;
  color: white;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
}
</style>

