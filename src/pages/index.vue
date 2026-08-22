<script lang="ts" setup>
const { data: status } = await useFetch('/api/status');
</script>

<template>
  <Container>
    <ServiceGroup>
      <Service
        v-for="svc of (status?.services ?? [])"
        :key="svc.id"
        :service="svc"
      />
    </ServiceGroup>
  </Container>
</template>
