<script setup lang="ts">
import ServiceStatus from './ServiceStatus.vue';

const props = defineProps<{
	healthy: boolean;
}>();
</script>

<template>
  <div
    v-if="props.healthy"
    class="status-hero"
  >
    <ServiceStatus
      healthy
      text
    />
    <h1>All systems operational</h1>
  </div>
  <div
    v-else
    class="status-hero"
  >
    <ServiceStatus
      :healthy="false"
      text
    />
    <h1>Major outage</h1>
  </div>
</template>

<style lang="css" scoped>
.status-hero {
	margin: 6rem 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.status-hero h1 {
	color: var(--text-shade-1);
	margin: 0.5rem 0 0 0;
	font-size: 2rem;
}

@media screen and (max-width: 600px) {
	.status-hero h1 {
		font-size: 1.5rem;
	}
}
</style>
