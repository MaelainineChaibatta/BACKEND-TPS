
<script setup>
    defineProps(["user"]);
</script>

<template>

<div class="profile-card">
    <h2>{{ user?.displayName }}</h2>
    <p>Email : {{ user?.email }}</p>
    <p>User ID : {{ user?.uid }} </p>
</div>

</template>

<style scoped>
.profile-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>