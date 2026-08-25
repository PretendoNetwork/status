<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <Container>
    <div class="footer-container">
      <div class="line" />
      <div class="footer-content">
        <NuxtLink
          :href="config.public.homepageUrl"
          class="brand"
        >
          Pretendo Network
        </NuxtLink>
      </div>
      <div class="line" />
    </div>
  </container>
</template>

<style lang="css" scoped>
.footer-container {
	display: flex;
	gap: 1rem;
	align-items: center;
	margin-top: 8rem;
	margin-bottom: 2rem;
}

.line {
	flex: 1;
	height: 1px;
	background-color: var(--bg-shade-4);
}

.brand, .brand:visited {
	color: var(--text-shade-3);
	font-size: 0.8rem;
	text-decoration: none;
	cursor: pointer;
	transition: color 100ms ease-in-out;
}
.brand:hover, .brand:focus {
	color: var(--text-shade-1);
	text-decoration: none;
}
</style>
