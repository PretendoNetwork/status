<script setup lang="ts">
const { error } = defineProps<{ error: any }>();

watch([error], () => {
	console.error(error);
}, { immediate: true });
</script>

<template>
  <p>ERROR: {{ error }}</p>
</template>
