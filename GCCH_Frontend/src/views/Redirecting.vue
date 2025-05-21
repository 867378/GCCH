<template>
  <div class="redirecting">Redirecting...</div>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  try {
    const { data: user } = await axios.get('/user');
    console.log(user);

    localStorage.setItem('user_id', user.id);

    if (!user.role) {
      router.push(`/signup/${user.id}`);
    } else {
      switch (user.role) {
        case 'applicant':
          router.push('/applicantdash');
          break;
        case 'company':
          router.push('/companydash');
          break;
        default:
          router.push('/login');
          break;
      }
    }
  } catch (e) {
    router.push('/login'); // fallback
  }
});
</script>
