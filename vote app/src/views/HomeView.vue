<script setup>
import { ref, onMounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import VoteButton from "../components/VoteButton.vue";
// Reactive events array
const events = ref([]);

// Fetch events in real-time from Firestore
onMounted(() => {
  const eventsRef = collection(db, "Events");

  onSnapshot(eventsRef, (snapshot) => {
    events.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
});
</script>


<template>
  <section class="events-section">
    <h2>Our Events : </h2>

    <div class="events-grid">
      <div v-for="event in events" :key="event.id" class="event-card">
        <h3>{{ event.title }}</h3>
        <p class="description">{{ event.description }}</p>

        <div class="vote-buttons">
            <VoteButton
                :eventId="event.id"
                type="yes"
                :yesVotes="event.yesVotes"
                :noVotes="event.noVotes">
            </VoteButton>

            <VoteButton
                :eventId="event.id"
                type="no"
                :yesVotes="event.yesVotes"
                :noVotes="event.noVotes">
            </VoteButton>

        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
/* Full page background */
.events-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}


/* Center content with max width */
.events-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

/* Section title */
h2 {
  font-size: 32px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 10px;
  text-align: center;
}

/* Subtitle */
.subtitle {
  text-align: center;
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 40px;
}

/* Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  margin-top: 20px;
}

/* Card */
.event-card {
  background: rgba(30, 41, 59, 0.9);
  padding: 28px;
  border-radius: 18px;
  border: 1px solid #334155;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  transition: 0.3s ease;
  backdrop-filter: blur(4px);
}

.event-card:hover {
  transform: translateY(-6px);
  border-color: #3b82f6;
}

/* Title inside card */
.event-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 10px;
}

/* Description */
.description {
  color: #d1d5db;
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.5;
}

/* Vote buttons container */
.vote-buttons {
  display: flex;
  gap: 14px;
}

/* Buttons from VoteButton.vue will fit this container perfectly */
.vote-buttons button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
}

</style>