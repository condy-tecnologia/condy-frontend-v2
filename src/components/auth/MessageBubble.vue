<template>
  <div :class="['flex w-full mb-3 sm:mb-4', isUser ? 'justify-end' : 'justify-start']">
    <div :class="['flex items-end gap-2 sm:gap-3', isUser ? 'flex-row-reverse' : 'flex-row']">
      <img
        v-if="!isUser && avatarUrl"
        :src="avatarUrl"
        alt="Bot Avatar"
        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm flex-shrink-0"
      />

      <img
        v-if="isUser && messageIconUrl"
        :src="messageIconUrl"
        alt="Message Icon"
        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm flex-shrink-0"
      />

      <div
        :class="[
          'max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 sm:p-4 shadow-md rounded-2xl',
          isUser
            ? 'bg-[#1F45FF] text-white' // User bubble: Vibrant purple/blue background, white text
            : 'bg-white text-black',    // Bot bubble: White background, black text
        ]"
      >
        <div
          v-if="!isUser"
          v-html="text"
          class="text-sm leading-relaxed break-words"
        ></div>
        <p v-else class="text-sm leading-relaxed break-words">{{ text }}</p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  text: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    default: false
  },
  // URL for the avatar, primarily for the bot (shown on the left).
  // Example: '/img/bot-avatar.png' (replace with your actual image path)
  // The avatar from your image image_7d7192.png (woman with curly hair)
  avatarUrl: {
    type: String,
    default: '@/assets/imgs/auth/condy-avatar.png'
  },
  // URL for the special icon next to user messages (shown on the right).
  // Example: '/img/user-message-icon.png' (replace with your actual image path)
  // The icon from your image image_7d2018.png (cube/box logo)
  messageIconUrl: {
    type: String,
    default: '@/assets/imgs/auth/user-avatar.png'
  }
});
</script>

<style scoped>
/* Add any component-specific custom styles here if needed. */
/* For v-html content, ensure your Tailwind CSS build includes classes used within the HTML string,
   or use inline styles for robust styling of dynamic HTML parts. */
:global(.text-blue-600) { /* Example if you use Tailwind class in v-html */
    color: #2563eb;
}
:global(.font-semibold) { /* Example if you use Tailwind class in v-html */
    font-weight: 600;
}
</style>