<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import GlobalStatus from '~/components/GlobalStatus.vue';

useHead({
	title: 'Pretendo Network Status'
});
useSeoMeta({
	description: 'View the status of Pretendo Network'
});

const { data: status, isFetching, dataUpdatedAt, suspense } = useQuery({
	queryKey: ['status'],
	queryFn: () => $fetch('/api/status'),
	refetchInterval: 15 * 1000
});

onServerPrefetch(async () => {
	await suspense();
});

const globalStatus = computed(() => !(status.value?.services ?? []).some(v => !v.healthy));
</script>

<template>
  <div>
    <Container>
      <GlobalStatus
        :healthy="globalStatus"
        :updating="isFetching"
        :last-updated="new Date(dataUpdatedAt)"
      />
      <IncidentList>
        <Incident
          v-for="incident of (status?.incidents ?? [])"
          :key="incident.id"
          :url="`/incidents/${incident.id}`"
          :incident="incident"
        />
      </IncidentList>
      <ServiceGroup>
        <Service
          v-for="svc of (status?.services ?? [])"
          :key="svc.id"
          :service="svc"
        />
      </ServiceGroup>
    </Container>
  </div>
</template>
