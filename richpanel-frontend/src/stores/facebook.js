import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useFacebookStore = defineStore("facebook", () => {
  const connectedPage = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const getAuthUrl = async () => {
    try {
      const { data } = await axios.get("/api/facebook/auth-url");
      return data.data.authUrl;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Failed to get Facebook auth URL";
      throw err;
    }
  };

  const getConnectedPage = async () => {
    try {
      isLoading.value = true;
      const { data } = await axios.get("/api/facebook/pages");
      connectedPage.value = data.data.page;
    } catch (err) {
      connectedPage.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const disconnect = async () => {
    try {
      isLoading.value = true;
      await axios.delete("/api/facebook/disconnect");
      connectedPage.value = null;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Failed to disconnect Facebook";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    connectedPage,
    isLoading,
    error,
    getAuthUrl,
    getConnectedPage,
    disconnect,
  };
});
