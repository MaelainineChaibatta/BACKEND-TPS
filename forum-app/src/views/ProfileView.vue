
<script setup>

import {ref, onMounted} from "vue";
import {auth} from "../firebase/firebaseConfig";
import { updateProfile } from "firebase/auth";

const user = ref(auth.currentUser);
const displayName = ref("");

auth.onAuthStateChanged((u)=>{
    user.value = u;
    if (u) {
        displayName.value = u.displayName || "";
    }
});

const save = async ()=>{
    if(user.value) {
        try {
            await updateProfile(user.value, {displayName: displayName.value});
            alert("Profile Updated!");
        } catch(e) {
            alert("Error updating profile: " + e.message);
        }
    }
};

</script>

<template>

<div class="profile-container">
    <div class="profile-card">
        <h1 class="welcome-message">Welcome back to the Forum! 👋</h1>
        
        <div v-if="user" class="user-info">
            <h2>{{ user.displayName || user.email }}</h2>
            
            <div class="profile-details">
                <div class="detail-item">
                    <span class="label">📧 Email:</span>
                    <span class="value">{{ user.email }}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">🆔 User ID:</span>
                    <span class="value">{{ user.uid }}</span>
                </div>
            </div>

            <div class="update-section">
                <h3>Update Display Name</h3>
                <input 
                    v-model="displayName" 
                    type="text"
                    placeholder="Enter your display name"
                    class="form-input"
                />
                <button @click="save" class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    </div>
</div>

</template>


<style scoped>
.profile-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
}

.profile-card {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-message {
    color: var(--color-primary);
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 2rem;
    text-align: center;
}

.user-info h2 {
    color: var(--color-heading);
    margin-top: 0;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--color-primary);
}

.profile-details {
    background: var(--color-background);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
}

.detail-item:last-child {
    border-bottom: none;
}

.label {
    font-weight: 600;
    color: var(--color-heading);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.value {
    color: var(--color-text);
    opacity: 0.8;
    word-break: break-all;
}

.update-section {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
}

.update-section h3 {
    color: var(--color-heading);
    margin-top: 0;
    margin-bottom: 1rem;
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
    transition: all var(--transition-duration);
    margin-bottom: 1rem;
}

.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-duration);
    font-size: 14px;
    width: 100%;
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

@media (max-width: 768px) {
    .profile-container {
        padding: 0.5rem;
    }
    
    .profile-card {
        padding: 1.5rem;
    }
    
    .welcome-message {
        font-size: 1.4rem;
    }
    
    .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>