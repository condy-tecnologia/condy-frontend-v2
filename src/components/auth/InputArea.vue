<template>
    <div class="p-4 bg-white border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <input
          type="text"
          v-model="inputText"
          @keyup.enter="submitMessage"
          :disabled="disabled"
          placeholder="Digite sua mensagem..."
          class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
        <button
          @click="submitMessage"
          :disabled="disabled || !inputText.trim()"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const inputText = ref('');
  const emit = defineEmits(['sendMessage']);
  defineProps({
    disabled: Boolean
  });
  
  const submitMessage = () => {
    if (inputText.value.trim() && !props.disabled) {
      emit('sendMessage', inputText.value.trim());
      inputText.value = '';
    }
  };
  </script>
  