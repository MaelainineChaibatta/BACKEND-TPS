
<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="title" placeholder="Titre" />
        <textarea v-model="body" placeholder="Contenu"></textarea>
        <input v-model="tags" placeholder="Tags séparés par des virgules" />
        <button>Ajouter</button>
    </form>
</template>
<script>
import { ref } from 'vue';
import usePostsStore from '../composables/postStore';

export default {
  setup() {
    const title = ref('');
    const body = ref('');
    const tags = ref('');

    const { addPost } = usePostsStore();

    function handleSubmit() {
      addPost({
        title: title.value,
        body: body.value,
        tags: tags.value
      });

      alert("Post ajouté !");
      title.value = '';
      body.value = '';
      tags.value = '';
    }

    return { title, body, tags, handleSubmit };
  }
};
</script>


<style>
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
</style>
