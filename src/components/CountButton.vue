<script setup lang="ts">
  import { useCountStore } from '@/stores/counter'

  const countStore = useCountStore()
</script>

<template>
  <div class="bg-dark text-white">
    <h1> Count: {{ countStore.count }} </h1>
    <button @click="countStore.increment">Increment</button>
    <button @click="countStore.decrement">Decrement</button>
  </div>
</template>
