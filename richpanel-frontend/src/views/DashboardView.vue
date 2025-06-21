<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left Sidebar -->
    <div class="w-1/4 bg-[#1565C0] text-white p-4 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Conversations</h2>
        <button
          @click="refreshConversations"
          class="text-white hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div v-if="conversationStore.isLoading" class="flex justify-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
        ></div>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="conversation in conversationStore.conversations"
          :key="conversation._id"
          @click="selectConversation(conversation._id)"
          :class="[
            'p-3 rounded-md cursor-pointer hover:bg-blue-700',
            conversationStore.selectedConversationId === conversation._id
              ? 'bg-blue-800'
              : '',
          ]"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">{{ conversation.customerName }}</p>
              <p class="text-xs text-blue-200">
                {{
                  conversation.platform === "messenger"
                    ? "Facebook DM"
                    : "Facebook Post"
                }}
              </p>
            </div>
            <span class="text-xs text-blue-200">{{
              formatTimeAgo(conversation.lastMessageAt)
            }}</span>
          </div>
          <p class="text-sm mt-1 truncate">
            {{ getLastMessagePreview(conversation._id) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Center Panel -->
    <div class="w-2/4 bg-white p-4 flex flex-col">
      <div
        v-if="conversationStore.selectedConversationId"
        class="flex-1 overflow-y-auto"
      >
        <h3 class="text-lg font-bold mb-4">
          {{ getSelectedConversation()?.customerName }}
        </h3>

        <div class="space-y-4">
          <div
            v-for="message in conversationStore.messages"
            :key="message._id"
            :class="[
              'flex',
              message.senderType === 'customer'
                ? 'justify-start'
                : 'justify-end',
            ]"
          >
            <div
              :class="[
                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                message.senderType === 'customer'
                  ? 'bg-gray-200'
                  : 'bg-blue-500 text-white',
              ]"
            >
              <p>{{ message.messageText }}</p>
              <p class="text-xs mt-1 opacity-70 text-right">
                {{ formatMessageTime(message.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <p class="text-gray-500">Select a conversation to start messaging</p>
      </div>

      <div v-if="conversationStore.selectedConversationId" class="mt-4">
        <div class="flex">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            @click="sendMessage"
            class="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="w-1/4 bg-gray-50 p-4 overflow-y-auto">
      <div v-if="conversationStore.selectedConversationId" class="space-y-4">
        <h3 class="text-lg font-bold">Customer details</h3>

        <div class="space-y-2">
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-medium">
              {{ getSelectedConversation()?.customerEmail || "Not provided" }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">First Name</p>
            <p class="font-medium">
              {{ getSelectedConversation()?.customerName.split(" ")[0] }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Last Name</p>
            <p class="font-medium">
              {{
                getSelectedConversation()
                  ?.customerName.split(" ")
                  .slice(1)
                  .join(" ") || "-"
              }}
            </p>
          </div>
        </div>

        <button
          class="w-full mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View more details
        </button>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <p class="text-gray-500">No customer selected</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useConversationStore } from "@/stores/conversation";
import { formatDistanceToNow, format } from "date-fns";

const conversationStore = useConversationStore();
const newMessage = ref("");

const getSelectedConversation = () => {
  return conversationStore.conversations.find(
    (c) => c._id === conversationStore.selectedConversationId
  );
};

const getLastMessagePreview = (conversationId) => {
  const messages = conversationStore.messages.filter(
    (m) => m.conversationId === conversationId
  );
  return messages.length > 0
    ? messages[messages.length - 1].messageText
    : "No messages yet";
};

const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const formatMessageTime = (date) => {
  return format(new Date(date), "h:mm a");
};

const selectConversation = async (conversationId) => {
  await conversationStore.fetchMessages(conversationId);
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  await conversationStore.sendMessage({
    conversationId: conversationStore.selectedConversationId,
    messageText: newMessage.value,
  });
  newMessage.value = "";
};

const refreshConversations = async () => {
  await conversationStore.fetchConversations();
};

onMounted(async () => {
  conversationStore.initSocket();
  conversationStore.connectSocket();
  await conversationStore.fetchConversations();
});
</script>
