<template>
  <div class="tag-cloud">
    <span v-for="tag in tags" :key="tag">
      <router-link :to="'/tags/' + tag">{{ tag }}</router-link>
    </span>
  </div>
</template>

<script>
export default {
  props: ['posts'],
  computed: {
    tags() {
      const allTags = [];

      // Sécurité : si posts n’est pas un tableau
      if (!Array.isArray(this.posts)) return [];

      this.posts.forEach(p => {
        if (p && Array.isArray(p.tags)) {
          allTags.push(...p.tags);
        }
      });

      return [...new Set(allTags)];
    }
  }
}
</script>

<style>
.tag-cloud {
  margin-bottom: 20px;
}

.tag-cloud span {
  display: inline-block;
  background: #e9f2ff;
  color: #1e90ff;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 20px;
  margin: 4px;
  cursor: pointer;
  transition: background .2s;
}

.tag-cloud span:hover {
  background: #d6e8ff;
}
</style>

