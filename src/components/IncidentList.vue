<template>
  <div class="list">
    <slot />
  </div>
</template>

<style lang="css" scoped>
.list {
	margin: 3rem 0;

	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.list:empty {
	margin: 0 0;
}
</style>
