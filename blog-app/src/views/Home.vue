<template>
  <div>
    <TagCloud :posts="posts || []" />
    <PostList :posts="posts || []" />
  </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import TagCloud from '../components/TagCloud.vue';
import usePostsStore from '../composables/postStore';

export default {
  name: 'HomePage',
  components: { PostList, TagCloud },
  setup() {
    const { posts, getPosts } = usePostsStore();

    getPosts(); // charge JSON + nouveaux posts

    return { posts };
  }
};
</script>

