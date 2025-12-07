<template>
  <nav class="navbar">
    <div class="logo">MyBlog</div>
    <div class="links">
      <router-link to="/">Accueil</router-link>
      <router-link to="/create">Ajouter un post</router-link>
    </div>
  </nav>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 16px 24px;
  border-radius: 14px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.navbar .logo {
  font-size: 22px;
  font-weight: 700;
  color: #4a4a4a;
}

.navbar a {
  margin-left: 20px;
  font-weight: 500;
  text-decoration: none;
  color: #555;
}

.navbar a:hover {
  color: #1e90ff;
}
</style>
