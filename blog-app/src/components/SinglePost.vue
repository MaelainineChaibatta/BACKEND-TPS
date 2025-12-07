<template>
  <div class="post-card">
    <h2>{{ post.title }}</h2>
    <p>{{ snippet }}</p>

    <router-link :to="'/post/' + post.id" class="btn-read">
      Lire l’article →
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['post'],
  computed: {
    snippet() {
      if (!this.post || !this.post.body) return '...';
      return this.post.body.substring(0, 50) + '...';
    }
  }
}
</script>

<style>
.post-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: transform .2s ease, box-shadow .2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
}

.post-card h2 {
  margin-top: 0;
  font-size: 22px;
  color: #333;
}

.btn-read {
  display: inline-block;
  margin-top: 12px;
  color: #1e90ff;
  font-weight: 600;
  text-decoration: none;
}

.btn-read:hover {
  text-decoration: underline;
}
</style>
