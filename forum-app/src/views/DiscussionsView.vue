<script setup>
import {ref, computed, onMounted} from "vue";
import {db, auth} from "../firebase/firebaseConfig";
import { collection ,onSnapshot ,query , orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import ReportModal from "../components/ReportModal.vue";

const router = useRouter();
const discussions = ref([]);
const loading = ref(false);
const currentUser = ref(auth.currentUser);
const editingId = ref(null);
const editTitle = ref("");
const editContent = ref("");
const selectedCategory = ref("All");
const searchQuery = ref("");
const reportingId = ref(null);
const reportingType = ref(null);
const reportingAuthor = ref(null);
const categories = [
    "All",
    "General",
    "Technology",
    "Education",
    "Entertainment",
    "Sports",
    "Health",
    "Business",
    "Science",
    "Travel",
    "Other"
];

const filteredDiscussions = computed(() => {
    let filtered = discussions.value;
    
    // Filter by category
    if (selectedCategory.value !== "All") {
        filtered = filtered.filter(d => d.category === selectedCategory.value);
    }
    
    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(d => 
            d.title.toLowerCase().includes(query) || 
            d.content.toLowerCase().includes(query)
        );
    }
    
    return filtered;
});

auth.onAuthStateChanged((u) => {
    currentUser.value = u;
});

onMounted(()=> {
    const q = query(collection(db ,"discussions") ,orderBy("createdAt","desc"));
    onSnapshot(q ,(snap)=>{
        discussions.value = snap.docs.map(d=>({id: d.id , ...d.data()}));
    });
});

const startEdit = (discussion) => {
    if (discussion.userId !== currentUser.value?.uid) {
        alert("You can only edit your own discussions");
        return;
    }
    editingId.value = discussion.id;
    editTitle.value = discussion.title;
    editContent.value = discussion.content;
};

const cancelEdit = () => {
    editingId.value = null;
    editTitle.value = "";
    editContent.value = "";
};

const saveEdit = async (id) => {
    if (!editTitle.value.trim() || !editContent.value.trim()) {
        alert("Title and content cannot be empty");
        return;
    }
    
    loading.value = true;
    try {
        await updateDoc(doc(db, "discussions", id), {
            title: editTitle.value,
            content: editContent.value,
            updatedAt: new Date()
        });
        editingId.value = null;
        editTitle.value = "";
        editContent.value = "";
    } catch(e) {
        alert("Error updating discussion: " + e.message);
    } finally {
        loading.value = false;
    }
};

const deleteDiscussion = async (id, userId) => {
    // Check if user owns this discussion
    if (userId !== currentUser.value?.uid) {
        alert("You can only delete your own discussions");
        return;
    }
    
    if (!confirm("Are you sure you want to delete this discussion?")) {
        return;
    }
    
    loading.value = true;
    try {
        await deleteDoc(doc(db, "discussions", id));
    } catch(e) {
        alert("Error deleting discussion: " + e.message);
    } finally {
        loading.value = false;
    }
};

const viewDiscussion = (id) => {
    router.push(`/discussion/${id}`);
};

const openReportModal = (discussionId, author) => {
    reportingId.value = discussionId;
    reportingType.value = "discussion";
    reportingAuthor.value = author;
};

const closeReportModal = () => {
    reportingId.value = null;
    reportingType.value = null;
    reportingAuthor.value = null;
};

</script>

