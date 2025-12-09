<script setup>
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { ref } from "vue";

const user = ref(auth.currentUser);

auth.onAuthStateChanged((u)=>{
    user.value = u;
});

const logout = async () => {
  await signOut(auth);
  window.location.href = "/login";
};

const getUserDisplay = () => {
    if (!user.value) return "";
    return user.value.displayName || user.value.email?.split('@')[0] || "User";
};
</script>

<template>
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <router-link to="/">🌐 Forum</router-link>
        </div>
        
        <div v-if="user" class="nav-welcome">
            Welcome back, <strong>{{ getUserDisplay() }}</strong>! 👋
        </div>
        
        <div class="nav-links">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/discussions" class="nav-link">Discussions</router-link>
            
            <router-link 
                v-if="user" 
                to="/profile" 
                class="nav-link"
            >
                👤 Profile
            </router-link>
            <router-link 
                v-if="user" 
                to="/new" 
                class="nav-link nav-link-create"
            >
                + New Discussion
            </router-link>

            <router-link 
                v-if="!user" 
                to="/login" 
                class="nav-link nav-link-login"
            >
                Login
            </router-link>
            <router-link 
                v-if="!user" 
                to="/register" 
                class="nav-link nav-link-register"
            >
                Register
            </router-link>
            <button 
                v-if="user" 
                @click="logout"
                class="nav-link nav-link-logout"
            >
                Logout
            </button>
        </div>
    </div>
</nav>
</template>

<style scoped>
.navbar {
    background: var(--color-background-soft);
    border-bottom: 1px solid var(--color-border);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
    flex-shrink: 0;
}

.nav-logo a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-duration);
}

.nav-logo a:hover {
    color: var(--color-secondary);
}

.nav-welcome {
    color: var(--color-text);
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;
}

.nav-welcome strong {
    color: var(--color-primary);
    font-weight: 700;
}

.nav-links {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.nav-link {
    color: var(--color-text);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    transition: all var(--transition-duration);
    font-size: 14px;
    font-weight: 500;
    background: transparent;
    border: none;
    cursor: pointer;
}

.nav-link:hover {
    background: var(--color-background);
    color: var(--color-primary);
}

.nav-link.router-link-active {
    color: var(--color-primary);
    background: rgba(66, 185, 131, 0.1);
}

.nav-link-create {
    background: var(--color-primary);
    color: white;
    margin-left: 0.5rem;
}

.nav-link-create:hover {
    background: #368659;
    transform: translateY(-1px);
}

.nav-link-login,
.nav-link-register {
    background: var(--color-secondary);
    color: white;
}

.nav-link-login:hover,
.nav-link-register:hover {
    background: #0052a3;
    transform: translateY(-1px);
}

.nav-link-logout {
    background: #d32f2f;
    color: white;
}

.nav-link-logout:hover {
    background: #b71c1c;
    transform: translateY(-1px);
}

@media (max-width: 1024px) {
    .nav-container {
        flex-wrap: wrap;
        padding: 1rem;
        gap: 1rem;
    }
    
    .nav-welcome {
        width: 100%;
        text-align: center;
    }
}

@media (max-width: 768px) {
    .nav-container {
        padding: 0.75rem 1rem;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .nav-links {
        width: 100%;
        justify-content: center;
        gap: 0.25rem;
    }
    
    .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 13px;
    }
    
    .nav-welcome {
        font-size: 13px;
    }
}
</style>