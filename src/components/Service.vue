<script setup lang="ts">
import type { StatusService } from '~~/shared/types';

const props = defineProps<{
	service: StatusService;
}>();
const lastHealthyAt = computed(() => new Date(props.service.lastHealthyAt));
</script>

<template>
  <div class="item">
    <div class="item-header">
      <div>
        <p class="item-name">
          {{ props.service.name }}
        </p>
        <p
          v-if="!props.service.healthy"
          class="item-desc"
        >
          Outage since {{ lastHealthyAt.toLocaleString() }}
        </p>
      </div>
      <div>
        <ServiceStatus :healthy="props.service.healthy" />
      </div>
    </div>

    <ServiceUptimeHistory
      class="history"
      :is-currently-healthy="props.service.healthy"
      :timeline="props.service.timeline"
    />
  </div>
</template>

<style lang="css" scoped>
.item {
	padding: 1rem;
}

.history {
	margin-top: 1rem;
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-name {
	color: var(--text-shade-1);
}

.item-desc {
	font-size: 0.7em;
	margin-top: 0.2rem;
	color: var(--text-shade-3);
}

@media screen and (max-width: 400px) {
	.history {
		display: none;
	}
}
</style>
