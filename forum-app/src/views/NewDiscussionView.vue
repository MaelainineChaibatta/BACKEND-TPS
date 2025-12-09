
<script setup>

import {ref} from "vue"; 
import {db ,auth} from "../firebase/firebaseConfig";
import { addDoc ,collection ,serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";

const router = useRouter();
const title = ref("");
const content = ref("");
const category = ref("General");
const error = ref("");
const loading = ref(false);

const categories = [
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

const createDiscussion = async ()=>{
    if (!title.value.trim() || !content.value.trim()) {
        error.value = "Please fill in all fields";
        return;
    }

    loading.value = true;
    try {
        if (!auth.currentUser) {
            error.value = "You must be logged in to create a discussion";
            return;
        }
        
        await addDoc(collection(db ,"discussions") ,{
            title: title.value ,
            content: content.value ,
            category: category.value,
            userId : auth.currentUser.uid ,
            userEmail: auth.currentUser.email,
            createdAt : serverTimestamp()
        });
        title.value = "";
        content.value = "";
        category.value = "General";
        error.value = "";
        router.push("/discussions");
    } catch(e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
};

</script>

<template>
<div class="new-discussion-container">
    <div class="form-card">
        <h2>Create New Discussion</h2>
        <p class="subtitle">Share your thoughts with the community</p>
        
        <form @submit.prevent="createDiscussion">
            <div class="form-group">
                <label for="title">Discussion Title</label>
                <input 
                    id="title"
                    v-model="title" 
                    type="text"
                    placeholder="Enter a catchy title..."
                    class="form-input"
                />
            </div>
            
            <div class="form-group">
                <label for="category">Category</label>
                <select 
                    id="category"
                    v-model="category"
                    class="form-input"
                >
                    <option v-for="cat in categories" :key="cat" :value="cat">
                        {{ cat }}
                    </option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="content">Discussion Content</label>
                <textarea 
                    id="content"
                    v-model="content" 
                    placeholder="Share your thoughts..."
                    class="form-textarea"
                    rows="8"
                ></textarea>
            </div>
            
            <div v-if="error" class="error-message">{{ error }}</div>
            
            <button 
                type="submit" 
                :disabled="loading"
                class="btn btn-primary"
            > 
                {{ loading ? 'Publishing...' : 'Publish Discussion' }}
            </button>
        </form>
    </div>
</div>
</template>

<style scoped>
.new-discussion-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
}

.form-card {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-card h2 {
    margin-top: 0;
    color: var(--color-heading);
}

.subtitle {
    color: var(--color-text);
    opacity: 0.8;
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-heading);
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-text);
    font-family: inherit;
    font-size: 14px;
    transition: all var(--transition-duration);
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.error-message {
    color: #d32f2f;
    background: rgba(211, 47, 47, 0.1);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    font-size: 14px;
}

.btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 16px;
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-duration);
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

@media (max-width: 768px) {
    .new-discussion-container {
        padding: 0.5rem;
    }
    
    .form-card {
        padding: 1.5rem;
    }
}
</style>