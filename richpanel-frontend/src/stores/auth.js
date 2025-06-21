import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        user.value = data.data.user;
        isAuthenticated.value = true;
      }
    } catch (err) {
      logout();
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      isLoading.value = true;
      error.value = null;
      const { data } = await axios.post("/api/auth/register", userData);
      localStorage.setItem("token", data.token);
      user.value = data.data.user;
      isAuthenticated.value = true;
      router.push("/dashboard");
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials) => {
    try {
      isLoading.value = true;
      error.value = null;
      const { data } = await axios.post("/api/auth/login", credentials);
      localStorage.setItem("token", data.token);
      user.value = data.data.user;
      isAuthenticated.value = true;
      router.push("/dashboard");
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout");
      localStorage.removeItem("token");
      user.value = null;
      isAuthenticated.value = false;
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    register,
    login,
    logout,
  };
});
