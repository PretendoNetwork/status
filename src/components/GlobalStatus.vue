<script setup lang="ts">
import { useRafFn, useTimeAgo } from '@vueuse/core';
import ServiceStatus from './ServiceStatus.vue';

const props = defineProps<{
	healthy: boolean;
	updating?: boolean;
	lastUpdated?: Date;
}>();

const updatedDate = computed(() => new Date(Math.min(props.lastUpdated?.getTime() ?? Date.now(), Date.now())));
const updatedAgo = useTimeAgo(updatedDate, {
	showSecond: true,
	scheduler: useRafFn
});
</script>

<template>
  <div
    class="status-hero"
  >
    <ServiceStatus
      :healthy="props.healthy"
      text
    />
    <h1 v-if="props.healthy">
      All systems operational
    </h1>
    <h1 v-else>
      Experiencing issues
    </h1>
    <p
      v-if="props.lastUpdated"
      class="updated-text"
    >
      <span v-if="props.updating"><Loader /></span>
      <span v-else><ClientOnly>Last updated {{ updatedAgo }}</ClientOnly></span>
    </p>
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

.updated-text {
	margin: 0.7rem 0 0 0;
	font-size: 0.9rem;
	color: var(--text-shade-3);
}

@media screen and (max-width: 600px) {
	.status-hero h1 {
		font-size: 1.5rem;
	}
}
</style>
