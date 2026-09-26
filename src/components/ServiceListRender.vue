<script setup lang="ts">
import type { StatusService } from '~~/shared/types';

const props = defineProps<{
	services: StatusService[];
	items: string[];
}>();

const items = computed(() => {
	return props.items.map((svcId) => {
		const svc = props.services.find(v => v.id === svcId);
		return {
			svcId,
			svc
		};
	});
});
</script>

<template>
  <div>
    <template
      v-for="item of items"
      :key="item.svcId"
    >
      <slot
        v-if="item.svc"
        :service="item.svc"
      />
      <p v-else>
        Unknown service
      </p>
    </template>
  </div>
</template>
