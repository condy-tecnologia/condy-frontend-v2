<template>
  <div>
    <h1 class="bg-dark text-white"> Home </h1>
    <h2>Count: {{ count }}</h2>
    <CountButton />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CountButton from '@/components/CountButton.vue'

  const count = ref(0)
</script>
