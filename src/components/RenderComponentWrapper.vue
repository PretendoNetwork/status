<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style lang="css" scoped>
.wrapper > :deep(*) {
	margin-bottom: 2rem;
}
.wrapper > :deep(*:last-child) {
	margin-bottom: 0;
}
</style>
