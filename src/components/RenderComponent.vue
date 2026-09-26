<script setup lang="ts">
import ServiceListRender from './ServiceListRender.vue';
import type { ComponentResponse, StatusService } from '~~/shared/types';

const props = defineProps<{
	services: StatusService[];
	component: ComponentResponse;
}>();
</script>

<template>
  <div v-if="props.component.type === 'svclist'">
    <ServiceGroup>
      <ServiceListRender
        v-slot="{ service }"
        :services="props.services"
        :items="props.component.services"
      >
        <Service :service="service" />
      </ServiceListRender>
    </ServiceGroup>
  </div>
  <div v-else-if="props.component.type === 'group'">
    <ServiceGroup :header="{ title: props.component.title, subtitle: props.component.subtitle }">
      <ServiceListRender
        v-slot="{ service }"
        :services="props.services"
        :items="props.component.services"
      >
        <Service :service="service" />
      </ServiceListRender>
    </ServiceGroup>
  </div>
  <div v-else>
    <p>Unkonw component</p>
  </div>
</template>
