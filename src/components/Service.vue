<script setup lang="ts">
import type { StatusService } from '~~/shared/types';

const props = defineProps<{
	service: StatusService;
}>();
</script>

<template>
  <div class="item">
    <div>
      <p class="item-name">
        {{ props.service.name }}
      </p>
    </div>
    <div>
      <ServiceStatus :healthy="props.service.healthy" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
}

.item-name {
	color: var(--text-shade-1);
}
</style>
