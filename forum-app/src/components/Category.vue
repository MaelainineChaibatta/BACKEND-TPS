
<script setup>
    defineProps(["name" ,"id"]);
</script>

<template>

<div class="category-card">
    <a href="'/category/'+ id">{{ name }}</a>
</div>

</template>

<style scoped>
.category-card {
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>