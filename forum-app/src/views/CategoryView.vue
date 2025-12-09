<script setup>

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const route = useRoute();
const categoryId = route.params.id;

const discussions = ref([]);

onMounted(() => {
    const q = query(
        collection(db, "discussions"),
        where("categoryId", "===", categoryId)
    );
    onSnapshot(q, (snap) => {
        discussions.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data,
        }));
    });
});

</script>

<template>

    <div>
        <div>
            <h2> Category : {{ categoryId }}</h2>
            <div v-if="discussions.length === 0">
                <p>No discussions in this category yet.</p>
            </div>

            <div v-else>
                <div v-for="d in discussions" :key="d.id" class="discussions-card">
                    <h3> {{ d.title }}</h3>
                    <p>{{ d.content }}</p>
                </div>
            </div>
        </div>
    </div>


</template>


<style scoped>
.discussion-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
}
</style>