<template>
<div class="discussions-container">
    <div class="discussions-header">
        <h2>All Discussions</h2>
        <router-link to="/new" class="btn btn-primary">+ New Discussion</router-link>
    </div>
    
    <div class="category-filter">
        <div class="search-box">
            <label for="search">Search Discussions:</label>
            <input 
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search by title or content..."
                class="search-input"
            />
        </div>
        
        <div class="filter-section">
            <label>Filter by Category:</label>
            <div class="category-buttons">
                <button 
                    v-for="cat in categories"
                    :key="cat"
                    @click="selectedCategory = cat"
                    :class="['category-btn', { active: selectedCategory === cat }]"
                >
                    {{ cat }}
                </button>
            </div>
        </div>
    </div>
    
    <div v-if="filteredDiscussions.length === 0" class="empty-state">
        <p>No discussions in this category yet. Be the first to create one!</p>
        <router-link to="/new" class="btn btn-primary">Create Discussion</router-link>
    </div>
    
    <div v-else class="discussions-list">
        <div v-for="d in filteredDiscussions" :key="d.id" class="discussion-card">
            <div v-if="editingId === d.id" class="edit-form">
                <h3>Edit Discussion</h3>
                <div class="form-group">
                    <label>Title</label>
                    <input v-model="editTitle" type="text" class="form-input" placeholder="Discussion title">
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <textarea v-model="editContent" class="form-input" rows="4" placeholder="Discussion content"></textarea>
                </div>
                <div class="edit-actions">
                    <button @click="saveEdit(d.id)" :disabled="loading" class="btn-save">💾 Save</button>
                    <button @click="cancelEdit" class="btn-cancel">❌ Cancel</button>
                </div>
            </div>
            
            <div v-else>
                <div class="discussion-header">
                    <h3 @click="viewDiscussion(d.id)" class="discussion-title">{{ d.title }}</h3>
                    <div v-if="currentUser?.uid === d.userId" class="discussion-actions">
                        <button 
                            @click="startEdit(d)"
                            class="btn-edit"
                        >
                            ✏️ Edit
                        </button>
                        <button 
                            @click="deleteDiscussion(d.id, d.userId)"
                            :disabled="loading"
                            class="btn-delete"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                    <div v-else class="discussion-actions">
                        <button 
                            @click="openReportModal(d.id, d.userEmail)"
                            class="btn-report"
                            title="Report this discussion"
                        >
                            🚩 Report
                        </button>
                    </div>
                </div>
                
                <p class="discussion-content">{{ d.content.substring(0, 150) }}...</p>
                
                <div class="discussion-meta">
                    <span class="meta-item">📂 <strong class="category-badge">{{ d.category || "General" }}</strong></span>
                    <span class="meta-item">📧 {{ d.userEmail }}</span>
                    <span class="meta-item">📅 {{ new Date(d.createdAt?.toDate?.()).toLocaleDateString() }}</span>
                    <span v-if="d.updatedAt" class="meta-item" style="color: orange;">✏️ Edited</span>
                </div>
                
                <button @click="viewDiscussion(d.id)" class="btn btn-secondary">View Discussion</button>
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
.discussions-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 1rem;
}

.discussions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.discussions-header h2 {
    margin: 0;
}

.category-filter {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.search-box {
    margin-bottom: 1.5rem;
}

.search-box label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-heading);
    font-size: 14px;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-text);
    font-family: inherit;
    font-size: 14px;
    transition: border-color var(--transition-duration);
}

.search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.filter-section label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 600;
    color: var(--color-heading);
}

.category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.category-btn {
    padding: 0.5rem 1rem;
    border: 2px solid var(--color-border);
    background: transparent;
    color: var(--color-text);
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-duration);
    font-size: 14px;
}

.category-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.category-btn.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.category-badge {
    background: rgba(66, 185, 131, 0.2);
    color: var(--color-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 13px;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    color: var(--color-text);
}

.discussions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.discussion-card {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    transition: all var(--transition-duration);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.discussion-card:hover {
    border-color: var(--color-border-hover);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.discussion-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
}

.discussion-title {
    margin: 0;
    color: var(--color-primary);
    cursor: pointer;
    transition: color var(--transition-duration);
    flex: 1;
}

.discussion-title:hover {
    color: var(--color-secondary);
    text-decoration: underline;
}

.discussion-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-delete {
    padding: 0.4rem 0.8rem;
    background: #d32f2f;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 12px;
    transition: all var(--transition-duration);
}

.btn-edit {
    padding: 0.4rem 0.8rem;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 12px;
    transition: all var(--transition-duration);
    margin-right: 0.5rem;
}

.btn-edit:hover {
    background: #1976D2;
    transform: translateY(-2px);
}

.btn-report {
    padding: 0.4rem 0.8rem;
    background: #FF6F00;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 12px;
    transition: all var(--transition-duration);
    margin-left: 0.5rem;
}

.btn-report:hover {
    background: #E65100;
    transform: translateY(-2px);
}

.btn-delete:hover:not(:disabled) {
    background: #b71c1c;
    transform: translateY(-2px);
}

.btn-delete:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.edit-form {
    background: var(--color-background);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    border: 2px solid var(--color-primary);
}

.edit-form h3 {
    margin-top: 0;
    color: var(--color-primary);
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text);
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-background-soft);
    color: var(--color-text);
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
}

.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.edit-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.btn-save, .btn-cancel {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-duration);
    font-size: 14px;
}

.btn-save {
    background: var(--color-primary);
    color: white;
}

.btn-save:hover:not(:disabled) {
    background: #368659;
    transform: translateY(-2px);
}

.btn-save:disabled {
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

.discussion-content {
    color: var(--color-text);
    opacity: 0.8;
    margin: 1rem 0;
    line-height: 1.6;
}

.discussion-meta {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    font-size: 13px;
    color: var(--color-text);
    opacity: 0.6;
    flex-wrap: wrap;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-duration);
    font-size: 14px;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background: #368659;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-secondary {
    background: var(--color-secondary);
    color: white;
}

.btn-secondary:hover {
    background: #0052a3;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .discussions-header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .discussion-header {
        flex-direction: column;
    }
    
    .discussion-meta {
        font-size: 12px;
    }
}
</style>