<template>
  <div class="min-h-screen flex items-center justify-center bg-[#1877F2] p-4">
    <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">
        Facebook Page Integration
      </h1>

      <div v-if="facebookStore.connectedPage" class="space-y-6">
        <div class="p-4 border border-gray-200 rounded-md">
          <p class="font-medium">Integrated Page:</p>
          <p class="text-lg">{{ facebookStore.connectedPage.pageName }}</p>
        </div>

        <button
          @click="deleteIntegration"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          :disabled="facebookStore.isLoading"
        >
          <span v-if="!facebookStore.isLoading">Delete Integration</span>
          <span v-else>Deleting...</span>
        </button>

        <router-link
          to="/dashboard"
          class="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reply To Messages
        </router-link>
      </div>

      <div v-else class="text-center">
        <p class="mb-6">No Facebook page connected</p>
        <button
          @click="connectFacebook"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="facebookStore.isLoading"
        >
          <span v-if="!facebookStore.isLoading">Connect Facebook Page</span>
          <span v-else>Connecting...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useFacebookStore } from "@/stores/facebook";

const facebookStore = useFacebookStore();

const connectFacebook = async () => {
  try {
    const authUrl = await facebookStore.getAuthUrl();
    window.location.href = authUrl;
  } catch (error) {
    console.error("Error connecting Facebook:", error);
  }
};

const deleteIntegration = async () => {
  try {
    await facebookStore.disconnect();
  } catch (error) {
    console.error("Error disconnecting Facebook:", error);
  }
};

onMounted(async () => {
  await facebookStore.getConnectedPage();
});
</script>
