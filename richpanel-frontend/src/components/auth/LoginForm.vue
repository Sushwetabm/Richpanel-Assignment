<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700"
        >Email</label
      >
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="manoj@richpanel.com"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700"
        >Password</label
      >
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>

    <div class="flex items-center">
      <input
        id="remember-me"
        v-model="rememberMe"
        type="checkbox"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="remember-me" class="ml-2 block text-sm text-gray-700"
        >Remember Me</label
      >
    </div>

    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :disabled="authStore.isLoading"
    >
      <span v-if="!authStore.isLoading">Login</span>
      <span v-else>Logging in...</span>
    </button>

    <div class="mt-4 text-center">
      <a
        @click="$emit('switch-view')"
        class="text-blue-600 hover:text-blue-500 text-sm cursor-pointer"
      >
        New to MyApp? Sign Up
      </a>
    </div>

    <div v-if="authStore.error" class="text-red-500 text-sm text-center">
      {{ authStore.error }}
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>
