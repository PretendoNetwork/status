<script lang="ts" setup>
import GlobalStatus from '~/components/GlobalStatus.vue';

const { data: status } = await useFetch('/api/status');

const globalStatus = computed(() => !(status.value?.services ?? []).some(v => !v.healthy));
</script>

<template>
  <Container>
    <GlobalStatus :healthy="globalStatus" />
    <ServiceGroup>
      <Service
        v-for="svc of (status?.services ?? [])"
        :key="svc.id"
        :service="svc"
      />
    </ServiceGroup>
  </Container>
</template>
