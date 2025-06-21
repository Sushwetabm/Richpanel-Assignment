<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    await authStore.checkAuth();
  } catch (error) {
    if (router.currentRoute.value.path !== "/login") {
      router.push("/login");
    }
  }
});
</script>
