<template>
  <div class="redirect-container">
    <div class="redirect-box">
      <div class="spinner"></div>
      <p>Redirecting, please wait...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  // Extract payload from URL
  const params = new URLSearchParams(window.location.search);
  const payloadRaw = params.get('payload');
  let payload = {};
  try {
    payload = JSON.parse(payloadRaw);
  } catch (e) {
    router.push('/login');
    return;
  }

  // Store token in localStorage
  if (payload.token) {
    localStorage.setItem('token', payload.token);
  }

  // Store user info if needed
  if (payload.user && payload.user.id) {
    localStorage.setItem('user_id', payload.user.id);
    if (payload.user.role) {
      localStorage.setItem('user_role', payload.user.role);
    }
  }

  // Redirect user based on payload
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (payload.redirect) {
    router.push(payload.redirect);
  } else {
    router.push('/login');
  }
});
</script>


<style scoped>
.redirect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.redirect-box {
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.spinner {
  border: 4px solid #e5e7eb;
  border-top: 4px solid #045d56;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
