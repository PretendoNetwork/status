<script setup lang="ts">
import Navbar from './components/Navbar.vue';

const { error } = defineProps<{ error: any }>();

onMounted(() => {
	if (import.meta.client) {
		console.error(error);
	}
});
</script>

<template>
  <Container>
    <Navbar />
    <div
      v-if="error.status === 404"
      class="hero"
    >
      <Icon
        class="icon"
        name="ph:circle-wavy-question-fill"
      />
      <h1>Page not found</h1>
      <p>Try looking somewhere else</p>
    </div>
    <div
      v-else
      class="hero"
    >
      <Icon
        class="icon red"
        name="ph:bug-beetle-fill"
      />
      <h1>An error occurred</h1>
      <p>{{ error.message }}</p>
    </div>
  </Container>
</template>

<style lang="css" scoped>
.hero {
	margin: 6rem 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.hero .icon {
	font-size: 2rem;
	color: var(--degraded-1);
}

.hero .icon.red {
	color: var(--outage-1);
}

.hero h1 {
	color: var(--text-shade-1);
	margin: 0.5rem 0 0 0;
	font-size: 2rem;
}

.hero p {
	color: var(--text-shade-3);
	margin: 0.5rem 0 0 0;
	font-size: 1rem;
}

@media screen and (max-width: 600px) {
	.status-hero h1 {
		font-size: 1.5rem;
	}
}
</style>
