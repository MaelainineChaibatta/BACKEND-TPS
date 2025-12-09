<script setup>
defineProps(["title", "content", "id"]);
</script>

<template>
    <a class="discussion" :href="'/discussion/' + id">
        <h3>{{ title }}</h3>
        <p>{{ content }}</p>
    </a>
</template>

<style scoped>
.discussion {
  display: block;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  text-decoration: none;
  color: black;
}
</style>
