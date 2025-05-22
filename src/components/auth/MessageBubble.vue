<template>
	<div :class="['flex', isUser ? 'justify-end' : 'justify-start']">
	  <div
	    :class="[
	      'max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg shadow',
	      isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
	    ]"
	  >
	    <p class="text-sm">{{ text }}</p>
	    <p v-if="timestamp" class="text-xs mt-1" :class="[isUser ? 'text-blue-200' : 'text-gray-400']">
	      {{ timestamp }}
	    </p>
	  </div>
	</div>
</template>

<script setup>
	defineProps({
		text: String,
		isUser: Boolean,
		timestamp: String
	});
</script>
  