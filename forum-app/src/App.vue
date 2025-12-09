<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div id="app" class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
