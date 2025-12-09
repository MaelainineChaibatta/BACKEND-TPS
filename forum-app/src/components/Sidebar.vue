
<script setup>

import { ref, onMounted } from "vue";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";


const categories = ref([]);

onMounted(()=>{
    onSnapshot(collection(db ,"categories") ,(snap)=>{
        categories.value = snap.docs.map((d)=>({
            id: d.id ,
            ...d.data(),
        }));
    });
});

</script>

<template>
<div class="sidebar">
    <h3>Categories</h3>
    <ul>
        <li v-for="c in categories" :key="c.id">
            <a href="'/category/' +c.id">{{ c.name }}</a>
        </li>
    </ul>
</div>

</template>

<style scoped>
.sidebar {
  width: 200px;
  border-right: 1px solid #ddd;
  padding: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li a {
  text-decoration: none;
  color: #444;
}
</style>