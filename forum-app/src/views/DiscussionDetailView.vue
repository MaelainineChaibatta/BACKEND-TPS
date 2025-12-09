<script setup>
import {ref, onMounted} from "vue";
import {db, auth} from "../firebase/firebaseConfig";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import ReportModal from "../components/ReportModal.vue";

const route = useRoute();
const router = useRouter();
const discussionId = route.params.id;
const discussion = ref(null);
const responses = ref([]);
const newResponse = ref("");
const loading = ref(false);
const currentUser = ref(auth.currentUser);
const editingResponseId = ref(null);
const editResponseText = ref("");
const reportingId = ref(null);
const reportingType = ref(null);
const reportingAuthor = ref(null);

auth.onAuthStateChanged((u) => {
    currentUser.value = u;
});

onMounted(async () => {
    // Fetch discussion details
    const docSnap = await getDoc(doc(db, "discussions", discussionId));
    if (docSnap.exists()) {
        discussion.value = { id: docSnap.id, ...docSnap.data() };
    }
    
    // Fetch responses
    const q = query(
        collection(db, "responses"),
        where("discussionId", "==", discussionId)
    );
    onSnapshot(q, (snap) => {
        responses.value = snap.docs.map(d => ({id: d.id, ...d.data()}));
    });
});

const addResponse = async () => {
    if (!newResponse.value.trim()) {
        alert("Please enter a response");
        return;
    }
    
    if (!currentUser.value) {
        router.push("/login");
        return;
    }
    
    loading.value = true;
    try {
        await addDoc(collection(db, "responses"), {
            discussionId: discussionId,
            message: newResponse.value,
            userId: currentUser.value.uid,
            author: currentUser.value.email,
            createdAt: serverTimestamp()
        });
        newResponse.value = "";
    } catch(e) {
        alert("Error adding response: " + e.message);
    } finally {
        loading.value = false;
    }
};

const deleteResponse = async (id, userId) => {
    if (userId !== currentUser.value?.uid) {
        alert("You can only delete your own responses");
        return;
    }
    
    if (!confirm("Delete this response?")) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, "responses", id));
    } catch(e) {
        alert("Error deleting response: " + e.message);
    }
};

const startEditResponse = (response) => {
    if (response.userId !== currentUser.value?.uid) {
        alert("You can only edit your own responses");
        return;
    }
    editingResponseId.value = response.id;
    editResponseText.value = response.message;
};

const cancelEditResponse = () => {
    editingResponseId.value = null;
    editResponseText.value = "";
};

const saveEditResponse = async (id) => {
    if (!editResponseText.value.trim()) {
        alert("Response cannot be empty");
        return;
    }
    
    loading.value = true;
    try {
        await updateDoc(doc(db, "responses", id), {
            message: editResponseText.value,
            updatedAt: serverTimestamp()
        });
        editingResponseId.value = null;
        editResponseText.value = "";
    } catch(e) {
        alert("Error updating response: " + e.message);
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    router.push("/discussions");
};

const openReportModal = (responseId, author) => {
    reportingId.value = responseId;
    reportingType.value = "response";
    reportingAuthor.value = author;
};

const closeReportModal = () => {
    reportingId.value = null;
    reportingType.value = null;
    reportingAuthor.value = null;
};
</script>

<template>
<div class="discussion-detail-container">
    <button @click="goBack" class="btn-back">← Back to Discussions</button>
    
    <div v-if="!discussion" class="loading">
        <p>Loading discussion...</p>
    </div>
    
    <div v-else>
        <!-- Discussion Header -->
        <div class="discussion-detail-card">
            <h1>{{ discussion.title }}</h1>
            <div class="discussion-meta">
                <span>📧 {{ discussion.userEmail }}</span>
                <span>📅 {{ new Date(discussion.createdAt?.toDate?.()).toLocaleDateString() }}</span>
            </div>
            
            <div class="discussion-body">
                <p>{{ discussion.content }}</p>
            </div>
        </div>
        
        <!-- Responses Section -->
        <div class="responses-section">
            <h2>Responses ({{ responses.length }})</h2>
            
            <div v-if="currentUser" class="add-response">
                <h3>Add Your Response</h3>
                <textarea 
                    v-model="newResponse"
                    placeholder="Share your thoughts..."
                    rows="4"
                    class="response-textarea"
                ></textarea>
                <button 
                    @click="addResponse"
                    :disabled="loading"
                    class="btn btn-primary"
                >
                    {{ loading ? 'Posting...' : 'Post Response' }}
                </button>
            </div>
            
            <div v-else class="login-prompt">
                <p>Please <router-link to="/login">login</router-link> to add a response.</p>
            </div>
            
            <div v-if="responses.length === 0" class="no-responses">
                <p>No responses yet. Be the first to respond!</p>
            </div>
            
            <div v-else class="responses-list">
                <div v-for="response in responses" :key="response.id" class="response-card">
                    <div v-if="editingResponseId === response.id" class="edit-response-form">
                        <textarea 
                            v-model="editResponseText"
                            rows="3"
                            class="response-textarea"
                        ></textarea>
                        <div class="edit-actions">
                            <button 
                                @click="saveEditResponse(response.id)"
                                :disabled="loading"
                                class="btn-save-edit"
                            >
                                💾 Save
                            </button>
                            <button 
                                @click="cancelEditResponse"
                                class="btn-cancel-edit"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                    
                    <div v-else>
                        <div class="response-header">
                            <div>
                                <strong>{{ response.author }}</strong>
                                <small>{{ new Date(response.createdAt?.toDate?.()).toLocaleDateString() }}</small>
                                <small v-if="response.updatedAt" style="color: orange; margin-left: 0.5rem;">✏️ Edited</small>
                            </div>
                            <div v-if="currentUser?.uid === response.userId" class="response-actions">
                                <button 
                                    @click="startEditResponse(response)"
                                    class="btn-edit-response"
                                >
                                    ✏️
                                </button>
                                <button 
                                    @click="deleteResponse(response.id, response.userId)"
                                    class="btn-delete"
                                >
                                    🗑️
                                </button>
                            </div>
                            <div v-else class="response-actions">
                                <button 
                                    @click="openReportModal(response.id, response.author)"
                                    class="btn-report-response"
                                    title="Report this response"
                                >
                                    🚩
                                </button>
                            </div>
                        </div>
                        <p class="response-message">{{ response.message }}</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    
    <ReportModal 
        v-if="reportingId"
        :content-id="reportingId"
        :content-type="reportingType"
        :content-author="reportingAuthor"
        @close="closeReportModal"
        @submitted="closeReportModal"
    />
</template><style scoped>
.discussion-detail-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 1rem;
}

