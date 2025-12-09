<script setup>
import { ref } from "vue";
import { db, auth } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const props = defineProps({
    contentId: String,
    contentType: String, // "discussion" or "response"
    contentAuthor: String
});

const emit = defineEmits(['close', 'submitted']);

const reason = ref("");
const description = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

const reportReasons = [
    "Spam",
    "Offensive/Abusive",
    "Harassment",
    "Misinformation",
    "Copyright/Plagiarism",
    "Adult Content",
    "Other"
];

const submitReport = async () => {
    if (!reason.value) {
        error.value = "Please select a reason";
        return;
    }

    if (!description.value.trim()) {
        error.value = "Please provide more details";
        return;
    }

    loading.value = true;
    error.value = "";

    try {
        await addDoc(collection(db, "reports"), {
            contentId: props.contentId,
            contentType: props.contentType,
            contentAuthor: props.contentAuthor,
            reason: reason.value,
            description: description.value,
            reportedBy: auth.currentUser.uid,
            reportedByEmail: auth.currentUser.email,
            createdAt: serverTimestamp(),
            status: "pending" // pending, reviewed, resolved, dismissed
        });

        success.value = true;
        setTimeout(() => {
            emit('submitted');
            emit('close');
        }, 1500);
    } catch (err) {
        error.value = "Error submitting report: " + err.message;
    } finally {
        loading.value = false;
    }
};

const closeModal = () => {
    emit('close');
};
</script>

<template>
<div class="report-modal-overlay" @click.self="closeModal">
    <div class="report-modal">
        <div class="modal-header">
            <h2>Report {{ contentType === 'discussion' ? 'Discussion' : 'Response' }}</h2>
            <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
            <div v-if="error" class="alert alert-danger">
                {{ error }}
            </div>

            <div v-if="success" class="alert alert-success">
                ✅ Thank you! Your report has been submitted. Our moderators will review it shortly.
            </div>

            <form v-if="!success" @submit.prevent="submitReport">
                <div class="form-group">
                    <label for="reason">Reason for Report *</label>
                    <select 
                        id="reason"
                        v-model="reason"
                        class="form-input"
                        required
                    >
                        <option value="">-- Select a reason --</option>
                        <option v-for="r in reportReasons" :key="r" :value="r">
                            {{ r }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Description *</label>
                    <textarea 
                        id="description"
                        v-model="description"
                        class="form-input"
                        rows="4"
                        placeholder="Please provide details about why you're reporting this content..."
                        required
                    ></textarea>
                </div>

                <div class="form-actions">
                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="btn btn-danger"
                    >
                        {{ loading ? 'Submitting...' : 'Submit Report' }}
                    </button>
                    <button 
                        type="button" 
                        @click="closeModal"
                        class="btn btn-cancel"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<style scoped>
.report-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.report-modal {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
    margin: 0;
    color: var(--color-heading);
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-duration);
}

.close-btn:hover {
    color: #d32f2f;
}

.modal-body {
    padding: 1.5rem;
}

.alert {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 14px;
}

.alert-danger {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
}

.alert-success {
    background-color: #efe;
    border: 1px solid #cfc;
    color: #3c3;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-heading);
    font-size: 14px;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background);
    color: var(--color-text);
    font-family: inherit;
    font-size: 14px;
    transition: border-color var(--transition-duration);
}

.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all var(--transition-duration);
}

.btn-danger {
    background: #d32f2f;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background: #b71c1c;
    transform: translateY(-2px);
}

.btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-cancel {
    background: #ccc;
    color: #333;
}

.btn-cancel:hover {
    background: #bbb;
}
</style>