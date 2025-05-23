<template>
  <div class="bg-white rounded-xl shadow-md p-3 sm:p-4">
    <p class="text-xs text-gray-500 mb-1 ml-1">Digite sua resposta para a Condy</p>

    <div class="flex items-center space-x-1 sm:space-x-2">
      <input
        type="text"
        v-model="inputText"
        @keyup.enter="submitMessage"
        :disabled="props.disabled"
        placeholder="Escolha como deseja seguir"
        class="flex-grow py-2.5 px-2 text-base sm:text-lg font-semibold text-gray-800 placeholder:text-gray-600 placeholder:font-semibold focus:outline-none bg-transparent"
      />

      <button
        :disabled="props.disabled"
        class="p-2 text-violet-500 hover:bg-violet-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Opção de tempo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>

      <button
        :disabled="props.disabled"
        class="p-2 text-violet-500 hover:bg-violet-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Anexar arquivo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
        </svg>
      </button>

      <button
        @click="submitMessage"
        :disabled="props.disabled || !inputText.trim()"
        class="px-3 sm:px-4 py-2.5 bg-violet-400 text-white rounded-lg hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-opacity-75 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 sm:space-x-2"
      >
        <span class="text-sm sm:text-base font-medium">Enviar</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 sm:w-5 sm:h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputText = ref('');
const emit = defineEmits(['sendMessage']);
const props = defineProps({
  disabled: Boolean
});

const submitMessage = () => {
  if (inputText.value.trim() && !props.disabled) {
    emit('sendMessage', inputText.value.trim());
    inputText.value = '';
  }
};
</script>

<style scoped>
/* You can add custom styles here if Tailwind classes are not enough. */
/* For example, to ensure placeholder and input text styles are precisely as desired: 
input::placeholder {
  color: #4B5563; /* gray-600 
  font-weight: 600; /* semibold
}
/* Tailwind's placeholder: prefix should handle this well. */
</style>