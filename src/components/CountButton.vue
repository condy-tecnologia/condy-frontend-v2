<script setup lang="ts">
  import { useCounterStore } from '@/stores/counter'

  const countStore = useCounterStore()
</script>

<template>
  <div class="bg-dark text-white">
    <h1> Count: {{ countStore.count }} </h1>
    <button @click="countStore.increment">Increment</button>
    <button @click="countStore.decrement">Decrement</button>
  </div>
</template>

<style scoped>
  .bg-dark {
    background-color: #333;
  }
</style>
