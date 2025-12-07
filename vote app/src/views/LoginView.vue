<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>Login or Register</h1>

      <input
        v-model="email"
        type="email"
        placeholder="ENSA Email"
        class="input"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input"
      />

      <button class="btn login-btn" @click="login">Login</button>
      <button class="btn register-btn" @click="register">Register</button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const isENSAEmail = (email) =>
  email.endsWith("@ensa.ac.ma") || email.endsWith("@edu.ensa.ac.ma");

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (e) {
    error.value = e.message;
  }
};

const register = async () => {
  if (!isENSAEmail(email.value)) {
    error.value = "You must use your ENSA university email";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (e) {
    error.value = e.message;
  }
};
</script>

<style scoped>
/* Background wrapper */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background: linear-gradient(to bottom right, #0f172a, #1e293b);
  padding: 20px;
}

/* Login card */
.login-card {
  background: rgba(30, 41, 59, 0.9);
  padding: 40px;
  width: 420px;
  border-radius: 20px;
  border: 1px solid #334155;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  text-align: center;
  animation: fadeIn 0.6s ease;
  backdrop-filter: blur(6px);
}

/* Title */
h1 {
  color: #f8fafc;
  margin-bottom: 10px;
  font-size: 26px;
  font-weight: 700;
}

/* Subtitle text */
.subtitle {
  color: #94a3b8;
  margin-bottom: 25px;
  font-size: 14px;
}

/* Input fields */
.input {
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid #475569;
  background: #0f172a;
  color: #f1f5f9;
  font-size: 15px;
  outline: none;
  transition: 0.25s ease;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
}

/* Buttons */
.btn {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s ease;
}

/* Login button */
.login-btn {
  background: #22c55e;
  color: white;
}

.login-btn:hover {
  background: #16a34a;
  transform: translateY(-2px);
}

/* Register button */
.register-btn {
  background: #3b82f6;
  color: white;
}

.register-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Error message */
.error-message {
  margin-top: 15px;
  color: #ef4444;
  font-size: 14px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>