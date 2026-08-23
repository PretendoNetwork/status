<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <div>
    <Container>
      <div class="navbar">
        <NuxtLink
          class="link-wrapper"
          :href="config.public.homepageUrl"
        >
          <Logo class="logo" />
          <span class="logo-text">Pretendo</span>
        </NuxtLink>
        <NuxtLink
          class="link-wrapper"
          :href="config.public.supportUrl"
        >
          Need help?
        </NuxtLink>
      </div>
    </container>
  </div>
</template>

<style lang="css" scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 -1rem;
}

.link-wrapper {
	background-color: rgba(34, 35, 51, 0);
	border-radius: 5px;
	padding: 0.5rem 0.8rem;
	transition:
		transform 100ms ease-in-out,
		background-color 50ms ease-in-out;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.9rem;
}
.link-wrapper:hover {
	background-color: rgba(34, 35, 51, 0.5);
}
.link-wrapper:active {
	transform: scale(0.95);
}

.logo-text {
	font-size: 1rem;
	color: var(--text-shade-1);
	font-weight: bold;
}

.link-wrapper,
.link-wrapper:focus,
.link-wrapper:visited,
.link-wrapper:active {
	color: var(--text-shade-2);
	text-decoration: none !important;
}

.logo {
	color: var(--brand);
}

@media screen and (max-width: 700px) {
	.navbar {
		margin: 0;
	}

	.logo-text {
		display: none;
	}
}
</style>
