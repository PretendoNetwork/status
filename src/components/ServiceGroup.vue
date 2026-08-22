<template>
  <div class="group">
    <slot />
  </div>
</template>

<style lang="css" scoped>
.group {
	background-color: var(--bg-shade-2);
	border: 1px solid var(--bg-shade-3);
	border-radius: 15px;
}

.group > :deep(*) {
	border-bottom: 1px solid var(--bg-shade-3);
}
.group > :deep(*:last-child) {
	border-bottom: 0;
}
</style>
