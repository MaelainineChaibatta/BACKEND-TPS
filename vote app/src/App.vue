<template>
  <div class="app">
    <header class="app-header">
      <h1>Voting App</h1>
      <button class="logout-btn" @click="logout">Logout</button>

    </header>


    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);

onAuthStateChanged(auth, (u) => {
  user.value = u;
});

const router = useRouter();
const logout = async () => {
  await signOut(auth);
  router.push("/login");
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
}

/* Login card */
.login-card {
  background: #1e293b;
  padding: 40px;
  width: 380px;
  border-radius: 18px;
  border: 1px solid #334155;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  text-align: center;
  animation: fadeIn 0.6s ease;
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
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f1f5f9;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Buttons */
.btn {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.25s ease;
}

/* Login button */
.login-btn {
  background: #10b981;
  color: white;
}

.login-btn:hover {
  background: #059669;
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
  margin-top: 12px;
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

.app {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0f172a, #1e293b);
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
}

/* Main content spacing */
main {
  padding: 40px 20px;
}

.logout-btn {
  background: #ef4444;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.logout-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 40px;
  border-bottom: 1px solid #1e293b;
  background: transparent;
}

.app-header h1 {
  font-size: 28px;
  color: #f8fafc;
}

</style>