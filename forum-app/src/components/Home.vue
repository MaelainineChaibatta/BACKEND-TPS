
<script setup>
</script>

<template>
<div class="home">
    <div class="content">
        <div class="welcome-card">
            <h1>Welcome to the Forum</h1>
            <p>Select a category to start browsing discussions.</p>
            <p class="features">
                Join our community, share your thoughts, and connect with others!
            </p>
        </div>
    </div>
</div>
</template>

<style scoped>
.home {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.content {
  flex: 1;
  max-width: 700px;
}

.welcome-card {
    background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background) 100%);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 3rem;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.6s ease-out;
}

.welcome-card h1 {
    color: var(--color-heading);
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

.welcome-card p {
    color: var(--color-text);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.features {
    color: var(--color-primary);
    font-weight: 600;
    opacity: 0.9;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .home {
        flex-direction: column;
        gap: 1rem;
    }
    
    .welcome-card {
        padding: 2rem;
    }
    
    .welcome-card h1 {
        font-size: 1.8rem;
    }
    
    .welcome-card p {
        font-size: 1rem;
    }
}
</style>