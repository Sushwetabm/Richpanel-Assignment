import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { io } from "socket.io-client";
const API = import.meta.env.VITE_API_BASE_URL;

export const useConversationStore = defineStore("conversation", () => {
  const conversations = ref([]);
  const messages = ref([]);
  const selectedConversationId = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const socket = ref(null);

  const initSocket = () => {
    socket.value = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    socket.value.on("newMessage", (message) => {
      if (message.conversationId === selectedConversationId.value) {
        messages.value.push(message);
      }
    });
  };

  const connectSocket = () => {
    if (!socket.value?.connected) {
      socket.value.connect();
    }
  };

  const disconnectSocket = () => {
    if (socket.value?.connected) {
      socket.value.disconnect();
    }
  };

  const joinConversation = (conversationId) => {
    if (socket.value) {
      socket.value.emit("joinConversation", conversationId);
    }
  };

  const fetchConversations = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const { data } = await axios.get(`${API}/api/conversations`);

      conversations.value = data.data.conversations;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Failed to load conversations";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      isLoading.value = true;
      error.value = null;
      const { data } = await axios.get(
        `${API}/api/conversations/${conversationId}/messages`
      );

      messages.value = data.data.messages;
      selectedConversationId.value = conversationId;
      joinConversation(conversationId);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load messages";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async ({ conversationId, messageText }) => {
    try {
      const { data } = await axios.post(
        `${API}/api/conversations/${conversationId}/reply`,
        {
          messageText,
        }
      );
      messages.value.push(data.data.message);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to send message";
      throw err;
    }
  };

  return {
    conversations,
    messages,
    selectedConversationId,
    isLoading,
    error,
    socket,
    initSocket,
    connectSocket,
    disconnectSocket,
    fetchConversations,
    fetchMessages,
    sendMessage,
  };
});
