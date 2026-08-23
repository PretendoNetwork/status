<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import GlobalStatus from '~/components/GlobalStatus.vue';

const { data: status, isFetching, suspense } = useQuery({
	queryKey: ['status'],
	queryFn: () => $fetch('/api/status'),
	refetchInterval: 15 * 1000
});

const { data: incidents, suspense: suspenseIncidents } = useQuery({
	queryKey: ['incidents'],
	queryFn: () => $fetch('/api/incidents'),
	refetchInterval: 60 * 1000
});

onServerPrefetch(async () => {
	await suspense();
	await suspenseIncidents();
});

const globalStatus = computed(() => !(status.value?.services ?? []).some(v => !v.healthy));
</script>

<template>
  <div>
    <Container>
      <GlobalStatus :healthy="globalStatus" />
      <p v-if="isFetching">
        Fetching...
      </p>
      <ServiceGroup>
        <Service
          v-for="svc of (status?.services ?? [])"
          :key="svc.id"
          :service="svc"
        />
      </ServiceGroup>
    </Container>
    <Container>
      <IncidentList>
        <Incident
          v-for="incident of (incidents?.data ?? [])"
          :key="incident.id"
          :incident="incident"
        />
      </IncidentList>
    </Container>
  </div>
</template>
