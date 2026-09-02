<script setup lang="ts">
const props = defineProps<{
	content: string;
}>();
</script>

<template>
  <div class="prose">
    <Markdown
      :value="props.content"
      :options="{ autoUnwrap: true }"
    />
  </div>
</template>
