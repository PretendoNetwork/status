<script setup lang="ts">
const props = defineProps<{
	header?: { title?: string; subtitle?: string };
}>();
</script>

<template>
  <div>
    <div
      v-if="props.header"
      class="header"
    >
      <h2
        v-if="props.header.title"
        class="title"
      >
        {{ props.header.title }}
      </h2>
      <p
        v-if="props.header.subtitle"
        class="subtitle"
      >
        {{ props.header.subtitle }}
      </p>
    </div>
    <div
      class="group"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="css" scoped>
.group {
	background-color: var(--bg-shade-2);
	border: 1px solid var(--bg-shade-3);
	border-radius: 15px;
}

.group > :deep(div > *) {
	border-bottom: 1px solid var(--bg-shade-3);
}
.group > :deep(div > *:last-child) {
	border-bottom: 0;
}

.header {
	margin-bottom: 0.8rem;
}
.title {
	font-size: 1rem;
	color: var(--text-shade-1);
	font-weight: bold;
	margin-bottom: 0.1rem;
}
.subtitle {
	font-size: 0.8rem;
	color: var(--text-shade-3);
}
</style>
