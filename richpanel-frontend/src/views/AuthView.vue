<template>
  <div class="min-h-screen flex items-center justify-center bg-[#1877F2] p-4">
    <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">
        {{ isLoginView ? "Login to your account" : "Create Account" }}
      </h1>

      <LoginForm v-if="isLoginView" @switch-view="toggleView" />
      <RegisterForm v-else @switch-view="toggleView" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";

const route = useRoute();
const isLoginView = ref(route.name === "login");

const toggleView = () => {
  isLoginView.value = !isLoginView.value;
};
</script>
