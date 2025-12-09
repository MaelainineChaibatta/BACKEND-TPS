<script setup>
defineProps(["message", "author"]);
</script>

<template>
    <div class="response">
        <p>{{ message }}</p>
        <small>By {{ author }}</small>
    </div>

</template>


<style scoped>
.response {
  border-left: 3px solid #007bff;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

