<script setup>
defineProps(["email", "name"]);
</script>

<template>
    <div class="user-card">
        <h3>{{ name || "No username" }}</h3>
        <p>{{ email }}</p>
    </div>
</template>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
}
</style>