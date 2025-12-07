<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
export default{components:{NavBar}}
</script>
<style>
  body{
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f4f6f9;
    color: #2a2a2a;

  }
  #app{
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

</style>