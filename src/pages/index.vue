<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import GlobalStatus from '~/components/GlobalStatus.vue';

const { data: status, isFetching, suspense } = useQuery({
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
          v-for="incident of (status?.incidents ?? [])"
          :key="incident.id"
          :incident="incident"
        />
      </IncidentList>
    </Container>
  </div>
</template>
