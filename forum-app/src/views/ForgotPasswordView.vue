<script setup>
import { ref } from "vue";
import { auth } from "../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);
const router = useRouter();

const resetPassword = async () => {
    error.value = "";
    success.value = false;
    loading.value = true;

    if (!email.value.trim()) {
        error.value = "Please enter your email address";
        loading.value = false;
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email.value);
        success.value = true;
        email.value = "";
        setTimeout(() => {
            router.push("/login");
        }, 3000);
    } catch (err) {
        // For security: Don't reveal if email exists or not
        // Show success message for all cases to prevent email enumeration attacks
        if (err.code === "auth/user-not-found") {
            // Email doesn't exist - but show success message anyway
            success.value = true;
        } else if (err.code === "auth/invalid-email") {
            error.value = "Invalid email address format";
        } else if (err.code === "auth/too-many-requests") {
            error.value = "Too many reset requests. Please try again later.";
        } else {
            // For other errors, show generic message
            success.value = true;
        }
        
        if (success.value) {
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
<div class="forgot-password-container">
    <div class="auth-card">
        <h2>Reset Your Password</h2>
        <p class="subtitle">Enter your email and we'll send you a link to reset your password</p>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-if="success" class="success-message">
            ✅ Password reset email sent! Check your inbox. Redirecting to login...
        </div>

        <form @submit.prevent="resetPassword" v-if="!success">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-input"
                    placeholder="you@example.com"
                    :disabled="loading"
                    required
                />
            </div>

            <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading"
            >
                {{ loading ? "Sending..." : "Send Reset Link" }}
            </button>
        </form>

        <p class="back-link">
            <router-link to="/login">Back to Login</router-link>
        </p>
    </div>
</div>
</template>

<style scoped>
.forgot-password-container {
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

.form-input:disabled {
    background-color: var(--color-background);
    opacity: 0.6;
    cursor: not-allowed;
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

.success-message {
    color: #388e3c;
    background: rgba(56, 142, 60, 0.1);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    font-size: 13px;
    border-left: 3px solid #388e3c;
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

.back-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 14px;
}

.back-link a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-duration);
}

.back-link a:hover {
    opacity: 0.8;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .auth-card {
        padding: 1.5rem;
    }
}
</style>