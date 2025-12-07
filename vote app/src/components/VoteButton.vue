
<template>
    <button
    :class="buttonClass"
    :disabled="alreadyVoted"
    @click="vote"
    >
        {{ label }}
    </button>
</template>

<script setup>
import { ref , onMounted} from "vue";
import { db ,auth} from "../firebase";
import { collection, query, where, getDocs, addDoc, doc, updateDoc} from "firebase/firestore";

const props = defineProps({
    eventId: String ,
    type : String ,
    yesVotes: Number,
    noVotes: Number,
});

const alreadyVoted = ref(false);
const user  =auth.currentUser;
const label = props.type === 'yes' ? `Yes 👍(${props.yesVotes})` : `No 👎(${props.noVotes})`;
const buttonClass = props.type ==='yes' ? 'yes' : 'no';


// Check if the user already voted
onMounted(async () =>{
    const q = query(
        collection(db, "Votes"),
        where("eventId", "==", props.eventId),
        where("userId", "==", user.uid)
    );
    const voteSnapshot = await getDocs(q);
    if (!voteSnapshot.empty) {
        alreadyVoted.value = true;
    }
});

const vote = async()=>{
    if (alreadyVoted.value) return;
    // save vote to Votes collection
    await addDoc(collection(db, "Votes"), {
        eventId: props.eventId,
        userId: user.uid,
        vote: props.type,
        createdAt : new Date()

    });
    // update vote count in Events collection
    const eventRef = doc(db, "Events", props.eventId);
    await updateDoc(eventRef, {
        yesVotes: props.type === 'yes' ? props.yesVotes + 1 : props.yesVotes,
        noVotes: props.type === 'no' ? props.noVotes + 1 : props.noVotes,
    });
    alreadyVoted.value = true;

};

</script>

<style scoped>button {
  width: 48%;
  padding: 10px;
  border-radius: 10px;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s;
}

.yes {
  background: #10b981;
}

.no {
  background: #ef4444;
}

button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>