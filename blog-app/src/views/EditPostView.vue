<template>
  <form @submit.prevent="handleSubmit">
    <h2>Éditer le post</h2>
    <input v-model="title" placeholder="Titre" />
    <textarea v-model="body" placeholder="Contenu"></textarea>
    <input v-model="tags" placeholder="Tags séparés par des virgules" />
    <button>Mettre à jour</button>
    <router-link to="/">Annuler</router-link>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'EditPostView',
  setup() {
    const title = ref('');
    const body = ref('');
    const tags = ref('');

    onMounted(() => {
      // const id = route.params.id;
      // Load post data based on id (implement based on your data source)
    });

    function handleSubmit() {
      console.log('Post updated', {
        title: title.value,
        body: body.value,
        tags: tags.value.split(',')
      });
      alert('Post mis à jour');
    }

    return { title, body, tags, handleSubmit };
  }
};
</script>

<style scoped>
form {
  background: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.07);
}

input,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 18px;
  border-radius: 10px;
  border: 1px solid #d3d3d3;
  font-size: 15px;
  transition: border .2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #1e90ff;
  background: #f8fbff;
}

button {
  background-color: #1e90ff;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: background .2s ease;
}

button:hover {
  background-color: #1877d3;
}

a {
  margin-left: 10px;
  padding: 12px 18px;
  background-color: #ccc;
  text-decoration: none;
  border-radius: 10px;
}
</style>