.btn-back {
    padding: 0.5rem 1rem;
    background: var(--color-secondary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-bottom: 2rem;
    transition: all var(--transition-duration);
}

.btn-back:hover {
    background: #0052a3;
    transform: translateY(-2px);
}

.loading {
    text-align: center;
    padding: 3rem;
    color: var(--color-text);
}

.discussion-detail-card {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.discussion-detail-card h1 {
    margin-top: 0;
    color: var(--color-heading);
}

.discussion-meta {
    display: flex;
    gap: 1.5rem;
    font-size: 14px;
    color: var(--color-text);
    opacity: 0.7;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.discussion-body {
    color: var(--color-text);
    line-height: 1.8;
    font-size: 15px;
}

.responses-section {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.responses-section h2 {
    margin-top: 0;
    color: var(--color-heading);
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 1rem;
}

.add-response {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.add-response h3 {
    margin-top: 0;
    color: var(--color-heading);
}

.response-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-background-soft);
    color: var(--color-text);
    font-family: inherit;
    font-size: 14px;
    transition: all var(--transition-duration);
    resize: vertical;
}

.response-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-duration);
    font-size: 14px;
    margin-top: 1rem;
    width: 100%;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #368659;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-prompt {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    text-align: center;
    color: var(--color-text);
    margin-bottom: 2rem;
}

.login-prompt a {
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
}

.login-prompt a:hover {
    text-decoration: underline;
}

.no-responses {
    text-align: center;
    padding: 2rem;
    color: var(--color-text);
    opacity: 0.7;
}

.responses-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.response-card {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--color-primary);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    transition: all var(--transition-duration);
}

.response-card:hover {
    border-color: var(--color-border-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.response-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
}

.response-header strong {
    color: var(--color-heading);
    display: block;
    margin-bottom: 0.25rem;
}

.response-header small {
    color: var(--color-text);
    opacity: 0.6;
    font-size: 12px;
}

.btn-delete {
    padding: 0.4rem 0.6rem;
    background: #d32f2f;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 14px;
    transition: all var(--transition-duration);
}

.btn-delete:hover {
    background: #b71c1c;
    transform: translateY(-2px);
}

.btn-edit-response {
    padding: 0.4rem 0.6rem;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 14px;
    transition: all var(--transition-duration);
    margin-right: 0.5rem;
}

.btn-edit-response:hover {
    background: #1976D2;
    transform: translateY(-2px);
}

.btn-report-response {
    padding: 0.4rem 0.6rem;
    background: #FF6F00;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 14px;
    transition: all var(--transition-duration);
    margin-left: 0.5rem;
}

.btn-report-response:hover {
    background: #E65100;
    transform: translateY(-2px);
}

.response-actions {
    display: flex;
    gap: 0.25rem;
}

.edit-response-form {
    background: var(--color-background-soft);
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 2px solid var(--color-primary);
    margin-bottom: 1rem;
}

.edit-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.btn-save-edit, .btn-cancel-edit {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all var(--transition-duration);
}

.btn-save-edit {
    background: var(--color-primary);
    color: white;
}

.btn-save-edit:hover:not(:disabled) {
    background: #368659;
    transform: translateY(-2px);
}

.btn-save-edit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-cancel-edit {
    background: #ccc;
    color: #333;
}

.btn-cancel-edit:hover {
    background: #bbb;
}

.response-message {
    color: var(--color-text);
    margin: 0;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .discussion-detail-container {
        padding: 0.5rem;
    }
    
    .discussion-detail-card,
    .responses-section {
        padding: 1rem;
    }
    
    .response-header {
        flex-direction: column;
    }
}
</style>
