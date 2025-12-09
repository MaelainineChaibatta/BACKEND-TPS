
<script setup>
import {ref} from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref(""); 
const password = ref("");
const error = ref(""); 
const loading = ref(false);

// Login Logic :
const login = async() => {
    if (!email.value || !password.value) {
        error.value = "Please fill in all fields";
        return;
    }
    
    loading.value = true;
    try {
        await signInWithEmailAndPassword(auth ,email.value ,password.value);
        email.value = "";
        password.value = "";
        error.value = "";
        router.push("/");
    } catch(e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
<div class="login-container">
    <div class="auth-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Sign in to your account</p>
        
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    id="email"
                    v-model="email" 
                    type="email"
                    placeholder="you@example.com"
                    class="form-input"
                    required
                />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    id="password"
                    v-model="password" 
                    type="password" 
                    placeholder="Your password"
                    class="form-input"
                    required
                />
            </div>
            
            <div v-if="error" class="error-message">{{ error }}</div>
            
            <button 
                type="submit" 
                :disabled="loading"
                class="btn btn-primary"
            >
                {{ loading ? 'Signing in...' : 'Login' }}
            </button>
        </form>
        
        <p class="forgot-password-link">
            <router-link to="/forgot-password">Forgot your password?</router-link>
        </p>
        
        <p class="register-link">
            Don't have an account? <router-link to="/register">Register here</router-link>
        </p>
    </div>
</div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
    background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background) 100%);
}

.auth-card {
    width: 100%;
    max-width: 400px;
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.auth-card h2 {
    margin-top: 0;
    text-align: center;
    color: var(--color-heading);
}

.subtitle {
    text-align: center;
    color: var(--color-text);
    opacity: 0.7;
    margin-bottom: 2rem;
    font-size: 14px;
}

.form-group {
    margin-bottom: 1.25rem;
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
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-text);
    font-family: inherit;
    font-size: 14px;
    transition: all var(--transition-duration);
}

.form-input:focus {
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
    font-size: 13px;
    border-left: 3px solid #d32f2f;
}

.btn {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-duration);
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

.register-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 14px;
    color: var(--color-text);
}

.forgot-password-link {
    text-align: center;
    margin-top: 1rem;
    font-size: 14px;
    color: var(--color-text);
}

.register-link a,
.forgot-password-link a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    transition: color var(--transition-duration);
}

.register-link a:hover,
.forgot-password-link a:hover {
    color: #368659;
    text-decoration: underline;
}
</style>